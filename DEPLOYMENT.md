# Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] `.env` file is properly configured locally
- [ ] `.env` is listed in `.gitignore` (✓ Already done)
- [ ] `.env.example` is created with placeholder values (✓ Already done)

### 2. Code Quality
- [ ] All features are working locally
- [ ] No console errors in browser
- [ ] Build completes successfully: `npm run build`
- [ ] Preview build works: `npm run preview`

### 3. Supabase Setup
- [ ] Database schema is applied (`supabase_schema.sql`)
- [ ] Row Level Security (RLS) policies are enabled
- [ ] Edge functions are deployed (if applicable)
- [ ] Supabase URL and Anon Key are ready

### 4. Git Repository
- [ ] Git is initialized: `git init`
- [ ] All files are committed
- [ ] Repository is pushed to GitHub
- [ ] `.gitignore` is working (no sensitive files committed)

---

## 🚀 GitHub Push Instructions

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Text to QR Generator SaaS"

# Create main branch
git branch -M main

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

---

## 🌐 Vercel Deployment Instructions

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com/
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_SUPABASE_URL = your_supabase_project_url
   VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (usually 1-2 minutes)
   - Your app will be live at: `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (accept default or enter custom name)
# - Directory? ./
# - Override settings? No
```

---

## 🔧 Post-Deployment Steps

### 1. Verify Deployment
- [ ] Visit your Vercel URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test QR code generation
- [ ] Test admin dashboard (if applicable)

### 2. Configure Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate to be issued

### 3. Set Up Supabase Redirects
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to:
   - **Site URL**: `https://your-project-name.vercel.app`
   - **Redirect URLs**: `https://your-project-name.vercel.app/**`

### 4. Monitor Application
- [ ] Check Vercel Analytics
- [ ] Monitor Supabase usage
- [ ] Set up error tracking (optional: Sentry)

---

## 🐛 Troubleshooting

### Build Fails on Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

### Environment Variables Not Working
- Ensure variables start with `VITE_` prefix
- Redeploy after adding environment variables
- Check variable names match exactly

### Supabase Connection Issues
- Verify Supabase URL and Key are correct
- Check Supabase project is not paused
- Verify RLS policies allow public access where needed

### 404 Errors on Routes
- Ensure `vercel.json` is present (✓ Already created)
- Check rewrites configuration for SPA routing

---

## 📊 Performance Optimization (Optional)

- [ ] Enable Vercel Analytics
- [ ] Set up Vercel Speed Insights
- [ ] Configure caching headers (already in `vercel.json`)
- [ ] Optimize images with Vercel Image Optimization

---

## 🔒 Security Checklist

- [ ] Environment variables are not exposed in client code
- [ ] Supabase RLS policies are properly configured
- [ ] Admin routes are protected
- [ ] API keys are stored in environment variables only
- [ ] CORS is properly configured in Supabase

---

## 📝 Notes

- Vercel provides automatic HTTPS
- Vercel provides automatic deployments on git push
- Free tier includes: 100GB bandwidth, unlimited requests
- Build time limit: 45 minutes (free tier)

---

**Ready to deploy!** 🎉

Follow the steps above and your application will be live in minutes!
