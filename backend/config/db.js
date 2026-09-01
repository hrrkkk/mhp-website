const crypto = require('crypto');
const { 
  supabase, 
  mapRowToMenuItem, 
  mapMenuItemToRow, 
  mapRowToUser, 
  mapUserToRow, 
  mapRowToOrder, 
  mapOrderToRow,
  mapRowToDailySlot,
  mapDailySlotToRow
} = require('./supabase');

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
  navbar: [
    { id: 'home', name: 'Home', path: '/', visible: true, order: 1 },
    { id: 'about', name: 'About', path: '/about', visible: true, order: 2 },
    { id: 'menu', name: 'Menu', path: '/menu', visible: true, order: 3 },
    { id: 'explore', name: 'Explore', path: '/explore', visible: true, order: 4 },
    { id: 'feedback', name: 'Feedback', path: '/feedback', visible: true, order: 5 },
    { id: 'profile', name: 'Profile', path: '/profile', visible: true, order: 6 },
  ],
  aboutContent: {
    heading: "MORE THAN JUST FOOD.",
    subheading: "THE HEARTBEAT OF VFSTR CAMPUS.",
    description: "MHP is an on-campus space where VFSTR students eat, meet, relax, connect, participate, perform, create, and enjoy campus life. Positioned conveniently near N Block, MHP provides quick culinary convenience and active student culture during academic breaks.",
    seatingCount: "500+",
    categoriesCount: "14",
    image: "/assets/mhp_hero_atmosphere.jpg",
    sectionVisibility: {
      story: true,
      purpose: true,
      stats: true,
      synergy: true
    }
  },
  exploreContent: {
    gallery: {
      eyebrow: "INSIDE MHP",
      heading: "GALLERY",
      subtitle: "A glimpse into the food, people and moments that make MHP special.",
      instagramHandle: "@mhp_vfstr",
      instagramSub: "Official Campus Handle",
      items: [
        { id: 1, title: "MHP Central Plaza", category: "Quadrangle Dining & Atmosphere", sub: "The Heartbeat Near N Block", image: "" },
        { id: 2, title: "Chef's Special Counters", category: "Signature Prep", sub: "", image: "" },
        { id: 3, title: "Student Gatherings", category: "Campus Break", sub: "", image: "" },
        { id: 4, title: "Authentic Campus Moments", category: "Editorial Portrait", sub: "", image: "" },
        { id: 5, title: "Flavors & Good Vibes", category: "Refreshed Daily", sub: "", image: "" }
      ]
    },
    reels: {
      eyebrow: "THE MOMENTS WE KEEP",
      heading: "Events & Memories",
      subtitle: "From celebrations and campus events to everyday moments, these are the memories that make MHP more than a place to eat.",
      videos: [
        { id: 1, title: "Campus Evening Vibes", tag: "DAILY MOMENTS", src: "/videos/mhp_hero_video.mp4", thumbnail: "", visible: true, order: 1 },
        { id: 2, title: "Biryani & Conversations", tag: "SIGNATURE DISHES", src: "/videos/WhatsApp%20Video%202026-08-27%20at%209.02.26%20PM.mp4", thumbnail: "", visible: true, order: 2 },
        { id: 3, title: "Synergy Open Mic Night", tag: "STUDENT STAGE", src: "/videos/mhp_hero_video.mp4", thumbnail: "", visible: true, order: 3 },
        { id: 4, title: "Mahotsav Prep & Fest Stalls", tag: "CAMPUS FESTIVAL", src: "/videos/WhatsApp%20Video%202026-08-27%20at%209.02.26%20PM.mp4", thumbnail: "", visible: true, order: 4 }
      ]
    },
    brandStatement: {
      heading: "EAT. MEET. REMEMBER. THAT'S MHP.",
      tagline: "More than a place to eat. A part of campus life."
    }
  },
  foodItems: [],
  orders: []
};

class SupabaseDatabase {
  constructor() {
    this.loadFromLocalJson();
    this.ensureAdminUser();
    this.initFromSupabase();
  }

