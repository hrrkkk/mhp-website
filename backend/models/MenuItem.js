const mongoose = require('mongoose');

const PriceOptionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const MenuItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  category: { 
    type: String, 
    required: true,
    trim: true,
    index: true
  },
  subcategory: { 
    type: String,
    default: '',
    trim: true
  },
  description: { 
    type: String, 
    default: '' 
  },
  price: { 
    type: Number, 
    required: true 
  },
  priceOptions: [PriceOptionSchema],
  foodType: { 
    type: String, 
    enum: ['Veg', 'Non-Veg', 'seafood', 'veg', 'non-veg'],
    default: 'Veg' 
  },
  image: { 
    type: String, 
    required: true 
  },
  popular: { 
    type: Boolean, 
    default: false 
  },
  available: { 
    type: Boolean, 
    default: true 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  serviceType: { 
    type: String, 
    enum: ['both', 'dining', 'delivery'],
    default: 'both' 
  }
}, { 
  timestamps: true 
});

// Index for fast query execution
MenuItemSchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
