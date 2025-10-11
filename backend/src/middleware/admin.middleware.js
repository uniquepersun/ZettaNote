import { verifyAdminToken } from '../utils/token.utils.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import AdminAccount from '../models/AdminAccount.model.js';
import logger from '../utils/logger.js';

/**
 * Middleware to verify admin authentication
 * Checks for valid admin JWT token
 * Attaches admin info to req object if valid
 * Logs admin activity
 * Updates last login time periodically
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;

    if (!token) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.ADMIN.UNAUTHORIZED,
      });
    }

    const admin = await verifyAdminToken(token);

    if (!admin) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.INVALID_TOKEN,
      });
    }

    // Attach admin to request object
    req.admin = admin;
    req.adminId = admin._id;

    // Log admin activity
    admin.addAuditLog(
      `API_ACCESS: ${req.method} ${req.originalUrl}`,
      req.ip,
      req.get('User-Agent'),
      {
        method: req.method,
        url: req.originalUrl,
      }
    );

    // Update last login periodically (every 30 minutes)
    if (!admin.lastLogin || Date.now() - admin.lastLogin > 30 * 60 * 1000) {
      admin.lastLogin = new Date();
      await admin.save();
    }

    next();
  } catch (error) {
    logger.error('Admin authentication middleware error', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.GENERAL.SERVER_ERROR,
    });
  }
};

/**
 * Middleware to check if admin has specific permission
 * @param {string} permission - Required permission
 * @returns {Function} Express middleware function
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.ADMIN.UNAUTHORIZED,
      });
    }

    if (!AdminAccount.hasPermission(req.admin, permission)) {
      // Log unauthorized access attempt
      req.admin.addAuditLog(`UNAUTHORIZED_ACCESS: ${permission}`, req.ip, req.get('User-Agent'), {
        permission,
        method: req.method,
        url: req.originalUrl,
      });
      req.admin.save().catch(logger.error);

      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: 'Insufficient permissions.',
      });
    }

    next();
  };
};

/**
 * Middleware to check if admin is super admin
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
export const requireSuperAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.ADMIN.UNAUTHORIZED,
    });
  }

  if (req.admin.role !== 'super_admin') {
    req.admin.addAuditLog('UNAUTHORIZED_SUPER_ADMIN_ACCESS', req.ip, req.get('User-Agent'), {
      method: req.method,
      url: req.originalUrl,
    });
    req.admin.save().catch(logger.error);

    return res.status(STATUS_CODES.FORBIDDEN).json({
      success: false,
      message: 'Super admin privileges required.',
    });
  }

  next();
};

export default {
  authenticateAdmin,
  requirePermission,
  requireSuperAdmin,
};
