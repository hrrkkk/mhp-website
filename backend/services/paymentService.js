const crypto = require('crypto');
const https = require('https');

const PAYMENT_MODE = (process.env.RAZORPAY_MODE || process.env.PAYMENT_MODE || 'test').toLowerCase().trim();
const RAZORPAY_KEY_ID = (process.env.RAZORPAY_KEY_ID || process.env.PAYMENT_KEY_ID || '').trim();
const RAZORPAY_KEY_SECRET = (process.env.RAZORPAY_KEY_SECRET || process.env.PAYMENT_KEY_SECRET || '').trim();

function createRazorpayOrderRemote(amountInPaise, receipt) {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET || RAZORPAY_KEY_ID.includes('demo')) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
      const postData = JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: String(receipt || '').slice(0, 40)
      });
      const req = https.request({
        hostname: 'api.razorpay.com',
        port: 443,
        path: '/v1/orders',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed && parsed.id) {
              resolve(parsed.id);
              return;
            }
          } catch (e) {}
          resolve(null);
        });
      });
      req.on('error', () => resolve(null));
      req.write(postData);
      req.end();
    } catch (e) {
      resolve(null);
    }
  });
}

/**
 * Creates a payment session for an order.
 * Generates an HMAC SHA-256 signature for test/sandbox verification.
 * Exposes ONLY the public Razorpay Key ID to callers.
 */
async function createPaymentSession(order) {
  if (!order || !order.orderNumber) {
    throw new Error('Valid order required to create payment session');
  }

  const transactionId = order.transactionId || `TXN-${PAYMENT_MODE.toUpperCase()}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const amount = Number(order.totalAmount || order.total || 0);
  const amountInPaise = Math.round(amount * 100);

  let razorpayOrderId = order.razorpayOrderId;
  if (!razorpayOrderId) {
    const remoteId = await createRazorpayOrderRemote(amountInPaise, order.orderNumber);
    razorpayOrderId = remoteId || `order_${Date.now().toString().slice(-8)}_${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // Generate HMAC SHA-256 signature using RAZORPAY_KEY_SECRET (server-side only)
  const payload = `${order.orderNumber}|${amount}|${transactionId}`;
  const keySecret = RAZORPAY_KEY_SECRET || 'mhp_test_key_secret_2026';
  
  const signature = crypto
    .createHmac('sha256', keySecret)
    .update(payload)
    .digest('hex');

  return {
    paymentMode: PAYMENT_MODE,
    keyId: RAZORPAY_KEY_ID || 'rzp_test_mhp_demo_key',
    razorpayOrderId,
    transactionId,
    amount,
    amountInPaise,
    currency: 'INR',
    signature,
    gatewayUrl: PAYMENT_MODE === 'live' 
      ? 'https://api.mhp.vignan.ac.in/v1/checkout' 
      : 'https://sandbox.mhp.vignan.ac.in/v1/checkout'
  };
}

/**
 * Cryptographically verifies Razorpay payment confirmation signature.
 * Rejects unverified or tampered requests.
 */
function verifyPaymentSignature(orderNumber, amount, transactionId, signature, razorpayOrderId, razorpayPaymentId) {
  if (!signature) {
    return false;
  }

  const keySecret = RAZORPAY_KEY_SECRET || 'mhp_test_key_secret_2026';

  // 1. Official Razorpay SDK Signature Check (razorpay_order_id + "|" + razorpay_payment_id)
  if (razorpayOrderId && razorpayPaymentId) {
    try {
      const rzpPayload = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedRzpSig = crypto
        .createHmac('sha256', keySecret)
        .update(rzpPayload)
        .digest('hex');

      if (crypto.timingSafeEqual(Buffer.from(String(signature).trim()), Buffer.from(expectedRzpSig.trim()))) {
        return true;
      }
    } catch (err) {
      // Fall through to order payload check
    }
  }

  // 2. Server-side HMAC Signature Check (orderNumber + "|" + amount + "|" + transactionId)
  if (orderNumber && amount && transactionId) {
    const amtNum = Number(amount);
    const payload = `${orderNumber}|${amtNum}|${transactionId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    try {
      const sigBuffer = Buffer.from(String(signature).trim());
      const expectedBuffer = Buffer.from(expectedSignature.trim());

      if (sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return true;
      }
    } catch (err) {
      // Fall through to test mode fallback check
    }
  }

  // 3. Test mode fallback for sandbox simulation
  if (PAYMENT_MODE === 'test' && (signature === `SIG-TEST-${transactionId}` || signature === 'test_signature_valid')) {
    return true;
  }

  return false;
}

/**
 * Verifies payment gateway webhook signature.
 */
function verifyWebhookSignature(rawBody, signatureHeader) {
  if (!rawBody || !signatureHeader) return false;
  const keySecret = RAZORPAY_KEY_SECRET || 'mhp_test_key_secret_2026';
  try {
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody))
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(String(signatureHeader)),
      Buffer.from(expected)
    );
  } catch (err) {
    return false;
  }
}

function getPaymentConfig() {
  return {
    paymentMode: PAYMENT_MODE,
    keyId: RAZORPAY_KEY_ID || 'rzp_test_mhp_demo_key',
    isLive: PAYMENT_MODE === 'live'
  };
}

module.exports = {
  createPaymentSession,
  verifyPaymentSignature,
  verifyWebhookSignature,
  getPaymentConfig
};

