const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const db = require('./db/connection');
const authMiddleware = require('./middleware/authMiddleware');
const adminOnly = require('./middleware/adminOnly');
const userRoutes = require('./routes/users');
const contentRoutes = require('./routes/content');
const dashboardRoutes = require('./routes/dashboard');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// User management routes
app.use('/users', authMiddleware, adminOnly, userRoutes);

// Content management routes
app.use('/content', authMiddleware, adminOnly, contentRoutes);

// Dashboard statistics routes
app.use('/dashboard', authMiddleware, adminOnly, dashboardRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Admin login endpoint
app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // In a real implementation, you would validate credentials against your database
    // This is a simplified example using environment variables
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { id: 1, username: 'admin', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      res.json({
        success: true,
        message: 'Login successful',
        token: token
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Initialize database
const initDatabase = require('./db/init');
initDatabase();

// Test database connection endpoint
app.get('/db-test', async (req, res) => {
  try {
    await db.query('SELECT NOW()');
    res.json({ success: true, message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
