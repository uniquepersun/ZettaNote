import cors from 'cors';
import config from './index.js';
import logger from '../utils/logger.js';

/**
 * Configure CORS middleware
 * @returns {Function} CORS middleware
 */
export const configureCors = () => {
  const { allowedOrigins } = config.cors;

  return cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        // Log rejected origin for debugging
        logger.warn('CORS rejected origin:', origin);
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });
};

export default configureCors;
