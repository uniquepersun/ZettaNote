import mongoose from 'mongoose';
import config from './index.js';

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.database.uri);
    console.log('✅ Connected to MongoDB database');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

/**
 * Get database connection status
 * @returns {string} Connection status with emoji
 */
export const getDatabaseStatus = () => {
  const state = mongoose.connection.readyState;

  switch (state) {
    case 0:
      return 'Disconnected ❌';
    case 1:
      return 'Connected ✅';
    case 2:
      return 'Connecting ⏳';
    case 3:
      return 'Disconnecting ⚠️';
    default:
      return 'Unknown ❓';
  }
};

export default { connectDatabase, getDatabaseStatus };
