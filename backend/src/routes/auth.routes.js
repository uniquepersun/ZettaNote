import express from 'express';
import {
  signup,
  login,
  getUser,
  changePassword,
  deleteUser,
} from '../controllers/auth.controller.js';
import { asyncHandler } from '../middleware/error.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage, token } = await signup(req);

    if (resStatus === 201 && token) {
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage, token } = await login(req);

    if (resStatus === 200 && token) {
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear cookie
 * @access  Private
 */
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @route   POST /api/auth/changepassword
 * @desc    Change user password
 * @access  Private
 */
router.post(
  '/changepassword',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage, token } = await changePassword(req);

    if (resStatus === 200 && token) {
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   GET /api/auth/getuser
 * @desc    Get current user information
 * @access  Private
 */
router.get(
  '/getuser',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await getUser(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   DELETE /api/auth/deleteUser
 * @desc    Delete user account
 * @access  Private
 */
router.delete(
  '/deleteUser',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await deleteUser(req);

    // Clear cookie on successful deletion
    if (resStatus === 200) {
      res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0),
      });
    }

    res.status(resStatus).json(resMessage);
  })
);

export default router;
