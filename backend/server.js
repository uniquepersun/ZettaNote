/**
 * Server Entry Point
 * Connects to database and starts the Express server
 */

import app from './src/app.js';
import { connectDatabase, getDatabaseStatus } from './src/config/database.js';
import config from './src/config/index.js';

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Check database status
    const dbStatus = getDatabaseStatus();
    console.log(`📊 Database Status: ${dbStatus.status}`);

    // Start Express server
    const server = app.listen(config.server.port, () => {
      console.log('🚀 ZettaNote API Server Started');
      console.log(`📍 Environment: ${config.server.nodeEnv}`);
      console.log(`🌐 Server running on port ${config.server.port}`);
      console.log(`🔗 API available at: http://localhost:${config.server.port}/api`);
      console.log(`💚 Health check: http://localhost:${config.server.port}/api/health`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('✅ HTTP server closed');

        try {
          // Close database connection
          const mongoose = (await import('mongoose')).default;
          await mongoose.connection.close();
          console.log('✅ Database connection closed');
          process.exit(0);
        } catch (err) {
          console.error('❌ Error during shutdown:', err);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️ Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Start the server
startServer();
