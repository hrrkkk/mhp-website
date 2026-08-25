const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'mhp_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial empty DB template with new MHP structure
const initialDbState = {
  users: [],
  happenings: [],
  events: [],
  synergy: [],
  facilities: [],
  feedback: [],
  bills: [],
  settings: {
    siteName: "MHP – The Most Happening Place",
    heroTitle: "MHP",
    heroSubtitle: "Where campus life happens.",
    heroDescription: "Your on-campus space to eat, connect, create, perform and make memories at VFSTR, Vadlamudi.",
    aboutText: "MHP – The Most Happening Place is an on-campus dining, social and student activity space at VFSTR, Vadlamudi. Positioned near N Block, MHP is designed to be more than a food counter — it is a place where students can eat, meet, relax, connect, participate, perform, create and enjoy campus life.",
    contactEmail: "mhp@vignan.ac.in",
    operatingHours: {
      regular: "Monday – Saturday: 8:00 AM – 6:00 PM",
      sunday: "Sunday: Open when college is operational",
      note: "Sunday hours may vary depending on college operations."
    }
  },
  location: {
    institution: "VFSTR (Vignan's Foundation for Science, Technology & Research)",
    address: "Vadlamudi, Guntur District, Andhra Pradesh - 522213",
    landmark: "Near N Block",
    operatingStatus: "Active Campus Hub",
    notes: "Located near N Block within easy walking distance from all academic departments."
  },
  homeContent: {
    hero: {
      heading: "MHP – The Most Happening Place",
      subtitle: '"Where campus life happens."',
      description: "Your campus space to eat, connect, create and enjoy at VFSTR, Vadlamudi.",
      primaryBtnText: "Explore Food Menu",
      primaryBtnLink: "/menu",
      image: ""
    },
    campusExperience: {
      sectionLabel: "The Campus Experience",
      heading: "More Than Just Food — The Heartbeat of VFSTR Campus",
      description: "MHP is an on-campus space where students eat, meet, relax, connect, participate, perform, create, and enjoy campus life. Positioned right near N Block, MHP provides quick dining and social convenience during lecture breaks.",
      bullet1: "Central meeting spot for student project teams near N Block",
      bullet2: "Host stage to Synergy monthly student talent showcases",
      bullet3: "Fresh dining & refreshment counters for academic breaks",
      image: "/uploads/mhp-1787070668709-441630964.jpg"
    },
    synergy: {
      sectionLabel: "Monthly Student Talent Showcase",
      heading: "SYNERGY",
      tagline: '"One Stage. Infinite Possibilities."',
      description: "Synergy is a monthly MHP student talent showcase where students get a small stage to present their talents, creativity and passion.",
      buttonText: "Discover Synergy",
      buttonLink: "/about",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
    }
  },
  categories: [],
  foodItems: [],
  orders: []
};

class JSONDatabase {
  constructor() {
    this.filePath = DB_FILE;
    this.data = this.load();
  }

