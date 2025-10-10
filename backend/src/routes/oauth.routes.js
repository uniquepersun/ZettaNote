import express from 'express';
import passport from 'passport';
import { generateToken } from '../utils/token.utils.js';
import config from '../config/index.js';

const router = express.Router();

// Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${config.frontendUrl}/login`,
    session: false,
  }),
  (req, res) => {
    // Successful authentication, generate token and redirect or respond
    const token = generateToken(req.user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.server.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${config.frontendUrl}/dashboard?oauth=success`); // Redirect to frontend dashboard or desired page
  }
);

// GitHub OAuth Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${config.frontendUrl}/login`,
    session: false,
  }),
  (req, res) => {
    // Successful authentication, generate token and redirect or respond
    const token = generateToken(req.user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.server.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${config.frontendUrl}/dashboard?oauth=success`); // Redirect to frontend dashboard or desired page
  }
);

export default router;
