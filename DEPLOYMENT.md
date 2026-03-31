# Railway Deployment Guide

## Prerequisites

- Railway account (created with GitHub) ✓
- GitHub repository with this code

## Step-by-Step Deployment

### 1. Create MongoDB Service

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Click "Provision MongoDB"
4. Railway creates a MongoDB instance
5. Copy the `MONGODB_URL` from the MongoDB service details

### 2. Create Backend Service

1. In Railway dashboard, click "New Service" → "GitHub Repo"
2. Select this repository
3. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - **Port**: 5000
4. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URL`: _(paste from MongoDB service)_

### 3. Create Frontend Service (Static)

1. Click "New Service" → "GitHub Repo"
2. Select this repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm install -g serve && serve -s build`
   - **Port**: 3000
4. Add environment variables:
   - `REACT_APP_API_URL`: `https://<your-backend-railway-url>`
   - `NODE_ENV`: `production`

### 4. Get Backend URL

1. In Railway, click the Backend service
2. Copy the "Public URL" (e.g., `https://trucking-backend-prod.up.railway.app`)

### 5. Update Frontend with Backend URL

1. Go to Frontend service
2. Update `REACT_APP_API_URL` environment variable with Backend URL
3. Click "Redeploy"

### 6. Access Your App

- Frontend: https://<your-frontend-railway-url>
- Backend API: https://<your-backend-railway-url>/api/health

## Environment Variables Summary

**Backend:**

- `NODE_ENV`: production
- `PORT`: 5000
- `MONGODB_URL`: (from MongoDB service)

**Frontend:**

- `REACT_APP_API_URL`: https://<backend-url>
- `NODE_ENV`: production

## Troubleshooting

**502 Bad Gateway**:

- Check that backend is running
- Verify `PORT` environment variable is set to 5000

**CORS Errors**:

- Check `REACT_APP_API_URL` is correct in frontend
- Verify backend has CORS enabled (it does by default)

**Build Fails**:

- Check Node.js version compatibility
- Verify `npm install` works locally first

## Cost Estimate

- MongoDB: Free tier included
- Backend + Frontend: ~$5-10/month
- **Total**: Usually within free $5/month credit
