# Deployment Guide - Real Estate Monorepo

This guide will help you deploy your real estate application to production using free-tier cloud services.

## Architecture Overview

- **Backend (NestJS)**: Railway.app (with PostgreSQL database)
- **Frontend (React)**: Vercel

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with your GitHub account (free)

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account and select this repository
4. Choose the `apps/backend` directory as the root path

### Step 3: Add PostgreSQL Database
1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create a PostgreSQL instance

### Step 4: Configure Environment Variables
In Railway project settings, add these environment variables:

```bash
# Database (Railway will auto-populate these from PostgreSQL service)
POSTGRES_HOST=${{Postgres.PGHOST}}
POSTGRES_PORT=${{Postgres.PGPORT}}
POSTGRES_USER=${{Postgres.PGUSER}}
POSTGRES_PASSWORD=${{Postgres.PGPASSWORD}}
POSTGRES_DB=${{Postgres.PGDATABASE}}

# Alternative DB variables for migrations
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASS=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_to_random_string

# Port (Railway provides this automatically)
PORT=${{PORT}}

# Frontend URL (will be updated after deploying frontend)
FRONTEND_URL=*
```

**Important**: After deploying, Railway will give you a URL like `https://your-app.railway.app`. Copy this URL.

### Step 5: Deploy
1. Railway will automatically build and deploy your backend
2. Wait for deployment to complete (usually 2-5 minutes)
3. Copy your backend URL (e.g., `https://your-backend.railway.app`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Configuration
Before deploying, update the API URL in your frontend:

1. Open `apps/public-frontend/.env.production`
2. Replace `https://your-backend-url.railway.app` with your actual Railway backend URL

```bash
REACT_APP_API_URL=https://your-actual-backend.railway.app
```

3. Open `apps/public-frontend/vercel.json`
4. Update the `destination` URL to your Railway backend URL

### Step 2: Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with your GitHub account (free)

### Step 3: Deploy Frontend
1. Click **"Add New Project"**
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `apps/public-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### Step 4: Configure Environment Variables (Optional)
In Vercel project settings → Environment Variables, add:

```bash
REACT_APP_API_URL=https://your-actual-backend.railway.app
```

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for deployment (usually 1-3 minutes)
3. Vercel will give you a URL like `https://your-app.vercel.app`

---

## Part 3: Final Configuration

### Update CORS in Backend
1. Go back to Railway project
2. Update the `FRONTEND_URL` environment variable:
   ```bash
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Railway will automatically redeploy

### Test Your Application
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test the functionality (login, property listings, etc.)
3. Check browser console for any errors

---

## Database Migrations

If you need to run database migrations on Railway:

1. Go to Railway project → Backend service
2. Click on **"Settings"** → **"Deploy"**
3. Add a custom build command:
   ```bash
   npm install && npm run build && npm run migration:run
   ```

Or use Railway CLI:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npm run migration:run
```

---

## Troubleshooting

### Backend Issues
- **Database connection errors**: Check that PostgreSQL service is running in Railway
- **Environment variables**: Verify all variables are set correctly
- **Build failures**: Check Railway logs for errors

### Frontend Issues
- **API calls failing**: Verify `REACT_APP_API_URL` is correct
- **CORS errors**: Make sure `FRONTEND_URL` is set in Railway backend
- **Build failures**: Check Vercel build logs

### Common Fixes
1. **Clear cache and redeploy** in both Railway and Vercel
2. **Check environment variables** are properly set
3. **Review logs** in Railway and Vercel dashboards

---

## Cost Estimate

- **Railway**: Free tier includes $5/month credit (sufficient for small apps)
- **Vercel**: Free tier includes unlimited deployments
- **Total**: **FREE** for small-scale applications

---

## Next Steps

1. **Custom Domain**: Add your own domain in Vercel settings
2. **SSL Certificate**: Automatically provided by both Railway and Vercel
3. **Monitoring**: Use Railway and Vercel built-in analytics
4. **Scaling**: Upgrade plans as your app grows

---

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- NestJS Docs: https://docs.nestjs.com
- React Docs: https://react.dev

---

**Congratulations! Your real estate application is now live! 🎉**
