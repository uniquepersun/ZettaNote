/**
 * Routes Index
 * Aggregates all application routes
 */

import express from 'express';
import authRoutes from './auth.routes.js';
import pageRoutes from './page.routes.js';
import adminRoutes from './admin.routes.js';
import mailerRoutes from './mailer.routes.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/pages', pageRoutes);
router.use('/admin', adminRoutes);
router.use('/mailer', mailerRoutes);

export default router;
