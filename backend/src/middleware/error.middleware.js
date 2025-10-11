import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../utils/logger.js';

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate response
 * Handles Mongoose, JWT, and general errors
 * @param {object} err - Error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {void}
 */
export const errorHandler = (err, req, res) => {
  logger.error('Error', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: messages.join(', '),
      errors: messages,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(STATUS_CODES.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.AUTH.INVALID_TOKEN,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: 'Token expired, please login again',
    });
  }

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: 'CORS policy violation',
    });
  }

  // Default error
  const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.GENERAL.SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Not Found handler
 * Catches unmatched routes and returns 404 response
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {void}
 */
export const notFoundHandler = (req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
    message: MESSAGES.GENERAL.NOT_FOUND,
    path: req.originalUrl,
  });
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function with error handling
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
