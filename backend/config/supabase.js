const dotenv = require('dotenv');
dotenv.config();

function isSupabaseConfigured() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key);
}

let supabase = null;
if (isSupabaseConfigured()) {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const url = process.env.SUPABASE_URL;
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
    price: Number(row.price || 0),
    description: row.description || '',
    image: row.image || '',
    isAvailable: row.is_available !== undefined ? row.is_available : (row.isAvailable !== undefined ? row.isAvailable : true),
    preparationTime: row.preparation_time || row.preparationTime || '10-15 mins',
    tags: Array.isArray(row.tags) ? row.tags : (row.tags ? String(row.tags).split(',') : []),
    badge: row.badge || '',
    rating: Number(row.rating || 4.5),
    reviewsCount: Number(row.reviews_count || row.reviewsCount || 0),
    spicyLevel: row.spicy_level || row.spicyLevel || 'Medium',
    dietary: row.dietary || 'Veg',
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
    price: item.price,
    description: item.description,
    image: item.image,
    is_available: item.isAvailable,
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
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    password: user.password,
    phone: user.phone,
    role: user.role,
    student_id: user.studentId,
    hostel_info: user.hostelInfo,
    avatar: user.avatar
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
    console.log('⚡ Supabase is configured. Checking connection...');
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
