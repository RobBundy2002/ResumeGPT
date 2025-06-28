#!/bin/bash

echo "🚀 ResumeGPT Deployment Script"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git remote add origin <your-gitlab-repo-url>"
    exit 1
fi

# Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  You're not on the main branch. Current branch: $current_branch"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Adding all files to git..."
git add .

echo "💾 Committing changes..."
git commit -m "Deploy ResumeGPT to GitLab Pages"

echo "🚀 Pushing to GitLab..."
git push origin main

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitLab project"
echo "2. Navigate to Settings > Pages"
echo "3. Enable GitLab Pages if not already enabled"
echo "4. Wait for the CI/CD pipeline to complete"
echo "5. Your app will be available at: https://yourusername.gitlab.io/ResumeGPT"
echo ""
echo "🔧 Backend deployment:"
echo "1. Sign up at railway.app"
echo "2. Connect your GitLab repo"
echo "3. Set environment variables (see DEPLOYMENT.md)"
echo "4. Update REACT_APP_API_URL in GitLab CI/CD variables"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md" 