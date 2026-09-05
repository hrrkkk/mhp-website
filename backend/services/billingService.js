const db = require('../config/db');
const externalBillingAdapter = require('./externalBillingAdapter');

const EXEMPT_PARCEL_CATEGORIES = ['shakes', 'mocktails', 'juices'];

/**
 * Centralized Bill Calculation Helper
 * Calculates subtotal, parcel charge, and grand total for any order
 */
function calculateBill(items = [], orderType = 'Dining') {
  const isDelivery = orderType === 'Parcel' || orderType === 'Delivery';

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.unitPrice || item.price || 0);
    const qty = Number(item.quantity || 1);
    return sum + (price * qty);
  }, 0);

  const parcelCharge = isDelivery 
    ? items.reduce((sum, item) => {
        let category = item.category || '';
        if (!category && (item.foodId || item._id)) {
          const dbItem = db.findById('foodItems', item.foodId || item._id);
          if (dbItem && dbItem.category) category = dbItem.category;
        }
        const catLower = (category || '').toLowerCase().trim();
        if (EXEMPT_PARCEL_CATEGORIES.includes(catLower)) return sum;
        return sum + (Number(item.quantity || 1) * 10);
      }, 0)
    : 0;

  const total = subtotal + parcelCharge;

  return {
    subtotal,
    parcelCharge,
    total
  };
}

function formatBillingDate(orderDate) {
  const d = orderDate ? new Date(orderDate) : (db.getISTDate ? db.getISTDate() : new Date());
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Generates sequential billing numbers per date.
 * Format: "mhp<DATE><001>" (e.g., mhp20260905001, mhp20260905002, ...)
 * Starts at 001 for each day and increments continuously.
 */
function generateBillingNumber(orderDate) {
  const dateStr = formatBillingDate(orderDate);
  const prefix = `mhp${dateStr}`;

  const allBills = db.find('bills', {}) || [];
  const allOrders = db.find('orders', {}) || [];

  const existingNumbers = new Set();
  allBills.forEach(b => {
    if (b.billingNumber && b.billingNumber.startsWith(prefix)) {
      existingNumbers.add(b.billingNumber);
    }
  });
  allOrders.forEach(o => {
    if (o.billingNumber && o.billingNumber.startsWith(prefix)) {
      existingNumbers.add(o.billingNumber);
    }
    if (o.orderNumber && o.orderNumber.startsWith(prefix)) {
      existingNumbers.add(o.orderNumber);
    }
  });

  let maxSeq = 0;
  existingNumbers.forEach(num => {
    const seqPart = num.slice(prefix.length);
    const seqNum = parseInt(seqPart, 10);
    if (!isNaN(seqNum) && seqNum > maxSeq) {
      maxSeq = seqNum;
    }
  });

  let nextSeq = maxSeq + 1;
  let candidate = `${prefix}${String(nextSeq).padStart(3, '0')}`;

  while (existingNumbers.has(candidate)) {
    nextSeq++;
    candidate = `${prefix}${String(nextSeq).padStart(3, '0')}`;
  }

  return candidate;
}

function createBillingRecord(order) {
  if (!order || !order._id) {
    throw new Error('Valid order required to create billing record');
  }

  // Check if bill already exists for this order
  const existingBill = db.findOne('bills', { orderId: order._id }) || db.findOne('bills', { orderNumber: order.orderNumber });
  if (existingBill) {
    return existingBill;
  }

  const billingNumber = order.billingNumber || generateBillingNumber(order.placedAt || order.createdAt);
  const orderTypeFormatted = order.orderType === 'Parcel' ? 'Delivery' : (order.orderType || 'Dining');
  
  const calc = calculateBill(order.items || [], orderTypeFormatted);
  const finalSubtotal = order.subtotal !== undefined ? order.subtotal : calc.subtotal;
  const finalParcelCharge = order.parcelCharge !== undefined ? order.parcelCharge : calc.parcelCharge;
  const finalTotal = order.total !== undefined ? order.total : (order.totalAmount !== undefined ? order.totalAmount : calc.total);

  // Preserve all 16 essential billing data fields for future API compatibility
  const billRecord = {
    billingNumber,
    orderId: order._id,
    orderNumber: order.orderNumber,
    studentId: order.studentId || '',
    customerName: order.customerName || '',
    customerPhone: order.customerPhone || '',
    orderType: orderTypeFormatted,
    items: order.items || [],
    itemQuantities: (order.items || []).reduce((acc, item) => acc + Number(item.quantity || 1), 0),
    subtotal: finalSubtotal,
    parcelCharge: finalParcelCharge,
    total: finalTotal,
    paymentMethod: order.paymentMethod || order.paymentMode || 'UPI',
    paymentStatus: order.paymentStatus || 'PAID',
    billingStatus: 'BILLED',
    externalSyncStatus: 'LOCAL_ONLY', // Future adapter state (LOCAL_ONLY, EXTERNAL_SYNCED, EXTERNAL_FAILED)
    orderCreatedAt: order.placedAt || order.createdAt || new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  const newBill = db.insert('bills', billRecord);

  // Update order record with billing number, billing status BILLED, orderStatus CONFIRMED, and initial receipt acknowledgement
  db.updateById('orders', order._id, {
    billingId: newBill._id,
    billingNumber: billingNumber,
    billingStatus: 'BILLED',
    externalSyncStatus: 'LOCAL_ONLY',
    orderStatus: 'CONFIRMED',
    status: 'CONFIRMED',
    orderReceived: false,
    orderReceivedStatus: 'NOT CONFIRMED'
  });

  // Invoke future external billing adapter (non-blocking, local-only safety fallback)
  try {
    externalBillingAdapter.syncToExternalBilling(newBill, order).catch(err => {
      console.warn('External billing sync non-critical notice:', err.message);
    });
  } catch (err) {
    // Non-blocking catch
  }

  return newBill;
}

module.exports = {
  calculateBill,
  createBillingRecord,
  generateBillingNumber
};
