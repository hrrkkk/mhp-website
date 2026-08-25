import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  Image as ImageIcon,
  Loader2,
  Globe,
  ShoppingBag,
  PackageCheck,
  PackageX,
  Layers,
  Filter,
  Clock,
  Save
} from 'lucide-react';

import AdminSlotTimingControl from '../../components/admin/AdminSlotTimingControl';

const AdminFutureMenu = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All'); // 'All' | 'Available' | 'Unavailable'
  const [uploadingImage, setUploadingImage] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Breakfast',
    subcategory: '',
    price: '',
    priceOptionLabel1: '',
    priceOptionValue1: '',
    priceOptionLabel2: '',
    priceOptionValue2: '',
    foodType: 'Veg',
    description: '',
    image: '',
    popular: false,
    isAvailable: true,
    serviceType: 'both'
  });

  const categories = [
    'All',
    'Breakfast',
    'Starters',
    'Sea Food',
    'Fast Food',
    'Biryani',
    'Pulao',
    'Rice Bowls',
    'Curries',
    'Breads',
    'Mocktails',
    'Juices',
    'Shakes',
    'Burgers',
    'Pizza',
    'Sandwiches & Wraps'
  ];

  // Ordering Slot Settings state
  const [slotForm, setSlotForm] = useState({
    orderingStartTime: '09:30',
    orderingEndTime: '10:30',
    pickupStartTime: '12:00',
    pickupEndTime: '13:00'
  });
  const [slotStatus, setSlotStatus] = useState(null);
  const [savingSlot, setSavingSlot] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, ordersRes, slotRes] = await Promise.all([
        api.get('/future-menu/items'),
        api.get('/future-menu/admin/orders').catch(() => ({ data: [] })),
        api.get('/ordering-slot').catch(() => null)
      ]);
      setItems(itemsRes.data || []);
      setOrders(ordersRes.data || []);
      if (slotRes?.data) {
        setSlotStatus(slotRes.data);
        setSlotForm({
          orderingStartTime: slotRes.data.orderingStartTime || '09:30',
          orderingEndTime: slotRes.data.orderingEndTime || '10:30',
          pickupStartTime: slotRes.data.pickupStartTime || '12:00',
          pickupEndTime: slotRes.data.pickupEndTime || '13:00'
        });
      }
    } catch (err) {
      console.error('Error fetching admin menu data:', err);
      showToast('error', 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrderingSlot = async (e) => {
    e.preventDefault();
    try {
      setSavingSlot(true);
      const res = await api.put('/ordering-slot', slotForm);
      setSlotStatus(res.data);
      showToast('success', 'Ordering Slot Settings saved successfully!');
    } catch (err) {
      console.error('Error saving slot settings:', err);
      showToast('error', 'Failed to save Ordering Slot Settings');
    } finally {
      setSavingSlot(false);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64DataUrl = event.target.result;
      
      // 1. Set Base64 Data URL for instant preview & fallback
      setFormData(prev => ({ ...prev, image: base64DataUrl }));

      // 2. Upload file to backend /api/upload
      try {
        const uploadData = new FormData();
        uploadData.append('image', file);
        const res = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data && res.data.imageUrl) {
          setFormData(prev => ({ ...prev, image: res.data.imageUrl }));
          showToast('success', 'Image uploaded successfully!');
        }
      } catch (uploadErr) {
        console.warn('Backend file upload note:', uploadErr);
        showToast('info', 'Image ready for saving!');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      const hasOpts = item.priceOptions && item.priceOptions.length > 0;
      setFormData({
        name: item.name,
        category: item.category || 'Breakfast',
        subcategory: item.subcategory || '',
        price: item.price || '',
        priceOptionLabel1: hasOpts && item.priceOptions[0] ? item.priceOptions[0].label : '',
        priceOptionValue1: hasOpts && item.priceOptions[0] ? item.priceOptions[0].price : '',
        priceOptionLabel2: hasOpts && item.priceOptions[1] ? item.priceOptions[1].label : '',
        priceOptionValue2: hasOpts && item.priceOptions[1] ? item.priceOptions[1].price : '',
        foodType: item.foodType || 'Veg',
        description: item.description || '',
        image: item.image || '',
        popular: Boolean(item.popular),
        isAvailable: item.isAvailable !== false,
        serviceType: item.serviceType || 'both'
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        category: 'Breakfast',
        subcategory: '',
        price: '',
        priceOptionLabel1: '',
        priceOptionValue1: '',
        priceOptionLabel2: '',
        priceOptionValue2: '',
        foodType: 'Veg',
        description: '',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        popular: false,
        isAvailable: true,
        serviceType: 'dining' // Default Breakfast to Dining Only
      });
    }
    setModalOpen(true);
  };

  const handleToggleAvailability = async (item) => {
    try {
      const updatedStatus = !item.isAvailable;
      await api.put(`/future-menu/admin/items/${item._id}`, { isAvailable: updatedStatus });
      showToast('success', `${item.name} is now ${updatedStatus ? 'Available' : 'Out of Stock'}`);
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, isAvailable: updatedStatus } : i));
    } catch (err) {
      showToast('error', 'Failed to update availability');
    }
  };

  const handleServiceTypeChange = async (item, newServiceType) => {
    try {
      await api.put(`/future-menu/admin/items/${item._id}`, { serviceType: newServiceType });
      const labelMap = { both: 'Both (Dining & Delivery)', dining: 'Dining Only', delivery: 'Delivery Only' };
      showToast('success', `${item.name} availability updated to ${labelMap[newServiceType] || newServiceType}`);
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, serviceType: newServiceType } : i));
    } catch (err) {
      showToast('error', 'Failed to update service mode');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let priceOptions = null;
      if (formData.priceOptionLabel1 && formData.priceOptionValue1) {
        priceOptions = [
          { label: formData.priceOptionLabel1, price: Number(formData.priceOptionValue1) }
        ];
        if (formData.priceOptionLabel2 && formData.priceOptionValue2) {
          priceOptions.push({ label: formData.priceOptionLabel2, price: Number(formData.priceOptionValue2) });
        }
      }

      const payload = {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: Number(formData.price) || 0,
        priceOptions,
        foodType: formData.foodType,
        description: formData.description,
        image: formData.image,
        popular: formData.popular,
        isAvailable: formData.isAvailable,
        serviceType: formData.serviceType || 'both'
      };

      if (editingId) {
        await api.put(`/future-menu/admin/items/${editingId}`, payload);
        showToast('success', 'Menu item updated!');
      } else {
        await api.post('/future-menu/admin/items', payload);
        showToast('success', 'Menu item created!');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Save error:', err);
      showToast('error', 'Failed to save menu item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await api.delete(`/future-menu/admin/items/${id}`);
      showToast('success', 'Menu item deleted');
      fetchData();
    } catch (err) {
      showToast('error', 'Failed to delete');
    }
  };

  // Filter calculation
  const totalItemsCount = items.length;
  const availableCount = items.filter(i => i.isAvailable !== false).length;
  const unavailableCount = items.filter(i => i.isAvailable === false).length;
  const pendingOrdersCount = orders.filter(o => 
    o.status === 'PLACED' || o.status === 'CONFIRMED' || o.status === 'PREPARING'
  ).length;

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAvailability = availabilityFilter === 'All'
      || (availabilityFilter === 'Available' && item.isAvailable !== false)
      || (availabilityFilter === 'Unavailable' && item.isAvailable === false);

    return matchesCat && matchesSearch && matchesAvailability;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FFFFFF] p-6 rounded-xl border border-[#DDD7CD] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B9684D] uppercase tracking-wider mb-1">
            <UtensilsCrossed className="w-4 h-4" />
            Admin Operations
          </div>
          <h1 className="font-bold text-2xl text-[#202020]">Menu & Ordering</h1>
          <p className="text-xs text-[#77736D] mt-0.5">
            Manage MHP menu items, ordering slots, and customer orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/menu"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg bg-[#F5F1E8] hover:bg-[#DDD7CD] text-[#202020] text-xs font-semibold flex items-center gap-2 border border-[#DDD7CD] transition-all"
          >
            <Globe className="w-4 h-4 text-[#B9684D]" />
            <span>Customer Menu</span>
          </a>

          <button
            onClick={() => handleOpenModal(null)}
            className="btn-mhp-primary text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* STAGE — ADMIN SLOT TIMING CONTROL */}
      <AdminSlotTimingControl />

      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#DDD7CD] shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#F5F1E8] text-[#202020] flex items-center justify-center border border-[#DDD7CD] shrink-0">
            <Layers className="w-5 h-5 text-[#B9684D]" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#77736D] uppercase tracking-wider block">Total Items</span>
            <span className="text-2xl font-bold text-[#202020]">{totalItemsCount}</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#DDD7CD] shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#5E8068]/10 text-[#5E8068] flex items-center justify-center border border-[#5E8068]/20 shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#77736D] uppercase tracking-wider block">Available</span>
            <span className="text-2xl font-bold text-[#5E8068]">{availableCount}</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#DDD7CD] shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#B75B55]/10 text-[#B75B55] flex items-center justify-center border border-[#B75B55]/20 shrink-0">
            <PackageX className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#77736D] uppercase tracking-wider block">Unavailable</span>
            <span className="text-2xl font-bold text-[#B75B55]">{unavailableCount}</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#DDD7CD] shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-[#B9684D]/10 text-[#B9684D] flex items-center justify-center border border-[#B9684D]/20 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#77736D] uppercase tracking-wider block">Pending Orders</span>
            <span className="text-2xl font-bold text-[#B9684D]">{pendingOrdersCount}</span>
          </div>
        </div>
      </div>

      {/* MENU MANAGEMENT SECTION */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#DDD7CD] p-5 space-y-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#DDD7CD] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#202020] uppercase tracking-wider">
              Menu Items Catalog
            </h2>
            <p className="text-xs text-[#77736D]">Filter and update food inventory</p>
          </div>

          {/* Availability Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-[#F5F1E8] p-1 rounded-lg border border-[#DDD7CD]">
            {['All', 'Available', 'Unavailable'].map((st) => (
              <button
                key={st}
                onClick={() => setAvailabilityFilter(st)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  availabilityFilter === st
                    ? 'bg-[#B9684D] text-white shadow-xs'
                    : 'text-[#77736D] hover:text-[#202020]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#77736D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#F5F1E8] border border-[#DDD7CD] text-[#202020] text-xs focus:outline-none focus:border-[#B9684D]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77736D]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#202020] text-white font-semibold'
                    : 'bg-[#F5F1E8] text-[#77736D] hover:text-[#202020] border border-[#DDD7CD]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table View for Desktop / Stacked Cards for Mobile */}
        {loading ? (
          <LoadingSkeleton count={4} />
        ) : filteredItems.length === 0 ? (
          <div className="p-10 text-center text-[#77736D] text-sm">
            No items found matching the selected filters.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto border border-[#DDD7CD] rounded-xl">
              <table className="w-full text-left text-xs text-[#202020]">
                <thead className="bg-[#F5F1E8] text-[#77736D] uppercase text-[10px] font-bold border-b border-[#DDD7CD]">
                  <tr>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4">Service Mode</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD7CD]">
                  {filteredItems.map((item) => {
                    const isAvailable = item.isAvailable !== false;
                    const ft = (item.foodType || '').toLowerCase();
                    const isSeafood = ft.includes('seafood') || ft.includes('sea food');
                    const isNonVeg = ft === 'non-veg' && !isSeafood;

                    return (
                      <tr key={item._id} className={`hover:bg-[#F5F1E8]/60 transition-colors ${!isAvailable ? 'bg-[#F5F1E8]/40' : ''}`}>
                        {/* Image */}
                        <td className="py-3 px-4">
                          <img
                            src={getImageUrl(item.image, item.category)}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover border border-[#DDD7CD] bg-[#F5F1E8]"
                            onError={(e) => handleImageError(e, item.category)}
                          />
                        </td>

                        {/* Item Name */}
                        <td className="py-3 px-4 font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#202020]">{item.name}</span>
                            {isSeafood ? (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 border border-cyan-300">Seafood</span>
                            ) : isNonVeg ? (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-300">Non-Veg</span>
                            ) : (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">Veg</span>
                            )}
                            {item.popular && (
                              <span className="text-[9px] font-bold text-[#B9684D] uppercase bg-[#B9684D]/10 px-1.5 py-0.2 rounded border border-[#B9684D]/20">Popular</span>
                            )}
                          </div>
                          {item.subcategory && (
                            <span className="text-[10px] text-[#77736D] block font-normal mt-0.5">{item.subcategory}</span>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-[#F5F1E8] border border-[#DDD7CD] text-[11px] font-semibold text-[#77736D]">
                            {item.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-bold text-[#B9684D] text-sm">
                          ₹{item.price}
                          {item.priceOptions && item.priceOptions.length > 0 && (
                            <span className="text-[10px] text-[#77736D] font-normal block">
                              Options: {item.priceOptions.map(o => `${o.label}: ₹${o.price}`).join(', ')}
                            </span>
                          )}
                        </td>

                        {/* Availability (In Stock / Out of Stock) */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              isAvailable
                                ? 'bg-[#5E8068]/15 text-[#5E8068] border border-[#5E8068]/30'
                                : 'bg-[#77736D]/15 text-[#77736D] border border-[#77736D]/30'
                            }`}
                          >
                            {isAvailable ? <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8068]" /> : <XCircle className="w-3.5 h-3.5 text-[#77736D]" />}
                            <span>{isAvailable ? 'Available' : 'Out of Stock'}</span>
                          </button>
                        </td>

                        {/* Service Mode (Dining / Delivery / Both) */}
                        <td className="py-3 px-4">
                          <select
                            value={item.serviceType || 'both'}
                            onChange={(e) => handleServiceTypeChange(item, e.target.value)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer focus:outline-none ${
                              (item.serviceType || 'both') === 'delivery'
                                ? 'bg-[#B9684D]/15 text-[#B9684D] border-[#B9684D]/40 font-bold'
                                : (item.serviceType || 'both') === 'dining'
                                ? 'bg-[#5E8068]/15 text-[#5E8068] border-[#5E8068]/40 font-bold'
                                : 'bg-[#202020]/10 text-[#202020] border-[#202020]/30 font-bold'
                            }`}
                          >
                            <option value="both">Both (Dining & Delivery)</option>
                            <option value="dining">Dining Only</option>
                            <option value="delivery">Delivery Only</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleOpenModal(item)}
                              className="text-[#B9684D] hover:underline font-semibold text-xs transition-colors flex items-center gap-1"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-1 rounded-md text-[#B75B55] hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="md:hidden space-y-3">
              {filteredItems.map((item) => {
                const isAvailable = item.isAvailable !== false;
                return (
                  <div
                    key={item._id}
                    className={`bg-[#FFFFFF] p-4 rounded-xl border border-[#DDD7CD] space-y-3 ${!isAvailable ? 'opacity-70' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={getImageUrl(item.image, item.category)} 
                        alt={item.name} 
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover border border-[#DDD7CD] shrink-0" 
                        onError={(e) => handleImageError(e, item.category)}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-[#202020] truncate">{item.name}</h3>
                        <p className="text-xs text-[#77736D]">{item.category}</p>
                        <p className="text-xs font-bold text-[#B9684D] mt-0.5">₹{item.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#DDD7CD]">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 ${
                          isAvailable
                            ? 'bg-[#5E8068]/15 text-[#5E8068] border border-[#5E8068]/30'
                            : 'bg-[#77736D]/15 text-[#77736D] border border-[#77736D]/30'
                        }`}
                      >
                        {isAvailable ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{isAvailable ? 'Available' : 'Out of Stock'}</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="text-[#B9684D] font-semibold text-xs flex items-center gap-1 hover:underline"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1 text-[#B75B55]"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Edit Panel Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202020]/50 backdrop-blur-xs">
          <div className="max-w-lg w-full bg-[#FFFFFF] border border-[#DDD7CD] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDD7CD] pb-3">
              <h2 className="text-lg font-bold text-[#202020]">{editingId ? 'Edit Food Item' : 'Add New Food Item'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-[#77736D] hover:text-[#202020]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs text-[#202020]">
              {/* Food Image with Change Image File Upload & URL */}
              <div className="bg-[#F5F1E8] p-3.5 rounded-xl border border-[#DDD7CD] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#202020]">Food Image</label>
                  <span className="text-[10px] text-[#77736D]">Select file or edit URL</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative group w-20 h-20 rounded-xl overflow-hidden bg-[#FFFFFF] border border-[#DDD7CD] shrink-0 flex items-center justify-center">
                    {formData.image ? (
                      <img 
                        src={getImageUrl(formData.image, formData.category)} 
                        alt="Food Preview" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                        onError={(e) => handleImageError(e, formData.category)}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#77736D]" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#B9684D] text-white font-semibold text-xs hover:bg-[#A85C42] transition-all cursor-pointer shadow-xs ${uploadingImage ? 'opacity-70 pointer-events-none' : ''}`}>
                      {uploadingImage ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{uploadingImage ? 'Uploading...' : 'Change Image'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileChange} 
                        disabled={uploadingImage}
                        className="hidden" 
                      />
                    </label>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#77736D] font-medium">Image URL:</span>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#DDD7CD] text-[#202020] text-[11px] focus:outline-none focus:border-[#B9684D]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Item Name */}
              <div className="space-y-1">
                <label className="font-semibold text-[#202020]">Food Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#DDD7CD] text-[#202020]"
                />
              </div>

              {/* Category & Food Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#202020]">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#DDD7CD] text-[#202020]"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#202020]">Food Type</label>
                  <select
                    value={formData.foodType}
                    onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#DDD7CD] text-[#202020]"
                  >
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                    <option value="seafood">Seafood</option>
                  </select>
                </div>
              </div>

              {/* Base Price */}
              <div className="space-y-1">
                <label className="font-semibold text-[#202020]">Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#DDD7CD] text-[#202020]"
                />
              </div>

              {/* Optional Portion Prices */}
              <div className="bg-[#F5F1E8] p-3 rounded-xl border border-[#DDD7CD] space-y-2">
                <p className="text-[10px] font-bold text-[#B9684D] uppercase">Portion / Option Prices (Optional)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Option 1 Label (e.g. Small)"
                    value={formData.priceOptionLabel1}
                    onChange={(e) => setFormData({ ...formData, priceOptionLabel1: e.target.value })}
                    className="px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#DDD7CD] text-[#202020] text-[11px]"
                  />
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={formData.priceOptionValue1}
                    onChange={(e) => setFormData({ ...formData, priceOptionValue1: e.target.value })}
                    className="px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#DDD7CD] text-[#202020] text-[11px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Option 2 Label (e.g. Large)"
                    value={formData.priceOptionLabel2}
                    onChange={(e) => setFormData({ ...formData, priceOptionLabel2: e.target.value })}
                    className="px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#DDD7CD] text-[#202020] text-[11px]"
                  />
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={formData.priceOptionValue2}
                    onChange={(e) => setFormData({ ...formData, priceOptionValue2: e.target.value })}
                    className="px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#DDD7CD] text-[#202020] text-[11px]"
                  />
                </div>
              </div>

              {/* Service Availability Selector */}
              <div className="space-y-1 bg-[#F5F1E8] p-3 rounded-xl border border-[#DDD7CD]">
                <label className="font-bold text-[#202020] block">Service Availability (Dining / Delivery)</label>
                <select
                  value={formData.serviceType || 'both'}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#DDD7CD] text-[#202020] font-semibold text-xs focus:outline-none focus:border-[#B9684D]"
                >
                  <option value="both">Both (Dining & Delivery)</option>
                  <option value="dining">Dining Only</option>
                  <option value="delivery">Delivery Only</option>
                </select>
              </div>

              {/* Availability Checkbox */}
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded text-[#B9684D]"
                  />
                  <span className="font-semibold text-[#202020]">Availability (In Stock)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="rounded text-[#B9684D]"
                  />
                  <span className="font-semibold text-[#202020]">Mark as Popular</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#DDD7CD] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-mhp-outline text-xs text-[#202020] border-[#DDD7CD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-mhp-primary text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFutureMenu;
