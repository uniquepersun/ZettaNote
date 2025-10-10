import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.model.js';
import config from './index.js';

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.oauth.google.clientID,
      clientSecret: config.oauth.google.clientSecret,
      callbackURL: `${config.server.url}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id, authProvider: 'google' });
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            authProvider: 'google',
            providerId: profile.id,
            avatar: profile.photos[0].value,
            emailVerified: true,
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
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
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id, authProvider: 'github' });
        if (!user) {
          user = new User({
            name: profile.displayName || profile.username,
            email: profile.emails[0].value,
            authProvider: 'github',
            providerId: profile.id,
            avatar: profile.photos[0].value,
            emailVerified: true,
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
