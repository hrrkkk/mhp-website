/**
 * Test script to verify Razorpay REST API connectivity and Test Mode credentials.
 * Run using: node backend/scripts/test_razorpay_order_api.js
 */
const dotenv = require('dotenv');
const path = require('path');
// Load backend .env variables first
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const paymentService = require('../services/paymentService');

async function testRazorpayOrderApi() {
  console.log('==================================================');
  console.log('🧪 TESTING RAZORPAY REST ORDER API CONNECTION');
  console.log('==================================================');

  const config = paymentService.getPaymentConfig();
  console.log(`📍 Configured Payment Mode: ${config.paymentMode.toUpperCase()}`);
  console.log(`🔑 Configured Key ID:      ${config.keyId}`);

  if (!process.env.RAZORPAY_KEY_SECRET) {
    console.error('❌ ERROR: RAZORPAY_KEY_SECRET is missing in backend/.env');
    process.exit(1);
  }

  const dummyOrder = {
    orderNumber: `TEST-ORD-${Date.now()}`,
    totalAmount: 100, // ₹100
    customerName: 'Test Student',
    customerPhone: '9876543210'
  };

  console.log('\n📡 Creating Razorpay Order via paymentService...');
  try {
    const session = await paymentService.createPaymentSession(dummyOrder);
    console.log('✅ SUCCESS! Payment session response:');
    console.dir(session, { depth: null });
    
    if (session.razorpayOrderId && session.razorpayOrderId.startsWith('order_')) {
      console.log('\n🎉 Razorpay API Order successfully created on Razorpay servers!');
      console.log(`🆔 Razorpay Order ID: ${session.razorpayOrderId}`);
    } else {
      console.log('\n⚠️ Notice: Session created locally or using fallback mock ID.');
    }
  } catch (err) {
    console.error('❌ FAILED to create Razorpay Order session:', err.message);
  }
}

testRazorpayOrderApi();
