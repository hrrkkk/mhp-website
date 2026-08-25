const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'mhp_vfstr_secret_key_2026_super_secure';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing or invalid' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token expired or unauthorized' });
    }
    
    // Attach fresh user info from DB
    const user = db.findById('users', decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User associated with token no longer exists' });
    }

    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Admin role authorization required' });
    }
  });
};

module.exports = {
  JWT_SECRET,
  generateToken,
  authenticateToken,
  requireAdmin
};
