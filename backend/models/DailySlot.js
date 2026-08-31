const mongoose = require('mongoose');

const DailySlotSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD in IST
    required: true,
    unique: true,
    index: true
  },
  orderingStartTime: {
    type: String,
    default: '09:30'
  },
  orderingEndTime: {
    type: String,
    default: '10:30'
  },
  pickupStartTime: {
    type: String,
    default: '12:00'
  },
  pickupEndTime: {
    type: String,
    default: '13:00'
  },
  isCustom: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.models.DailySlot || mongoose.model('DailySlot', DailySlotSchema);
