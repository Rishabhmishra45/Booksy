import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Route imports
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import adminRoutes from './routes/admin.js'; // ADD THIS LINE

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes); // ADD THIS LINE

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'BOOKSY Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 BOOKSY Backend API: http://localhost:${PORT}`);
  console.log(`👑 Admin API: http://localhost:${PORT}/api/admin`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});