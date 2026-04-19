const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));           // change to your frontend URL in production
app.use(express.json());

// In-memory users (replace hashes with your generated ones)
const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2b$10$QNPJzianYGu9lRomiUTC4OQ5VNh8OYWCcB2jg1ssphcyi60qAePyW',   // ← paste from hash.js
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    password: '$2b$10$xen1kYFbjHCAg6gcvn8WMefi.1lgbJl.IQzHNU84b/DuEIndfBNpm',    // ← paste from hash.js
    role: 'user'
  }
];

// ====================== MIDDLEWARES ======================

// 1. JWT Authentication (3.1.2)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// 2. RBAC – Role-Based Access (3.1.3)
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: Insufficient role' });
    }
    next();
  };
};

// ====================== ROUTES ======================

// 3.1.2 + 3.1.3 – Login (issues JWT)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// Protected route – any logged-in user
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Protected profile data', user: req.user });
});

// RBAC route – only ADMIN
app.get('/api/admin', authenticateToken, authorizeRole(['admin']), (req, res) => {
  res.json({ message: 'Admin-only data accessed successfully' });
});

// RBAC route – USER or ADMIN
app.get('/api/dashboard', authenticateToken, authorizeRole(['user', 'admin']), (req, res) => {
  res.json({ message: 'Dashboard data for authorized users' });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// For Vercel serverless (export default app)
module.exports = app;

// For local development only
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}