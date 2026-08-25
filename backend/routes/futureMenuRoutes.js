const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const billingService = require('../services/billingService');

// =========================================================================
// PUBLIC & CUSTOMER MENU ENDPOINTS
// =========================================================================

// @route   GET /api/future-menu/items
// @desc    Get all menu items (filterable by category, search, veg/non-veg)
router.get('/items', (req, res) => {
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
});

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

// @route   POST /api/future-menu/orders/initiate-payment
// @desc    Initiate a prepaid order payment session (UPI or Net Banking)
router.post('/orders/initiate-payment', (req, res) => {
  try {
    const slotConfig = db.getOrderingSlot();
    const slotStatus = db.checkOrderingSlotStatus(slotConfig);
    if (!slotStatus.isOpen) {
      return res.status(400).json({ 
        message: slotStatus.message,
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
      notes 
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart cannot be empty' });
    }

    const method = paymentMethod === 'Net Banking' ? 'Net Banking' : 'UPI';
    const type = orderType === 'Parcel' ? 'Parcel' : 'Pickup';
    const totalItemCount = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    const subtotal = items.reduce((sum, item) => sum + (Number(item.unitPrice || item.price || 0) * Number(item.quantity || 1)), 0);

    const exemptCategories = ['shakes', 'mocktails', 'juices'];
    const parcelCharge = type === 'Parcel' 
      ? items.reduce((sum, item) => {
          let category = item.category || '';
          if (!category && (item.foodId || item._id)) {
            const dbItem = db.findById('foodItems', item.foodId || item._id);
            if (dbItem && dbItem.category) category = dbItem.category;
          }
          const catLower = (category || '').toLowerCase().trim();
          if (exemptCategories.includes(catLower)) return sum;
          return sum + (Number(item.quantity || 1) * 10);
        }, 0)
      : 0;
    const total = subtotal + parcelCharge;

    const orderNumber = `MHP-${Date.now().toString().slice(-6)}`;
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = db.insert('orders', {
      orderId: orderNumber,
      orderNumber,
      customerName: customerName || 'Campus Student',
      customerPhone: customerPhone || studentPhone || '',
      studentPhone: studentPhone || customerPhone || '',
      studentId: studentId || '',
      pickupLocation: type === 'Parcel' ? 'MHP Parcel Counter, Near N Block' : 'MHP Main Counter, Near N Block',
      items,
      totalItemCount,
      subtotal,
      orderType: type,
      parcelCharge,
      total,
      totalAmount: total,
      paymentMethod: method,
      paymentMode: method,
      paymentStatus: 'PENDING',
      paymentReference: transactionId,
      transactionId,
      orderStatus: 'PENDING_PAYMENT',
      status: 'PENDING_PAYMENT',
      notes: notes || '',
      createdAt: new Date().toISOString()
    });

    // Automatically create internal billing record
    billingService.createBillingRecord(newOrder);
    const updatedOrder = db.findById('orders', newOrder._id) || newOrder;

    res.status(201).json({
      message: 'Payment session initiated',
      order: updatedOrder,
      billingNumber: updatedOrder.billingNumber,
      transactionId,
      paymentReference: transactionId,
      amountToPay: total,
      paymentMethod: method
    });
  } catch (err) {
    console.error('Error initiating payment:', err);
    res.status(500).json({ message: 'Failed to initiate payment session' });
  }
});

// @route   POST /api/future-menu/orders/confirm-payment
// @desc    Confirm successful prepaid payment from payment gateway
router.post('/orders/confirm-payment', (req, res) => {
  try {
    const { orderId, transactionId, paymentReference } = req.body;

    const order = db.findOne('orders', { _id: orderId }) || 
                  db.findOne('orders', { orderId }) || 
                  db.findOne('orders', { orderNumber: orderId }) ||
                  db.findOne('orders', { transactionId });

    if (!order) {
      return res.status(404).json({ message: 'Order session not found' });
    }

    const updated = db.updateById('orders', order._id, {
      paymentStatus: 'PAID',
      orderStatus: 'PLACED',
      status: 'PLACED',
      paidAt: new Date().toISOString(),
      placedAt: new Date().toISOString(),
      paymentReference: paymentReference || transactionId || order.transactionId || `TXN-CONFIRMED-${Date.now()}`
    });

    res.json({ message: 'Payment confirmed successfully', order: updated });
  } catch (err) {
    console.error('Error confirming payment:', err);
    res.status(500).json({ message: 'Failed to confirm payment' });
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
      return res.status(404).json({ message: 'Order session not found' });
    }

    const failStatus = 'FAILED';
    const updated = db.updateById('orders', order._id, {
      paymentStatus: failStatus,
      orderStatus: failStatus,
      status: failStatus
    });

    res.json({ message: 'Payment failed', order: updated });
  } catch (err) {
    console.error('Error recording payment failure:', err);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
});

// @route   POST /api/future-menu/orders
// @desc    Place a new student order (Direct / Pickup / Parcel)
router.post('/orders', (req, res) => {
  try {
    const slotConfig = db.getOrderingSlot();
    const slotStatus = db.checkOrderingSlotStatus(slotConfig);
    if (!slotStatus.isOpen) {
      return res.status(400).json({ 
        message: slotStatus.message,
        orderingStatus: slotStatus
      });
    }

    const { customerName, customerPhone, studentId, studentPhone, items, orderType, paymentMode, paymentMethod, paymentStatus, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart cannot be empty' });
    }

    const method = paymentMethod || paymentMode || 'UPI';
    const type = orderType === 'Parcel' ? 'Parcel' : 'Pickup';

    // Reject Dining orders (Dining is View-Only)
    if (type === 'Pickup' || orderType === 'Dining' || orderType === 'Pickup') {
      return res.status(400).json({ 
        message: 'Dining menu is view-only. Orders can only be placed from Delivery.' 
      });
    }
    const totalItemCount = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    const subtotal = items.reduce((sum, item) => sum + (Number(item.unitPrice || item.price || 0) * Number(item.quantity || 1)), 0);

    const exemptCategories = ['shakes', 'mocktails', 'juices'];
    const parcelCharge = type === 'Parcel' 
      ? items.reduce((sum, item) => {
          let category = item.category || '';
          if (!category && (item.foodId || item._id)) {
            const dbItem = db.findById('foodItems', item.foodId || item._id);
            if (dbItem && dbItem.category) category = dbItem.category;
          }
          const catLower = (category || '').toLowerCase().trim();
          if (exemptCategories.includes(catLower)) return sum;
          return sum + (Number(item.quantity || 1) * 10);
        }, 0)
      : 0;
    const total = subtotal + parcelCharge;

    const orderNumber = `MHP-${Date.now().toString().slice(-6)}`;
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = db.insert('orders', {
      orderId: orderNumber,
      orderNumber,
      customerName: customerName || 'Campus Student',
      customerPhone: customerPhone || studentPhone || '',
      studentPhone: studentPhone || customerPhone || '',
      studentId: studentId || '',
      pickupPoint: req.body.pickupPoint || 'N Block',
      pickupLocation: `${req.body.pickupPoint || 'N Block'} (MHP ${type === 'Parcel' ? 'Parcel' : 'Main'} Counter)`,
      items,
      totalItemCount,
      subtotal,
      orderType: type,
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
      paidAt: paymentStatus === 'PAID' ? new Date().toISOString() : null
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
