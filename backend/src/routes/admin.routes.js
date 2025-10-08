import express from 'express';
import {
  adminLogin,
  adminLogout,
  banUser,
  changeFirstPassword,
  createAdmin,
  deleteAdmin,
  getAllAdmins,
  getAllUsers,
  getAnalytics,
  getTotalUsers,
  unbanUser,
  updateAdmin,
} from '../controllers/admin.controller.js';
import {
  adminLoginLimiter,
  adminApiLimiter,
  adminCreationLimiter,
  logSuspiciousActivity,
  securityHeaders,
} from '../utils/security.utils.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  authenticateAdmin,
  requirePermission,
  requireSuperAdmin,
} from '../middleware/admin.middleware.js';

const router = express.Router();

// Apply security middleware to all admin routes
router.use(securityHeaders);
router.use(logSuspiciousActivity);
router.use(adminApiLimiter);

/**
 * @route   POST /api/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post(
  '/login',
  adminLoginLimiter,
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await adminLogin(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/admin/change-first-password
 * @desc    Change first time admin password
 * @access  Public
 */
router.post(
  '/change-first-password',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await changeFirstPassword(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/admin/logout
 * @desc    Admin logout
 * @access  Private (Admin)
 */
router.post(
  '/logout',
  authenticateAdmin,
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await adminLogout(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   GET /api/admin/me
 * @desc    Get current admin info
 * @access  Private (Admin)
 */
router.get('/me', authenticateAdmin, (req, res) => {
  if (!req.admin) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  res.status(200).json({
    success: true,
    admin: {
      id: req.admin._id,
      email: req.admin.email,
      name: req.admin.name,
      role: req.admin.role,
      permissions: req.admin.permissions,
      lastLogin: req.admin.lastLogin,
      twoFactorEnabled: req.admin.twoFactorEnabled,
    },
  });
});

/**
 * @route   POST /api/admin/create
 * @desc    Create new admin
 * @access  Private (Super Admin)
 */
router.post(
  '/create',
  adminCreationLimiter,
  authenticateAdmin,
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    req.body.createdBy = req.admin?._id;
    const { resStatus, resMessage } = await createAdmin(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   GET /api/admin/analytics/total-users
 * @desc    Get total users count
 * @access  Private (Admin with read_analytics permission)
 */
router.get(
  '/analytics/total-users',
  authenticateAdmin,
  requirePermission('read_analytics'),
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await getTotalUsers(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   GET /api/admin/analytics
 * @desc    Get analytics data
 * @access  Private (Admin with read_analytics permission)
 */
router.get(
  '/analytics',
  authenticateAdmin,
  requirePermission('read_analytics'),
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await getAnalytics(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (Admin with read_users permission)
 */
router.get(
  '/users',
  authenticateAdmin,
  requirePermission('read_users'),
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await getAllUsers(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/admin/users/:userId/ban
 * @desc    Ban a user
 * @access  Private (Admin with ban_users permission)
 */
router.post(
  '/users/:userId/ban',
  authenticateAdmin,
  requirePermission('ban_users'),
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await banUser(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/admin/users/:userId/unban
 * @desc    Unban a user
 * @access  Private (Admin with ban_users permission)
 */
router.post(
  '/users/:userId/unban',
  authenticateAdmin,
  requirePermission('ban_users'),
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await unbanUser(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   GET /api/admin/admins
 * @desc    Get all admins
 * @access  Private (Super Admin)
 */
router.get(
  '/admins',
  authenticateAdmin,
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await getAllAdmins(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   PUT /api/admin/admins/:adminId
 * @desc    Update admin
 * @access  Private (Super Admin)
 */
router.put(
  '/admins/:adminId',
  authenticateAdmin,
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await updateAdmin(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   DELETE /api/admin/admins/:adminId
 * @desc    Delete admin
 * @access  Private (Super Admin)
 */
router.delete(
  '/admins/:adminId',
  authenticateAdmin,
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await deleteAdmin(req);
    res.status(resStatus).json(resMessage);
  })
);

export default router;
