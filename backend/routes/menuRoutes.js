const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { supabase, isSupabaseConfigured, mapRowToMenuItem, mapMenuItemToRow } = require('../config/supabase');

// =========================================================================
// SUPABASE / DB MENU ENDPOINTS
// =========================================================================

// @route   GET /api/menu
// @desc    Get all menu items
router.get('/', async (req, res) => {
  try {
    const { category, search, foodType, availableOnly, serviceType, mode } = req.query;

    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('menu_items').select('*');

      const targetService = serviceType || mode;
      if (targetService) {
        const s = targetService.toLowerCase();
        if (s === 'dining') {
          query = query.in('service_type', ['both', 'dining']);
        } else if (s === 'delivery') {
          query = query.in('service_type', ['both', 'delivery']);
        }
      }

      if (availableOnly === 'true') {
        query = query.eq('is_available', true);
      }

      if (category && category !== 'All') {
        query = query.ilike('category', category);
      }

      if (foodType && foodType !== 'All') {
        const ft = foodType.toLowerCase();
        if (ft === 'veg') {
          query = query.in('food_type', ['Veg', 'veg']);
        } else if (ft === 'non-veg') {
          query = query.in('food_type', ['Non-Veg', 'non-veg']);
        } else if (ft === 'seafood') {
          query = query.in('food_type', ['seafood', 'Sea Food', 'sea food']);
        }
      }

      if (search) {
        const term = search.trim();
        query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%,subcategory.ilike.%${term}%`);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        const mappedItems = data.map(mapRowToMenuItem);
        return res.json(mappedItems);
      }
    }

    // Local DB fallback
    let items = db.find('foodItems', {}) || [];

    const targetService = serviceType || mode;
    if (targetService) {
      const s = targetService.toLowerCase();
      items = items.filter(item => {
        const st = (item.serviceType || 'both').toLowerCase();
        return st === 'both' || st === s;
      });
    }

    if (availableOnly === 'true') {
      items = items.filter(item => item.isAvailable !== false && item.available !== false);
    }

    if (category && category !== 'All') {
      items = items.filter(item => (item.category || '').toLowerCase() === category.toLowerCase());
    }

    if (foodType && foodType !== 'All') {
      const ft = foodType.toLowerCase();
      items = items.filter(item => (item.foodType || item.dietary || '').toLowerCase() === ft);
    }

    if (search) {
      const term = search.trim().toLowerCase();
      items = items.filter(item =>
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.category && item.category.toLowerCase().includes(term))
      );
    }

    return res.json(items);
  } catch (err) {
    console.error('Error in GET /api/menu:', err);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
});

// @route   GET /api/menu/category/:category
// @desc    Get menu items by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .ilike('category', category);

      if (!error && data) {
        const mappedItems = data.map(mapRowToMenuItem);
        return res.json(mappedItems);
      }
    }

    const items = (db.find('foodItems', {}) || []).filter(
      item => (item.category || '').toLowerCase() === category.toLowerCase()
    );
    return res.json(items);
  } catch (err) {
    console.error('Error fetching menu items by category:', err);
    res.status(500).json({ message: 'Failed to fetch category items' });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return res.json(mapRowToMenuItem(data));
      }
    }

    const item = db.findById('foodItems', id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    return res.json(item);
  } catch (err) {
    console.error('Error fetching single menu item:', err);
    res.status(500).json({ message: 'Failed to fetch menu item' });
  }
});

// @route   POST /api/menu
// @desc    Create a new menu item
router.post('/', async (req, res) => {
  try {
    const { name, category, subcategory, price, priceOptions, foodType, description, image, popular, isAvailable, serviceType } = req.body;

    if (!name || !category || (!price && (!priceOptions || priceOptions.length === 0))) {
      return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    const newItemData = {
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
    };

    if (isSupabaseConfigured() && supabase) {
      const row = mapMenuItemToRow(newItemData);
      const { data, error } = await supabase
        .from('menu_items')
        .insert([row])
        .select()
        .single();

      if (!error && data) {
        const newItem = mapRowToMenuItem(data);
        return res.status(201).json(newItem);
      }
    }

    const created = db.insert('foodItems', newItemData);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating menu item:', err);
    res.status(500).json({ message: 'Failed to create menu item' });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update a menu item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured() && supabase) {
      const row = mapMenuItemToRow(req.body);
      const { data, error } = await supabase
        .from('menu_items')
        .update(row)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return res.json(mapRowToMenuItem(data));
      }
    }

    const updated = db.updateById('foodItems', id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ message: 'Failed to update menu item' });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a menu item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error deleting menu item:', error.message);
      }
    }

    db.deleteById('foodItems', id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
});

module.exports = router;
