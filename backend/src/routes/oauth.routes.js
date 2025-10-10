import express from 'express';
import passport from 'passport';
import { generateToken } from '../utils/token.utils.js';
import config from '../config/index.js';

const router = express.Router();

// Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.redirect(
        `${config.frontendUrl}/login?error=oauth_failed&message="Authentication failed"`
      );
    }

    if (!user) {
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed&message="No user found"`);
    }

    // Successful authentication, generate token
    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.server.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${config.frontendUrl}/dashboard?oauth=success`);
  })(req, res, next);
});

// GitHub OAuth Routes
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false,
  })
);

router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', { session: false }, (err, user, info) => {
    if (err) {
      console.error('GitHub OAuth error:', err);
      return res.redirect(
        `${config.frontendUrl}/login?error=oauth_failed&message="Authentication failed"`
      );
    }

    if (!user) {
      return res.redirect(`${config.frontendUrl}/login?error=oauth_failed&message="No user found"`);
    }

    // Successful authentication, generate token
    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.server.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${config.frontendUrl}/dashboard?oauth=success`);
  })(req, res, next);
});

export default router;
