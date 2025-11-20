# Quick Start: Push to GitHub & Deploy to Vercel

## 📦 What's Been Configured

✅ `.gitignore` - Protects sensitive files (.env, node_modules, build files)
✅ `.env.example` - Template for environment variables
✅ `vercel.json` - Vercel deployment configuration
✅ `package.json` - Build and preview scripts added
✅ `README.md` - Project documentation
✅ `DEPLOYMENT.md` - Detailed deployment guide

---

## 🚀 Quick Deploy (3 Steps)

### Step 1: Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to **https://vercel.com/**
2. Click **"Add New Project"**
3. **Import** your GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL` = (your Supabase URL)
   - `VITE_SUPABASE_ANON_KEY` = (your Supabase key)
5. Click **"Deploy"**

### Step 3: Configure Supabase

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`

---

## ✅ Pre-Flight Check

Before deploying, make sure:

- [ ] Your `.env` file has correct Supabase credentials
- [ ] Database schema is applied in Supabase
- [ ] App works locally: `npm run dev`
- [ ] Build works: `npm run build`
- [ ] No sensitive data in code

---

## 🔑 Where to Find Your Supabase Credentials

1. Go to **https://supabase.com/dashboard**
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## 🆘 Need Help?

- See `DEPLOYMENT.md` for detailed instructions
- See `README.md` for project documentation
- Check Vercel build logs if deployment fails

---

**You're ready to deploy! 🎉**
