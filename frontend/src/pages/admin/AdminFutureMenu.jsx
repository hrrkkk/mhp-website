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
import { MHPCard, MHPButton, MHPBadge, MHPInput, MHPSelect, MHPTable } from '../../components/admin/MHPAdminComponents';

const AdminFutureMenu = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
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
      console.warn('Error fetching admin menu data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64DataUrl = event.target.result;
      setFormData(prev => ({ ...prev, image: base64DataUrl }));

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
        serviceType: 'dining'
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
    <div className="space-y-6 pb-16 text-[#202522]">
      
      {/* Header Bar */}
      <MHPCard className="!p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#F47B20] uppercase tracking-widest mb-1">
              <UtensilsCrossed className="w-4 h-4 text-[#F47B20]" />
              CATALOG MANAGEMENT
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#183A2A]">
              Menu Items Catalog
            </h1>
            <p className="text-xs text-[#7D967E] font-medium mt-0.5">
              Manage MHP menu items, pricing, category filters, and service modes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/menu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MHPButton variant="outline" size="sm">
                <Globe className="w-4 h-4 text-[#183A2A]" />
                <span>Customer Menu</span>
              </MHPButton>
            </a>

            <MHPButton
              onClick={() => handleOpenModal(null)}
              variant="primary"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Menu Item</span>
            </MHPButton>
          </div>
        </div>
      </MHPCard>

      {/* STAGE — ADMIN SLOT TIMING CONTROL */}
      <AdminSlotTimingControl />

      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MHPCard className="!p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF7E8] text-[#183A2A] flex items-center justify-center border border-[#7D967E]/30 shrink-0">
            <Layers className="w-5 h-5 text-[#F47B20]" />
          </div>
          <div>
            <span className="text-[11px] font-black text-[#7D967E] uppercase tracking-wider block">Total Items</span>
            <span className="text-2xl font-mono font-black text-[#183A2A]">{totalItemsCount}</span>
          </div>
        </MHPCard>

        <MHPCard className="!p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300 shrink-0">
            <PackageCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">Available</span>
            <span className="text-2xl font-mono font-black text-emerald-800">{availableCount}</span>
          </div>
        </MHPCard>

        <MHPCard className="!p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center border border-rose-300 shrink-0">
            <PackageX className="w-5 h-5 text-rose-700" />
          </div>
          <div>
            <span className="text-[11px] font-black text-rose-800 uppercase tracking-wider block">Unavailable</span>
            <span className="text-2xl font-mono font-black text-rose-800">{unavailableCount}</span>
          </div>
        </MHPCard>

        <MHPCard className="!p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF7E8] text-[#F47B20] flex items-center justify-center border border-[#7D967E]/30 shrink-0">
            <ShoppingBag className="w-5 h-5 text-[#F47B20]" />
          </div>
          <div>
            <span className="text-[11px] font-black text-[#F47B20] uppercase tracking-wider block">Pending Orders</span>
            <span className="text-2xl font-mono font-black text-[#F47B20]">{pendingOrdersCount}</span>
          </div>
        </MHPCard>
      </div>

      {/* MENU MANAGEMENT SECTION */}
      <MHPCard className="!p-5 space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#7D967E]/20 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-[#183A2A] uppercase tracking-wider">
              Food Catalog Items
            </h2>
            <p className="text-xs text-[#7D967E] font-medium">Filter and update food inventory status</p>
          </div>

          {/* Availability Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-[#FFF7E8] p-1 rounded-xl border border-[#7D967E]/30">
            {['All', 'Available', 'Unavailable'].map((st) => (
              <button
                key={st}
                onClick={() => setAvailabilityFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  availabilityFilter === st
                    ? 'bg-[#F47B20] text-white shadow-xs'
                    : 'text-[#7D967E] hover:text-[#183A2A]'
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
            <Search className="w-4 h-4 text-[#7D967E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFF7E8] border border-[#7D967E]/30 text-[#183A2A] text-xs font-bold placeholder-[#7D967E]/60 focus:outline-none focus:border-[#F47B20]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D967E]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#183A2A] text-[#FFF7E8] shadow-xs'
                    : 'bg-[#FFF7E8] text-[#7D967E] hover:text-[#183A2A] border border-[#7D967E]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        {loading ? (
          <LoadingSkeleton count={4} />
        ) : filteredItems.length === 0 ? (
          <div className="p-10 text-center text-[#7D967E] text-sm font-medium">
            No items found matching the selected filters.
          </div>
        ) : (
          <MHPTable headers={['Image', 'Item', 'Category', 'Price', 'Stock Status', 'Service Mode', 'Actions']}>
            {filteredItems.map((item) => {
              const isAvailable = item.isAvailable !== false;
              const ft = (item.foodType || '').toLowerCase();
              const isSeafood = ft.includes('seafood') || ft.includes('sea food');
              const isNonVeg = ft === 'non-veg' && !isSeafood;

              return (
                <tr key={item._id} className={`hover:bg-[#FFF7E8]/60 transition-colors ${!isAvailable ? 'bg-gray-50/60' : ''}`}>
                  {/* Image */}
                  <td className="py-3 px-4">
                    <img
                      src={getImageUrl(item.image, item.category)}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-[#7D967E]/30 bg-[#FFF7E8]"
                      onError={(e) => handleImageError(e, item.category)}
                    />
                  </td>

                  {/* Item Name */}
                  <td className="py-3 px-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#183A2A]">{item.name}</span>
                      {isSeafood ? (
                        <MHPBadge variant="default">Seafood</MHPBadge>
                      ) : isNonVeg ? (
                        <MHPBadge variant="danger">Non-Veg</MHPBadge>
                      ) : (
                        <MHPBadge variant="success">Veg</MHPBadge>
                      )}
                      {item.popular && (
                        <MHPBadge variant="orange">Popular</MHPBadge>
                      )}
                    </div>
                    {item.subcategory && (
                      <span className="text-[10px] text-[#7D967E] block font-medium mt-0.5">{item.subcategory}</span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-[#FFF7E8] border border-[#7D967E]/30 text-[11px] font-extrabold text-[#183A2A]">
                      {item.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-mono font-extrabold text-[#F47B20] text-sm">
                    ₹{item.price}
                  </td>

                  {/* Stock Status */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {isAvailable ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <XCircle className="w-3.5 h-3.5 text-rose-700" />}
                      <span>{isAvailable ? 'Available' : 'Out of Stock'}</span>
                    </button>
                  </td>

                  {/* Service Mode */}
                  <td className="py-3 px-4">
                    <select
                      value={item.serviceType || 'both'}
                      onChange={(e) => handleServiceTypeChange(item, e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-[#FFF7E8] border border-[#7D967E]/30 text-[#183A2A] focus:outline-none focus:border-[#F47B20] cursor-pointer"
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
                        className="text-[#F47B20] hover:underline font-extrabold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </MHPTable>
        )}
      </MHPCard>

      {/* Edit Panel Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="max-w-lg w-full bg-[#FFFFFF] border-2 border-[#7D967E]/40 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#7D967E]/20 pb-3">
              <h2 className="text-lg font-display font-extrabold text-[#183A2A]">
                {editingId ? 'Edit Food Item' : 'Add New Food Item'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#7D967E] hover:text-[#183A2A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs text-[#202522]">
              {/* Food Image */}
              <div className="bg-[#FFF7E8] p-3.5 rounded-2xl border border-[#7D967E]/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-[#183A2A]">Food Image</label>
                  <span className="text-[10px] text-[#7D967E] font-medium">Select file or edit URL</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative group w-20 h-20 rounded-2xl overflow-hidden bg-[#FFFFFF] border border-[#7D967E]/30 shrink-0 flex items-center justify-center">
                    {formData.image ? (
                      <img 
                        src={getImageUrl(formData.image, formData.category)} 
                        alt="Food Preview" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                        onError={(e) => handleImageError(e, formData.category)}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#7D967E]" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F47B20] text-white font-extrabold text-xs hover:bg-[#FF882E] transition-all cursor-pointer shadow-xs ${uploadingImage ? 'opacity-70 pointer-events-none' : ''}`}>
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

                    <MHPInput
                      type="text"
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Item Name */}
              <MHPInput
                label="Food Name *"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              {/* Category & Food Type */}
              <div className="grid grid-cols-2 gap-3">
                <MHPSelect
                  label="Category *"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </MHPSelect>

                <MHPSelect
                  label="Food Type"
                  value={formData.foodType}
                  onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                >
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="seafood">Seafood</option>
                </MHPSelect>
              </div>

              {/* Base Price */}
              <MHPInput
                label="Price (₹) *"
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />

              {/* Service Availability Selector */}
              <MHPSelect
                label="Service Availability (Dining / Delivery)"
                value={formData.serviceType || 'both'}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              >
                <option value="both">Both (Dining & Delivery)</option>
                <option value="dining">Dining Only</option>
                <option value="delivery">Delivery Only</option>
              </MHPSelect>

              {/* Availability Checkbox */}
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded text-[#F47B20]"
                  />
                  <span className="font-extrabold text-[#183A2A]">Availability (In Stock)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="rounded text-[#F47B20]"
                  />
                  <span className="font-extrabold text-[#183A2A]">Mark as Popular</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#7D967E]/20 flex justify-end gap-3">
                <MHPButton
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </MHPButton>

                <MHPButton
                  type="submit"
                  variant="primary"
                >
                  Save Changes
                </MHPButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFutureMenu;
