const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const careerRoutes = require('./routes/careerRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Root route for API status
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Career Stop API' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/career-stop';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 