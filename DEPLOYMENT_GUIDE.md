# Deployment Guide

## Current Issue
The app is deployed but showing 404 because Vercel is having trouble with the monorepo structure.

## Solution 1: Configure Vercel Dashboard (Recommended)
1. Go to your Vercel project dashboard
2. Go to Settings > General
3. Set the following:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

## Solution 2: Restructure Project (Alternative)
If the dashboard configuration doesn't work, you can restructure the project:

1. Move all files from `frontend/` to the root directory
2. Move `backend/` to a subdirectory or separate repository
3. Update the build scripts in package.json

## Solution 3: Use Vercel CLI
Deploy directly using Vercel CLI with specific configuration:

```bash
npx vercel --cwd frontend
```

## Current Configuration
The current `vercel.json` should work, but if it doesn't, try the dashboard configuration first.