  async ensureAdminUser() {
    try {
      const bcrypt = require('bcryptjs');
      const adminEmail = 'admin@mhp.vfstr.ac.in';
      const adminPhone = '7672022351';
      let existing = this.findOne('users', u => u.role === 'admin' || u.phone === adminPhone || (u.email && u.email.toLowerCase() === adminEmail));
      if (!existing) {
        const hashedPassword = await bcrypt.hash('mhp@zest143', 10);
        this.insert('users', {
          name: 'MHP Administrator',
          email: adminEmail,
          password: hashedPassword,
          phone: adminPhone,
          role: 'admin',
          studentId: 'STAFF-MHP-01',
          hostelInfo: 'MHP Office, Near N Block',
          avatar: ''
        });
        console.log('✅ Auto-seeded admin user: Phone 7672022351 / Password mhp@zest143');
      } else {
        if (!existing.phone || existing.phone === '9876543210') {
          this.updateById('users', existing._id, { phone: adminPhone });
        }
      }
    } catch (e) {
      console.error('Error ensuring admin user:', e.message);
    }
  }

  loadFromLocalJson() {
    try {
      const fs = require('fs');
      const path = require('path');
      const DB_FILE = path.join(__dirname, '..', 'data', 'mhp_db.json');
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        if (fileContent) {
          const parsed = JSON.parse(fileContent);
          this.cache = { ...this.cache, ...parsed };
        }
      }
    } catch (e) {
      console.error('Error loading local mhp_db.json fallback:', e.message);
    }
  }

  saveToLocalJson() {
    try {
      const fs = require('fs');
      const path = require('path');
      const DATA_DIR = path.join(__dirname, '..', 'data');
      const DB_FILE = path.join(DATA_DIR, 'mhp_db.json');
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.cache, null, 2), 'utf8');
    } catch (e) {
      console.error('Error saving local mhp_db.json fallback:', e.message);
    }
  }

  async initFromSupabase() {
    if (!supabase) return;
    try {
      // Load Menu Items
      const { data: menuData } = await supabase.from('menu_items').select('*');
      if (menuData && menuData.length > 0) {
        this.cache.foodItems = menuData.map(mapRowToMenuItem);
      } else if (menuData && menuData.length === 0 && this.cache.foodItems && this.cache.foodItems.length > 0) {
        console.log('🌱 Supabase menu_items table is empty. Auto-seeding 206 local food items to Supabase...');
        try {
          const rows = this.cache.foodItems.map(mapMenuItemToRow).filter(Boolean);
          if (rows.length > 0) {
            await supabase.from('menu_items').upsert(rows);
            console.log(`✅ Successfully seeded ${rows.length} menu items to Supabase!`);
          }
        } catch (seedErr) {
          console.error('Error auto-seeding menu items to Supabase:', seedErr.message);
        }
      }

      // Load Users
      const { data: userData } = await supabase.from('users').select('*');
      if (userData && userData.length > 0) {
        this.cache.users = userData.map(mapRowToUser);
      }
      await this.ensureAdminUser();

      // Load Orders
      const { data: orderData } = await supabase.from('orders').select('*');
      if (orderData && orderData.length > 0) {
        this.cache.orders = orderData.map(mapRowToOrder);
      }

      // Load Explore Content
      const { data: exploreData } = await supabase.from('explore_content').select('*').eq('key', 'explore_main').maybeSingle();
      if (exploreData) {
        this.cache.exploreContent = {
          gallery: exploreData.gallery || initialDbState.exploreContent.gallery,
          reels: exploreData.reels || initialDbState.exploreContent.reels,
          brandStatement: exploreData.brand_statement || initialDbState.exploreContent.brandStatement
        };
      }

      // Load App Settings
      const { data: settingsRows } = await supabase.from('app_settings').select('*');
      if (settingsRows && settingsRows.length > 0) {
        for (const row of settingsRows) {
          if (row.key === 'settings') this.cache.settings = { ...this.cache.settings, ...(row.data || {}) };
          else if (row.key === 'homeContent') this.cache.homeContent = { ...this.cache.homeContent, ...(row.data || {}) };
          else if (row.key === 'aboutContent') this.cache.aboutContent = { ...this.cache.aboutContent, ...(row.data || {}) };
          else if (row.key === 'location') this.cache.location = { ...this.cache.location, ...(row.data || {}) };
          else if (row.key === 'navbar') this.cache.navbar = row.data || this.cache.navbar;
          else if (row.key === 'happenings') this.cache.happenings = row.data || [];
          else if (row.key === 'events') this.cache.events = row.data || [];
          else if (row.key === 'synergy') this.cache.synergy = row.data || [];
          else if (row.key === 'facilities') this.cache.facilities = row.data || [];
          else if (row.key === 'feedback') this.cache.feedback = row.data || [];
          else if (row.key === 'bills') this.cache.bills = row.data || [];
        }
      }
    } catch (err) {
      console.error('SupabaseDatabase init error:', err.message);
    }
  }

  getCollection(name) {
    return this.cache[name] || [];
  }

  find(collectionName, filter) {
    const list = this.getCollection(collectionName);
    if (!filter) return list;
    if (typeof filter === 'function') {
      return list.filter(filter);
    }
    if (typeof filter === 'object' && Object.keys(filter).length > 0) {
      return list.filter(item =>
        Object.entries(filter).every(([key, value]) => item[key] === value)
      );
    }
    return list;
  }

  findOne(collectionName, filter) {
    const list = this.getCollection(collectionName);
    if (!filter) return list[0] || null;
    if (typeof filter === 'function') {
      return list.find(filter);
    }
    if (typeof filter === 'object' && Object.keys(filter).length > 0) {
      return list.find(item =>
        Object.entries(filter).every(([key, value]) => item[key] === value)
      );
    }
    return list[0] || null;
  }

  findById(collectionName, id) {
    const list = this.getCollection(collectionName);
    return list.find(item => item._id === id || item.id === id);
  }

  insert(collectionName, item) {
    if (!this.cache[collectionName]) {
      this.cache[collectionName] = [];
    }
    const newItem = {
      _id: item._id || item.id || crypto.randomBytes(8).toString('hex'),
      id: item.id || item._id || crypto.randomBytes(8).toString('hex'),
      createdAt: new Date().toISOString(),
      ...item
    };
    this.cache[collectionName].push(newItem);

    // Sync to Supabase in background
    this.syncCollectionToSupabase(collectionName, newItem, 'insert');
    return newItem;
  }

  update(collectionName, id, updateData) {
    return this.updateById(collectionName, id, updateData);
  }

  updateById(collectionName, id, updateData) {
    const list = this.getCollection(collectionName);
    const index = list.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;

    this.cache[collectionName][index] = {
      ...list[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    const updated = this.cache[collectionName][index];

    // Sync to Supabase in background
    this.syncCollectionToSupabase(collectionName, updated, 'update');
    return updated;
  }

  deleteById(collectionName, id) {
    const list = this.getCollection(collectionName);
    const index = list.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return false;

    const removed = list[index];
    this.cache[collectionName].splice(index, 1);

    // Sync deletion to Supabase in background
    this.syncCollectionToSupabase(collectionName, removed, 'delete');
    return true;
  }

  async syncCollectionToSupabase(collectionName, item, action) {
    if (!supabase) return;
    try {
      if (collectionName === 'menu_items' || collectionName === 'foodItems') {
        const row = mapMenuItemToRow(item);
        if (action === 'delete') {
          await supabase.from('menu_items').delete().eq('id', item.id || item._id);
        } else if (action === 'insert') {
          await supabase.from('menu_items').upsert([row]);
        } else {
          await supabase.from('menu_items').update(row).eq('id', item.id || item._id);
        }
      } else if (collectionName === 'users') {
        const row = mapUserToRow(item);
        if (action === 'delete') {
          await supabase.from('users').delete().eq('id', item.id || item._id);
        } else if (action === 'insert') {
          await supabase.from('users').upsert([row]);
        } else {
          await supabase.from('users').update(row).eq('id', item.id || item._id);
        }
      } else if (collectionName === 'orders') {
        const row = mapOrderToRow(item);
        if (action === 'delete') {
          await supabase.from('orders').delete().eq('id', item.id || item._id);
        } else if (action === 'insert') {
          await supabase.from('orders').upsert([row]);
        } else {
          await supabase.from('orders').update(row).eq('id', item.id || item._id);
        }
      } else {
        // App Settings JSON array sync for happenings, events, synergy, facilities, feedback, bills, etc.
        const currentData = this.cache[collectionName] || [];
        await supabase.from('app_settings').upsert([{ key: collectionName, data: currentData }]);
      }
    } catch (err) {
      console.error(`Supabase sync error for ${collectionName}:`, err.message);
    }
  }

  getOrderingSlot(targetDateStr) {
    const todayStr = targetDateStr || getISTDateString();
    
    const defaults = {
      orderingStartTime: "09:30",
      orderingEndTime: "10:30",
      pickupStartTime: "12:00",
      pickupEndTime: "13:00",
      ...(this.cache.settings?.orderingSlot?.defaults || {})
    };

    const dailyOverrides = this.cache.settings?.orderingSlot?.dailyOverrides || {};
    const todayOverride = dailyOverrides[todayStr] || null;

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

      orderingStartTime: activeSlot.orderingStartTime,
      orderingEndTime: activeSlot.orderingEndTime,
      pickupStartTime: activeSlot.pickupStartTime,
      pickupEndTime: activeSlot.pickupEndTime
    };
  }

  updateOrderingSlot(payload = {}) {
    if (!this.cache.settings) this.cache.settings = {};
    if (!this.cache.settings.orderingSlot) {
      this.cache.settings.orderingSlot = {
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
      if (!this.cache.settings.orderingSlot.defaults) {
        this.cache.settings.orderingSlot.defaults = {};
      }
      if (orderingStartTime) this.cache.settings.orderingSlot.defaults.orderingStartTime = orderingStartTime;
      if (orderingEndTime) this.cache.settings.orderingSlot.defaults.orderingEndTime = orderingEndTime;
      if (pickupStartTime) this.cache.settings.orderingSlot.defaults.pickupStartTime = pickupStartTime;
      if (pickupEndTime) this.cache.settings.orderingSlot.defaults.pickupEndTime = pickupEndTime;
    } else {
      if (!this.cache.settings.orderingSlot.dailyOverrides) {
        this.cache.settings.orderingSlot.dailyOverrides = {};
      }
      const existingToday = this.cache.settings.orderingSlot.dailyOverrides[todayStr] || {};
      const currentFull = this.getOrderingSlot(todayStr);
      const currentActive = currentFull.activeSlot;

      this.cache.settings.orderingSlot.dailyOverrides[todayStr] = {
        orderingStartTime: orderingStartTime || existingToday.orderingStartTime || currentActive.orderingStartTime,
        orderingEndTime: orderingEndTime || existingToday.orderingEndTime || currentActive.orderingEndTime,
        pickupStartTime: pickupStartTime || existingToday.pickupStartTime || currentActive.pickupStartTime,
        pickupEndTime: pickupEndTime || existingToday.pickupEndTime || currentActive.pickupEndTime
      };
    }

    this.saveSettingsToSupabase();
    return this.getOrderingSlot(todayStr);
  }

  resetOrderingSlot(targetDateStr) {
    const todayStr = targetDateStr || getISTDateString();
    if (this.cache.settings?.orderingSlot?.dailyOverrides) {
      delete this.cache.settings.orderingSlot.dailyOverrides[todayStr];
      this.saveSettingsToSupabase();
    }
    return this.getOrderingSlot(todayStr);
  }

  getSettings() {
    return {
      ...initialDbState.settings,
      ...(this.cache.settings || {}),
      orderingSlot: this.getOrderingSlot()
    };
  }

  updateSettings(newSettings) {
    this.cache.settings = { ...this.cache.settings, ...newSettings };
    if (newSettings.orderingSlot) {
      this.cache.settings.orderingSlot = { ...this.getOrderingSlot(), ...newSettings.orderingSlot };
    }
    this.saveSettingsToSupabase();
    return this.getSettings();
  }

  async saveSettingsToSupabase() {
    if (!supabase) return;
    try {
      await supabase.from('app_settings').upsert([{ key: 'settings', data: this.cache.settings }]);
    } catch (e) {}
  }

  getLocation() {
    return this.cache.location || initialDbState.location;
  }

  async updateLocation(newLocation) {
    this.cache.location = { ...this.cache.location, ...newLocation };
    if (supabase) {
      try {
        await supabase.from('app_settings').upsert([{ key: 'location', data: this.cache.location }]);
      } catch (e) {}
    }
    return this.cache.location;
  }

  getHomeContent() {
    return {
      ...initialDbState.homeContent,
      ...(this.cache.homeContent || {}),
      hero: { ...initialDbState.homeContent.hero, ...(this.cache.homeContent?.hero || {}) },
      campusExperience: { ...initialDbState.homeContent.campusExperience, ...(this.cache.homeContent?.campusExperience || {}) },
      synergy: { ...initialDbState.homeContent.synergy, ...(this.cache.homeContent?.synergy || {}) },
      sectionVisibility: {
        hero: true,
        diningDelivery: true,
        signatureDishes: true,
        campusExperience: true,
        synergy: true,
        ...(this.cache.homeContent?.sectionVisibility || {})
      }
    };
  }

  async updateHomeContent(newContent = {}) {
    const current = this.getHomeContent();
    this.cache.homeContent = {
      ...current,
      ...newContent,
      hero: { ...current.hero, ...(newContent.hero || {}) },
      campusExperience: { ...current.campusExperience, ...(newContent.campusExperience || {}) },
      synergy: { ...current.synergy, ...(newContent.synergy || {}) },
      sectionVisibility: { ...current.sectionVisibility, ...(newContent.sectionVisibility || {}) }
    };
    if (supabase) {
      try {
        await supabase.from('app_settings').upsert([{ key: 'homeContent', data: this.cache.homeContent }]);
      } catch (e) {}
    }
    return this.getHomeContent();
  }

  getNavbar() {
    return this.cache.navbar || initialDbState.navbar;
  }

  async updateNavbar(navItems) {
    this.cache.navbar = navItems;
    if (supabase) {
      try {
        await supabase.from('app_settings').upsert([{ key: 'navbar', data: this.cache.navbar }]);
      } catch (e) {}
    }
    return this.cache.navbar;
  }

  getAboutContent() {
    return {
      ...initialDbState.aboutContent,
      ...(this.cache.aboutContent || {})
    };
  }

  async updateAboutContent(newContent) {
    this.cache.aboutContent = { ...this.getAboutContent(), ...newContent };
    if (supabase) {
      try {
        await supabase.from('app_settings').upsert([{ key: 'aboutContent', data: this.cache.aboutContent }]);
      } catch (e) {}
    }
    return this.getAboutContent();
  }

  getExploreContent() {
    const current = this.cache.exploreContent || {};
    const init = initialDbState.exploreContent;
    return {
      gallery: {
        ...init.gallery,
        ...(current.gallery || {}),
        items: (current.gallery && Array.isArray(current.gallery.items) && current.gallery.items.length > 0)
          ? current.gallery.items
          : init.gallery.items
      },
      reels: {
        ...init.reels,
        ...(current.reels || {}),
        videos: (current.reels && Array.isArray(current.reels.videos) && current.reels.videos.length > 0)
          ? current.reels.videos
          : init.reels.videos
      },
      brandStatement: {
        ...init.brandStatement,
        ...(current.brandStatement || {})
      }
    };
  }

  async updateExploreContent(newContent) {
    if (!newContent) return this.getExploreContent();
    const prev = this.getExploreContent();
    
    const updated = {
      gallery: {
        ...prev.gallery,
        ...(newContent.gallery || {}),
        items: Array.isArray(newContent.gallery?.items) ? newContent.gallery.items : prev.gallery.items
      },
      reels: {
        ...prev.reels,
        ...(newContent.reels || {}),
        videos: Array.isArray(newContent.reels?.videos) ? newContent.reels.videos : prev.reels.videos
      },
      brandStatement: {
        ...prev.brandStatement,
        ...(newContent.brandStatement || {})
      }
    };

    this.cache.exploreContent = updated;
    if (supabase) {
      try {
        await supabase.from('explore_content').upsert([{
          key: 'explore_main',
          gallery: updated.gallery,
          reels: updated.reels,
          brand_statement: updated.brandStatement
        }]);
      } catch (e) {}
    }

    return this.getExploreContent();
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

  let status = 'BEFORE';
  if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
    status = 'OPEN';
  } else if (currentMinutes >= endMinutes) {
    status = 'CLOSED';
  } else {
    status = 'BEFORE';
  }

  // In development / testing mode, keep ordering OPEN so developers/students can test ordering & bill generation anytime
  if (process.env.NODE_ENV === 'development' || process.env.ENABLE_DEV_ORDERING === 'true') {
    status = 'OPEN';
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
  } else if (status === 'BEFORE') {
    message = `Ordering opens today at ${orderingStartFormatted}.`;
  } else {
    message = `Today's ordering window is closed. Today's window was ${orderingStartFormatted} – ${orderingEndFormatted}.`;
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
    hasTodayOverride: Boolean(fullConfig?.hasTodayOverride),
    isCustom: Boolean(fullConfig?.hasTodayOverride),
    slotType: Boolean(fullConfig?.hasTodayOverride) ? 'CUSTOM' : 'DEFAULT'
  };
}

const db = new SupabaseDatabase();
db.checkOrderingSlotStatus = checkOrderingSlotStatus;
db.getISTDate = getISTDate;
db.getISTDateString = getISTDateString;
module.exports = db;
