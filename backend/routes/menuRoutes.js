const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const db = require('../config/db');
const { getIsConnected } = require('../config/mongodb');

// =========================================================================
// MONGODB MENU ENDPOINTS
// =========================================================================

// @route   GET /api/menu
// @desc    Get all menu items from MongoDB (with fallback to JSON DB)
router.get('/', async (req, res) => {
  try {
    const { category, search, foodType, availableOnly, serviceType, mode } = req.query;

    if (getIsConnected()) {
      const query = {};

      const targetService = serviceType || mode;
      if (targetService) {
        const s = targetService.toLowerCase();
        if (s === 'dining') {
          query.serviceType = { $in: ['both', 'dining'] };
        } else if (s === 'delivery') {
          query.serviceType = { $in: ['both', 'delivery'] };
        }
      }

      if (availableOnly === 'true') {
        query.$or = [{ isAvailable: true }, { available: true }];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (foodType && foodType !== 'All') {
        const ft = foodType.toLowerCase();
        if (ft === 'veg') query.foodType = { $in: ['Veg', 'veg'] };
        else if (ft === 'non-veg') query.foodType = { $in: ['Non-Veg', 'non-veg'] };
        else if (ft === 'seafood') query.foodType = { $in: ['seafood', 'Sea Food', 'sea food'] };
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        query.$or = [
          { name: regex },
          { description: regex },
          { category: regex },
          { subcategory: regex }
        ];
      }

      const items = await MenuItem.find(query).lean();
      return res.json(items);
    }

    // Fallback to JSON DB if MongoDB is offline
    let items = db.find('foodItems', {});
    if (category && category !== 'All') {
      items = items.filter(i => i.category === category);
    }
    res.json(items);
  } catch (err) {
    console.error('Error fetching MongoDB menu items:', err);
    // Fallback to JSON DB
    const items = db.find('foodItems', {});
    res.json(items);
  }
});

// @route   GET /api/menu/category/:category
// @desc    Get menu items by category from MongoDB
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    if (getIsConnected()) {
      const items = await MenuItem.find({ category }).lean();
      return res.json(items);
    }
    const items = db.find('foodItems', { category });
    res.json(items);
  } catch (err) {
    console.error('Error fetching menu items by category:', err);
    res.status(500).json({ message: 'Failed to fetch category items' });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item by ID from MongoDB
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const item = await MenuItem.findById(id).lean();
      if (item) return res.json(item);
    }
    const item = db.findById('foodItems', id) || db.findOne('foodItems', { _id: id });
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error('Error fetching single menu item:', err);
    res.status(500).json({ message: 'Failed to fetch menu item' });
  }
});

module.exports = router;
