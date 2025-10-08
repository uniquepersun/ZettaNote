# Testing Guide for Refactored Backend

## Quick Start

1. **Install Dependencies**

   ```bash
   cd backend
   pnpm install
   ```

2. **Setup Environment Variables**
   Copy `.env.example` to `.env` and configure your values:

   ```bash
   cp .env.example .env
   ```

3. **Start MongoDB** (if running locally)

   ```bash
   mongod
   ```

4. **Start the Server**
   ```bash
   npm run dev
   ```

## Testing Endpoints

### Health Check

```bash
curl http://localhost:3001/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

### User Authentication

#### 1. Signup

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt
```

#### 2. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt
```

#### 3. Get User Info

```bash
curl http://localhost:3001/api/auth/getuser \
  -b cookies.txt
```

### Page Management

#### 1. Create Page

```bash
curl -X POST http://localhost:3001/api/pages/createpage \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "pageName": "My First Note"
  }'
```

#### 2. Get Pages

```bash
curl -X POST http://localhost:3001/api/pages/getpages \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

#### 3. Save Page Content

```bash
curl -X POST http://localhost:3001/api/pages/savepage \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "pageId": "YOUR_PAGE_ID",
    "pageData": "# Hello World\n\nThis is my note content."
  }'
```

### Admin Endpoints

#### 1. Create First Admin

```bash
npm run create-admin
```

#### 2. Admin Login

```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "YourAdminPassword"
  }' \
  -c admin-cookies.txt
```

#### 3. Get Admin Info

```bash
curl http://localhost:3001/api/admin/me \
  -b admin-cookies.txt
```

#### 4. Get Analytics

```bash
curl http://localhost:3001/api/admin/analytics \
  -b admin-cookies.txt
```

#### 5. Get All Users

```bash
curl http://localhost:3001/api/admin/users \
  -b admin-cookies.txt
```

## Testing with Frontend

### Frontend Configuration

Update `frontend/src/config.js`:

```javascript
const config = {
  apiUrl: 'http://localhost:3001/api',
};

export default config;
```

Update `admin-portal/src/config.js`:

```javascript
const config = {
  apiUrl: 'http://localhost:3001/api',
};

export default config;
```

### Start All Services

Terminal 1 - Backend:

```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:

```bash
cd frontend
pnpm run start
```

Terminal 3 - Admin Portal:

```bash
cd admin-portal
pnpm run start
```

## Automated Testing Script

Create `test-api.sh` in backend directory:

```bash
#!/bin/bash

BASE_URL="http://localhost:3001/api"

echo "🧪 Testing ZettaNote API"
echo "========================"

# Health Check
echo -e "\n1️⃣ Health Check"
curl -s $BASE_URL/health | jq

# Signup
echo -e "\n2️⃣ User Signup"
curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }' \
  -c /tmp/cookies.txt | jq

# Login
echo -e "\n3️⃣ User Login"
curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }' \
  -c /tmp/cookies.txt | jq

# Get User
echo -e "\n4️⃣ Get User Info"
curl -s $BASE_URL/auth/getuser \
  -b /tmp/cookies.txt | jq

# Create Page
echo -e "\n5️⃣ Create Page"
curl -s -X POST $BASE_URL/pages/createpage \
  -H "Content-Type: application/json" \
  -b /tmp/cookies.txt \
  -d '{
    "pageName": "Test Note"
  }' | jq

# Get Pages
echo -e "\n6️⃣ Get All Pages"
curl -s -X POST $BASE_URL/pages/getpages \
  -H "Content-Type: application/json" \
  -b /tmp/cookies.txt | jq

echo -e "\n✅ All tests completed!"
```

Make it executable:

```bash
chmod +x test-api.sh
./test-api.sh
```

## Common Issues

### 1. Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### 2. MongoDB Connection Error

- Check if MongoDB is running: `mongod --version`
- Start MongoDB: `sudo systemctl start mongod` (Linux) or `brew services start mongodb-community` (Mac)

### 3. CORS Errors

- Ensure `CORS_ORIGIN` in `.env` includes your frontend URL
- Check that cookies are being sent with requests

### 4. Cookie Not Set

- Make sure `COOKIE_SECURE=false` for local development
- Check that `-c cookies.txt` is in curl commands

## Success Criteria

✅ All endpoints return expected responses  
✅ Authentication works (cookies are set)  
✅ Page CRUD operations work  
✅ Admin authentication works  
✅ Rate limiting is active  
✅ Error messages are clear and consistent  
✅ Frontend can communicate with backend  
✅ Admin portal can communicate with backend

## Next Steps

After successful testing:

1. Commit changes to git
2. Update production environment variables
3. Deploy to staging environment
4. Run tests in staging
5. Deploy to production
