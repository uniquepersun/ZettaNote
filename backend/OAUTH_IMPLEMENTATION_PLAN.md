# OAuth Implementation Plan for ZettaNote

## 🎯 Strategy: Hybrid Approach (Keep Current Auth + Add OAuth)

### Why This Approach?

- ✅ Keep your excellent existing email/password system
- ✅ Add OAuth providers (Google, GitHub) alongside it
- ✅ Minimal migration effort
- ✅ Users can choose auth method
- ✅ Maintain your custom admin system

---

## 📦 Implementation Options

### Option 1: Passport.js (Recommended for Hybrid)

**Pros:**

- ✅ Works alongside your current JWT system
- ✅ Mature, battle-tested (since 2011)
- ✅ 500+ OAuth strategies available
- ✅ Minimal changes to existing code
- ✅ Easy to add providers incrementally

**Cons:**

- ⚠️ More manual configuration
- ⚠️ Need to handle OAuth callbacks yourself

**Installation:**

```bash
npm install passport passport-google-oauth20 passport-github2
```

---

### Option 2: Auth.js (@auth/express)

**Pros:**

- ✅ Modern, actively maintained
- ✅ Built-in OAuth providers
- ✅ TypeScript support
- ✅ Simple configuration

**Cons:**

- ⚠️ Need to refactor some existing code
- ⚠️ Different token management
- ⚠️ You already have it installed but not configured

**Installation:**

```bash
# Already installed!
npm install @auth/express @auth/mongodb-adapter
```

---

## 🚀 Recommended Implementation: Passport.js Hybrid

### Phase 1: Add OAuth Infrastructure (2-3 days)

#### Step 1: Install Dependencies

```bash
npm install passport passport-google-oauth20 passport-github2
```

#### Step 2: Update User Model

Add OAuth fields to existing schema:

```javascript
// backend/src/models/User.model.js
const UserSchema = new mongoose.Schema({
  // Existing fields
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Make optional for OAuth users

  // New OAuth fields
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local',
  },
  providerId: { type: String }, // OAuth provider user ID
  avatar: { type: String }, // Profile picture URL
  emailVerified: { type: Boolean, default: false },

  // Rest of existing fields...
  pages: [mongoose.Types.ObjectId],
  sharedPages: [mongoose.Types.ObjectId],
  banned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
```

#### Step 3: Create Passport Configuration

```javascript
// backend/src/config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.model.js';

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({
          providerId: profile.id,
          authProvider: 'google',
        });

        if (!user) {
          // Check if email already exists (merge accounts)
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link OAuth to existing account
            user.authProvider = 'google';
            user.providerId = profile.id;
            user.avatar = profile.photos[0]?.value;
            user.emailVerified = true;
            await user.save();
          } else {
            // Create new user
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              authProvider: 'google',
              providerId: profile.id,
              avatar: profile.photos[0]?.value,
              emailVerified: true,
            });
          }
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          providerId: profile.id,
          authProvider: 'github',
        });

        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            user.authProvider = 'github';
            user.providerId = profile.id;
            user.avatar = profile.photos[0]?.value;
            user.emailVerified = true;
            await user.save();
          } else {
            user = await User.create({
              name: profile.displayName || profile.username,
              email: profile.emails[0].value,
              authProvider: 'github',
              providerId: profile.id,
              avatar: profile.photos[0]?.value,
              emailVerified: true,
            });
          }
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
```

#### Step 4: Create OAuth Routes

```javascript
// backend/src/routes/oauth.routes.js
import express from 'express';
import passport from '../config/passport.js';
import { generateToken } from '../utils/token.utils.js';
import config from '../config/index.js';

const router = express.Router();

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${config.client.url}/login?error=oauth_failed`,
  }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend with success
    res.redirect(`${config.client.url}/dashboard?oauth=success`);
  }
);

// GitHub OAuth
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false,
  })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${config.client.url}/login?error=oauth_failed`,
  }),
  (req, res) => {
    const token = generateToken(req.user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${config.client.url}/dashboard?oauth=success`);
  }
);

export default router;
```

#### Step 5: Update App.js

```javascript
// backend/src/app.js
import passport from './config/passport.js';
import oauthRoutes from './routes/oauth.routes.js';

// Initialize Passport
app.use(passport.initialize());

// OAuth routes
app.use('/api/auth', oauthRoutes);
```

#### Step 6: Update Auth Controller

```javascript
// backend/src/controllers/auth.controller.js
// Make password optional for OAuth users
export const signup = async (req) => {
  // ... existing validation ...

  // Only require password for local auth
  const { name, email, password } = validation.data;

  // Hash password only if provided
  const userData = {
    name,
    email,
    authProvider: 'local',
  };

  if (password) {
    userData.password = await bcrypt.hash(password, 10);
  }

  const newUser = new User(userData);
  // ... rest of logic
};
```

#### Step 7: Environment Variables

```bash
# .env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
API_URL=http://localhost:4000
CLIENT_URL=http://localhost:5173
```

---

### Phase 2: Frontend Integration (1-2 days)

#### Update Login Page

```jsx
// frontend/src/pages/Login.jsx
<div className="space-y-4">
  {/* Existing email/password form */}
  <form onSubmit={handleSubmit}>{/* ... existing fields ... */}</form>

  {/* OAuth Divider */}
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-base-300"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-base-100 text-base-content/60">Or continue with</span>
    </div>
  </div>

  {/* OAuth Buttons */}
  <div className="grid grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() => (window.location.href = `${VITE_API_URL}/api/auth/google`)}
      className="flex items-center justify-center gap-2 px-4 py-2 border border-base-300 rounded-lg hover:bg-base-200 transition"
    >
      <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
      Google
    </button>

    <button
      type="button"
      onClick={() => (window.location.href = `${VITE_API_URL}/api/auth/github`)}
      className="flex items-center justify-center gap-2 px-4 py-2 border border-base-300 rounded-lg hover:bg-base-200 transition"
    >
      <FaGithub className="w-5 h-5" />
      GitHub
    </button>
  </div>
