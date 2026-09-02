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

// CORS setup - Allow all origins gracefully in production & local dev
app.use(cors({
  origin: true,
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Direct Health Check endpoints (registered at top level before routers)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'MHP Backend REST API',
    institution: 'VFSTR, Vadlamudi, Guntur, AP',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'MHP Backend REST API',
    institution: 'VFSTR, Vadlamudi, Guntur, AP',
    timestamp: new Date().toISOString()
  });
});

// Primary API Routes (registered under /api)
app.use('/api/menu', menuRoutes);
app.use('/api/future-menu', futureMenuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', billingWebhookRoutes);
app.use('/api', contentRoutes);

// Direct alias routes (registered without /api prefix as safety fallback)
app.use('/menu', menuRoutes);
app.use('/future-menu', futureMenuRoutes);
app.use('/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, sans-serif; text-align: center; padding: 50px; background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <h1 style="color: #38bdf8; margin-bottom: 8px;">🚀 MHP REST API Server is Running</h1>
      <p style="color: #94a3b8; font-size: 1.1rem; margin-bottom: 24px;">This is the backend API service (Port ${PORT}).</p>
      <a href="https://mhp-website.onrender.com" style="background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1rem; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);">
        Open Web Application &rarr;
      </a>
    </div>
  `);
});

// Serve frontend dist build if present
const fs = require('fs');
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

// API 404 handler (JSON response for unhandled API endpoints)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    requestedPath: req.originalUrl
  });
});

// SPA fallback for non-API routes if frontend build is served
if (fs.existsSync(frontendDist)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const { getPaymentConfig } = require('./services/paymentService');

app.listen(PORT, '0.0.0.0', () => {
  const pConfig = getPaymentConfig();
  console.log(`==================================================`);
  console.log(`🚀 MHP REST API Server running on port ${PORT} (0.0.0.0)`);
  console.log(`💳 Payment Gateway Mode: ${pConfig.paymentMode.toUpperCase()} | Key ID: ${pConfig.keyId}`);
  console.log(`📍 VFSTR Campus, Vadlamudi, Guntur, AP`);
  console.log(`==================================================`);

  // Automated 10-minute Self-Ping Routine to keep Render instance awake 24/7
  const PING_INTERVAL_MS = 10 * 60 * 1000;
  setInterval(() => {
    try {
      const pingUrl = process.env.RENDER_EXTERNAL_URL 
        ? `${process.env.RENDER_EXTERNAL_URL}/api/health` 
        : 'https://mhp-backend-ee3o.onrender.com/api/health';
        
      const client = pingUrl.startsWith('https') ? require('https') : require('http');
      client.get(pingUrl, (res) => {
        if (res.statusCode === 200) {
          console.log(`[KeepAlive] ⚡ Health ping successful (${new Date().toLocaleTimeString('en-US')})`);
        }
      }).on('error', () => {});
    } catch (e) {}
  }, PING_INTERVAL_MS);
});
