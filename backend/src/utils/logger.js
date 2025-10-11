/**
 * Logger Utility
 * Professional logging system using Winston
 * Provides structured logging, multiple transports, and log levels
 */

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define custom log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each log level
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'magenta',
  debug: 'white',
};

// Tell winston about our custom colors
winston.addColors(logColors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format with colors for development
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `[${timestamp}] ${level}: ${message}`;

    // Add metadata if present
    if (Object.keys(metadata).length > 0) {
      const meta = JSON.stringify(metadata, null, 2);
      msg += `\n${meta}`;
    }

    return msg;
  })
);

// Define transports
const transports = [
  // Console transport for all environments
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
  // Create logs directory path
  const logsDir = path.join(__dirname, '../../logs');

  transports.push(
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Create the logger instance
const winstonLogger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  transports,
  exitOnError: false,
});

/**
 * Custom logger wrapper to provide convenience methods
 */
class Logger {
  /**
   * Log error messages
   * @param {string} message - Error message
   * @param {Error | object} error - Error object or additional data
   */
  error(message, error = null) {
    if (error instanceof Error) {
      winstonLogger.error(message, { error: error.message, stack: error.stack });
    } else if (error) {
      winstonLogger.error(message, { details: error });
    } else {
      winstonLogger.error(message);
    }
  }

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {*} metadata - Additional metadata
   */
  warn(message, metadata = null) {
    if (metadata) {
      winstonLogger.warn(message, metadata);
    } else {
      winstonLogger.warn(message);
    }
  }

  /**
   * Log info messages
   * @param {string} message - Info message
   * @param {*} metadata - Additional metadata
   */
  info(message, metadata = null) {
    if (metadata) {
      winstonLogger.info(message, metadata);
    } else {
      winstonLogger.info(message);
    }
  }

  /**
   * Log HTTP request information
   * @param {string} message - HTTP log message
   * @param {*} metadata - Additional metadata
   */
  http(message, metadata = null) {
    if (metadata) {
      winstonLogger.http(message, metadata);
    } else {
      winstonLogger.http(message);
    }
  }

  /**
   * Log debug messages (only in development)
   * @param {string} message - Debug message
   * @param {*} metadata - Additional metadata
   */
  debug(message, metadata = null) {
    if (metadata) {
      winstonLogger.debug(message, metadata);
    } else {
      winstonLogger.debug(message);
    }
  }

  /**
   * Log successful operations
   * @param {string} message - Success message
   * @param {*} metadata - Additional metadata
   */
  success(message, metadata = null) {
    const successMsg = `✅ ${message}`;
    if (metadata) {
      winstonLogger.info(successMsg, metadata);
    } else {
      winstonLogger.info(successMsg);
    }
  }

  /**
   * Log HTTP request information
   * @param {object} req - Express request object
   */
  request(req) {
    this.http(`${req.method} ${req.originalUrl || req.url}`, {
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
    });
  }

  /**
   * Log database operations
   * @param {string} operation - Database operation type
   * @param {string} collection - Collection/table name
   * @param {*} metadata - Additional metadata
   */
  db(operation, collection, metadata = null) {
    this.debug(`Database ${operation}: ${collection}`, metadata);
  }

  /**
   * Log authentication events
   * @param {string} event - Auth event type
   * @param {string} userIdentifier - User email or ID
   * @param {*} metadata - Additional metadata
   */
  auth(event, userIdentifier, metadata = null) {
    this.info(`Auth ${event}: ${userIdentifier}`, metadata);
  }

  /**
   * Access to underlying winston logger for advanced usage
   * @returns {winston.Logger} Winston logger instance
   */
  get winston() {
    return winstonLogger;
  }
}

// Export singleton instance
const logger = new Logger();

export default logger;
