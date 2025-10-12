import express from 'express';
import { requireAdminAuth, requireSuperAdmin, requirePermission } from '../../util/adminAuth.js';
import {
  adminLoginLimiter,
  adminApiLimiter,
  adminCreationLimiter,
  logSuspiciousActivity,
  securityHeaders,
} from '../../util/security.js';

import {
  adminLogin,
  adminLogout,
  banUser,
  changeFirstPassword,
  createAdmin,
  deleteAdmin,
  getAllAdmins,
  getAllUsers,
  getAdminAnalytics as getAnalytics,
  getTotalUsers,
  unbanUser,
  updateAdmin,
} from '../../controllers/adminControllers/index.js';

const router = express.Router();

// Apply security middleware to all admin routes
router.use(securityHeaders);
router.use(logSuspiciousActivity);
router.use(adminApiLimiter); // Moved here so it's applied globally (fix)

// Public admin routes (no authentication required)
router.post('/login', adminLoginLimiter, async (req, res) => {
  try {
    const result = await adminLogin(req);
    const resStatus = result?.resStatus || 500;
    const resMessage = result?.resMessage || {
      success: false,
      message: 'Unexpected response format',
    };
    res.status(resStatus).json(resMessage);
  } catch (err) {
    console.log('Admin Login Error: ', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/change-first-password', async (req, res) => {
  try {
    const result = await changeFirstPassword(req);
    const resStatus = result?.resStatus || 500;
    const resMessage = result?.resMessage || {
      success: false,
      message: 'Unexpected response format',
    };
    res.status(resStatus).json(resMessage);
  } catch (err) {
    console.log('Change First Password Error: ', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Protected admin routes (authentication required)

router.post('/logout', requireAdminAuth, async (req, res) => {
  try {
    const result = await adminLogout(req);
    const resStatus = result?.resStatus || 500;
    const resMessage = result?.resMessage || {
      success: false,
      message: 'Unexpected response format',
    };
    res.status(resStatus).json(resMessage);
  } catch (err) {
    console.log('Admin Logout Error: ', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Get current admin info
router.get('/me', requireAdminAuth, async (req, res) => {
  try {
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
  } catch (err) {
    console.log('Get Admin Info Error: ', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Super admin only routes
router.post(
  '/create',
  adminCreationLimiter,
  requireAdminAuth,
  requireSuperAdmin,
  async (req, res) => {
    try {
      // Add the creating admin's ID to the request
      req.body.createdBy = req.admin?._id;
      const result = await createAdmin(req);
      const resStatus = result?.resStatus || 500;
      const resMessage = result?.resMessage || {
        success: false,
        message: 'Unexpected response format',
      };
      res.status(resStatus).json(resMessage);
    } catch (err) {
      console.log('Create Admin Error: ', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
);

// Analytics routes (require specific permissions)
router.get(
  '/analytics/total-users',
  requireAdminAuth,
  requirePermission('read_analytics'),
  async (req, res) => {
    try {
      const result = await getTotalUsers(req);
      const resStatus = result?.resStatus || 500;
      const resMessage = result?.resMessage || {
        success: false,
        message: 'Unexpected response format',
      };
      res.status(resStatus).json(resMessage);
    } catch (err) {
      console.log('Get Total Users Error: ', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
);

router.get(
  '/analytics',
  requireAdminAuth,
  requirePermission('read_analytics'),
  async (req, res) => {
    try {
      const result = await getAnalytics(req);
      const resStatus = result?.resStatus || 500;
      const resMessage = result?.resMessage || {
        success: false,
        message: 'Unexpected response format',
      };
      res.status(resStatus).json(resMessage);
    } catch (err) {
      console.log('Get Analytics Error: ', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
);

// User management routes
router.get('/users', requireAdminAuth, requirePermission('read_users'), async (req, res) => {
  try {
    const result = await getAllUsers(req);
    const resStatus = result?.resStatus || 500;
    const resMessage = result?.resMessage || {
      success: false,
      message: 'Unexpected response format',
    };
    res.status(resStatus).json(resMessage);
  } catch (err) {
    console.log('Get All Users Error: ', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post(
  '/users/:userId/ban',
  requireAdminAuth,
  requirePermission('ban_users'),
  async (req, res) => {
    try {
      const result = await banUser(req);
      const resStatus = result?.resStatus || 500;
      const resMessage = result?.resMessage || {
        success: false,
        message: 'Unexpected response format',
      };
      res.status(resStatus).json(resMessage);
    } catch (err) {
      console.log('Ban User Error: ', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
);

router.post(
  '/users/:userId/unban',
  requireAdminAuth,
  requirePermission('ban_users'),
  async (req, res) => {
    try {
      const result = await unbanUser(req);
      const resStatus = result?.resStatus || 500;
      const resMessage = result?.resMessage || {
        success: false,
        message: 'Unexpected response format',
      };
      res.status(resStatus).json(resMessage);
    } catch (err) {
      console.log('Unban User Error: ', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
);

// Admin management routes (Super Admin only)
router.get('/admins', requireAdminAuth, requireSuperAdmin, async (req, res) => {
  try {
    const result = await getAllAdmins(req);
    const resStatus = result?.resStatus || 500;
    const resMessage = result?.resMessage || {
      success: false,
      message: 'Unexpected response format',
    };
    res.status(resStatus).json(resMessage);
  } catch (err) {
    console.log('Get All Admins Error: ', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.put('/admins/:adminId', requireAdminAuth, requireSuperAdmin, async (req, res) => {
  try {
    const result = await updateAdmin(req);
    const resStatus = result?.resStatus || 500;
    const resMessage = result?.resMessage || {
      success: false,
      message: 'Unexpected response format',
    };
    res.status(resStatus).json(resMessage);
  } catch (err) {
    console.log('Update Admin Error: ', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.delete('/admins/:adminId', requireAdminAuth, requireSuperAdmin, async (req, res) => {
  try {
    const result = await deleteAdmin(req);
    const resStatus = result?.resStatus || 500;
    const resMessage = result?.resMessage || {
      success: false,
      message: 'Unexpected response format',
    };
    res.status(resStatus).json(resMessage);
  } catch (err) {
    console.log('Delete Admin Error: ', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
