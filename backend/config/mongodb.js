const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const ExploreContent = require('../models/ExploreContent');
const DailySlot = require('../models/DailySlot');
const db = require('./db');

let isConnected = false;

async function connectMongoDB() {
  if (isConnected) return true;

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mhp_database';
  
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully to:', mongoURI);

    // Auto-migrate original menu items from JSON DB / Seed if MongoDB collection is empty or incomplete
    await syncOriginalMenuToMongoDB();
    await syncExploreContentToMongoDB();
    await syncDailySlotsToMongoDB();
    return true;
  } catch (err) {
    console.warn('⚠️ MongoDB connection warning (falling back to JSON DB mode):', err.message);
    isConnected = false;
    return false;
  }
}

async function syncOriginalMenuToMongoDB() {
  try {
    if (!isConnected) return;

    // Get verified original items from db.json
    const originalItems = db.find('foodItems', {}) || [];
    if (originalItems.length === 0) return;

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of originalItems) {
      const filter = { name: item.name, category: item.category };
      const doc = {
        name: item.name,
        category: item.category,
        subcategory: item.subcategory || '',
        description: item.description || '',
        price: Number(item.price) || 0,
        priceOptions: item.priceOptions || [],
        foodType: item.foodType || 'Veg',
        image: item.image,
        popular: Boolean(item.popular),
        available: item.available !== false && item.isAvailable !== false,
        isAvailable: item.isAvailable !== false && item.available !== false,
        serviceType: item.serviceType || 'both'
      };

      const result = await MenuItem.updateOne(filter, { $set: doc }, { upsert: true });
      if (result.upsertedCount > 0) {
        insertedCount++;
      } else if (result.modifiedCount > 0) {
        updatedCount++;
      }
    }

    console.log(`📦 MongoDB Menu Sync Complete: ${insertedCount} inserted, ${updatedCount} updated (${originalItems.length} total items in DB).`);
  } catch (syncErr) {
    console.error('Failed to sync original menu to MongoDB:', syncErr);
  }
}

async function syncExploreContentToMongoDB() {
  try {
    if (!isConnected) return;
    const currentJsonContent = db.getExploreContent();
    await ExploreContent.updateOne(
      { key: 'explore_main' },
      { $set: { ...currentJsonContent, key: 'explore_main' } },
      { upsert: true }
    );
    console.log('📦 MongoDB Explore Content Sync Complete.');
  } catch (syncErr) {
    console.error('Failed to sync Explore content to MongoDB:', syncErr);
  }
}

async function syncDailySlotsToMongoDB(targetDateStr) {
  try {
    if (!isConnected) return;
    const slotConfig = db.getOrderingSlot(targetDateStr);
    const date = slotConfig.todayDate;
    const active = slotConfig.activeSlot;
    const isCustom = Boolean(slotConfig.hasTodayOverride);

    await DailySlot.updateOne(
      { date },
      {
        $set: {
          date,
          orderingStartTime: active.orderingStartTime,
          orderingEndTime: active.orderingEndTime,
          pickupStartTime: active.pickupStartTime,
          pickupEndTime: active.pickupEndTime,
          isCustom
        }
      },
      { upsert: true }
    );
    console.log(`📦 MongoDB DailySlot Sync Complete for ${date} (isCustom: ${isCustom}).`);
  } catch (syncErr) {
    console.error('Failed to sync DailySlot to MongoDB:', syncErr);
  }
}

function getIsConnected() {
  return isConnected;
}

module.exports = {
  connectMongoDB,
  syncOriginalMenuToMongoDB,
  syncExploreContentToMongoDB,
  syncDailySlotsToMongoDB,
  getIsConnected
};
