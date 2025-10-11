import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.model.js';
import config from './index.js';
import logger from '../utils/logger.js';

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.oauth.google.clientID,
      clientSecret: config.oauth.google.clientSecret,
      callbackURL: `${config.server.url}/api/auth/google/callback`,
      scope: ['profile', 'email'], // Explicitly request email and profile
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract email safely
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        if (!email) {
          return done(new Error('No email provided by Google'), null);
        }

        // Check if user exists by providerId
        let user = await User.findOne({ providerId: profile.id, authProvider: 'google' });

        if (!user) {
          // Check if email already exists
          user = await User.findOne({ email });

          if (user) {
            // User exists with this email
            if (user.authProvider === 'local' && user.password) {
              // User has a local account with password - don't allow OAuth login
              return done(
                new Error(
                  'An account with this email already exists. Please sign in with your email and password instead.'
                ),
                null
              );
            }

            // Link Google account to existing user (OAuth to OAuth linking allowed)
            user.authProvider = 'google';
            user.providerId = profile.id;
            user.avatar =
              profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;
            user.emailVerified = true;
            await user.save();
          } else {
            // Create new user
            user = new User({
              name: profile.displayName || email.split('@')[0],
              email: email,
              authProvider: 'google',
              providerId: profile.id,
              avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
              emailVerified: true,
            });
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        logger.error('Google OAuth error', err);
        return done(err, null);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: config.oauth.github.clientID,
      clientSecret: config.oauth.github.clientSecret,
      callbackURL: `${config.server.url}/api/auth/github/callback`,
      scope: ['user:email'], // Explicitly request email
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract email safely - GitHub can return multiple emails
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails.find((e) => e.primary)?.value || profile.emails[0].value
            : null;

        if (!email) {
          return done(
            new Error(
              'No email provided by GitHub. Please make sure your GitHub email is public or verified.'
            ),
            null
          );
        }

        // Check if user exists by providerId
        let user = await User.findOne({ providerId: profile.id, authProvider: 'github' });

        if (!user) {
          // Check if email already exists
          user = await User.findOne({ email });

          if (user) {
            // User exists with this email
            if (user.authProvider === 'local' && user.password) {
              // User has a local account with password - don't allow OAuth login
              return done(
                new Error(
                  'An account with this email already exists. Please sign in with your email and password instead.'
                ),
                null
              );
            }

            // Link GitHub account to existing user (OAuth to OAuth linking allowed)
            user.authProvider = 'github';
            user.providerId = profile.id;
            user.avatar =
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : profile._json?.avatar_url || null;
            user.emailVerified = true;
            await user.save();
          } else {
            // Create new user
            user = new User({
              name: profile.displayName || profile.username || email.split('@')[0],
              email: email,
              authProvider: 'github',
              providerId: profile.id,
              avatar:
                profile.photos && profile.photos.length > 0
                  ? profile.photos[0].value
                  : profile._json?.avatar_url || null,
              emailVerified: true,
            });
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        logger.error('GitHub OAuth error', err);
        return done(err, null);
      }
    }
  )
);

export default passport;
