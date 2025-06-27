# 🚀 GitHub Pages Deployment Guide

This guide will help you deploy your CrystalHarp Sampler to GitHub Pages for free hosting.

## 📋 Prerequisites

1. A GitHub account
2. Git installed on your computer
3. Your project code (already prepared!)

## 🎯 Quick Deployment Steps

### Step 1: Update Repository URLs

Before deploying, update these placeholder URLs in `package.json`:

```json
"homepage": "https://YOURUSERNAME.github.io/CrystalHarp-Sampler",
"repository": {
  "type": "git",
  "url": "https://github.com/YOURUSERNAME/CrystalHarp-Sampler.git"
}
```

Replace `YOURUSERNAME` with your actual GitHub username.

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `CrystalHarp-Sampler` (or your preferred name)
3. Make it **public** (required for free GitHub Pages)
4. Don't initialize with README (we already have one)

### Step 3: Push Your Code

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit: CrystalHarp Sampler"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOURUSERNAME/CrystalHarp-Sampler.git

# Push to GitHub
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The deployment will start automatically!

### Step 5: Access Your Live Application

After deployment (usually 2-3 minutes), your app will be available at:
**https://YOURUSERNAME.github.io/CrystalHarp-Sampler**

## 🔄 Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:

- Build your project when you push to `main` branch
- Deploy to GitHub Pages
- Update your live site

## 🛠️ Manual Deployment (Alternative)

If you prefer manual deployment using gh-pages:

```bash
# Build and deploy manually
npm run deploy
```

## 📁 Project Structure for Deployment

```
CrystalHarp-Sampler/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Auto-deployment workflow
├── public/
│   └── .nojekyll              # Prevents Jekyll processing
├── src/                       # Your source code
├── vite.config.ts             # Vite configuration for GitHub Pages
├── package.json               # Updated with deployment scripts
└── README.md                  # This file
```

## ⚙️ Configuration Files

### `vite.config.ts`

- Sets base path for GitHub Pages
- Optimizes build for production
- Separates vendor chunks for better caching

### `package.json`

- Adds deployment scripts
- Includes gh-pages dependency
- Sets homepage and repository URLs

### `.github/workflows/deploy.yml`

- Automatic deployment on push to main
- Uses Node.js 20
- Builds and deploys to GitHub Pages

## 🎵 Your Live Sample Generator

Once deployed, visitors can:

- Generate CrystalHarp samples in their browser
- Adjust parameters in real-time
- Download WAV files for music production
- No installation required!

## 🔧 Troubleshooting

### Build Fails

- Check console for TypeScript errors
- Ensure all dependencies are installed: `npm install`
- Test locally: `npm run build`

### Page Not Loading

- Verify repository is public
- Check GitHub Pages settings
- Ensure `.nojekyll` file exists in `public/` folder

### Audio Not Working

- Modern browsers require HTTPS for Web Audio (GitHub Pages provides this)
- Users need to interact with page before audio can start (click a button)

## 🎯 Next Steps

After deployment, you can:

1. Share the live URL with others
2. Continue developing and push updates
3. Consider custom domain setup
4. Add analytics or user feedback

Your CrystalHarp Sampler is now ready for the world! 🌍

---

**Live URL Template**: `https://YOURUSERNAME.github.io/CrystalHarp-Sampler`

Remember to replace `YOURUSERNAME` with your actual GitHub username!