</div>
```

#### Handle OAuth Success

```jsx
// frontend/src/pages/Login.jsx or Dashboard.jsx
useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('oauth') === 'success') {
    toast.success('Successfully logged in!');
    // Clean URL
    navigate(location.pathname, { replace: true });
  }
}, [location]);
```

---

### Phase 3: Setup OAuth Apps (1 day)

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:4000/api/auth/google/callback` (dev)
   - `https://your-domain.com/api/auth/google/callback` (prod)

#### GitHub OAuth Setup

1. Go to [GitHub Settings > Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Add callback URL:
   - `http://localhost:4000/api/auth/github/callback` (dev)
   - `https://your-domain.com/api/auth/github/callback` (prod)

---

## 📊 Implementation Timeline

| Phase     | Task                   | Time         | Priority |
| --------- | ---------------------- | ------------ | -------- |
| 1         | Update User model      | 30 min       | High     |
| 1         | Install Passport.js    | 15 min       | High     |
| 1         | Configure Google OAuth | 2 hours      | High     |
| 1         | Configure GitHub OAuth | 2 hours      | High     |
| 1         | Create OAuth routes    | 1 hour       | High     |
| 1         | Update auth controller | 1 hour       | Medium   |
| 2         | Frontend OAuth buttons | 2 hours      | High     |
| 2         | Handle OAuth redirects | 1 hour       | High     |
| 3         | Setup Google Console   | 30 min       | High     |
| 3         | Setup GitHub OAuth     | 30 min       | High     |
| 4         | Testing                | 4 hours      | High     |
| **Total** |                        | **2-3 days** |          |

---

## 🔐 Security Considerations

### 1. Account Linking

- ✅ Link OAuth to existing email if found
- ✅ Prevent duplicate accounts
- ✅ Ask user for permission to merge

### 2. Email Verification

- ✅ OAuth emails are pre-verified
- ⚠️ Still verify email signups

### 3. Password Reset

- ⚠️ OAuth users don't have passwords
- ✅ Show "Sign in with Google/GitHub" instead

### 4. Security Headers

```javascript
// Add to app.js
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

---

## 🧪 Testing Checklist

- [ ] Google OAuth login works
- [ ] GitHub OAuth login works
- [ ] OAuth links to existing email account
- [ ] OAuth creates new account if email doesn't exist
- [ ] JWT token generated correctly for OAuth users
- [ ] Dashboard loads after OAuth redirect
- [ ] Logout works for OAuth users
- [ ] Password field optional for OAuth users
- [ ] Can't create OAuth user with same email twice
- [ ] Error handling for failed OAuth

---

## 🚀 Future Enhancements

### Phase 4: Additional Features

1. **More OAuth Providers**
   - Discord
   - Twitter/X
   - Microsoft
   - LinkedIn

2. **Account Unlinking**
   - Allow users to disconnect OAuth
   - Require password setup before unlinking

3. **Multiple OAuth Accounts**
   - Link multiple OAuth providers to one account
   - Choose default sign-in method

4. **OAuth Profile Sync**
   - Update avatar from OAuth provider
   - Sync name changes

---

## 📝 Migration Notes

### Backward Compatibility

- ✅ Existing users keep email/password login
- ✅ No breaking changes to current auth flow
- ✅ JWT tokens work for both auth types
- ✅ All existing endpoints unchanged

### Data Migration

No migration needed! Just add new fields with defaults.

```javascript
// Optional: Add migration script
// backend/scripts/migrateUsersForOAuth.js
import User from '../src/models/User.model.js';

async function migrate() {
  await User.updateMany(
    { authProvider: { $exists: false } },
    {
      $set: {
        authProvider: 'local',
        emailVerified: false,
      },
    }
  );
  console.log('Migration complete!');
}
```

---

## 🎯 Next Steps

1. **Review this plan** - Make sure it fits your needs
2. **Setup OAuth apps** - Get credentials from Google/GitHub
3. **Start with Google** - Implement one provider first
4. **Add GitHub** - Once Google works, add GitHub
5. **Test thoroughly** - All edge cases
6. **Deploy** - Update production env vars

---

## 🆘 Need Help?

Common issues and solutions:

### "Redirect URI mismatch"

- ✅ Check callback URLs in Google/GitHub console
- ✅ Make sure protocol matches (http vs https)
- ✅ Check for trailing slashes

### "Email not provided by OAuth"

- ✅ Request email scope explicitly
- ✅ Check provider permissions
- ✅ Handle missing email gracefully

### "Cookie not set after OAuth"

- ✅ Check CORS settings
- ✅ Verify sameSite cookie attribute
- ✅ Test with localhost:3000 → localhost:4000

---

## 📚 Resources

- [Passport.js Documentation](http://www.passportjs.org/)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Guide](https://docs.github.com/en/apps/oauth-apps)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Ready to implement? Let me know which provider you want to start with!** 🚀
