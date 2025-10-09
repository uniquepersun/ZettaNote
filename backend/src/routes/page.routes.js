import express from 'express';
import {
  createPage,
  getPage,
  getPages,
  savePage,
  renamePage,
  deletePage,
  sharePage,
  publicShare,
  getPublicShare,
} from '../controllers/page.controller.js';
import { asyncHandler } from '../middleware/error.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/pages/createpage
 * @desc    Create a new page
 * @access  Private
 */
router.post(
  '/createpage',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await createPage(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/pages/getpage
 * @desc    Get a single page by ID
 * @access  Private
 */
router.post(
  '/getpage',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await getPage(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/pages/getpages
 * @desc    Get all pages (owned and shared)
 * @access  Private
 */
router.post(
  '/getpages',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await getPages(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/pages/savepage
 * @desc    Save/update page content
 * @access  Private
 */
router.post(
  '/savepage',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await savePage(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/pages/renamepage
 * @desc    Rename a page
 * @access  Private
 */
router.post(
  '/renamepage',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await renamePage(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   DELETE /api/pages/deletepage
 * @desc    Delete a page
 * @access  Private
 */
router.delete(
  '/deletepage',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await deletePage(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/pages/sharepage
 * @desc    Share a page with another user
 * @access  Private
 */
router.post(
  '/sharepage',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await sharePage(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   POST /api/pages/publicshare
 * @desc    Generate public share link
 * @access  Private
 */
router.post(
  '/publicshare',
  asyncHandler(async (req, res) => {
    const { resStatus, resMessage } = await publicShare(req);
    res.status(resStatus).json(resMessage);
  })
);

/**
 * @route   GET /api/pages/share/:shareId
 * @desc    Get publicly shared page
 * @access  Public
 */
router.get(
  '/share/:shareId',
  asyncHandler(async (req, res) => {
    const { shareId } = req.params;
    const { resStatus, resMessage } = await getPublicShare(shareId);
    res.status(resStatus).json(resMessage);
  })
);

export default router;
