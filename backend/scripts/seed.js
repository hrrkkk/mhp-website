const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seed() {
  console.log('Running Idempotent Seed for MHP Food Menu & Campus Data...');

  // 1. Seed Admin & Customer Users
  const adminEmail = 'admin@mhp.vfstr.ac.in';
  let admin = db.findOne('users', { email: adminEmail });
  if (!admin) {
    const hashedAdminPassword = await bcrypt.hash('AdminPassword123!', 10);
    admin = db.insert('users', {
      name: 'MHP Administrator',
      email: adminEmail,
      password: hashedAdminPassword,
      phone: '9876543210',
      role: 'admin',
      studentId: 'STAFF-MHP-01',
      hostelInfo: 'MHP Office, Near N Block',
      avatar: ''
    });
    console.log('✔ Admin account created: admin@mhp.vfstr.ac.in / AdminPassword123!');
  }

  const customerEmail = 'student@vignan.ac.in';
  let student = db.findOne('users', { email: customerEmail });
  if (!student) {
    const hashedStudentPassword = await bcrypt.hash('StudentPassword123!', 10);
    student = db.insert('users', {
      name: 'Student Demo',
      email: customerEmail,
      password: hashedStudentPassword,
      phone: '9123456789',
      role: 'customer',
      studentId: '211FA04001',
      hostelInfo: 'Near N Block Quadrangle',
      avatar: ''
    });
    console.log('✔ Demo student account created: student@vignan.ac.in / StudentPassword123!');
  }

  // 2. Seed Vignan's Mahotsav Hero Event & Campus Events
  db.insert('events', {
    title: "Vignan's Mahotsav",
    subtitle: "National Level Youth Festival",
    shortDescription: "The premier national-level youth festival at VFSTR celebrating student talent across culture, technical competitions, sports, literary arts, and fine arts.",
    description: "Vignan's Mahotsav is one of the major student festivals at VFSTR, bringing together students for cultural, technical, literary, fine arts, sports and other competitions. The festival celebrates culture, technical talent, sports, fine arts, literary activities, student creativity, teamwork, and active participation across universities.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    secondaryImages: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80"
    ],
    date: "2026-09-18 to 2026-09-20",
    time: "All-Day Festival Grounds",
    location: "VFSTR Campus Grounds & MHP Central Plaza",
    status: "upcoming",
    featured: true,
    published: true,
    highlights: [
      "Cultural Stage Competitions",
      "Technical Hackathons & Innovations",
      "Sports & Athletics Tournaments",
      "Fine Arts & Literary Debates",
      "Pro Nights & Celebrity Guest Performances"
    ]
  });

  db.insert('events', {
    title: "Synergy Monthly Open Mic Night",
    subtitle: "MHP Student Talent Showcase",
    shortDescription: "Monthly stage for VFSTR students to present singing, music, comedy, and poetry at MHP stage.",
    description: "Synergy is a monthly MHP student talent showcase where students get a small stage to present their talents, creativity, and passion. One Stage. Infinite Possibilities.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80",
    date: "2026-08-28",
    time: "05:00 PM - 07:30 PM",
    location: "MHP Stage, Near N Block",
    status: "upcoming",
    featured: false,
    published: true,
    highlights: [
      "Acoustic Performances",
      "Stand-Up Comedy",
      "Poetry & Spoken Word",
      "Solo & Group Dance"
    ]
  });

  // 3. Seed Synergy Showcase
  db.insert('synergy', {
    title: "Synergy Student Talent Stage",
    tagline: "One Stage. Infinite Possibilities.",
    description: "Synergy is a monthly MHP student talent showcase where students get a small stage to present their talents, creativity and passion. MHP gives students more than a place to eat and hang out — it gives them a place to be seen.",
    talentTypes: [
      "Singing",
      "Dancing",
      "Instrumental Performances",
      "Poetry & Spoken Word",
      "Art & Live Sketching",
      "Stand-Up Comedy",
      "Public Speaking"
    ],
    date: "Monthly Program",
    time: "Every Last Friday of the Month",
    status: "published",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80"
  });

  // 4. Seed What's Happening Posts
  db.insert('happenings', {
    title: "Synergy Monthly Showcase Registration Open",
    description: "Got a passion for singing, dance, stand-up comedy, or poetry? Register for the upcoming Synergy edition at MHP stage near N Block!",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
    category: "MHP Activity",
    date: new Date().toISOString().split('T')[0],
    time: "04:00 PM",
    status: "published",
    featured: true
  });

  db.insert('happenings', {
    title: "Vignan's Mahotsav Preparation & Festival Stalls at MHP",
    description: "MHP plaza near N Block is gearing up for Vignan's Mahotsav! Special student registration stalls and activity booths are active now.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
    category: "Fest Activity",
    date: new Date().toISOString().split('T')[0],
    time: "11:00 AM",
    status: "published",
    featured: true
  });

  // 5. Seed Facilities Cards
  db.insert('facilities', {
    title: "On-Campus Dining Area",
    description: "Shaded indoor and outdoor seating providing quick meals, beverages, and refreshments for students and faculty.",
    icon: "Utensils",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    status: "active",
    order: 1
  });

  db.insert('facilities', {
    title: "Student Hangout & Social Spaces",
    description: "Spacious quadrangle seating positioned near N Block for peer project discussions, leisure, and community bonding.",
    icon: "Users",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    status: "active",
    order: 2
  });

  // =========================================================================
  // 6. SEED COMPLETE MHP FOOD MENU (ALL 14 CATEGORIES)
  // =========================================================================

  const menuCategories = [
    { id: 'Breakfast', name: 'Breakfast', icon: 'Sun' },
    { id: 'Starters', name: 'Starters', icon: 'Flame' },
    { id: 'Sea Food', name: 'Sea Food', icon: 'Fish' },
    { id: 'Fast Food', name: 'Fast Food', icon: 'Zap' },
    { id: 'Biryani', name: 'Biryani\'s', icon: 'Utensils' },
    { id: 'Pulao', name: 'Pulaos', icon: 'Soup' },
    { id: 'Rice Bowls', name: 'Rice Bowls', icon: 'Bowl' },
    { id: 'Curries', name: 'Curries', icon: 'Flame' },
    { id: 'Breads', name: 'Breads', icon: 'Disc' },
    { id: 'Mocktails', name: 'Mocktails', icon: 'Wine' },
    { id: 'Juices', name: 'Juices', icon: 'CupSoda' },
    { id: 'Shakes', name: 'Shakes', icon: 'Coffee' },
    { id: 'Burgers', name: 'Burgers', icon: 'Sandwich' },
    { id: 'Pizza', name: 'Pizza', icon: 'Pizza' },
    { id: 'Sandwiches & Wraps', name: 'Sandwiches & Wraps', icon: 'Wrap' }
  ];

  menuCategories.forEach(c => db.insert('categories', c));

  const allFoodItems = [
    // ---------------- BREAKFAST (34 EXACT ITEMS) ----------------
    { name: 'Plain Dosa', category: 'Breakfast', price: 40, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80&dish=plain-dosa', description: 'Crispy golden crepe served with chutney and sambar.' },
    { name: 'Karam Dosa', category: 'Breakfast', price: 40, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80&dish=karam-dosa', description: 'Crispy dosa smeared with spicy red chilli garlic paste.' },
    { name: 'Onion Dosa', category: 'Breakfast', price: 50, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80&dish=onion-dosa', description: 'Dosa topped with finely chopped onions and green chillies.' },
    { name: 'Upma Dosa', category: 'Breakfast', price: 50, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80&dish=upma-dosa', description: 'Dosa stuffed with savory rava upma.' },
    { name: 'Ghee Karam Dosa', category: 'Breakfast', price: 50, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80&dish=ghee-karam-dosa', description: 'Crispy dosa roasted in pure ghee & spicy karam podi.', popular: true },
    { name: 'Masala Dosa', category: 'Breakfast', price: 50, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80&dish=masala-dosa-crispy', description: 'Dosa stuffed with traditional spiced potato masala.', popular: true },
    { name: 'Cheese Masala Dosa', category: 'Breakfast', price: 60, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80&dish=cheese-masala-dosa', description: 'Masala dosa loaded with melted cheese.' },
    { name: 'Butter Dosa', category: 'Breakfast', price: 50, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80&dish=butter-dosa-golden', description: 'Crispy crepe prepared with generous butter.' },
    { name: 'Panner Dosa', category: 'Breakfast', price: 80, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80&dish=panner-dosa-special', description: 'Grated panner and spices filled in crispy dosa.' },
    { name: 'Egg Dosa', category: 'Breakfast', price: 50, foodType: 'Non-Veg', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80&dish=egg-dosa-single', description: 'Crispy dosa topped with seasoned beaten egg.' },
    { name: 'Double Egg Dosa', category: 'Breakfast', price: 60, foodType: 'Non-Veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80&dish=double-egg-dosa', description: 'Rich dosa layered with two eggs and spices.', popular: true },
    { name: 'Carrot Dosa', category: 'Breakfast', price: 50, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80&dish=carrot-dosa-fresh', description: 'Healthy dosa topped with grated carrots.' },
    { name: 'Carrot Masala Dosa', category: 'Breakfast', price: 60, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80&dish=carrot-masala-dosa', description: 'Carrot and potato masala filling crepe.' },
    { name: 'Pessarattu', category: 'Breakfast', price: 50, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80&dish=plain-pessarattu', description: 'Nutritious Andhra green gram crepe.' },
    { name: 'Onion Pessarattu', category: 'Breakfast', price: 60, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80&dish=onion-pessarattu', description: 'Green gram crepe with onions and green chillies.' },
    { name: 'Upma Pessarattu', category: 'Breakfast', price: 60, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80&dish=upma-pessarattu-mla', description: 'Classic Andhra Pessarattu filled with Upma.' },
    { name: 'Uthappam', category: 'Breakfast', price: 50, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80&dish=onion-tomato-uthappam', description: 'Thick soft pancake with vegetable toppings.' },
    { name: 'Idly', category: 'Breakfast', price: 30, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80&dish=steamed-idly-4pcs', description: 'Soft steamed rice cakes served with chutneys.' },
    { name: 'Ghee Karam Idly', category: 'Breakfast', price: 50, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80&dish=ghee-karam-idly-mini', description: 'Ghee and karam podi tossed idlies.', popular: true },
    { name: 'Sambar Idly', category: 'Breakfast', price: 40, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80&dish=sambar-soaked-idly', description: 'Idly soaked in piping hot sambar.' },
    { name: 'Vada', category: 'Breakfast', price: 30, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80&dish=medu-vada-crispy', description: 'Crispy urad dal donuts served with chutney.' },
    { name: '2 Idly | Vada', category: 'Breakfast', price: 40, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80&dish=combo-2idly-1vada-plate', description: 'Combination plate of 2 Idlies & 1 Vada.' },
    { name: 'Sambar Vada', category: 'Breakfast', price: 40, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80&dish=sambar-vada-dip', description: 'Vada soaked in aromatic sambar.' },
    { name: 'Mysore Bonda', category: 'Breakfast', price: 40, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80&dish=mysore-bonda-fluffy', description: 'Fluffy golden fried bondas.' },
    { name: 'Puri', category: 'Breakfast', price: 50, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80&dish=puffed-puri-kurma', description: 'Puffed wheat puri served with potato curry.' },
    { name: 'Chapati', category: 'Breakfast', price: 70, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80&dish=soft-wheat-chapati', description: 'Whole wheat chapatis served with curry.' },
    { name: 'Parrota', category: 'Breakfast', price: 70, foodType: 'Veg', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80&dish=malabar-flaky-parrota', description: 'Layered Malabar parrotas served with kurma.' },
    { name: 'Egg Parota', category: 'Breakfast', price: 80, foodType: 'Non-Veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80&dish=egg-parota-curry', description: 'Parrota served with egg curry.' },
    { name: 'Egg Chapati', category: 'Breakfast', price: 80, foodType: 'Non-Veg', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80&dish=egg-roll-chapati', description: 'Chapati filled with egg omelette.' },
    { name: 'Dosa with Chicken Curry', category: 'Breakfast', price: 99, foodType: 'Non-Veg', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80&dish=dosa-with-chicken-curry-combo', description: 'Hot dosa served with spicy Andhra chicken curry.', popular: true },
    { name: 'Puri with Chicken Curry', category: 'Breakfast', price: 99, foodType: 'Non-Veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80&dish=puri-with-chicken-curry-combo', description: 'Fluffy puris served with chicken curry.' },
    { name: 'Chapati with Chicken Curry', category: 'Breakfast', price: 119, foodType: 'Non-Veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80&dish=chapati-with-chicken-curry-combo', description: 'Chapatis served with chicken curry.' },
    { name: 'Parota With Chicken Curry', category: 'Breakfast', price: 119, foodType: 'Non-Veg', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80&dish=parota-with-chicken-curry-combo', description: 'Layered parota with rich chicken curry.', popular: true },
    { name: 'Omelette', category: 'Breakfast', price: 50, foodType: 'Non-Veg', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80&dish=double-egg-omelette', description: 'Double egg omelette with onions and chillies.' },

    // ---------------- STARTERS (VEG, NON-VEG & SEAFOOD STARTERS) ----------------
    // Veg Starters (11 items)
    { name: 'Veg Manchurian', category: 'Starters', subcategory: 'Veg Starters', price: 90, foodType: 'veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80&dish=veg-manchurian', description: 'Crispy vegetable dumplings tossed in tangy soya chilli Manchurian sauce.', popular: true },
    { name: 'Gobi Manchurian', category: 'Starters', subcategory: 'Veg Starters', price: 100, foodType: 'veg', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80&dish=gobi-manchurian', description: 'Crispy fried cauliflower florets coated in Indo-Chinese Manchurian sauce.' },
    { name: 'Gobi 65', category: 'Starters', subcategory: 'Veg Starters', price: 110, foodType: 'veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80&dish=gobi-65', description: 'Deep-fried spicy marinated cauliflower florets with curry leaves and spices.' },
    { name: 'Chilli Panner', category: 'Starters', subcategory: 'Veg Starters', price: 159, foodType: 'veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80&dish=chilli-panner', description: 'Cottage cheese cubes wok-tossed with capsicum, onions, and green chillies.', popular: true },
    { name: 'Panner 65', category: 'Starters', subcategory: 'Veg Starters', price: 159, foodType: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80&dish=panner-65', description: 'Spicy South-Indian style marinated and crispy fried panner cubes.' },
    { name: 'Panner Majestic', category: 'Starters', subcategory: 'Veg Starters', price: 159, foodType: 'veg', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80&dish=panner-majestic', description: 'Succulent panner strips sauteed in yoghurt, green chillies, and garlic.' },
    { name: 'Dragon Panner', category: 'Starters', subcategory: 'Veg Starters', price: 169, foodType: 'veg', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80&dish=dragon-panner', description: 'Crispy panner strips tossed in a fiery sweet & spicy dragon sauce.' },
    { name: 'Chilli Mushroom', category: 'Starters', subcategory: 'Veg Starters', price: 159, foodType: 'veg', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80&dish=chilli-mushroom', description: 'Fresh button mushrooms tossed with green chillies, onions, and bell peppers.' },
    { name: 'Mushroom Salt and Pepper', category: 'Starters', subcategory: 'Veg Starters', price: 169, foodType: 'veg', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80&dish=mushroom-salt-pepper', description: 'Crispy battered button mushrooms seasoned with crushed black pepper and sea salt.' },
    { name: 'Chilli baby corn', category: 'Starters', subcategory: 'Veg Starters', price: 159, foodType: 'veg', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80&dish=chilli-baby-corn', description: 'Crispy fried baby corn tossed in garlic chilli sauce.' },
    { name: 'Baby Corn Manchurian', category: 'Starters', subcategory: 'Veg Starters', price: 159, foodType: 'veg', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80&dish=baby-corn-manchurian', description: 'Golden baby corn fritters tossed in classic Manchurian gravy.' },

    // Non-Veg Starters (13 items)
    { name: 'Egg Manchurian', category: 'Starters', subcategory: 'Non-Veg Starters', price: 99, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80&dish=egg-manchurian', description: 'Crispy fried boiled egg pieces tossed in savoury Manchurian sauce.' },
    { name: 'Chilli Egg', category: 'Starters', subcategory: 'Non-Veg Starters', price: 119, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?auto=format&fit=crop&w=600&q=80&dish=chilli-egg', description: 'Boiled egg slices fried and wok-tossed with capsicum and spicy chillies.' },
    { name: 'Egg 65', category: 'Starters', subcategory: 'Non-Veg Starters', price: 129, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=80&dish=egg-65', description: 'Spicy marinated boiled egg bites deep fried with Southern spices.' },
    { name: 'Chicken Manchurian', category: 'Starters', subcategory: 'Non-Veg Starters', price: 169, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80&dish=chicken-manchurian', description: 'Tender chicken cubes fried and coated in soya garlic Manchurian glaze.' },
    { name: 'Chicken 65', category: 'Starters', subcategory: 'Non-Veg Starters', price: 169, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80&dish=chicken-65', description: 'Popular spicy fried chicken starter seasoned with red chillies and curry leaves.', popular: true },
    { name: 'Chilli chicken', category: 'Starters', subcategory: 'Non-Veg Starters', price: 179, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80&dish=chilli-chicken', description: 'Classic spicy wok-tossed boneless chicken with green chillies and bell peppers.', popular: true },
    { name: 'Chicken majestic', category: 'Starters', subcategory: 'Non-Veg Starters', price: 189, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80&dish=chicken-majestic', description: 'Hyderabadi style dry chicken strips cooked in spiced yoghurt and curry leaves.' },
    { name: 'Chicken lollipop', category: 'Starters', subcategory: 'Non-Veg Starters', price: 219, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80&dish=chicken-lollipop', description: 'Frenchette chicken winglets marinated, crispy fried, and served with sauce.', popular: true },
    { name: 'Chicken Drumstick', category: 'Starters', subcategory: 'Non-Veg Starters', price: 219, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80&dish=chicken-drumstick', description: 'Juicy marinated fried chicken leg drumsticks with aromatic herbs.' },
    { name: 'Chicken 555', category: 'Starters', subcategory: 'Non-Veg Starters', price: 189, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80&dish=chicken-555', description: 'Crispy fried chicken strips tossed in a rich, tangy spiced creamy garlic sauce.' },
    { name: 'Dragon chicken', category: 'Starters', subcategory: 'Non-Veg Starters', price: 189, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&w=600&q=80&dish=dragon-chicken', description: 'Crispy chicken strips coated in spicy red chilli dragon sauce with cashews.' },
    { name: 'Chicken pakodi', category: 'Starters', subcategory: 'Non-Veg Starters', price: 159, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80&dish=chicken-pakodi', description: 'Andhra street style crispy bone-in chicken fritters with mint and spices.' },
    { name: 'Zest SPL Pachi Mirchi Kodi Vepudu', category: 'Starters', subcategory: 'Non-Veg Starters', price: 219, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=600&q=80&dish=pachi-mirchi-kodi-vepudu', description: 'MHP Special fiery green chilli roasted chicken fry.', popular: true },

    // Sea Food Starters (4 items)
    { name: 'Loose prawns(Dry)', category: 'Starters', subcategory: 'Sea Food Starters', price: 219, foodType: 'seafood', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80&dish=loose-prawns-dry', description: 'Crispy batter-fried prawns seasoned with pepper and curry leaves.', popular: true },
    { name: 'Chilli prawns(wet)', category: 'Starters', subcategory: 'Sea Food Starters', price: 219, foodType: 'seafood', image: 'https://images.unsplash.com/photo-1559737671-61a7a0b3864a?auto=format&fit=crop&w=600&q=80&dish=chilli-prawns-wet', description: 'Fresh juicy prawns tossed in rich Indo-Chinese chilli garlic gravy.' },
    { name: 'Fried fish(Dry)', category: 'Starters', subcategory: 'Sea Food Starters', price: 219, foodType: 'seafood', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80&dish=fried-fish-dry', description: 'Pan-fried marinated fish fillets with traditional coastal spices.' },
    { name: 'Apollo fish (wet)', category: 'Starters', subcategory: 'Sea Food Starters', price: 219, foodType: 'seafood', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80&dish=apollo-fish-wet', description: 'Boneless fish fillets tossed in spicy curd, garlic, and green chilli tempering.', popular: true },

    // ---------------- FAST FOOD (FRIED RICE & NOODLES) ----------------
    // Fried Rice (12 items)
    { name: 'Veg fried rice', category: 'Fast Food', subcategory: 'Fried Rice', price: 90, foodType: 'veg', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80&dish=veg-fried-rice', description: 'Classic wok-fried rice tossed with fresh chopped garden vegetables.', popular: true },
    { name: 'Veg schezwan fried rice', category: 'Fast Food', subcategory: 'Fried Rice', price: 100, foodType: 'veg', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80&dish=veg-schezwan-fried-rice', description: 'Spicy Schezwan sauce tossed wok fried vegetable rice.' },
    { name: 'Gobi fried rice', category: 'Fast Food', subcategory: 'Fried Rice', price: 110, foodType: 'veg', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80&dish=gobi-fried-rice', description: 'Fried rice loaded with crispy fried Gobi pieces.' },
    { name: 'Manchuria fried rice', category: 'Fast Food', subcategory: 'Fried Rice', price: 100, foodType: 'veg', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80&dish=manchuria-fried-rice', description: 'Combination of vegetable fried rice and veg Manchurian balls.' },
    { name: 'Mushroom fried rice', category: 'Fast Food', subcategory: 'Fried Rice', price: 120, foodType: 'veg', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80&dish=mushroom-fried-rice', description: 'Sautéed button mushrooms wok tossed with basmati rice.' },
    { name: 'Panner fried rice', category: 'Fast Food', subcategory: 'Fried Rice', price: 130, foodType: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80&dish=panner-fried-rice', description: 'Delicious fried rice topped with spiced panner cubes.', popular: true },
    { name: 'Kaju fried rice', category: 'Fast Food', subcategory: 'Fried Rice', price: 130, foodType: 'veg', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80&dish=kaju-fried-rice', description: 'Rich aromatic fried rice tossed with roasted cashew nuts.' },
    { name: 'Egg fried rice', category: 'Fast Food', subcategory: 'Fried Rice', price: 100, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80&dish=egg-fried-rice', description: 'Wok tossed rice with scrambled egg and spring onions.', popular: true },
    { name: 'Schezwan egg fried rice', category: 'Fast Food', subcategory: 'Fried Rice', price: 110, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?auto=format&fit=crop&w=600&q=80&dish=schezwan-egg-fried-rice', description: 'Fiery Schezwan style egg fried rice.' },
    { name: 'Chicken fried rice', category: 'Fast Food', subcategory: 'Fried Rice', price: 130, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80&dish=chicken-fried-rice', description: 'Wok fried rice with tender seasoned chicken pieces.', popular: true },
    { name: 'Schezwan chicken fried rice', category: 'Fast Food', subcategory: 'Fried Rice', price: 140, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80&dish=schezwan-chicken-fried-rice', description: 'Spicy Schezwan chicken fried rice with spring onions.' },
    { name: 'Prawns fried rice', category: 'Fast Food', subcategory: 'Fried Rice', price: 170, foodType: 'seafood', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80&dish=prawns-fried-rice', description: 'Seafood fried rice prepared with fresh spiced prawns.' },

    // Noodles (8 items)
    { name: 'Veg Noodles', category: 'Fast Food', subcategory: 'Noodles', price: 90, foodType: 'veg', image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80&dish=veg-noodles', description: 'Classic Indo-Chinese stir fried Hakka noodles with vegetables.', popular: true },
    { name: 'Schezwan Veg Noodles', category: 'Fast Food', subcategory: 'Noodles', price: 100, foodType: 'veg', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80&dish=schezwan-veg-noodles', description: 'Spicy Schezwan sauce tossed soft vegetable noodles.' },
    { name: 'Manchurian Noodles', category: 'Fast Food', subcategory: 'Noodles', price: 100, foodType: 'veg', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80&dish=manchurian-noodles', description: 'Soft noodles wok tossed with veg Manchurian balls.' },
    { name: 'Gobi Manchurian Noodles', category: 'Fast Food', subcategory: 'Noodles', price: 125, foodType: 'veg', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80&dish=gobi-manchurian-noodles', description: 'Delicious noodles served with crispy Gobi Manchurian.' },
    { name: 'Chilli Garlic Noodles', category: 'Fast Food', subcategory: 'Noodles', price: 115, foodType: 'veg', image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80&dish=chilli-garlic-noodles', description: 'Aromatic garlic and red chilli flavored soft noodles.' },
    { name: 'Egg Noodles', category: 'Fast Food', subcategory: 'Noodles', price: 110, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80&dish=egg-noodles', description: 'Stir fried noodles tossed with egg and crunchy vegetables.' },
    { name: 'Chicken Noodles', category: 'Fast Food', subcategory: 'Noodles', price: 130, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80&dish=chicken-noodles', description: 'Wok fried soft noodles tossed with tender chicken pieces.', popular: true },
    { name: 'Schezwan Chicken Noodles', category: 'Fast Food', subcategory: 'Noodles', price: 140, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=600&q=80&dish=schezwan-chicken-noodles', description: 'Fiery Schezwan style chicken noodles with green chillies.' },

    // ---------------- BIRYANI'S (15 ITEMS) ----------------
    // Veg Biryani (4 items)
    { name: 'Veg Dum Biryani', category: 'Biryani', subcategory: 'Veg', price: 149, foodType: 'veg', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80&dish=veg-dum-biryani', description: 'Aromatic dum cooked basmati rice with mixed vegetables and spices.', popular: true },
    { name: 'Panner Biryani', category: 'Biryani', subcategory: 'Veg', price: 220, foodType: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80&dish=panner-biryani', description: 'Hyderabadi style biryani layered with spiced panner cubes.' },
    { name: 'Mushroom Biryani', category: 'Biryani', subcategory: 'Veg', price: 220, foodType: 'veg', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80&dish=mushroom-biryani', description: 'Aromatic basmati rice cooked with juicy button mushrooms.' },
    { name: 'Kaju Biryani', category: 'Biryani', subcategory: 'Veg', price: 220, foodType: 'veg', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80&dish=kaju-biryani', description: 'Rich biryani rice garnished with golden fried cashew nuts.' },

    // Non-Veg Biryani (11 items)
    { name: 'Chicken Dum Biryani (Single)', category: 'Biryani', subcategory: 'Non-Veg', price: 139, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80&dish=chicken-dum-biryani-single', description: 'Single portion aromatic Hyderabadi chicken dum biryani.', popular: true },
    { name: 'Chicken Dum Biryani (Full)', category: 'Biryani', subcategory: 'Non-Veg', price: 179, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80&dish=chicken-dum-biryani-full', description: 'Full portion Hyderabadi chicken dum biryani with raita and gravy.', popular: true },
    { name: 'Chicken Rambo Biryani (2pcs)', category: 'Biryani', subcategory: 'Non-Veg', price: 259, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80&dish=chicken-rambo-biryani', description: 'Special biryani served with 2 juicy chicken drumsticks.' },
    { name: 'Chicken Wings Biryani (3pcs)', category: 'Biryani', subcategory: 'Non-Veg', price: 259, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80&dish=chicken-wings-biryani', description: 'Spiced biryani rice served with 3 fried chicken wings.' },
    { name: 'Chicken Fry Piece Biryani', category: 'Biryani', subcategory: 'Non-Veg', price: 229, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80&dish=chicken-fry-piece-biryani', description: 'Biryani rice topped with crispy Andhra fried chicken pieces.' },
    { name: 'Chicken Boneless Biryani', category: 'Biryani', subcategory: 'Non-Veg', price: 269, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80&dish=chicken-boneless-biryani', description: 'Flavorful biryani rice served with boneless chicken tikka.', popular: true },
    { name: 'Chicken Mughlai Biryani', category: 'Biryani', subcategory: 'Non-Veg', price: 269, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80&dish=chicken-mughlai-biryani', description: 'Rich Mughlai style chicken biryani with boiled egg.' },
    { name: 'Tandoori Chicken Biryani', category: 'Biryani', subcategory: 'Non-Veg', price: 299, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&w=600&q=80&dish=tandoori-chicken-biryani-299', description: 'Biryani served with smoky tandoori chicken leg (₹299 portion).' },
    { name: 'Tandoori Chicken Biryani', category: 'Biryani', subcategory: 'Non-Veg', price: 279, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=600&q=80&dish=tandoori-chicken-biryani-279', description: 'Biryani served with smoky tandoori chicken leg (₹279 portion).' },
    { name: 'Prawns Biryani', category: 'Biryani', subcategory: 'Non-Veg', price: 289, foodType: 'seafood', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80&dish=prawns-biryani', description: 'Fragrant basmati rice layered with spicy coastal prawns.' },
    { name: 'Fish Biryani', category: 'Biryani', subcategory: 'Non-Veg', price: 289, foodType: 'seafood', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80&dish=fish-biryani', description: 'Boneless fish fillets cooked with authentic biryani spices.' },

    // ---------------- PULAOS (7 ITEMS) ----------------
    { name: 'Veg Pulao', category: 'Pulao', price: 159, foodType: 'veg', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80&dish=veg-pulao', description: 'Mildly spiced aromatic vegetable pulao.' },
    { name: 'Panner Pulao', category: 'Pulao', price: 169, foodType: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80&dish=panner-pulao', description: 'Pulao rice cooked with soft panner cubes.' },
    { name: 'Kaju Pulao', category: 'Pulao', price: 169, foodType: 'veg', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80&dish=kaju-pulao', description: 'Rich ghee pulao topped with fried cashew nuts.' },
    { name: 'Chicken Pulao', category: 'Pulao', price: 179, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80&dish=chicken-pulao', description: 'Traditional South Indian style chicken pulao.', popular: true },
    { name: 'Fry Piece Chicken Pulao', category: 'Pulao', price: 179, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80&dish=fry-piece-chicken-pulao', description: 'Pulao rice served with spicy fried chicken pieces.' },
    { name: 'Prawns Pulao', category: 'Pulao', price: 229, foodType: 'seafood', image: 'https://images.unsplash.com/photo-1559737671-61a7a0b3864a?auto=format&fit=crop&w=600&q=80&dish=prawns-pulao', description: 'Seafood pulao cooked with fresh prawns.' },
    { name: 'ZEST SPL PACHI MIRCHI KODI PULAO', category: 'Pulao', price: 189, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=600&q=80&dish=zest-spl-pachi-mirchi-kodi-pulao', description: 'MHP signature spicy green chilli chicken pulao.', popular: true },

    // ---------------- RICE BOWLS (9 ITEMS) ----------------
    // Veg Rice Bowl (6 items)
    { name: 'Tomato Rice Bowl', category: 'Rice Bowls', subcategory: 'Veg Rice Bowl', price: 89, foodType: 'veg', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80&dish=tomato-rice-bowl', description: 'Tangy spiced tomato rice bowl.' },
    { name: 'Aloo 65 Rice Bowl', category: 'Rice Bowls', subcategory: 'Veg Rice Bowl', price: 99, foodType: 'veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80&dish=aloo-65-rice-bowl', description: 'Steamed rice served with crispy Aloo 65.' },
    { name: 'Panner Rice Bowl', category: 'Rice Bowls', subcategory: 'Veg Rice Bowl', price: 129, foodType: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80&dish=panner-rice-bowl', description: 'Rice bowl topped with Panner Manchurian.' },
    { name: 'Sambar Rice Bowl', category: 'Rice Bowls', subcategory: 'Veg Rice Bowl', price: 109, foodType: 'veg', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80&dish=sambar-rice-bowl', description: 'Homestyle South Indian sambar rice with ghee.' },
    { name: 'Curd Rice Bowl', category: 'Rice Bowls', subcategory: 'Veg Rice Bowl', price: 99, foodType: 'veg', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80&dish=curd-rice-bowl', description: 'Cooling curd rice tempered with mustard and curry leaves.' },
    { name: 'Veg Meals', category: 'Rice Bowls', subcategory: 'Veg Rice Bowl', price: 99, foodType: 'veg', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80&dish=veg-meals', description: 'Complete South Indian thali meal.', popular: true },

    // Non-Veg Rice Bowl (3 items)
    { name: 'Chicken Sambar Rice Bowl', category: 'Rice Bowls', subcategory: 'Non-Veg Rice Bowl', price: 129, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80&dish=chicken-sambar-rice-bowl', description: 'Sambar rice served with chicken fry.' },
    { name: 'Chilli Chicken Rice Bowl', category: 'Rice Bowls', subcategory: 'Non-Veg Rice Bowl', price: 149, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80&dish=chilli-chicken-rice-bowl', description: 'Fried rice bowl topped with chilli chicken gravy.', popular: true },
    { name: 'Chicken 65 Rice Bowl', category: 'Rice Bowls', subcategory: 'Non-Veg Rice Bowl', price: 149, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80&dish=chicken-65-rice-bowl', description: 'Flavored rice bowl served with spicy Chicken 65.' },

    // ---------------- VEG & NON-VEG CURRIES (18 ITEMS) ----------------
    // Veg Curries (8 items)
    { name: 'Mixed Veg Curry', category: 'Curries', subcategory: 'Veg Curries', price: 129, foodType: 'veg', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80&dish=mixed-veg-curry', description: 'Assorted garden vegetables in rich onion tomato gravy.' },
    { name: 'Paneer Butter Masala', category: 'Curries', subcategory: 'Veg Curries', price: 159, foodType: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80&dish=paneer-butter-masala', description: 'Fresh paneer cubes in rich buttery tomato cream sauce.', popular: true },
    { name: 'Paneer Kadai', category: 'Curries', subcategory: 'Veg Curries', price: 159, foodType: 'veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80&dish=paneer-kadai', description: 'Paneer and capsicum cooked in kadai spices.' },
    { name: 'Paneer Shahi Kurma', category: 'Curries', subcategory: 'Veg Curries', price: 169, foodType: 'veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80&dish=paneer-shahi-kurma', description: 'Rich cashew and cream gravy paneer.' },
    { name: 'Kaju Paneer Curry', category: 'Curries', subcategory: 'Veg Curries', price: 169, foodType: 'veg', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80&dish=kaju-paneer-curry', description: 'Roasted cashews and soft paneer in rich gravy.' },
    { name: 'Kaju Curry', category: 'Curries', subcategory: 'Veg Curries', price: 159, foodType: 'veg', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80&dish=kaju-curry', description: 'Whole cashews simmered in rich spicy gravy.' },
    { name: 'Paneer Tikka Masala', category: 'Curries', subcategory: 'Veg Curries', price: 159, foodType: 'veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80&dish=paneer-tikka-masala', description: 'Grilled paneer tikkas tossed in spiced tikka gravy.' },
    { name: 'Paneer Methi', category: 'Curries', subcategory: 'Veg Curries', price: 149, foodType: 'veg', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80&dish=paneer-methi', description: 'Paneer cooked with fresh fenugreek leaves and spices.' },

    // Non-Veg Curries (10 items)
    { name: 'Egg Burji', category: 'Curries', subcategory: 'Non-Veg Curries', price: 99, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80&dish=egg-burji', description: 'Scrambled eggs cooked with onions and chillies.' },
    { name: 'Boneless Chicken Curry', category: 'Curries', subcategory: 'Non-Veg Curries', price: 179, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80&dish=boneless-chicken-curry', description: 'Tender boneless chicken in Andhra spicy gravy.', popular: true },
    { name: 'Kaju Boneless Chicken Curry', category: 'Curries', subcategory: 'Non-Veg Curries', price: 199, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80&dish=kaju-boneless-chicken-curry', description: 'Rich cashew and boneless chicken gravy.' },
    { name: 'Butter Chicken Curry', category: 'Curries', subcategory: 'Non-Veg Curries', price: 199, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80&dish=butter-chicken-curry', description: 'Creamy tomato butter chicken curry.', popular: true },
    { name: 'Chicken Tikka Masala', category: 'Curries', subcategory: 'Non-Veg Curries', price: 119, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80&dish=chicken-tikka-masala', description: 'Smoky tandoori chicken pieces in rich gravy.' },
    { name: 'Chicken Shahi Kurma', category: 'Curries', subcategory: 'Non-Veg Curries', price: 179, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80&dish=chicken-shahi-kurma', description: 'Royal Mughlai cashew chicken gravy.' },
    { name: 'Mughalai Chicken Curry', category: 'Curries', subcategory: 'Non-Veg Curries', price: 199, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80&dish=mughalai-chicken-curry', description: 'Rich egg enriched Mughlai chicken curry.' },
    { name: 'Kadi Chicken Curry', category: 'Curries', subcategory: 'Non-Veg Curries', price: 189, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80&dish=kadi-chicken-curry', description: 'Kadai spices tossed chicken gravy.' },
    { name: 'Methi Chicken Curry', category: 'Curries', subcategory: 'Non-Veg Curries', price: 199, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=600&q=80&dish=methi-chicken-curry', description: 'Fenugreek flavored chicken curry.' },
    { name: 'Prawns Curry', category: 'Curries', subcategory: 'Non-Veg Curries', price: 249, foodType: 'seafood', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80&dish=prawns-curry', description: 'Spicy coastal Andhra prawns curry.' },

    // ---------------- BREADS (9 ITEMS) ----------------
    { name: 'Tandoori Roti', category: 'Breads', price: 29, foodType: 'veg', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80&dish=tandoori-roti', description: 'Clay oven baked whole wheat roti.' },
    { name: 'Garlic Naan', category: 'Breads', price: 45, foodType: 'veg', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80&dish=garlic-naan', description: 'Fluffy naan brushed with garlic butter.', popular: true },
    { name: 'Butter Naan', category: 'Breads', price: 39, foodType: 'veg', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80&dish=butter-naan', description: 'Refined flour naan topped with fresh butter.' },
    { name: 'Pulka', category: 'Breads', price: 29, foodType: 'veg', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80&dish=pulka', description: 'Soft puffed whole wheat phulka.' },
    { name: 'Aloo Parota', category: 'Breads', price: 59, foodType: 'veg', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80&dish=aloo-parota', description: 'Spiced potato stuffed paratha.' },
    { name: 'Paneer Parota', category: 'Breads', price: 69, foodType: 'veg', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80&dish=paneer-parota', description: 'Paneer stuffed paratha served with curd.' },
    { name: 'Meethi Parota', category: 'Breads', price: 59, foodType: 'veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80&dish=meethi-parota', description: 'Methi / sweet flavored paratha.' },
    { name: 'Masala Kulcha', category: 'Breads', price: 59, foodType: 'veg', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80&dish=masala-kulcha', description: 'Spiced vegetable kulcha bread.' },
    { name: 'Paneer Kulcha', category: 'Breads', price: 69, foodType: 'veg', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80&dish=paneer-kulcha', description: 'Stuffed paneer kulcha bread.' },

    // ---------------- MOCKTAILS (11 ITEMS - ALL ₹79) ----------------
    { name: 'Raspberry Lemonade', category: 'Mocktails', price: 79, foodType: 'veg', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80&dish=raspberry-lemonade', description: 'Refreshing raspberry flavored lemonade cooler.' },
    { name: 'Strawberry Lemonade', category: 'Mocktails', price: 79, foodType: 'veg', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80&dish=strawberry-lemonade', description: 'Sweet strawberry and mint lemonade.' },
    { name: 'Watermelon Lemonade', category: 'Mocktails', price: 79, foodType: 'veg', image: 'https://images.unsplash.com/photo-1587888637140-849b25d80ef9?auto=format&fit=crop&w=600&q=80&dish=watermelon-lemonade', description: 'Chilled watermelon lemon fizz.' },
    { name: 'Green Apple Lemonade', category: 'Mocktails', price: 79, foodType: 'veg', image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80&dish=green-apple-lemonade', description: 'Tangy green apple sparkling lemonade.' },
    { name: 'Bubblegum Lemonade', category: 'Mocktails', price: 79, foodType: 'veg', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80&dish=bubblegum-lemonade', description: 'Fun bubblegum syrup mocktail.' },
    { name: 'Lychee Lemonade', category: 'Mocktails', price: 79, foodType: 'veg', image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80&dish=lychee-lemonade', description: 'Sweet lychee fruit mocktail.' },
    { name: 'Red Wine', category: 'Mocktails', price: 79, foodType: 'veg', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80&dish=red-wine', description: 'Non-alcoholic red grape spiced mocktail.' },
    { name: 'Blue Curacao', category: 'Mocktails', price: 79, foodType: 'veg', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80&dish=blue-curacao', description: 'Tropical blue curacao citrus mocktail.', popular: true },
    { name: 'Virgin Mojito', category: 'Mocktails', price: 79, foodType: 'veg', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80&dish=virgin-mojito', description: 'Classic mint lime soda mocktail.', popular: true },
    { name: 'Virgin Strawberry Mojito', category: 'Mocktails', price: 79, foodType: 'veg', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80&dish=virgin-strawberry-mojito', description: 'Strawberry crushed mint mojito.' },
    { name: 'Vanilla Cream Lemonade', category: 'Mocktails', price: 79, foodType: 'veg', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80&dish=vanilla-cream-lemonade', description: 'Creamy vanilla blended lemonade.' },

    // ---------------- JUICES (15 ITEMS) ----------------
    { name: 'ABC Juice', category: 'Juices', price: 80, foodType: 'veg', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b7?auto=format&fit=crop&w=600&q=80&dish=abc-juice', description: 'Detox Apple, Beetroot & Carrot juice.', popular: true },
    { name: 'Apple Juice', category: 'Juices', price: 80, foodType: 'veg', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80&dish=apple-juice', description: 'Freshly extracted apple juice.' },
    { name: 'Beetroot', category: 'Juices', price: 60, foodType: 'veg', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80&dish=beetroot-juice', description: 'Healthy fresh beetroot juice.' },
    { name: 'Banana', category: 'Juices', price: 50, foodType: 'veg', image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80&dish=banana-juice', description: 'Fresh banana fruit juice.' },
    { name: 'Carrot', category: 'Juices', price: 60, foodType: 'veg', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80&dish=carrot-juice', description: 'Nutritious carrot juice.' },
    { name: 'Grape', category: 'Juices', price: 60, foodType: 'veg', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=600&q=80&dish=grape-juice', description: 'Chilled black grape juice.' },
    { name: 'Kharbuja', category: 'Juices', price: 50, foodType: 'veg', image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&q=80&dish=kharbuja-juice', description: 'Fresh muskmelon juice.' },
    { name: 'Papaya', category: 'Juices', price: 50, foodType: 'veg', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b7?auto=format&fit=crop&w=600&q=80&dish=papaya-juice', description: 'Fresh papaya juice.' },
    { name: 'Pineapple', category: 'Juices', price: 50, foodType: 'veg', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80&dish=pineapple-juice', description: 'Tangy fresh pineapple juice.' },
    { name: 'Pomegranate', category: 'Juices', price: 80, foodType: 'veg', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80&dish=pomegranate-juice', description: 'Antioxidant rich pomegranate juice.', popular: true },
    { name: 'Sapota', category: 'Juices', price: 50, foodType: 'veg', image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80&dish=sapota-juice', description: 'Chiku sapota fruit juice.' },
    { name: 'Watermelon', category: 'Juices', price: 50, foodType: 'veg', image: 'https://images.unsplash.com/photo-1587888637140-849b25d80ef9?auto=format&fit=crop&w=600&q=80&dish=watermelon-juice', description: 'Hydrating fresh watermelon juice.' },
    { name: 'Orange', category: 'Juices', price: 70, foodType: 'veg', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80&dish=orange-juice', description: 'Freshly squeezed orange juice.' },
    { name: 'Mosambi', category: 'Juices', price: 70, foodType: 'veg', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80&dish=mosambi-juice', description: 'Sweet lime juice.' },
    { name: 'Mango', category: 'Juices', price: 70, foodType: 'veg', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80&dish=mango-juice', description: 'Sweet seasonal mango juice.' },

    // ---------------- SHAKES (11 ITEMS - MILK SHAKE ₹120 | THICK SHAKE ₹180) ----------------
    {
      name: 'Belgium Chocolate',
      category: 'Shakes',
      price: 120,
      milkShakePrice: 120,
      thickShakePrice: 180,
      priceOptions: [
        { label: 'Milk-Shake', size: 'Milk-Shake', price: 120 },
        { label: 'Thick-Shake', size: 'Thick-Shake', price: 180 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80&dish=belgium-chocolate-shake',
      description: 'Rich Belgian dark chocolate shake.',
      popular: true
    },
    {
      name: 'Kit Kat',
      category: 'Shakes',
      price: 120,
      milkShakePrice: 120,
      thickShakePrice: 180,
      priceOptions: [
        { label: 'Milk-Shake', size: 'Milk-Shake', price: 120 },
        { label: 'Thick-Shake', size: 'Thick-Shake', price: 180 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80&dish=kit-kat-shake',
      description: 'Blended KitKat chocolate crunch shake.',
      popular: true
    },
    {
      name: 'Oreo',
      category: 'Shakes',
      price: 120,
      milkShakePrice: 120,
      thickShakePrice: 180,
      priceOptions: [
        { label: 'Milk-Shake', size: 'Milk-Shake', price: 120 },
        { label: 'Thick-Shake', size: 'Thick-Shake', price: 180 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80&dish=oreo-shake',
      description: 'Classic Oreo cookie blended shake.'
    },
    {
      name: 'Triple Choco Chip',
      category: 'Shakes',
      price: 120,
      milkShakePrice: 120,
      thickShakePrice: 180,
      priceOptions: [
        { label: 'Milk-Shake', size: 'Milk-Shake', price: 120 },
        { label: 'Thick-Shake', size: 'Thick-Shake', price: 180 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80&dish=triple-choco-chip-shake',
      description: 'Triple chocolate chips loaded shake.'
    },
    {
      name: 'Oreo Caramel',
      category: 'Shakes',
      price: 120,
      milkShakePrice: 120,
      thickShakePrice: 180,
      priceOptions: [
        { label: 'Milk-Shake', size: 'Milk-Shake', price: 120 },
        { label: 'Thick-Shake', size: 'Thick-Shake', price: 180 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80&dish=oreo-caramel-shake',
      description: 'Oreo cookies with golden caramel drizzle.'
    },
    {
      name: 'Cold Coffee',
      category: 'Shakes',
      price: 120,
      milkShakePrice: 120,
      thickShakePrice: 180,
      priceOptions: [
        { label: 'Milk-Shake', size: 'Milk-Shake', price: 120 },
        { label: 'Thick-Shake', size: 'Thick-Shake', price: 180 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80&dish=cold-coffee-shake',
      description: 'Creamy chilled espresso coffee shake.',
      popular: true
    },
    {
      name: 'Strawberry',
      category: 'Shakes',
      price: 120,
      milkShakePrice: 120,
      thickShakePrice: 180,
      priceOptions: [
        { label: 'Milk-Shake', size: 'Milk-Shake', price: 120 },
        { label: 'Thick-Shake', size: 'Thick-Shake', price: 180 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80&dish=strawberry-shake',
      description: 'Sweet strawberry icecream shake.'
    },
    {
      name: 'Butterscotch',
      category: 'Shakes',
      price: 120,
      milkShakePrice: 120,
      thickShakePrice: 180,
      priceOptions: [
        { label: 'Milk-Shake', size: 'Milk-Shake', price: 120 },
        { label: 'Thick-Shake', size: 'Thick-Shake', price: 180 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80&dish=butterscotch-shake',
      description: 'Butterscotch crunch icecream shake.'
    },
    {
      name: 'Munch Blast',
      category: 'Shakes',
      price: 120,
      milkShakePrice: 120,
      thickShakePrice: 180,
      priceOptions: [
        { label: 'Milk-Shake', size: 'Milk-Shake', price: 120 },
        { label: 'Thick-Shake', size: 'Thick-Shake', price: 180 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80&dish=munch-blast-shake',
      description: 'Blended Munch chocolate bar shake.'
    },
    {
      name: 'Ice Cream Snickers',
      category: 'Shakes',
      price: 120,
      milkShakePrice: 120,
      thickShakePrice: 180,
      priceOptions: [
        { label: 'Milk-Shake', size: 'Milk-Shake', price: 120 },
        { label: 'Thick-Shake', size: 'Thick-Shake', price: 180 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80&dish=ice-cream-snickers-shake',
      description: 'Peanut and caramel Snickers chocolate shake.'
    },
    {
      name: 'Naughty Nutella',
      category: 'Shakes',
      price: 120,
      milkShakePrice: 120,
      thickShakePrice: 180,
      priceOptions: [
        { label: 'Milk-Shake', size: 'Milk-Shake', price: 120 },
        { label: 'Thick-Shake', size: 'Thick-Shake', price: 180 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80&dish=naughty-nutella-shake',
      description: 'Rich hazelnut Nutella thick blend.',
      popular: true
    },

    // ---------------- BURGERS (6 ITEMS) ----------------
    // Veg Burgers (4 items)
    { name: 'Veg Burger', category: 'Burgers', subcategory: 'Veg Burgers', price: 80, foodType: 'veg', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80&dish=veg-burger', description: 'Crispy veggie patty burger with lettuce and mayo.' },
    { name: 'Veg Cheese Burger', category: 'Burgers', subcategory: 'Veg Burgers', price: 100, foodType: 'veg', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=80&dish=veg-cheese-burger', description: 'Crispy veggie patty loaded with melted cheese.' },
    { name: 'Paneer Burger', category: 'Burgers', subcategory: 'Veg Burgers', price: 100, foodType: 'veg', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80&dish=paneer-burger', description: 'Spiced paneer patty burger.' },
    { name: 'Paneer Cheese Burger', category: 'Burgers', subcategory: 'Veg Burgers', price: 119, foodType: 'veg', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80&dish=paneer-cheese-burger', description: 'Spicy paneer patty burger with melted cheese.' },

    // Non-Veg Burgers (2 items)
    { name: 'Chicken Burger', category: 'Burgers', subcategory: 'Non-Veg Burgers', price: 110, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80&dish=chicken-burger', description: 'Crispy chicken patty burger.', popular: true },
    { name: 'Chicken Cheese Burger', category: 'Burgers', subcategory: 'Non-Veg Burgers', price: 130, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80&dish=chicken-cheese-burger', description: 'Juicy chicken patty loaded with melted cheese.' },

    // ---------------- PIZZA (6 ITEMS WITH SMALL & LARGE OPTIONS) ----------------
    // Veg Pizza (3 items)
    {
      name: 'Veg Pizza',
      category: 'Pizza',
      subcategory: 'Veg Pizza',
      price: 149,
      priceOptions: [
        { label: 'Small', size: 'Small', price: 149 },
        { label: 'Large', size: 'Large', price: 189 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80&dish=veg-pizza',
      description: 'Classic mozzarella cheese and fresh garden vegetable pizza.'
    },
    {
      name: 'Paneer Pizza',
      category: 'Pizza',
      subcategory: 'Veg Pizza',
      price: 169,
      priceOptions: [
        { label: 'Small', size: 'Small', price: 169 },
        { label: 'Large', size: 'Large', price: 219 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80&dish=paneer-pizza',
      description: 'Spiced paneer cubes, capsicum and mozzarella pizza.',
      popular: true
    },
    {
      name: 'Veg Corn Pizza',
      category: 'Pizza',
      subcategory: 'Veg Pizza',
      price: 169,
      priceOptions: [
        { label: 'Small', size: 'Small', price: 169 },
        { label: 'Large', size: 'Large', price: 219 }
      ],
      foodType: 'veg',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80&dish=veg-corn-pizza',
      description: 'Sweet corn and golden mozzarella cheese pizza.'
    },

    // Non-Veg Pizza (3 items)
    {
      name: 'Chicken Cheese Pizza',
      category: 'Pizza',
      subcategory: 'Non-Veg Pizza',
      price: 209,
      priceOptions: [
        { label: 'Small', size: 'Small', price: 209 },
        { label: 'Large', size: 'Large', price: 279 }
      ],
      foodType: 'non-veg',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80&dish=chicken-cheese-pizza',
      description: 'Seasoned chicken tikka pieces with mozzarella cheese.',
      popular: true
    },
    {
      name: 'Chicken Double Cheese Pizza',
      category: 'Pizza',
      subcategory: 'Non-Veg Pizza',
      price: 229,
      priceOptions: [
        { label: 'Small', size: 'Small', price: 229 },
        { label: 'Large', size: 'Large', price: 299 }
      ],
      foodType: 'non-veg',
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80&dish=chicken-double-cheese-pizza',
      description: 'Double loaded mozzarella cheese chicken pizza.'
    },
    {
      name: 'Chicken Corn Pizza',
      category: 'Pizza',
      subcategory: 'Non-Veg Pizza',
      price: 229,
      priceOptions: [
        { label: 'Small', size: 'Small', price: 229 },
        { label: 'Large', size: 'Large', price: 299 }
      ],
      foodType: 'non-veg',
      image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80&dish=chicken-corn-pizza',
      description: 'Tender chicken pieces and sweet corn pizza.'
    },

    // ---------------- SANDWICHES / WRAPS (10 ITEMS) ----------------
    // Veg Sandwich / Wraps (6 items)
    { name: 'Veg Sandwich', category: 'Sandwiches & Wraps', subcategory: 'Veg Sandwich / Wraps', price: 80, foodType: 'veg', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80&dish=veg-sandwich', description: 'Fresh veggie grilled sandwich.' },
    { name: 'Veg Cheese Sandwich', category: 'Sandwiches & Wraps', subcategory: 'Veg Sandwich / Wraps', price: 100, foodType: 'veg', image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=600&q=80&dish=veg-cheese-sandwich', description: 'Grilled vegetable sandwich with melted cheese.' },
    { name: 'Paneer Sandwich', category: 'Sandwiches & Wraps', subcategory: 'Veg Sandwich / Wraps', price: 120, foodType: 'veg', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80&dish=paneer-sandwich', description: 'Spiced paneer grilled sandwich.', popular: true },
    { name: 'Paneer Cheese Sandwich', category: 'Sandwiches & Wraps', subcategory: 'Veg Sandwich / Wraps', price: 110, foodType: 'veg', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80&dish=paneer-cheese-sandwich', description: 'Paneer and melted cheese grilled sandwich.' },
    { name: 'Veg Wrap', category: 'Sandwiches & Wraps', subcategory: 'Veg Sandwich / Wraps', price: 99, foodType: 'veg', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80&dish=veg-wrap', description: 'Crispy veggie patty roll in tortilla wrap.' },
    { name: 'Paneer Wrap', category: 'Sandwiches & Wraps', subcategory: 'Veg Sandwich / Wraps', price: 119, foodType: 'veg', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80&dish=paneer-wrap', description: 'Grilled paneer strips wrap.' },

    // Non-Veg Sandwich / Wraps (4 items)
    { name: 'Chicken Sandwich', category: 'Sandwiches & Wraps', subcategory: 'Non-Veg Sandwich / Wraps', price: 129, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80&dish=chicken-sandwich', description: 'Shredded chicken grilled sandwich.', popular: true },
    { name: 'Chicken Cheese Sandwich', category: 'Sandwiches & Wraps', subcategory: 'Non-Veg Sandwich / Wraps', price: 139, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=600&q=80&dish=chicken-cheese-sandwich', description: 'Chicken and cheese grilled sandwich.' },
    { name: 'Chicken Wrap', category: 'Sandwiches & Wraps', subcategory: 'Non-Veg Sandwich / Wraps', price: 129, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80&dish=chicken-wrap', description: 'Crispy chicken wrap with mayo and veggies.', popular: true },
    { name: 'Egg Omelette', category: 'Sandwiches & Wraps', subcategory: 'Non-Veg Sandwich / Wraps', price: 99, foodType: 'non-veg', image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=600&q=80&dish=egg-omelette', description: 'Classic street style egg omelette.' }
  ];

  let newlyAddedCount = 0;
  allFoodItems.forEach(item => {
    const existing = db.findOne('foodItems', { name: item.name });
    if (!existing) {
      db.insert('foodItems', {
        ...item,
        isAvailable: true,
        popular: Boolean(item.popular)
      });
      newlyAddedCount++;
    }
  });

  console.log(`✔ Idempotent seed check completed. ${newlyAddedCount} new items inserted, existing records preserved.`);

  // 7. Update Location & Settings
  db.updateLocation({
    institution: "VFSTR (Vignan's Foundation for Science, Technology & Research)",
    address: "Vadlamudi, Guntur District, Andhra Pradesh - 522213",
    landmark: "Near N Block",
    operatingStatus: "Active Campus Hub",
    notes: "Easy walking distance from all academic departments, located near N Block."
  });

  db.updateSettings({
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
  });

  console.log('✅ MHP Database migration & seeding completed successfully.');
}

seed().catch(console.error);
