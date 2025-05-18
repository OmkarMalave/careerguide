const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Route files
const careerRoutes = require('./routes/careerRoutes');
const authRoutes = require('./routes/authRoutes');
const tests = require('./routes/tests');
const recommendations = require('./routes/recommendationRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS with specific options
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5000', 'http://localhost:5001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/careers', careerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', tests);
app.use('/api/recommendations', recommendations);

// Error handler
app.use(errorHandler);

// Try ports in sequence
const tryPorts = [5000, 5001, 5002, 5003, 5004];

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Try each port until one works
    for (const port of tryPorts) {
      try {
        const server = app.listen(port, () => {
          console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
          console.log(`Server URL: http://localhost:${port}`);
          
          // Update the port in the environment
          process.env.PORT = port;
        });

        // Handle server errors
        server.on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying next port...`);
            return;
          } else {
            console.error('Server error:', err);
          }
        });

        // Handle process termination
        process.on('SIGTERM', () => {
          console.log('SIGTERM received. Shutting down gracefully...');
          server.close(() => {
            console.log('Process terminated');
          });
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err, promise) => {
          console.log(`Unhandled Rejection: ${err.message}`);
          // Don't exit the process, just log the error
          console.error(err);
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (err) => {
          console.log(`Uncaught Exception: ${err.message}`);
          // Don't exit the process, just log the error
          console.error(err);
        });

        // If we get here, the server started successfully
        return;
      } catch (err) {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is in use, trying next port...`);
          continue;
        }
        throw err;
      }
    }

    // If we get here, all ports failed
    console.error('All ports are in use. Please free up a port or try again later.');
    process.exit(1);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 