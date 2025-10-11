import { verifyToken } from '../utils/token.utils.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../utils/logger.js';

/**
 * Middleware to verify user authentication
 * Checks for valid JWT token in cookies
 * Attaches user info to req object if valid
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.UNAUTHORIZED,
      });
    }

    const user = await verifyToken(token);

    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.INVALID_TOKEN,
      });
    }

    // Check if user account is banned
    if (user.banned) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: 'Your account has been banned. Please contact support.',
      });
    }

    // Attach user to request object
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    logger.error('Authentication middleware error', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.GENERAL.SERVER_ERROR,
    });
  }
};

/**
 * Optional authentication middleware
 * Continues even if user is not authenticated
 * Attaches user info to req object if valid token is present
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (token) {
      const user = await verifyToken(token);
      if (user && !user.banned) {
        req.user = user;
        req.userId = user._id;
      }
    }

    next();
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // Continue without auth
    next();
  }
};

export default {
  authenticate,
  optionalAuth,
};
