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
        { id: 1, title: "MHP Central Plaza", category: "Quadrangle Dining & Atmosphere", sub: "The Heartbeat Near N Block", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80" },
        { id: 2, title: "Chef's Special Counters", category: "Signature Prep", sub: "Fresh Daily", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80" },
        { id: 3, title: "Student Gatherings", category: "Campus Break", sub: "Afternoon Chai & Snack", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80" },
        { id: 4, title: "Authentic Campus Moments", category: "Editorial Portrait", sub: "VFSTR Life", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" },
        { id: 5, title: "Flavors & Good Vibes", category: "Refreshed Daily", sub: "Specialty Cuisine", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80" }
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
        console.log('✅ Admin user account verified (Phone: 7672022351)');
      } else {
        // Ensure role & phone are preserved without overwriting customized admin password
        const updates = {};
        if (existing.role !== 'admin') updates.role = 'admin';
        if (!existing.phone) updates.phone = adminPhone;
        if (!existing.password) {
          updates.password = await bcrypt.hash('mhp@zest143', 10);
        }
        if (Object.keys(updates).length > 0) {
          this.updateById('users', existing._id || existing.id, updates);
          console.log('✅ Synchronized admin user account attributes');
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

    const fetchWithTimeout = (promise, ms = 2500) => {
      return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase query timeout')), ms))
      ]);
    };

    try {
      const [menuRes, userRes, orderRes, exploreRes, settingsRes] = await Promise.allSettled([
        fetchWithTimeout(supabase.from('menu_items').select('*')),
        fetchWithTimeout(supabase.from('users').select('*')),
        fetchWithTimeout(supabase.from('orders').select('*')),
        fetchWithTimeout(supabase.from('explore_content').select('*').eq('key', 'explore_main').maybeSingle()),
        fetchWithTimeout(supabase.from('app_settings').select('*'))
      ]);

      if (menuRes.status === 'fulfilled' && menuRes.value?.data && menuRes.value.data.length > 0) {
        this.cache.foodItems = menuRes.value.data.map(mapRowToMenuItem);
      }

      if (userRes.status === 'fulfilled' && userRes.value?.data && userRes.value.data.length > 0) {
        this.cache.users = userRes.value.data.map(mapRowToUser);
      }
      await this.ensureAdminUser();

      if (orderRes.status === 'fulfilled' && orderRes.value?.data && orderRes.value.data.length > 0) {
        this.cache.orders = orderRes.value.data.map(mapRowToOrder);
      }

      if (exploreRes.status === 'fulfilled' && exploreRes.value?.data) {
        const exploreData = exploreRes.value.data;
        this.cache.exploreContent = {
          gallery: exploreData.gallery || initialDbState.exploreContent.gallery,
          reels: exploreData.reels || initialDbState.exploreContent.reels,
          brandStatement: exploreData.brand_statement || initialDbState.exploreContent.brandStatement
        };
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value?.data && settingsRes.value.data.length > 0) {
        for (const row of settingsRes.value.data) {
          if (row.key === 'settings') this.cache.settings = { ...this.cache.settings, ...(row.data || {}) };
          else if (row.key === 'homeContent') this.cache.homeContent = { ...this.cache.homeContent, ...(row.data || {}) };
          else if (row.key === 'aboutContent') this.cache.aboutContent = { ...this.cache.aboutContent, ...(row.data || {}) };
          else if (row.key === 'exploreContent') this.cache.exploreContent = { ...this.cache.exploreContent, ...(row.data || {}) };
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
    this.saveToLocalJson();
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
    this.saveToLocalJson();
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
    this.saveToLocalJson();
    return true;
  }

  async clearAllOrders() {
    this.cache.orders = [];
    this.cache.bills = [];
    this.saveToLocalJson();
    if (supabase) {
      try {
        await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('bills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('app_settings').upsert([{ key: 'bills', data: [] }]);
      } catch (err) {
        console.warn('Supabase clear orders warning:', err.message);
      }
    }
    return true;
  }

  async clearCustomerUsers() {
    const customers = (this.cache.users || []).filter(u => u && u.role !== 'admin');
    this.cache.users = (this.cache.users || []).filter(u => u && u.role === 'admin');
    await this.ensureAdminUser();
    this.saveToLocalJson();
    if (supabase) {
      try {
        await supabase.from('users').delete().neq('role', 'admin');
        for (const u of customers) {
          const targetId = u._id || u.id;
          if (targetId) {
            await supabase.from('users').delete().eq('id', targetId);
          }
        }
      } catch (err) {
        console.warn('Supabase clear customer users warning:', err.message);
      }
    }
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

      const newOverride = {
        orderingStartTime: orderingStartTime || existingToday.orderingStartTime || currentActive.orderingStartTime,
        orderingEndTime: orderingEndTime || existingToday.orderingEndTime || currentActive.orderingEndTime,
        pickupStartTime: pickupStartTime || existingToday.pickupStartTime || currentActive.pickupStartTime,
        pickupEndTime: pickupEndTime || existingToday.pickupEndTime || currentActive.pickupEndTime
      };

      this.cache.settings.orderingSlot.dailyOverrides[todayStr] = newOverride;
      this.cache.settings.orderingSlot.latestCustomSlot = newOverride;
    }

    this.saveSettingsToSupabase();
    this.saveToLocalJson();
    return this.getOrderingSlot(todayStr);
  }

  resetOrderingSlot(targetDateStr) {
    const todayStr = targetDateStr || getISTDateString();
    if (this.cache.settings?.orderingSlot) {
      if (this.cache.settings.orderingSlot.dailyOverrides) {
        delete this.cache.settings.orderingSlot.dailyOverrides[todayStr];
      }
      delete this.cache.settings.orderingSlot.latestCustomSlot;
      this.saveSettingsToSupabase();
      this.saveToLocalJson();
    }
    return this.getOrderingSlot(todayStr);
  }

  getAdminPhoneNumbers() {
    const list = this.cache.settings?.adminPhoneNumbers || ['7672022351'];
    if (!list.includes('7672022351')) {
      list.unshift('7672022351');
    }
    return Array.from(new Set(list));
  }

  addAdminPhoneNumber(newPhone) {
    if (!newPhone) return this.getAdminPhoneNumbers();
    const cleanDigits = String(newPhone).replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length < 10) return this.getAdminPhoneNumbers();
    
    if (!this.cache.settings) this.cache.settings = {};
    const current = this.getAdminPhoneNumbers();
    if (!current.includes(cleanDigits)) {
      current.push(cleanDigits);
    }
    this.cache.settings.adminPhoneNumbers = current;
    this.saveSettingsToSupabase();
    this.saveToLocalJson();
    return current;
  }

  getAdminEmails() {
    const list = this.cache.settings?.adminEmails || ['admin@mhp.vfstr.ac.in'];
    if (!list.includes('admin@mhp.vfstr.ac.in')) {
      list.unshift('admin@mhp.vfstr.ac.in');
    }
    return Array.from(new Set(list));
  }

  addAdminEmail(newEmail) {
    if (!newEmail) return this.getAdminEmails();
    const clean = String(newEmail).trim().toLowerCase();
    if (!clean || !clean.includes('@')) return this.getAdminEmails();

    if (!this.cache.settings) this.cache.settings = {};
    const current = this.getAdminEmails();
    if (!current.includes(clean)) {
      current.push(clean);
    }
    this.cache.settings.adminEmails = current;
    this.saveSettingsToSupabase();
    this.saveToLocalJson();
    return current;
  }

  removeAdminEmail(emailToRemove) {
    const clean = String(emailToRemove).trim().toLowerCase();
    if (!clean || clean === 'admin@mhp.vfstr.ac.in') {
      return this.getAdminEmails();
    }
    if (!this.cache.settings) this.cache.settings = {};
    const current = this.getAdminEmails().filter(e => e !== clean);
    this.cache.settings.adminEmails = current;
    this.saveSettingsToSupabase();
    this.saveToLocalJson();
    return current;
  }

  async changeAdminPassword(newPassword) {
    if (!newPassword || newPassword.length < 4) {
      throw new Error('Password must be at least 4 characters');
    }
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const admin = this.findOne('users', u => u.role === 'admin' || u.phone === '7672022351' || (u.email && u.email.toLowerCase() === 'admin@mhp.vfstr.ac.in'));
    if (admin) {
      this.updateById('users', admin._id || admin.id, { password: hashedPassword });
    }
    if (!this.cache.settings) this.cache.settings = {};
    this.cache.settings.adminCustomPassword = hashedPassword;
    this.saveSettingsToSupabase();
    this.saveToLocalJson();
    return true;
  }

  getSettings() {
    return {
      ...initialDbState.settings,
      ...(this.cache.settings || {}),
      adminPhoneNumbers: this.getAdminPhoneNumbers(),
      adminEmails: this.getAdminEmails(),
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

  getHomeContent() {
    return this.cache.homeContent || initialDbState.homeContent || {
      hero: {
        eyebrow: 'VFSTR VADLAMUDI CAMPUS',
        heading: 'WELCOME TO MHP',
        subheading: 'Mahotsav Food & Hospitality Court',
        description: 'Serving hot, authentic, hygienic food to students and faculty daily.'
      },
      sectionVisibility: {
        hero: true,
        signatureDishes: true,
        liveSlotStatus: true,
        todaysSpecial: true,
        orderingOptions: true,
        whatsHappening: true,
        galleryPreview: true,
        campusMap: true
      }
    };
  }

  updateHomeContent(newContent) {
    this.cache.homeContent = { ...this.getHomeContent(), ...newContent };
    this.saveSettingsToSupabase();
    this.saveToLocalJson();
    return this.getHomeContent();
  }

  getAboutContent() {
    return this.cache.aboutContent || initialDbState.aboutContent || {
      heading: 'About MHP Vadlamudi',
      description: 'The heartbeat of campus food & hospitality at VFSTR Vadlamudi.',
      sectionVisibility: {
        mission: true,
        history: true,
        team: true
      }
    };
  }

  updateAboutContent(newContent) {
    this.cache.aboutContent = { ...this.getAboutContent(), ...newContent };
    this.saveSettingsToSupabase();
    this.saveToLocalJson();
    return this.getAboutContent();
  }

  getExploreContent() {
    return this.cache.exploreContent || initialDbState.exploreContent || {
      gallery: {
        eyebrow: 'INSIDE MHP',
        heading: 'GALLERY',
        subtitle: 'A glimpse into the food, people and moments that make MHP special.',
        instagramHandle: '@mhp_vfstr',
        instagramSub: 'Official Campus Handle',
        items: [
          { id: 1, title: 'MHP Central Plaza', category: 'Quadrangle Dining & Atmosphere', sub: 'The Heartbeat Near N Block', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80' },
          { id: 2, title: "Chef's Special Counters", category: 'Signature Prep', sub: 'Fresh Daily', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80' },
          { id: 3, title: 'Student Gatherings', category: 'Campus Break', sub: 'Afternoon Chai & Snack', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80' },
          { id: 4, title: 'Authentic Campus Moments', category: 'Editorial Portrait', sub: 'VFSTR Life', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80' },
          { id: 5, title: 'Flavors & Good Vibes', category: 'Refreshed Daily', sub: 'Specialty Cuisine', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80' }
        ]
      },
      reels: {
        eyebrow: 'THE MOMENTS WE KEEP',
        heading: 'Events & Memories',
        subtitle: 'From celebrations and campus events to everyday moments, these are the memories that make MHP more than a place to eat.',
        videos: [
          { id: 1, title: 'Campus Evening Vibes', tag: 'DAILY MOMENTS', src: '/videos/mhp_hero_video.mp4', thumbnail: '', visible: true, order: 1 },
          { id: 2, title: 'Biryani & Conversations', tag: 'SIGNATURE DISHES', src: '/videos/WhatsApp%20Video%202026-08-27%20at%209.02.26%20PM.mp4', thumbnail: '', visible: true, order: 2 },
          { id: 3, title: 'Synergy Open Mic Night', tag: 'STUDENT STAGE', src: '/videos/mhp_hero_video.mp4', thumbnail: '', visible: true, order: 3 },
          { id: 4, title: 'Mahotsav Prep & Fest Stalls', tag: 'CAMPUS FESTIVAL', src: '/videos/WhatsApp%20Video%202026-08-27%20at%209.02.26%20PM.mp4', thumbnail: '', visible: true, order: 4 }
        ]
      },
      brandStatement: {
        heading: "EAT. MEET. REMEMBER. THAT'S MHP.",
        tagline: 'More than a place to eat. A part of campus life.'
      }
    };
  }

  updateExploreContent(newContent) {
    this.cache.exploreContent = { ...this.getExploreContent(), ...newContent };
    this.saveSettingsToSupabase();
    this.saveToLocalJson();
    return this.getExploreContent();
  }

  async saveSettingsToSupabase() {
    if (!supabase) return;
    try {
      await supabase.from('app_settings').upsert([
        { key: 'settings', data: this.cache.settings },
        { key: 'homeContent', data: this.cache.homeContent },
        { key: 'aboutContent', data: this.cache.aboutContent },
        { key: 'exploreContent', data: this.cache.exploreContent }
      ]);
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

  // Optional manual override for testing if explicitly configured
  if (process.env.ENABLE_FORCE_SLOT_OPEN === 'true') {
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
