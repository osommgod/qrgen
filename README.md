# Text to QR Generator

A modern, full-featured SaaS application for generating QR codes with user management, subscription plans, and admin dashboard.

## 🚀 Features

- **QR Code Generation**: Convert text to QR codes with customization options
- **User Authentication**: Secure login and registration with Supabase
- **Subscription Plans**: Free, Pro, and Enterprise tiers with usage limits
- **Admin Dashboard**: Manage users, plans, and monitor statistics
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Live data synchronization with Supabase

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Deployment**: Vercel
- **QR Generation**: qrcode library

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account
- Vercel account (for deployment)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Text to QR Generator v8"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your actual values:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the SQL schema in your Supabase SQL editor:
   ```bash
   # Use the supabase_schema.sql file
   ```

5. **Deploy Supabase Edge Functions** (if applicable)
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Deploy functions
   supabase functions deploy generate-qr
   ```

## 🏃 Running Locally

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🚀 Deployment to Vercel

### Method 1: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

### Method 2: Using Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

## 🔐 Environment Variables

Make sure to add these environment variables in Vercel:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## 📁 Project Structure

```
├── src/
│   ├── components/       # React components
│   ├── lib/             # Utility functions and Supabase client
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── supabase/
│   ├── functions/       # Edge functions
│   └── migrations/      # Database migrations
├── public/              # Static assets
├── .env.example         # Environment variables template
├── vercel.json          # Vercel configuration
└── supabase_schema.sql  # Database schema
```

## 👤 Admin Access

To access the admin dashboard:
1. Create a user account
2. In Supabase, update the user's `is_admin` field to `true`
3. Navigate to `/admin` route

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue in the GitHub repository.