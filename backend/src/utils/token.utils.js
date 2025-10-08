import jsonwebtoken from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/User.model.js';
import AdminAccount from '../models/AdminAccount.model.js';

/**
 * Generate JWT token for regular users
 * @param {Object} user - User object
 * @param {Object} options - Token options
 * @returns {string} JWT token
 */
export const generateToken = (user, options = {}) => {
  return jsonwebtoken.sign(
    {
      id: user._id,
      type: 'user',
    },
    config.jwt.secret,
    { expiresIn: options.expiresIn || config.jwt.expiresIn }
  );
};

/**
 * Generate JWT token for admin users
 * @param {Object} admin - Admin object
 * @param {Object} options - Token options
 * @returns {string} JWT token
 */
export const generateAdminToken = (admin, options = {}) => {
  return jsonwebtoken.sign(
    {
      id: admin._id,
      role: admin.role,
      type: 'admin',
    },
    config.jwt.secret,
    { expiresIn: options.expiresIn || '4h' }
  );
};

/**
 * Verify user token and return user object
 * @param {string} token - JWT token
 * @returns {Promise<Object|null>} User object or null
 */
export const verifyToken = async (token) => {
  try {
    const decoded = jsonwebtoken.verify(token, config.jwt.secret);

    if (decoded.type !== 'user') {
      return null;
    }

    const user = await User.findById(decoded.id);
    return user || null;
  } catch (error) {
    return null;
  }
};

/**
 * Verify admin token and return admin object
 * @param {string} token - JWT token
 * @returns {Promise<Object|null>} Admin object or null
 */
export const verifyAdminToken = async (token) => {
  try {
    const decoded = jsonwebtoken.verify(token, config.jwt.secret);

    if (decoded.type !== 'admin') {
      return null;
    }

    const admin = await AdminAccount.findById(decoded.id);

    if (!admin || !admin.active || admin.isLocked) {
      return null;
    }

    return admin;
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from cookie
 * @param {Object} req - Express request object
 * @returns {string|null} Token or null
 */
export const extractTokenFromCookie = (req) => {
  return req.cookies?.token || null;
};

/**
 * Extract token from Authorization header
 * @param {Object} req - Express request object
 * @returns {string|null} Token or null
 */
export const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

export default {
  generateToken,
  generateAdminToken,
  verifyToken,
  verifyAdminToken,
  extractTokenFromCookie,
  extractTokenFromHeader,
};
