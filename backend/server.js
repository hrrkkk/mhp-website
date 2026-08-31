const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const futureMenuRoutes = require('./routes/futureMenuRoutes');
const menuRoutes = require('./routes/menuRoutes');
const billingWebhookRoutes = require('./routes/billingWebhookRoutes');
const { seedAllTablesToSupabase, isSupabaseConfigured } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 5000;

// Seed / verify Supabase PostgreSQL connection
if (isSupabaseConfigured()) {
  seedAllTablesToSupabase();
}

// CORS setup
const defaultAllowedOrigins = [
  'https://mhp-website.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173'
];
const clientUrl = process.env.CLIENT_URL;
if (clientUrl) {
  const envOrigins = clientUrl.includes(',') ? clientUrl.split(',').map(u => u.trim()) : [clientUrl.trim()];
  envOrigins.forEach(o => {
    if (o && !defaultAllowedOrigins.includes(o)) defaultAllowedOrigins.push(o);
  });
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) or if origin is allowed
    if (!origin || defaultAllowedOrigins.includes(origin) || defaultAllowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);
app.use('/api/future-menu', futureMenuRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/webhooks', billingWebhookRoutes);

// Root route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, sans-serif; text-align: center; padding: 50px; background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <h1 style="color: #38bdf8; margin-bottom: 8px;">🚀 MHP REST API Server is Running</h1>
      <p style="color: #94a3b8; font-size: 1.1rem; margin-bottom: 24px;">This is the backend API service (Port 5000).</p>
      <a href="http://localhost:3000" style="background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1rem; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);">
        Open Web Application (http://localhost:3000) &rarr;
      </a>
    </div>
  `);
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'MHP Backend REST API',
    institution: 'VFSTR, Vadlamudi, Guntur, AP',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const { getPaymentConfig } = require('./services/paymentService');

app.listen(PORT, () => {
  const pConfig = getPaymentConfig();
  console.log(`==================================================`);
  console.log(`🚀 MHP REST API Server running on port ${PORT}`);
  console.log(`💳 Payment Gateway Mode: ${pConfig.paymentMode.toUpperCase()} | Key ID: ${pConfig.keyId}`);
  console.log(`📍 VFSTR Campus, Vadlamudi, Guntur, AP`);
  console.log(`==================================================`);
});
