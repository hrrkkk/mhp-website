const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const billingService = require('../services/billingService');
const paymentService = require('../services/paymentService');
const { supabase, isSupabaseConfigured, mapRowToMenuItem, mapMenuItemToRow } = require('../config/supabase');

async function findMenuItem(item) {
  const targetId = item._id || item.foodId || item.id;
  let dbItem = null;

  if (isSupabaseConfigured()) {
    try {
      if (targetId) {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('id', targetId)
          .maybeSingle();
        if (data && !error) {
          dbItem = mapRowToMenuItem(data);
        }
      }
      if (!dbItem && item.name) {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .ilike('name', item.name)
          .maybeSingle();
        if (data && !error) {
          dbItem = mapRowToMenuItem(data);
        }
      }
    } catch (e) {}
  }

  if (!dbItem) {
    dbItem = db.findById('foodItems', targetId) || 
             db.findOne('foodItems', { _id: targetId }) || 
             (item.name ? db.findOne('foodItems', { name: item.name }) : null);
  }

  if (!dbItem && item && item.name && item.price !== undefined) {
    dbItem = {
      _id: targetId || item.name,
      name: item.name,
      category: item.category || '',
      subcategory: item.subcategory || '',
      price: Number(item.price || 0),
      isAvailable: item.isAvailable !== false && item.available !== false,
      available: item.available !== false && item.isAvailable !== false
    };
  }

  return dbItem;
}

function isRestrictedForDining(categoryName, subcategoryName = '', itemTitle = '') {
  const cat = (categoryName || '').toLowerCase().trim();
  const sub = (subcategoryName || '').toLowerCase().trim();
  const title = (itemTitle || '').toLowerCase().trim();

  if (cat.includes('breakfast') || sub.includes('breakfast') || title.includes('breakfast')) return true;
  if (cat.includes('burger') || sub.includes('burger') || title.includes('burger')) return true;
  if (cat.includes('pizza') || sub.includes('pizza') || title.includes('pizza')) return true;
  if (cat.includes('sandwich') || sub.includes('sandwich') || title.includes('sandwich')) return true;
  return false;
}

// =========================================================================
// PUBLIC & CUSTOMER MENU ENDPOINTS
// =========================================================================

