# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Local Testing
```bash
# Make sure everything works locally first:
cd client && npm run dev      # Should run on localhost:5173
cd server && npm run dev      # Should run on localhost:5000

# Test register & login endpoints
```

### 2. Environment Variables

#### Server Environment (`server/.env`)
```env
NODE_ENV=development          # Change to 'production' on Vercel
PORT=5000                     # Vercel will override this
MONGO_URI=[YOUR_ATLAS_CONNECTION_STRING]  # MongoDB Atlas, not localhost
JWT_SECRET=[LONG_RANDOM_STRING_MIN_16_CHARS]
JWT_EXPIRES_IN=7d
CLIENT_URLS=http://localhost:5173    # Will be your Vercel domain
```

#### Client Environment (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api    # Local development
# For Vercel, this will be overridden in Vercel dashboard
```

---

## 🚀 Deployment Steps

### Step 1: Prepare Repository
```bash
# Make sure both .env files are NOT in git (check .gitignore)
# Only .env.example files should be in git
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Create Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select "Environment Variables" tab
5. Add these variables:

**Variable Setup:**
```
NODE_ENV = production
MONGO_URI = [Your MongoDB Atlas Connection String]
JWT_SECRET = [Generate a secure 32+ character string]
CLIENT_URLS = https://your-project-name.vercel.app
VITE_API_URL = /api
```

### Step 3: Configure Vercel Settings
- **Framework**: (auto-selected)
- **Build Command**: Already set in `vercel.json`
- **Install Command**: Already set in `vercel.json`
- **Output Directory**: Already set to `client/dist`

### Step 4: Deploy
Click "Deploy" and wait for the build to complete.

---

## 🔍 Troubleshooting

### ❌ "Login Failed" / "Register Failed"
**Causes:**
- ✗ `MONGO_URI` not set or invalid
- ✗ `JWT_SECRET` too short (must be 16+ chars)
- ✗ Database connection timeout

**Fix:**
1. Verify `MONGO_URI` works locally
2. Check MongoDB Atlas has your IP whitelisted (use 0.0.0.0/0 for testing)
3. Check Vercel function logs in dashboard

### ❌ API Returns 404 or Wrong Endpoint
**Causes:**
- ✗ `VITE_API_URL` pointing to wrong endpoint
- ✗ Frontend trying to connect to localhost

**Fix:**
1. Set `VITE_API_URL=/api` in Vercel dashboard
2. Rebuild and redeploy

### ❌ CORS Errors
**Causes:**
- ✗ `CLIENT_URLS` doesn't match the frontend domain
- ✗ Frontend URL includes trailing slash

**Fix:**
1. Go to Vercel → Project Settings → Environment Variables
2. Update `CLIENT_URLS` to match your Vercel domain (without trailing slash)
3. Redeploy

### ❌ Database Connection Fails
**Causes:**
- ✗ MongoDB Atlas IP whitelist doesn't include Vercel's IPs

**Fix:**
1. MongoDB Atlas → Network Access
2. Add `0.0.0.0/0` (temporary, for testing only)
3. Or use Vercel IP range if known

---

## 📊 Monitoring

### View Logs
1. Vercel Dashboard → Your Project → Deployments
2. Click on "Functions" tab to see endpoint logs
3. Click "Logs" to see real-time output

### Test Endpoints
```bash
# Test health check
curl https://your-project-name.vercel.app/api/health

# Test register
curl -X POST https://your-project-name.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST https://your-project-name.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🔐 Security Notes

⚠️ **NEVER commit `.env` files to git!**
- Check `.gitignore` includes `*.env`
- Only commit `.env.example` files

⚠️ **Production JWT Secret**
- Use a strong, randomly generated secret (32+ characters)
- Never use `change-me-in-production` or `supersecretkey123456`
- Example: `openssl rand -base64 32`

⚠️ **MongoDB Access**
- Don't expose your Vercel domain with `0.0.0.0/0` permanently
- Restrict to Vercel IPs when possible
- Or use MongoDB Atlas private endpoints

---

## 📝 Architecture

```
https://your-project-name.vercel.app
    ├─ / (Frontend SPA - React)
    ├─ /api/auth/register (Serverless)
    ├─ /api/auth/login (Serverless)
    ├─ /api/auth/me (Serverless)
    ├─ /api/tasks/* (Serverless)
    └─ MongoDB Atlas (External)
```

All API requests go through Vercel Serverless Functions which handle MongoDB connection pooling.
