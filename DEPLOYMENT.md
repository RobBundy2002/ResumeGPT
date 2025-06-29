# 🚀 Deployment Guide - ResumeGPT

This guide will help you deploy ResumeGPT to GitHub Pages with a separate backend service.

## 📋 Prerequisites

- GitHub account
- Railway/Render/Heroku account (for backend)
- OpenAI API key (optional - app works with mock mode)

## 🎯 Step-by-Step Deployment

### 1. Backend Deployment (Railway - Recommended)

#### Option A: Railway (Free Tier)
1. **Sign up** at [railway.app](https://railway.app)
2. **Connect your GitHub repo** to Railway
3. **Set environment variables:**
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=production
   PORT=5000
   USE_MOCK_MODE=true
   ```
4. **Deploy** - Railway will automatically detect the Node.js app
5. **Copy the deployment URL** (e.g., `https://resumegpt-production-xxxx.up.railway.app`)

#### Option B: Render (Free Tier)
1. **Sign up** at [render.com](https://render.com)
2. **Create a new Web Service**
3. **Connect your GitHub repo**
4. **Configure:**
   - Build Command: `npm install && cd server && npm install`
   - Start Command: `cd server && npm start`
   - Environment Variables: Same as Railway
5. **Deploy and copy the URL**

### 2. Frontend Deployment (GitHub Pages)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment configuration"
   git push origin main
   ```

2. **Update the backend URL** in your frontend:
   - Edit `client/src/services/api.js`
   - Replace `'https://your-backend-url.railway.app'` with your actual backend URL

3. **Enable GitHub Pages:**
   - Go to your GitHub repository
   - Navigate to **Settings > Pages**
   - Set Source to "GitHub Actions"
   - The workflow will automatically deploy

4. **The GitHub Actions workflow will automatically:**
   - Install dependencies
   - Build the React app
   - Deploy to GitHub Pages

### 3. Environment Variables Setup

#### For Frontend (GitHub Secrets):
1. Go to **Settings > Secrets and variables > Actions**
2. Add:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

#### For Backend (Railway/Render):
```
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
PORT=5000
USE_MOCK_MODE=false  # Set to 'true' if you want to use mock analysis
```

## 🔧 Configuration Files

### GitHub Actions (`.github/workflows/deploy.yml`)
- Automatically builds and deploys frontend
- Runs on every push to `main` branch

### Frontend API Configuration (`client/src/services/api.js`)
- Automatically detects environment
- Uses localhost for development
- Uses deployed backend for production

## 🌐 Final URLs

After deployment, you'll have:
- **Frontend**: `https://yourusername.github.io/ResumeGPT`
- **Backend**: `https://your-backend-url.railway.app`

## 🧪 Testing Deployment

1. **Test the backend:**
   ```
   https://your-backend-url.railway.app/api/health
   ```

2. **Test the frontend:**
   - Visit your GitHub Pages URL
   - Try uploading a resume and analyzing it

## 🔍 Troubleshooting

### Frontend Issues
- **CORS errors**: Make sure backend CORS is configured for your GitHub Pages domain
- **API not found**: Check the `REACT_APP_API_URL` environment variable

### Backend Issues
- **Port issues**: Make sure `PORT` environment variable is set
- **OpenAI errors**: Check API key and quota
- **Build failures**: Check Railway/Render logs

### GitHub Pages Issues
- **Build failures**: Check GitHub Actions workflow logs
- **404 errors**: Make sure the `gh-pages` branch is being created correctly

## 📊 Monitoring

### GitHub Actions
- View workflow status in your GitHub repository
- Check Actions tab for build logs

### Backend Services
- **Railway**: Dashboard shows logs and metrics
- **Render**: Dashboard shows deployment status and logs

## 🔄 Updates

To update your deployment:
1. **Make changes** to your code
2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update app"
   git push origin main
   ```
3. **Frontend** will automatically redeploy via GitHub Actions
4. **Backend** will automatically redeploy via Railway/Render

## 💡 Pro Tips

1. **Use mock mode** for demos if you don't want to use OpenAI API
2. **Set up custom domain** for a more professional look
3. **Monitor usage** to stay within free tier limits
4. **Backup your environment variables** somewhere safe

## 🆘 Need Help?

- **GitHub Pages**: [GitHub Pages Documentation](https://docs.github.com/en/pages)
- **GitHub Actions**: [GitHub Actions Documentation](https://docs.github.com/en/actions)
- **Railway**: [Railway Documentation](https://docs.railway.app/)
- **Render**: [Render Documentation](https://render.com/docs)

---

**Your ResumeGPT will be live at: `https://yourusername.github.io/ResumeGPT`** 🎉 