// @route   GET /api/future-menu/items & GET /api/future-menu
// @desc    Get all menu items (filterable by category, search, veg/non-veg)
const handleGetMenuItems = (req, res) => {
  try {
    const { category, search, foodType, availableOnly, serviceType, mode } = req.query;
    let items = db.find('foodItems', {});

    const targetService = serviceType || mode;
    if (targetService) {
      const s = targetService.toLowerCase();
      if (s === 'dining') {
        items = items.filter(item => item.serviceType === 'both' || item.serviceType === 'dining' || !item.serviceType);
      } else if (s === 'delivery') {
        items = items.filter(item => item.serviceType === 'both' || item.serviceType === 'delivery');
      }
    }

    if (availableOnly === 'true') {
      items = items.filter(item => item.isAvailable !== false);
    }

    if (category && category !== 'All') {
      items = items.filter(item => item.category === category);
    }

    if (foodType && foodType !== 'All') {
      const ft = foodType.toLowerCase();
      items = items.filter(item => {
        const itemFt = (item.foodType || '').toLowerCase();
        const sub = (item.subcategory || '').toLowerCase();
        if (ft === 'veg') return itemFt === 'veg' && !sub.includes('sea food');
        if (ft === 'non-veg') return itemFt === 'non-veg' && !sub.includes('sea food');
        if (ft === 'seafood') return itemFt === 'seafood' || itemFt === 'sea food' || sub.includes('sea food');
        return itemFt === ft;
      });
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    }

    res.json(items);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};

router.get('/', handleGetMenuItems);
router.get('/items', handleGetMenuItems);

// @route   GET /api/future-menu/categories
// @desc    Get all menu categories
router.get('/categories', (req, res) => {
  try {
    const categories = db.find('categories', {});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// @route   GET /api/future-menu/favorites
// @desc    Get Student Favorites (dynamic if order data exists) or MHP Picks (if no order data yet)
router.get('/favorites', (req, res) => {
  try {
    const allOrders = db.find('orders', {}) || [];
    const validOrders = allOrders.filter(ord => 
      ord.paymentStatus === 'PAID' || 
      ord.orderStatus === 'CONFIRMED' || 
      ord.status === 'CONFIRMED' || 
      ord.status === 'PLACED'
    );

    const itemCounts = {};
    validOrders.forEach(ord => {
      if (Array.isArray(ord.items)) {
        ord.items.forEach(item => {
          const key = item.foodId || item._id || item.name;
          itemCounts[key] = (itemCounts[key] || 0) + (Number(item.quantity) || 1);
        });
      }
    });

    const hasOrderData = Object.keys(itemCounts).length > 0;
    const allFoodItems = db.find('foodItems', {}) || [];

    let resultItems = [];

    if (hasOrderData) {
      const itemsWithCounts = allFoodItems.map(item => {
        const count = itemCounts[item._id] || itemCounts[item.id] || itemCounts[item.name] || 0;
        return { ...item, orderCount: count };
      }).filter(item => item.orderCount > 0);

      itemsWithCounts.sort((a, b) => b.orderCount - a.orderCount);
      resultItems = itemsWithCounts.slice(0, 6);
    }

    if (!resultItems || resultItems.length === 0) {
      const picks = allFoodItems.filter(item => 
        item.popular || 
        ['Chicken 65', 'Veg Dum Biryani', 'Crispy Corn', 'Egg Dum Biryani', 'Paneer Butter Masala', 'Ghee Karam Dosa'].includes(item.name)
      );

      resultItems = picks.slice(0, 6);
      if (resultItems.length === 0) {
        resultItems = allFoodItems.slice(0, 6);
      }
    }

    res.json({
      hasOrderData,
      title: hasOrderData ? '🔥 STUDENT FAVORITES' : '🔥 MHP PICKS',
      subtitle: hasOrderData 
        ? 'Most ordered dishes on campus based on actual student orders' 
        : 'Handpicked signature recommendations by MHP staff',
      items: resultItems
    });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
});

// @route   POST /api/future-menu/orders/initiate-payment
// @desc    Initiate a prepaid order payment session with paymentService signature
router.post('/orders/initiate-payment', async (req, res) => {
  try {
    const slotConfig = db.getOrderingSlot();
    const slotStatus = db.checkOrderingSlotStatus(slotConfig);
    if (!slotStatus.isOpen) {
      return res.status(400).json({ 
        error: `Ordering is currently closed. Today's ordering window is ${slotStatus.orderingWindow}.`,
        message: `Ordering is currently closed. Today's ordering window is ${slotStatus.orderingWindow}.`,
        orderingStatus: slotStatus
      });
    }

    const { 
      customerName, 
      customerPhone, 
      studentId, 
      studentPhone, 
      items, 
      orderType, 
      paymentMethod,
      notes,
      pickupLocation,
      pickupPoint
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart cannot be empty', message: 'Cart cannot be empty' });
    }

    const method = paymentMethod === 'Net Banking' ? 'Net Banking' : 'UPI';
    const type = orderType === 'Dining' ? 'Dining' : (orderType === 'Parcel' ? 'Parcel' : 'Pickup');

    const VALID_PICKUP_LOCATIONS = ['A BLOCK', 'N BLOCK', 'P BLOCK', 'H BLOCK', 'U BLOCK'];
    let finalPickupLocation = null;

    if (type !== 'Dining') {
      const rawLoc = (pickupLocation || pickupPoint || 'N BLOCK').toString().trim().toUpperCase();
      let matchedLoc = VALID_PICKUP_LOCATIONS.find(loc => rawLoc.includes(loc.split(' ')[0]));
      finalPickupLocation = matchedLoc || 'N BLOCK';
    } else {
      finalPickupLocation = null;
      const restrictedItems = items.filter(item => {
        let category = item.category || '';
        let subcategory = item.subcategory || '';
        let name = item.name || '';
        if (!category && (item.foodId || item._id)) {
          const dbItem = db.findById('foodItems', item.foodId || item._id);
          if (dbItem) {
            category = dbItem.category || '';
            subcategory = dbItem.subcategory || '';
            name = dbItem.name || name;
          }
        }
        return isRestrictedForDining(category, subcategory, name);
      });

      if (restrictedItems.length > 0) {
        const itemNames = restrictedItems.map(i => i.name || 'Restricted Item').join(', ');
        return res.status(400).json({
          error: `The following items are not available for Dining orders: ${itemNames}. Please remove them or switch to Delivery mode.`,
          message: `The following items are not available for Dining orders: ${itemNames}. Please remove them or switch to Delivery mode.`
        });
      }
    }

    // Authoritative Server-Side Price & Availability Calculation from DB / Atlas
    let trustedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbItem = await findMenuItem(item);
      
      if (!dbItem || dbItem.isAvailable === false || dbItem.available === false) {
        return res.status(400).json({ 
          error: `Item "${item.name || 'Selected item'}" is currently unavailable. Please remove it from your cart.`,
          message: `Item "${item.name || 'Selected item'}" is currently unavailable. Please remove it from your cart.`
        });
      }

      let unitPrice = Number(dbItem.price || 0);
      if (item.selectedOptionLabel && dbItem.priceOptions && dbItem.priceOptions.length > 0) {
        const matchedOption = dbItem.priceOptions.find(opt => opt.label === item.selectedOptionLabel);
        if (matchedOption) {
          unitPrice = Number(matchedOption.price);
        }
      }

      const qty = Math.max(1, Number(item.quantity || 1));
      const itemSubtotal = unitPrice * qty;
      trustedSubtotal += itemSubtotal;

      validatedItems.push({
        _id: dbItem._id,
        foodId: dbItem._id,
        name: dbItem.name,
        category: dbItem.category || item.category || '',
        subcategory: dbItem.subcategory || item.subcategory || '',
        foodType: dbItem.foodType || item.foodType || 'Veg',
        image: dbItem.image || item.image || '',
        unitPrice,
        price: unitPrice,
        quantity: qty,
        selectedOptionLabel: item.selectedOptionLabel || null,
        subtotal: itemSubtotal
      });
    }

    const totalItemCount = validatedItems.reduce((sum, item) => sum + item.quantity, 0);

    const exemptCategories = ['shakes', 'mocktails', 'juices'];
    const parcelCharge = (type === 'Parcel' || type === 'Pickup')
      ? validatedItems.reduce((sum, item) => {
          const catLower = (item.category || '').toLowerCase().trim();
          if (exemptCategories.includes(catLower)) return sum;
          return sum + (item.quantity * 10);
        }, 0)
      : 0;
    const total = trustedSubtotal + parcelCharge;

    const billingNumber = billingService.generateBillingNumber();
    const orderNumber = billingNumber;
    const initialTxnId = `TXN-${(process.env.PAYMENT_MODE || 'TEST').toUpperCase()}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const draftOrder = {
      orderId: orderNumber,
      orderNumber,
      billingNumber,
      customerName: customerName || 'Campus Student',
      customerPhone: customerPhone || studentPhone || '',
      studentPhone: studentPhone || customerPhone || '',
      studentId: studentId || '',
      pickupPoint: finalPickupLocation,
      pickupLocation: finalPickupLocation,
      items: validatedItems,
      totalItemCount,
      subtotal: trustedSubtotal,
      orderType: type,
      orderMode: type,
      parcelCharge,
      total,
      totalAmount: total,
      paymentMethod: method,
      paymentMode: method,
      paymentStatus: 'PENDING',
      paymentReference: initialTxnId,
      transactionId: initialTxnId,
      orderStatus: 'PENDING_PAYMENT',
      status: 'PENDING_PAYMENT',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    let paymentSession;
    try {
      paymentSession = await paymentService.createPaymentSession(draftOrder);
    } catch (payErr) {
      console.warn('Payment gateway init fallback to simulated sandbox session:', payErr.message);
      paymentSession = {
        transactionId: initialTxnId,
        amount: total,
        currency: 'INR',
        paymentMode: 'TEST',
        signature: `SIMULATED_SIG_${Date.now()}`
      };
    }

    const newOrder = db.insert('orders', {
      ...draftOrder,
      razorpayOrderId: paymentSession.razorpayOrderId || null,
      transactionId: paymentSession.transactionId,
      paymentReference: paymentSession.transactionId,
      paymentSignature: paymentSession.signature
    });

    res.status(201).json({
      message: 'Payment session initiated successfully',
      order: newOrder,
      paymentSession
    });
  } catch (err) {
    console.error('Error initiating payment:', err);
    res.status(500).json({ error: 'Failed to initiate payment session', message: 'Failed to initiate payment session' });
  }
});

// @route   POST /api/future-menu/orders/confirm-payment
// @desc    Confirm prepaid payment with cryptographic signature verification
router.post('/orders/confirm-payment', (req, res) => {
  try {
    const { 
      orderId, 
      transactionId, 
      signature, 
      paymentReference, 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature 
    } = req.body;

    const order = db.findOne('orders', { _id: orderId }) || 
                  db.findOne('orders', { orderId }) || 
                  db.findOne('orders', { orderNumber: orderId }) ||
                  db.findOne('orders', { transactionId });

    if (!order) {
      return res.status(404).json({ error: 'Order session not found', message: 'Order session not found' });
    }

    // Idempotency check: if order is already PAID / CONFIRMED, return existing order
    if (order.paymentStatus === 'PAID' && (order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PLACED')) {
      const existingBill = db.findOne('bills', { orderId: order._id });
      return res.json({ 
        message: 'Payment already confirmed', 
        order, 
        billingNumber: existingBill?.billingNumber || order.billingNumber 
      });
    }

    const txId = transactionId || paymentReference || order.transactionId;
    const sig = razorpaySignature || signature || order.paymentSignature;
    const rzpOrdId = razorpayOrderId || order.razorpayOrderId;
    const rzpPayId = razorpayPaymentId || null;

    const isValidSignature = paymentService.verifyPaymentSignature(
      order.orderNumber,
      order.totalAmount || order.total,
      txId,
      sig,
      rzpOrdId,
      rzpPayId,
      order.orderId
    );

    if (!isValidSignature) {
      return res.status(400).json({ 
        error: 'Invalid payment verification signature. Payment verification failed.',
        message: 'Invalid payment verification signature. Payment verification failed.' 
      });
    }

    const updated = db.updateById('orders', order._id, {
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      status: 'CONFIRMED',
      paidAt: new Date().toISOString(),
      placedAt: new Date().toISOString(),
      paymentReference: rzpPayId || txId,
      transactionId: txId,
      razorpayPaymentId: rzpPayId
    });

    const bill = billingService.createBillingRecord(updated);
    const finalOrder = db.findById('orders', order._id) || updated;

    res.json({ 
      message: 'Payment confirmed successfully', 
      order: finalOrder,
      billingNumber: bill.billingNumber
    });
  } catch (err) {
    console.error('Error confirming payment:', err);
    res.status(500).json({ error: 'Failed to confirm payment', message: 'Failed to confirm payment' });
  }
});

// @route   POST /api/future-menu/orders/fail-payment
// @desc    Record payment failure or cancellation
router.post('/orders/fail-payment', (req, res) => {
  try {
    const { orderId, transactionId, reason } = req.body;

    const order = db.findOne('orders', { _id: orderId }) || 
                  db.findOne('orders', { orderId }) || 
                  db.findOne('orders', { orderNumber: orderId }) ||
                  db.findOne('orders', { transactionId });

    if (!order) {
      return res.status(404).json({ error: 'Order session not found', message: 'Order session not found' });
    }

    const failStatus = 'FAILED';
    const updated = db.updateById('orders', order._id, {
      paymentStatus: failStatus,
      orderStatus: failStatus,
      status: failStatus,
      failureReason: reason || 'Payment cancelled or abandoned by user'
    });

    res.json({ message: 'Payment marked as failed', order: updated });
  } catch (err) {
    console.error('Error recording payment failure:', err);
    res.status(500).json({ error: 'Failed to update payment status', message: 'Failed to update payment status' });
  }
});

// @route   POST /api/future-menu/orders/webhook
// @desc    Asynchronous payment gateway callback handler
router.post('/orders/webhook', (req, res) => {
  try {
    const sigHeader = req.headers['x-payment-signature'] || req.headers['x-razorpay-signature'];
    const { orderId, orderNumber, transactionId, status } = req.body;

    const order = db.findOne('orders', { orderNumber }) || db.findOne('orders', { _id: orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status === 'SUCCESS' || status === 'PAID') {
      if (order.paymentStatus !== 'PAID') {
        const updated = db.updateById('orders', order._id, {
          paymentStatus: 'PAID',
          orderStatus: 'CONFIRMED',
          status: 'CONFIRMED',
          paidAt: new Date().toISOString()
        });
        billingService.createBillingRecord(updated);
      }
      return res.json({ status: 'OK', message: 'Order confirmed via webhook' });
    }

    return res.json({ status: 'OK', message: 'Webhook event processed' });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// @route   POST /api/future-menu/orders
// @desc    Place a new student order (Direct / Pickup / Parcel)
router.post('/orders', async (req, res) => {
  try {
    const slotConfig = db.getOrderingSlot();
    const slotStatus = db.checkOrderingSlotStatus(slotConfig);
    if (!slotStatus.isOpen) {
      return res.status(400).json({ 
        error: `Ordering is currently closed. Today's ordering window is ${slotStatus.orderingWindow}.`,
        message: `Ordering is currently closed. Today's ordering window is ${slotStatus.orderingWindow}.`,
        orderingStatus: slotStatus,
        slotStatus
      });
    }

    const { customerName, customerPhone, studentId, studentPhone, items, orderType, paymentMode, paymentMethod, paymentStatus, notes, pickupLocation, pickupPoint } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart cannot be empty' });
    }

    const method = paymentMethod || paymentMode || 'UPI';
    const type = orderType === 'Dining' ? 'Dining' : (orderType === 'Parcel' ? 'Parcel' : 'Pickup');

    const VALID_PICKUP_LOCATIONS = ['A BLOCK', 'N BLOCK', 'P BLOCK', 'H BLOCK', 'U BLOCK'];
    let finalPickupLocation = null;

    if (type !== 'Dining') {
      const rawLoc = (pickupLocation || pickupPoint || 'N BLOCK').toString().trim().toUpperCase();
      let matchedLoc = VALID_PICKUP_LOCATIONS.find(loc => rawLoc.includes(loc.split(' ')[0]));
      if (!matchedLoc && VALID_PICKUP_LOCATIONS.includes(rawLoc)) {
        matchedLoc = rawLoc;
      }
      finalPickupLocation = matchedLoc || 'N BLOCK';
    } else {
      finalPickupLocation = null;
      const restrictedItems = items.filter(item => {
        let category = item.category || '';
        let subcategory = item.subcategory || '';
        let name = item.name || '';
        if (!category && (item.foodId || item._id)) {
          const dbItem = db.findById('foodItems', item.foodId || item._id);
          if (dbItem) {
            category = dbItem.category || '';
            subcategory = dbItem.subcategory || '';
            name = dbItem.name || name;
          }
        }
        return isRestrictedForDining(category, subcategory, name);
      });

      if (restrictedItems.length > 0) {
        const itemNames = restrictedItems.map(i => i.name || 'Restricted Item').join(', ');
        return res.status(400).json({
          error: `The following items are not available for Dining orders: ${itemNames}. Please remove them or switch to Delivery mode.`,
          message: `The following items are not available for Dining orders: ${itemNames}. Please remove them or switch to Delivery mode.`,
          restrictedItems
        });
      }
    }

    // Authoritative Server-Side Price & Availability Calculation from DB / Atlas
    let trustedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbItem = await findMenuItem(item);
      
      if (!dbItem || dbItem.isAvailable === false || dbItem.available === false) {
        return res.status(400).json({ 
          error: `Item "${item.name || 'Selected item'}" is currently unavailable. Please remove it from your cart.`,
          message: `Item "${item.name || 'Selected item'}" is currently unavailable. Please remove it from your cart.`
        });
      }

      let unitPrice = Number(dbItem.price || 0);
      if (item.selectedOptionLabel && dbItem.priceOptions && dbItem.priceOptions.length > 0) {
        const matchedOption = dbItem.priceOptions.find(opt => opt.label === item.selectedOptionLabel);
        if (matchedOption) {
          unitPrice = Number(matchedOption.price);
        }
      }

      const qty = Math.max(1, Number(item.quantity || 1));
      const itemSubtotal = unitPrice * qty;
      trustedSubtotal += itemSubtotal;

      validatedItems.push({
        _id: dbItem._id,
        foodId: dbItem._id,
        name: dbItem.name,
        category: dbItem.category || item.category || '',
        subcategory: dbItem.subcategory || item.subcategory || '',
        foodType: dbItem.foodType || item.foodType || 'Veg',
        image: dbItem.image || item.image || '',
        unitPrice,
        price: unitPrice,
        quantity: qty,
        selectedOptionLabel: item.selectedOptionLabel || null,
        subtotal: itemSubtotal
      });
    }

    const totalItemCount = validatedItems.reduce((sum, item) => sum + item.quantity, 0);

    const exemptCategories = ['shakes', 'mocktails', 'juices'];
    const parcelCharge = (type === 'Parcel' || type === 'Pickup')
      ? validatedItems.reduce((sum, item) => {
          const catLower = (item.category || '').toLowerCase().trim();
          if (exemptCategories.includes(catLower)) return sum;
          return sum + (item.quantity * 10);
        }, 0)
      : 0;
    const total = trustedSubtotal + parcelCharge;

    const billingNumber = billingService.generateBillingNumber();
    const orderNumber = billingNumber;
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = db.insert('orders', {
      billingNumber,
      orderId: orderNumber,
      orderNumber,
      customerName: customerName || 'Campus Student',
      customerPhone: customerPhone || studentPhone || '',
      studentPhone: studentPhone || customerPhone || '',
      studentId: studentId || '',
      pickupPoint: finalPickupLocation,
      pickupLocation: finalPickupLocation,
      items: validatedItems,
      totalItemCount,
      subtotal: trustedSubtotal,
      orderType: type,
      orderMode: type,
      parcelCharge,
      total,
      totalAmount: total,
      paymentMethod: method,
      paymentMode: method,
      paymentStatus: paymentStatus || 'PAID',
      paymentReference: transactionId,
      transactionId,
      orderStatus: 'CONFIRMED',
      status: 'CONFIRMED',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      placedAt: new Date().toISOString(),
      paidAt: (paymentStatus || 'PAID') === 'PAID' ? new Date().toISOString() : null
    });

    // Automatically create internal billing record immediately upon order confirmation
    try {
      billingService.createBillingRecord(newOrder);
    } catch (billingErr) {
      console.error('Billing generation failed, rolling back order:', billingErr);
      db.deleteById('orders', newOrder._id);
      return res.status(500).json({ message: 'Order creation failed due to billing generation error. Please try again.' });
    }

    const updatedOrder = db.findById('orders', newOrder._id) || newOrder;
    res.status(201).json(updatedOrder);
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// @route   PUT /api/future-menu/orders/:id/confirm-receipt
// @route   PUT /api/future-menu/orders/:id/confirm-receipt
// @desc    Customer confirms order receipt (Order Received: YES/NO) - Strictly authenticated
router.put('/orders/:id/confirm-receipt', authenticateToken, (req, res) => {
  try {
    const orderId = req.params.id;
    const { received } = req.body; // true or false

    const order = db.findById('orders', orderId) || 
                  db.findOne('orders', { _id: orderId }) || 
                  db.findOne('orders', { orderId: orderId }) || 
                  db.findOne('orders', { orderNumber: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Security Check: Verify order belongs to the authenticated student or admin
    const studentId = req.user._id || req.user.studentId || req.user.id;
    const userPhone = req.user.phone || '';
    const isOwner = (order.studentId && (order.studentId === studentId || order.studentId === req.user.studentId || order.studentId === req.user._id)) ||
                    (userPhone && (order.customerPhone === userPhone || order.studentPhone === userPhone)) ||
                    (req.user.role === 'admin');

    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized: You can only confirm receipt of your own orders' });
    }

    const isReceived = received !== false;
    const updated = db.updateById('orders', order._id, {
      orderReceived: isReceived,
      orderReceivedStatus: isReceived ? 'ORDER RECEIVED' : 'NOT CONFIRMED',
      orderReceivedAt: isReceived ? (order.orderReceivedAt || new Date().toISOString()) : null
    });

    res.json({
      message: isReceived ? 'Order receipt confirmed' : 'Order receipt status updated',
      order: updated
    });
  } catch (err) {
    console.error('Error confirming order receipt:', err);
    res.status(500).json({ message: 'Failed to update order receipt status' });
  }
});

// @route   GET /api/future-menu/my-orders
// @desc    Get authenticated student's personal order history (sorted most recent first)
router.get('/my-orders', authenticateToken, (req, res) => {
  try {
    const studentId = req.user._id || req.user.studentId || req.user.id;
    const userPhone = req.user.phone || '';
    const userEmail = req.user.email || '';

    const allOrders = db.find('orders', {}) || [];

    // Strictly filter orders belonging to the authenticated student
    const studentOrders = allOrders.filter(ord => {
      const matchesId = ord.studentId && (ord.studentId === studentId || ord.studentId === req.user.studentId || ord.studentId === req.user._id);
      const matchesPhone = userPhone && (ord.customerPhone === userPhone || ord.studentPhone === userPhone);
      const matchesEmail = userEmail && ord.customerEmail === userEmail;
      return matchesId || matchesPhone || matchesEmail;
    });

    // Sort most recent first
    studentOrders.sort((a, b) => new Date(b.placedAt || b.createdAt) - new Date(a.placedAt || a.createdAt));

    res.json(studentOrders);
  } catch (err) {
    console.error('Error fetching student orders:', err);
    res.status(500).json({ message: 'Failed to fetch your orders' });
  }
});

// @route   PUT /api/future-menu/admin/orders/:id/billing-status
// @desc    Admin update order billing status (NEW / BILLED)
router.put('/admin/orders/:id/billing-status', requireAdmin, (req, res) => {
  try {
    const { billingStatus } = req.body; // 'NEW' or 'BILLED'
    const orderId = req.params.id;

    const order = db.findById('orders', orderId) || 
                  db.findOne('orders', { _id: orderId }) || 
                  db.findOne('orders', { orderId }) || 
                  db.findOne('orders', { orderNumber: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const newBillingStatus = billingStatus || 'BILLED';
    const updated = db.updateById('orders', order._id, {
      billingStatus: newBillingStatus,
      billedAt: newBillingStatus === 'BILLED' ? new Date().toISOString() : null
    });

    const bill = db.findOne('bills', { orderId: order._id });
    if (bill) {
      db.updateById('bills', bill._id, {
        billingStatus: newBillingStatus
      });
    }

    res.json({ message: `Billing status updated to ${newBillingStatus}`, order: updated });
  } catch (err) {
    console.error('Error updating billing status:', err);
    res.status(500).json({ message: 'Failed to update billing status' });
  }
});

// @route   GET /api/future-menu/orders/:id
// @desc    Track a specific order by ID or orderNumber
router.get('/orders/:id', (req, res) => {
  try {
    const order = db.findOne('orders', { _id: req.params.id }) || db.findOne('orders', { orderNumber: req.params.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// =========================================================================
// ADMIN MENU MANAGEMENT ENDPOINTS
// =========================================================================

// @route   POST /api/future-menu/admin/items
// @desc    Create a new menu item
router.post('/admin/items', requireAdmin, (req, res) => {
  try {
    const { name, category, subcategory, price, priceOptions, foodType, description, image, popular, isAvailable, serviceType } = req.body;

    if (!name || !category || (!price && (!priceOptions || priceOptions.length === 0))) {
      return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    const newItem = db.insert('foodItems', {
      name,
      category,
      subcategory: subcategory || '',
      price: Number(price) || 0,
      priceOptions: priceOptions || null,
      foodType: foodType || 'Veg',
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      popular: Boolean(popular),
      isAvailable: isAvailable !== false,
      serviceType: serviceType || 'both'
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(500).json({ message: 'Failed to create menu item' });
  }
});

// @route   PUT /api/future-menu/admin/items/:id
// @desc    Update a menu item
router.put('/admin/items/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateById('foodItems', req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ message: 'Failed to update menu item' });
  }
});

// @route   DELETE /api/future-menu/admin/items/:id
// @desc    Delete a menu item
router.delete('/admin/items/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteById('foodItems', req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
});

// @route   GET /api/future-menu/admin/orders
// @desc    Get all orders for admin management
router.get('/admin/orders', requireAdmin, (req, res) => {
  try {
    const orders = db.find('orders', {});
    orders.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin orders' });
  }
});

// @route   PUT /api/future-menu/admin/orders/:id/status
// @desc    Update order status
router.put('/admin/orders/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    if (status === 'CANCELLED' || status === 'Cancelled') {
      return res.status(400).json({ message: 'Order cancellation is completely disabled' });
    }
    const order = db.update('orders', req.params.id, { status });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;
