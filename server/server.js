const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── ROUTES ───────────────────────────────────────────
app.use('/api/lost', require('./routes/lostRoutes'));
app.use('/api/found', require('./routes/foundRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Thirike API running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// ─── START SERVER ─────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Thirike server running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});

module.exports = app;
