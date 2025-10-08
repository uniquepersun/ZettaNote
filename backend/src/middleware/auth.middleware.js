import { verifyToken } from '../utils/token.utils.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Middleware to verify user authentication
 * Checks for valid JWT token in cookies
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
    console.error('Authentication middleware error:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.GENERAL.SERVER_ERROR,
    });
  }
};

/**
 * Optional authentication middleware
 * Continues even if user is not authenticated
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
  } catch (error) {
    // Continue without auth
    next();
  }
};

export default {
  authenticate,
  optionalAuth,
};
