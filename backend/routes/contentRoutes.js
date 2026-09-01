const express = require('express');
const db = require('../config/db');
const { requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer storage config for image uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'mhp-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Image Upload Endpoint (Admin protected)
router.post('/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ message: 'Image uploaded successfully', imageUrl });
});

// ==========================================
// 1. WHAT'S HAPPENING
// ==========================================

// Public: Get published happenings
router.get('/happenings', (req, res) => {
  const happenings = db.find('happenings');
  const published = happenings.filter(h => h.status !== 'draft');
  res.json(published);
});

// Admin: Get all happenings
router.get('/admin/happenings', requireAdmin, (req, res) => {
  res.json(db.getCollection('happenings'));
});

// Admin: Create happening
router.post('/happenings', requireAdmin, (req, res) => {
  const { title, description, image, category, date, time, status, featured } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  const item = db.insert('happenings', {
    title,
    description,
    image: image || '',
    category: category || 'MHP Update',
    date: date || new Date().toISOString().split('T')[0],
    time: time || '',
    status: status || 'published',
    featured: Boolean(featured)
  });
  res.status(201).json(item);
});

// Admin: Update happening
router.put('/happenings/:id', requireAdmin, (req, res) => {
  const updated = db.updateById('happenings', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Item not found' });
  res.json(updated);
});

// Admin: Delete happening
router.delete('/happenings/:id', requireAdmin, (req, res) => {
  const success = db.deleteById('happenings', req.params.id);
  if (!success) return res.status(404).json({ error: 'Item not found' });
  res.json({ message: 'Happening update deleted successfully' });
});


// ==========================================
// 2. EVENTS (VIGNAN'S MAHOTSAV + CAMPUS EVENTS)
// ==========================================

// Public: Get events
router.get('/events', (req, res) => {
  const events = db.find('events');
  const published = events.filter(e => e.published !== false && e.status !== 'draft');
  res.json(published);
});

// Admin: Get all events
router.get('/admin/events', requireAdmin, (req, res) => {
  res.json(db.getCollection('events'));
});

// Admin: Create event
router.post('/events', requireAdmin, (req, res) => {
  const { title, subtitle, shortDescription, description, image, date, time, location, status, featured, published, highlights } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const eventItem = db.insert('events', {
    title,
    subtitle: subtitle || '',
    shortDescription: shortDescription || '',
    description: description || '',
    image: image || '',
    date: date || new Date().toISOString().split('T')[0],
    time: time || '',
    location: location || 'VFSTR Campus, Near N Block',
    status: status || 'upcoming',
    featured: Boolean(featured),
    published: published !== false,
    highlights: highlights || []
  });
  res.status(201).json(eventItem);
});

// Admin: Update event
router.put('/events/:id', requireAdmin, (req, res) => {
  const updated = db.updateById('events', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Event not found' });
  res.json(updated);
});

// Admin: Delete event
router.delete('/events/:id', requireAdmin, (req, res) => {
  const success = db.deleteById('events', req.params.id);
  if (!success) return res.status(404).json({ error: 'Event not found' });
  res.json({ message: 'Event deleted successfully' });
});


// ==========================================
// 3. SYNERGY (STUDENT TALENT SHOWCASE)
// ==========================================

// Public: Get published Synergy posts
router.get('/synergy', (req, res) => {
  const list = db.find('synergy');
  res.json(list.filter(s => s.status !== 'draft'));
});

// Admin: Get all Synergy entries
router.get('/admin/synergy', requireAdmin, (req, res) => {
  res.json(db.getCollection('synergy'));
});

// Admin: Create Synergy showcase
router.post('/synergy', requireAdmin, (req, res) => {
  const { title, tagline, description, talentTypes, date, time, status, image } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const item = db.insert('synergy', {
    title,
    tagline: tagline || 'One Stage. Infinite Possibilities.',
    description: description || '',
    talentTypes: talentTypes || ['Singing', 'Dancing', 'Poetry', 'Instrumental', 'Comedy', 'Art'],
    date: date || new Date().toISOString().split('T')[0],
    time: time || 'Monthly Showcase',
    status: status || 'published',
    image: image || ''
  });
  res.status(201).json(item);
});

// Admin: Update Synergy
router.put('/synergy/:id', requireAdmin, (req, res) => {
  const updated = db.updateById('synergy', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Item not found' });
  res.json(updated);
});

// Admin: Delete Synergy
router.delete('/synergy/:id', requireAdmin, (req, res) => {
  const success = db.deleteById('synergy', req.params.id);
  if (!success) return res.status(404).json({ error: 'Item not found' });
  res.json({ message: 'Synergy showcase deleted' });
});


// ==========================================
// 4. FACILITIES & SERVICES
// ==========================================

// Public: Get active facilities
router.get('/facilities', (req, res) => {
  const list = db.find('facilities');
  res.json(list.filter(f => f.status !== 'inactive'));
});

// Admin: Get all facilities
router.get('/admin/facilities', requireAdmin, (req, res) => {
  res.json(db.getCollection('facilities'));
});

// Admin: Create facility card
router.post('/facilities', requireAdmin, (req, res) => {
  const { title, description, icon, image, status, order } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const item = db.insert('facilities', {
    title,
    description: description || '',
    icon: icon || 'Utensils',
    image: image || '',
    status: status || 'active',
    order: order || 0
  });
  res.status(201).json(item);
});

// Admin: Update facility
router.put('/facilities/:id', requireAdmin, (req, res) => {
  const updated = db.updateById('facilities', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Facility not found' });
  res.json(updated);
});

// Admin: Delete facility
router.delete('/facilities/:id', requireAdmin, (req, res) => {
  const success = db.deleteById('facilities', req.params.id);
  if (!success) return res.status(404).json({ error: 'Facility not found' });
  res.json({ message: 'Facility deleted' });
});


// ==========================================
// 5. FEEDBACK
// ==========================================

// Public: Submit feedback
router.post('/feedback', (req, res) => {
  const { name, email, phone, rating, category, comment, imageUrl } = req.body;
  if (!comment || !rating) {
    return res.status(400).json({ error: 'Rating and comment are required' });
  }

  const feedbackItem = db.insert('feedback', {
    name: name ? name.trim() : 'Anonymous Student',
    email: email ? email.trim() : '',
    phone: phone ? phone.trim() : '',
    rating: Number(rating),
    category: category || 'Experience',
    comment: comment.trim(),
    imageUrl: imageUrl || '',
    status: 'new',
    adminNotes: ''
  });

  res.status(201).json({ message: 'Thank you for your feedback!', feedback: feedbackItem });
});

// Admin: View all feedback
router.get('/admin/feedback', requireAdmin, (req, res) => {
  res.json(db.getCollection('feedback'));
});

// Admin: Update feedback status / notes
router.put('/admin/feedback/:id', requireAdmin, (req, res) => {
  const { status, adminNotes } = req.body;
  const updated = db.updateById('feedback', req.params.id, {
    ...(status && { status }),
    ...(adminNotes !== undefined && { adminNotes })
  });
  if (!updated) return res.status(404).json({ error: 'Feedback not found' });
  res.json(updated);
});


// ==========================================
// 6. LOCATION & SITE SETTINGS
// ==========================================

// Public: Get location info
router.get('/location', (req, res) => {
  res.json(db.getLocation());
});

// Admin: Update location info
router.put('/location', requireAdmin, (req, res) => {
  const updated = db.updateLocation(req.body);
  res.json(updated);
});

// Public: Get site settings
router.get('/settings', (req, res) => {
  res.json(db.getSettings());
});

// Admin: Update site settings
router.put('/settings', requireAdmin, (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// Public: Get Ordering Slot config and live status
const handleGetOrderingSlot = (req, res) => {
  const slotConfig = db.getOrderingSlot();
  const slotStatus = db.checkOrderingSlotStatus(slotConfig);
  res.json(slotStatus);
};

router.get('/ordering-slot', handleGetOrderingSlot);
router.get('/admin/ordering-slot', handleGetOrderingSlot);

// Admin: Update Ordering Slot config (Default vs Today's Active Slot)
const handlePutOrderingSlot = async (req, res) => {
  const { target, action, orderingStartTime, orderingEndTime, pickupStartTime, pickupEndTime } = req.body;

  if (action === 'reset') {
    const updatedSlot = db.resetOrderingSlot();
    const slotStatus = db.checkOrderingSlotStatus(updatedSlot);
    return res.json(slotStatus);
  }

  const validateTimeRange = (start, end, label) => {
    if (start && end) {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) {
        return `${label}: Invalid time format.`;
      }
      if (sh * 60 + sm >= eh * 60 + em) {
        return `${label}: End time (${end}) must be after Start time (${start}).`;
      }
    }
    return null;
  };

  const ordErr = validateTimeRange(orderingStartTime, orderingEndTime, 'Ordering Slot');
  if (ordErr) return res.status(400).json({ error: ordErr, message: ordErr });

  const picErr = validateTimeRange(pickupStartTime, pickupEndTime, 'Pickup Slot');
  if (picErr) return res.status(400).json({ error: picErr, message: picErr });

  const updatedSlot = db.updateOrderingSlot(req.body);
  const slotStatus = db.checkOrderingSlotStatus(updatedSlot);
  res.json(slotStatus);
};

router.put('/ordering-slot', requireAdmin, handlePutOrderingSlot);
router.put('/admin/ordering-slot', requireAdmin, handlePutOrderingSlot);

// Admin: Reset today's ordering slot to default
const handleResetOrderingSlot = async (req, res) => {
  const updatedSlot = db.resetOrderingSlot();
  const slotStatus = db.checkOrderingSlotStatus(updatedSlot);
  res.json(slotStatus);
};

router.post('/ordering-slot/reset', requireAdmin, handleResetOrderingSlot);
router.delete('/ordering-slot', requireAdmin, handleResetOrderingSlot);
router.delete('/admin/ordering-slot', requireAdmin, handleResetOrderingSlot);

// Public: Get home page content
router.get('/home-content', (req, res) => {
  res.json(db.getHomeContent());
});

// Admin: Update home page content
router.put('/home-content', requireAdmin, (req, res) => {
  const updated = db.updateHomeContent(req.body);
  res.json(updated);
});


// ==========================================
// 7. ADMIN DASHBOARD OVERVIEW STATS & DAILY SALES
// ==========================================

function getDailySalesMetrics(targetDateStr) {
  const allOrders = db.getCollection('orders') || [];

  let totalOrders = 0;
  let totalRevenue = 0;
  let completedOrders = 0;
  let pendingOrders = 0;

  let deliveringOrders = 0;
  let deliveringRevenue = 0;

  const diningOrders = 0;
  const diningRevenue = 0;

  allOrders.forEach(ord => {
    const rawDate = ord.placedAt || ord.createdAt;
    if (!rawDate) return;

    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const ordDateStr = `${year}-${month}-${day}`;

    if (ordDateStr !== targetDateStr) return;

    const status = (ord.status || ord.orderStatus || '').toUpperCase();
    const isPendingPayment = status === 'PENDING_PAYMENT';

    if (isPendingPayment) {
      return;
    }

    totalOrders++;

    const orderAmount = Number(
      ord.totalAmount !== undefined 
        ? ord.totalAmount 
        : (ord.total !== undefined 
            ? ord.total 
            : (ord.subtotal || 0) + (ord.parcelCharge || 0))
    );

    totalRevenue += orderAmount;

    if (status === 'COMPLETED' || status === 'DELIVERED') {
      completedOrders++;
    } else {
      pendingOrders++;
    }

    deliveringOrders++;
    deliveringRevenue += orderAmount;
  });

  const parts = targetDateStr.split('-');
  let formattedDate = targetDateStr;
  if (parts.length === 3) {
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (!isNaN(dateObj.getTime())) {
      formattedDate = dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }

  return {
    date: targetDateStr,
    formattedDate,
    totalOrders,
    totalRevenue,
    completedOrders,
    pendingOrders,
    deliveringOrders,
    deliveringRevenue,
    diningOrders,
    diningRevenue
  };
}

const handleGetStats = (req, res) => {
  try {
    const users = db.getCollection('users');
    const events = db.getCollection('events');
    const synergy = db.getCollection('synergy');
    const feedback = db.getCollection('feedback');
    const happenings = db.getCollection('happenings');

    const customersCount = users.filter(u => u.role === 'customer').length;
    const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
    const synergyShowcases = synergy.length;
    const pendingFeedback = feedback.filter(f => f.status === 'new').length;
    const activeHappenings = happenings.filter(h => h.status !== 'draft').length;

    const todayObj = new Date();
    const year = todayObj.getFullYear();
    const month = String(todayObj.getMonth() + 1).padStart(2, '0');
    const day = String(todayObj.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    const dailySales = getDailySalesMetrics(todayStr);

    res.json({
      totalCustomers: customersCount,
      upcomingEvents,
      synergyShowcases,
      feedbackReceived: feedback.length,
      pendingFeedback,
      activeUpdates: activeHappenings,
      todayOrders: dailySales.totalOrders,
      todayRevenue: dailySales.totalRevenue,
      completedOrders: dailySales.completedOrders,
      pendingOrders: dailySales.pendingOrders,
      dailySales
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
};

router.get('/admin/stats', requireAdmin, handleGetStats);
router.get('/stats', handleGetStats);

router.get('/admin/daily-sales', requireAdmin, (req, res) => {
  try {
    let dateStr = req.query.date;
    if (!dateStr) {
      const todayObj = new Date();
      const year = todayObj.getFullYear();
      const month = String(todayObj.getMonth() + 1).padStart(2, '0');
      const day = String(todayObj.getDate()).padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    }
    const metrics = getDailySalesMetrics(dateStr);
    res.json(metrics);
  } catch (err) {
    console.error('Error fetching daily sales metrics:', err);
    res.status(500).json({ message: 'Failed to fetch daily sales metrics' });
  }
});

// Admin: Manage Staff Phone Numbers
router.get('/admin/phone-numbers', requireAdmin, (req, res) => {
  res.json(db.getAdminPhoneNumbers());
});

router.post('/admin/phone-numbers', requireAdmin, (req, res) => {
  const { phone } = req.body;
  if (!phone || String(phone).replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'Please provide a valid 10-digit mobile number' });
  }
  const updatedList = db.addAdminPhoneNumber(phone);
  res.json(updatedList);
});

router.delete('/admin/phone-numbers/:phone', requireAdmin, (req, res) => {
  const { phone } = req.params;
  const clean = String(phone).replace(/\D/g, '');
  if (clean === '7672022351') {
    return res.status(400).json({ error: 'Primary admin number cannot be deleted' });
  }
  const updatedList = db.removeAdminPhoneNumber(phone);
  res.json(updatedList);
});

// ==========================================
// 8. NAVBAR MANAGEMENT
// ==========================================
router.get('/navbar', (req, res) => {
  res.json(db.getNavbar());
});

router.put('/navbar', requireAdmin, (req, res) => {
  const updated = db.updateNavbar(req.body);
  res.json(updated);
});

// ==========================================
// 9. ABOUT PAGE CONTENT MANAGEMENT
// ==========================================
router.get(['/about-content', '/about-settings', '/about'], (req, res) => {
  res.json(db.getAboutContent());
});

router.put(['/about-content', '/about-settings', '/about'], requireAdmin, (req, res) => {
  const updated = db.updateAboutContent(req.body);
  res.json(updated);
});

// ==========================================
// 10. EXPLORE PAGE CONTENT MANAGEMENT
// ==========================================
router.get(['/explore-content', '/explore-settings', '/explore'], (req, res) => {
  res.json(db.getExploreContent());
});

router.put(['/explore-content', '/explore-settings', '/explore'], requireAdmin, (req, res) => {
  const updated = db.updateExploreContent(req.body);
  res.json(updated);
});

module.exports = router;
