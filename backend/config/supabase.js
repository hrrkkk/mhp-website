const dotenv = require('dotenv');
dotenv.config();

function cleanSupabaseUrl(rawUrl) {
  if (!rawUrl) return '';
  return rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

function isSupabaseConfigured() {
  const url = cleanSupabaseUrl(process.env.SUPABASE_URL);
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key);
}

function toUUID(str) {
  if (!str) return '00000000-0000-4000-a000-000000000001';
  if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str)) {
    return str;
  }
  const clean = String(str).replace(/[^a-fA-F0-9]/g, '').padEnd(32, '0').slice(0, 32);
  return `${clean.slice(0,8)}-${clean.slice(8,12)}-4${clean.slice(13,16)}-a${clean.slice(17,20)}-${clean.slice(20,32)}`;
}

let supabase = null;
if (isSupabaseConfigured()) {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const url = cleanSupabaseUrl(process.env.SUPABASE_URL);
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    supabase = createClient(url, key);
  } catch (err) {
    console.warn('Could not initialize Supabase client:', err.message);
  }
}

function mapRowToMenuItem(row) {
  if (!row) return null;
  return {
    _id: row.id || row._id,
    id: row.id || row._id,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory || row.sub_category || '',
    price: Number(row.price || 0),
    priceOptions: row.price_options || row.priceOptions || null,
    foodType: row.food_type || row.foodType || row.dietary || 'Veg',
    description: row.description || '',
    image: row.image || '',
    popular: row.popular !== undefined ? row.popular : false,
    isAvailable: row.is_available !== undefined ? row.is_available : (row.isAvailable !== undefined ? row.isAvailable : true),
    serviceType: row.service_type || row.serviceType || 'both',
    preparationTime: row.preparation_time || row.preparationTime || '10-15 mins',
    tags: Array.isArray(row.tags) ? row.tags : (row.tags ? String(row.tags).split(',') : []),
    badge: row.badge || '',
    rating: Number(row.rating || 4.5),
    reviewsCount: Number(row.reviews_count || row.reviewsCount || 0),
    spicyLevel: row.spicy_level || row.spicyLevel || 'Medium',
    dietary: row.dietary || row.food_type || row.foodType || 'Veg',
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt
  };
}

function mapMenuItemToRow(item) {
  if (!item) return null;
  return {
    id: item.id || item._id,
    name: item.name,
    category: item.category,
    subcategory: item.subcategory || '',
    price: item.price,
    price_options: item.priceOptions || null,
    food_type: item.foodType || item.dietary || 'Veg',
    description: item.description,
    image: item.image,
    popular: item.popular,
    is_available: item.isAvailable,
    service_type: item.serviceType || 'both',
    preparation_time: item.preparationTime,
    tags: item.tags,
    badge: item.badge,
    rating: item.rating,
    reviews_count: item.reviewsCount,
    spicy_level: item.spicyLevel,
    dietary: item.dietary
  };
}

function mapRowToUser(row) {
  if (!row) return null;
  return {
    _id: row.id || row._id,
    id: row.id || row._id,
    name: row.name,
    email: row.email,
    password: row.password,
    phone: row.phone || '',
    role: row.role || 'customer',
    studentId: row.student_id || row.studentId || '',
    hostelInfo: row.hostel_info || row.hostelInfo || '',
    avatar: row.avatar || '',
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt
  };
}

function mapUserToRow(user) {
  if (!user) return null;
  return {
    id: toUUID(user.id || user._id),
    name: user.name,
    email: (user.email && user.email.trim()) ? user.email.trim() : null,
    password: user.password,
    phone: user.phone || null,
    role: user.role,
    student_id: user.studentId || null,
    hostel_info: user.hostelInfo || null,
    avatar: user.avatar || ''
  };
}

function mapRowToOrder(row) {
  if (!row) return null;
  return {
    _id: row.id || row._id,
    id: row.id || row._id,
    orderId: row.order_id || row.orderId,
    user: row.user_data || row.user,
    items: row.items || [],
    totalAmount: Number(row.total_amount || row.totalAmount || 0),
    status: row.status || 'Pending',
    paymentStatus: row.payment_status || row.paymentStatus || 'Pending',
    paymentMethod: row.payment_method || row.paymentMethod || 'Cash',
    paymentId: row.payment_id || row.paymentId || '',
    notes: row.notes || '',
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt
  };
}

function mapOrderToRow(order) {
  if (!order) return null;
  return {
    id: order.id || order._id,
    order_id: order.orderId,
    user_data: order.user,
    items: order.items,
    total_amount: order.totalAmount,
    status: order.status,
    payment_status: order.paymentStatus,
    payment_method: order.paymentMethod,
    payment_id: order.paymentId,
    notes: order.notes
  };
}

function mapRowToDailySlot(row) {
  if (!row) return null;
  return {
    _id: row.id || row._id,
    id: row.id || row._id,
    date: row.date,
    slotNumber: row.slot_number || row.slotNumber,
    startTime: row.start_time || row.startTime,
    endTime: row.end_time || row.endTime,
    status: row.status || 'Open',
    maxOrders: row.max_orders || row.maxOrders || 50,
    currentOrdersCount: row.current_orders_count || row.currentOrdersCount || 0
  };
}

function mapDailySlotToRow(slot) {
  if (!slot) return null;
  return {
    id: slot.id || slot._id,
    date: slot.date,
    slot_number: slot.slotNumber,
    start_time: slot.startTime,
    end_time: slot.endTime,
    status: slot.status,
    max_orders: slot.maxOrders,
    current_orders_count: slot.currentOrdersCount
  };
}

async function seedAllTablesToSupabase() {
  if (!isSupabaseConfigured() || !supabase) return;
  try {
    console.log('⚡ Supabase is configured. Checking menu_items table...');
    const { data, error } = await supabase.from('menu_items').select('id').limit(1);
    if (!error && (!data || data.length === 0)) {
      console.log('🌱 Supabase menu_items is empty. Seeding menu items from local database...');
      const db = require('./db');
      const items = db.find('foodItems', {}) || [];
      if (items.length > 0) {
        const rows = items.map(mapMenuItemToRow).filter(Boolean);
        await supabase.from('menu_items').upsert(rows);
        console.log(`✅ Seeded ${rows.length} menu items into Supabase!`);
      }
    }
  } catch (err) {
    console.error('Supabase seed error:', err.message);
  }
}

module.exports = {
  supabase,
  isSupabaseConfigured,
  mapRowToMenuItem,
  mapMenuItemToRow,
  mapRowToUser,
  mapUserToRow,
  mapRowToOrder,
  mapOrderToRow,
  mapRowToDailySlot,
  mapDailySlotToRow,
  seedAllTablesToSupabase
};
