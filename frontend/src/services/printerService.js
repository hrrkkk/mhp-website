/**
 * MHP Thermal Printer Service
 * Manages thermal receipt printer configurations (80mm vs 58mm paper),
 * store headers, auto-print preferences, and thermal printing triggers.
 */

const STORAGE_KEY = 'mhp_thermal_printer_settings';

export const DEFAULT_PRINTER_SETTINGS = {
  paperWidth: '80mm', // '80mm' (3-inch POS standard) or '58mm' (2-inch mini)
  autoPrintOnOrder: true,
  storeTitle: 'MY HOSUR PALACE',
  storeSubtitle: 'VFSTR Campus Hub, Vadlamudi',
  storePhone: '+91 7672022351',
  footerNote: 'Thank you for dining at MHP! Please keep this bill for parcel pickup at N Block Counter.',
  showQrCode: true,
  copies: 1
};

export const getPrinterSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_PRINTER_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.warn('Failed to read printer settings:', err);
  }
  return DEFAULT_PRINTER_SETTINGS;
};

export const savePrinterSettings = (settings) => {
  try {
    const updated = { ...getPrinterSettings(), ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save printer settings:', err);
    return DEFAULT_PRINTER_SETTINGS;
  }
};

/**
 * Generates a realistic mock order payload for instant printer testing.
 */
export const createMockTestOrder = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(100 + Math.random() * 900);
  const billNo = `mhp${dateStr}${randomNum}`;

  return {
    _id: `test_ord_${Date.now()}`,
    billingNumber: billNo,
    orderNumber: billNo,
    customerName: 'Test Student (Printer Test)',
    customerPhone: '9876543210',
    studentId: '211FA04000',
    orderType: 'Parcel',
    orderMode: 'Parcel',
    pickupPoint: 'N BLOCK Counter',
    pickupLocation: 'N BLOCK Counter',
    paymentMethod: 'TEST_MODE',
    paymentStatus: 'PAID (TEST)',
    items: [
      { name: 'MHP Special Chicken Biryani', quantity: 2, unitPrice: 180, price: 180 },
      { name: 'Cold Badam Milk (Bottled)', quantity: 1, unitPrice: 40, price: 40 },
      { name: 'Crispy Veg Nuggets', quantity: 1, unitPrice: 90, price: 90 }
    ],
    subtotal: 490,
    parcelCharge: 30,
    totalAmount: 520,
    total: 520,
    placedAt: date.toISOString(),
    createdAt: date.toISOString(),
    orderReceived: false
  };
};

/**
 * Triggers standard browser window printing targeted at connected system thermal printer
 */
export const triggerBrowserPrint = () => {
  if (typeof window !== 'undefined') {
    window.print();
  }
};