  load() {
    try {
      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, JSON.stringify(initialDbState, null, 2));
        return JSON.parse(JSON.stringify(initialDbState));
      }
      const fileData = fs.readFileSync(this.filePath, 'utf8');
      const parsed = JSON.parse(fileData);
      return { ...initialDbState, ...parsed };
    } catch (err) {
      console.error('Error reading JSON database, resetting:', err);
      return JSON.parse(JSON.stringify(initialDbState));
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  getCollection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
      this.save();
    }
    return this.data[name];
  }

  find(collectionName, query = {}) {
    const list = this.getCollection(collectionName);
    return list.filter(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  findOne(collectionName, query = {}) {
    const results = this.find(collectionName, query);
    return results.length > 0 ? results[0] : null;
  }

  findById(collectionName, id) {
    return this.findOne(collectionName, { _id: id });
  }

  insert(collectionName, item) {
    const list = this.getCollection(collectionName);
    const newItem = {
      _id: item._id || crypto.randomBytes(8).toString('hex'),
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newItem);
    this.save();
    return newItem;
  }

  updateById(collectionName, id, updateData) {
    const list = this.getCollection(collectionName);
    const index = list.findIndex(item => item._id === id);
    if (index === -1) return null;
    
    const updatedItem = {
      ...list[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    list[index] = updatedItem;
    this.save();
    return updatedItem;
  }

  update(collectionName, id, updateData) {
    return this.updateById(collectionName, id, updateData);
  }

  deleteById(collectionName, id) {
    const list = this.getCollection(collectionName);
    const index = list.findIndex(item => item._id === id);
    if (index === -1) return false;
    list.splice(index, 1);
    this.save();
    return true;
  }

  remove(collectionName, id) {
    return this.deleteById(collectionName, id);
  }

  getOrderingSlot(targetDateStr) {
    const todayStr = targetDateStr || getISTDateString();
    
    // Default slot config
    const defaults = {
      orderingStartTime: "09:30",
      orderingEndTime: "10:30",
      pickupStartTime: "12:00",
      pickupEndTime: "13:00",
      ...(this.data.settings?.orderingSlot?.defaults || {})
    };

    // Daily overrides object (keyed by IST YYYY-MM-DD date)
    const dailyOverrides = this.data.settings?.orderingSlot?.dailyOverrides || {};
    const todayOverride = dailyOverrides[todayStr] || null;

    // Active timing for target date
    const activeSlot = {
      orderingStartTime: todayOverride?.orderingStartTime || defaults.orderingStartTime,
      orderingEndTime: todayOverride?.orderingEndTime || defaults.orderingEndTime,
      pickupStartTime: todayOverride?.pickupStartTime || defaults.pickupStartTime,
      pickupEndTime: todayOverride?.pickupEndTime || defaults.pickupEndTime
    };

    return {
      defaults,
      todayOverride,
      hasTodayOverride: Boolean(todayOverride),
      activeSlot,
      todayDate: todayStr,

      // Root level properties for backward compatibility
      orderingStartTime: activeSlot.orderingStartTime,
      orderingEndTime: activeSlot.orderingEndTime,
      pickupStartTime: activeSlot.pickupStartTime,
      pickupEndTime: activeSlot.pickupEndTime
    };
  }

  updateOrderingSlot(payload = {}) {
    if (!this.data.settings) this.data.settings = {};
    if (!this.data.settings.orderingSlot) {
      this.data.settings.orderingSlot = {
        defaults: {
          orderingStartTime: "09:30",
          orderingEndTime: "10:30",
          pickupStartTime: "12:00",
          pickupEndTime: "13:00"
        },
        dailyOverrides: {}
      };
    }

    const { target, orderingStartTime, orderingEndTime, pickupStartTime, pickupEndTime } = payload;
    const todayStr = getISTDateString();

    if (target === 'default') {
      if (!this.data.settings.orderingSlot.defaults) {
        this.data.settings.orderingSlot.defaults = {};
      }
      if (orderingStartTime) this.data.settings.orderingSlot.defaults.orderingStartTime = orderingStartTime;
      if (orderingEndTime) this.data.settings.orderingSlot.defaults.orderingEndTime = orderingEndTime;
      if (pickupStartTime) this.data.settings.orderingSlot.defaults.pickupStartTime = pickupStartTime;
      if (pickupEndTime) this.data.settings.orderingSlot.defaults.pickupEndTime = pickupEndTime;
    } else {
      // Default target is 'today' / 'active'
      if (!this.data.settings.orderingSlot.dailyOverrides) {
        this.data.settings.orderingSlot.dailyOverrides = {};
      }
      const existingToday = this.data.settings.orderingSlot.dailyOverrides[todayStr] || {};
      const currentFull = this.getOrderingSlot(todayStr);
      const currentActive = currentFull.activeSlot;

      this.data.settings.orderingSlot.dailyOverrides[todayStr] = {
        orderingStartTime: orderingStartTime || existingToday.orderingStartTime || currentActive.orderingStartTime,
        orderingEndTime: orderingEndTime || existingToday.orderingEndTime || currentActive.orderingEndTime,
        pickupStartTime: pickupStartTime || existingToday.pickupStartTime || currentActive.pickupStartTime,
        pickupEndTime: pickupEndTime || existingToday.pickupEndTime || currentActive.pickupEndTime
      };
    }

    this.save();
    return this.getOrderingSlot(todayStr);
  }

  getSettings() {
    return {
      ...initialDbState.settings,
      ...(this.data.settings || {}),
      orderingSlot: this.getOrderingSlot()
    };
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    if (newSettings.orderingSlot) {
      this.data.settings.orderingSlot = { ...this.getOrderingSlot(), ...newSettings.orderingSlot };
    }
    this.save();
    return this.getSettings();
  }

  getLocation() {
    return this.data.location || initialDbState.location;
  }

  updateLocation(newLocation) {
    this.data.location = { ...this.data.location, ...newLocation };
    this.save();
    return this.data.location;
  }

  getHomeContent() {
    return {
      hero: { ...initialDbState.homeContent.hero, ...(this.data.homeContent?.hero || {}) },
      campusExperience: { ...initialDbState.homeContent.campusExperience, ...(this.data.homeContent?.campusExperience || {}) },
      synergy: { ...initialDbState.homeContent.synergy, ...(this.data.homeContent?.synergy || {}) }
    };
  }

  updateHomeContent(newContent = {}) {
    const current = this.getHomeContent();
    this.data.homeContent = {
      hero: { ...current.hero, ...(newContent.hero || {}) },
      campusExperience: { ...current.campusExperience, ...(newContent.campusExperience || {}) },
      synergy: { ...current.synergy, ...(newContent.synergy || {}) }
    };
    this.save();
    return this.data.homeContent;
  }
}

// IST Schedule Helper Calculation
function getISTDate() {
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istMs = utcMs + (330 * 60000);
  return new Date(istMs);
}

function getISTDateString() {
  const d = getISTDate();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function format12h(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  const minStr = m < 10 ? `0${m}` : m;
  return `${hour12}:${minStr} ${period}`;
}

function checkOrderingSlotStatus(slotConfig) {
  const istNow = getISTDate();
  const todayStr = getISTDateString();
  const fullConfig = db.getOrderingSlot ? db.getOrderingSlot(todayStr) : null;

  const defaults = fullConfig?.defaults || {
    orderingStartTime: "09:30",
    orderingEndTime: "10:30",
    pickupStartTime: "12:00",
    pickupEndTime: "13:00"
  };

  const active = slotConfig?.activeSlot || slotConfig || fullConfig?.activeSlot || defaults;

  const currentMinutes = istNow.getHours() * 60 + istNow.getMinutes();

  const [startH, startM] = (active.orderingStartTime || "09:30").split(':').map(Number);
  const startMinutes = startH * 60 + startM;

  const [endH, endM] = (active.orderingEndTime || "10:30").split(':').map(Number);
  const endMinutes = endH * 60 + endM;

  let status = 'CLOSED_BEFORE';
  if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
    status = 'OPEN';
  } else if (currentMinutes > endMinutes) {
    status = 'CLOSED_AFTER';
  }

  const orderingStartFormatted = format12h(active.orderingStartTime || "09:30");
  const orderingEndFormatted = format12h(active.orderingEndTime || "10:30");
  const pickupStartFormatted = format12h(active.pickupStartTime || "12:00");
  const pickupEndFormatted = format12h(active.pickupEndTime || "13:00");

  const defaultOrderingStartFormatted = format12h(defaults.orderingStartTime || "09:30");
  const defaultOrderingEndFormatted = format12h(defaults.orderingEndTime || "10:30");
  const defaultPickupStartFormatted = format12h(defaults.pickupStartTime || "12:00");
  const defaultPickupEndFormatted = format12h(defaults.pickupEndTime || "13:00");

  let message = '';
  if (status === 'OPEN') {
    message = `ORDERING OPEN (Accepting orders until ${orderingEndFormatted})`;
  } else if (status === 'CLOSED_BEFORE') {
    message = `Ordering opens today at ${orderingStartFormatted}.`;
  } else {
    message = `Today's ordering window is closed. Next ordering slot: Tomorrow, ${defaultOrderingStartFormatted} – ${defaultOrderingEndFormatted}`;
  }

  return {
    isOpen: status === 'OPEN',
    status,
    message,
    orderingWindow: `${orderingStartFormatted} – ${orderingEndFormatted}`,
    pickupWindow: `${pickupStartFormatted} – ${pickupEndFormatted}`,
    defaultOrderingWindow: `${defaultOrderingStartFormatted} – ${defaultOrderingEndFormatted}`,
    defaultPickupWindow: `${defaultPickupStartFormatted} – ${defaultPickupEndFormatted}`,
    orderingStartTime: active.orderingStartTime,
    orderingEndTime: active.orderingEndTime,
    pickupStartTime: active.pickupStartTime,
    pickupEndTime: active.pickupEndTime,
    orderingStartFormatted,
    orderingEndFormatted,
    pickupStartFormatted,
    pickupEndFormatted,
    defaults: {
      orderingStartTime: defaults.orderingStartTime,
      orderingEndTime: defaults.orderingEndTime,
      pickupStartTime: defaults.pickupStartTime,
      pickupEndTime: defaults.pickupEndTime,
      orderingWindow: `${defaultOrderingStartFormatted} – ${defaultOrderingEndFormatted}`,
      pickupWindow: `${defaultPickupStartFormatted} – ${defaultPickupEndFormatted}`,
      orderingStartFormatted: defaultOrderingStartFormatted,
      orderingEndFormatted: defaultOrderingEndFormatted,
      pickupStartFormatted: defaultPickupStartFormatted,
      pickupEndFormatted: defaultPickupEndFormatted
    },
    todayDate: todayStr,
    hasTodayOverride: Boolean(fullConfig?.hasTodayOverride)
  };
}

const db = new JSONDatabase();
db.checkOrderingSlotStatus = checkOrderingSlotStatus;
db.getISTDate = getISTDate;
db.getISTDateString = getISTDateString;
module.exports = db;
