# Deployment Guide

This guide covers deploying the AI Prompt Library Manager to various platforms.

## Quick Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Option 1: Deploy from Git Repository

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

That's it! Vercel will automatically detect Next.js and configure everything.

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Your app will be live at**: `https://your-project.vercel.app`

---

## Deploy to Netlify

### From Git Repository

1. Push code to Git
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to Git provider
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Click "Deploy"

### With Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build the app
npm run build

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## Deploy to AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Base directory**: `/`
   - **Output directory**: `.next`
5. Click "Save and deploy"

---

## Static Export (GitHub Pages, S3, etc.)

For static hosting, you need to export the Next.js app.

### 1. Update `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

### 2. Build and Export

```bash
npm run build
```

This creates an `out/` directory with static files.

### 3. Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d out"

# Deploy
npm run deploy
```

### 4. Deploy to AWS S3

```bash
# Install AWS CLI
# Configure AWS credentials

# Sync to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Enable static website hosting in S3 console
```

---

## Environment Variables

This MVP doesn't require environment variables, but for future phases:

### Create `.env.local`

```bash
# Example for future backend integration
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Add to Vercel

```bash
# Via CLI
vercel env add NEXT_PUBLIC_API_URL

# Or in Vercel Dashboard:
# Settings → Environment Variables
```

---

## Custom Domain

### Vercel

1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as shown

### Netlify

1. Go to site settings
2. Click "Domain management"
3. Add custom domain
4. Update DNS records

---

## Performance Optimization

### Before Deploying

1. **Optimize Images**: Use Next.js Image component
2. **Enable Compression**: Automatically handled by platforms
3. **Check Bundle Size**: `npm run build` shows sizes
4. **Test Build Locally**:
   ```bash
   npm run build
   npm start
   ```

### After Deploying

1. **Test Performance**: Use Lighthouse or PageSpeed Insights
2. **Monitor**: Set up analytics (Vercel Analytics, Google Analytics)
3. **CDN**: Automatically enabled on Vercel/Netlify

---

## SSL/HTTPS

All modern platforms provide free SSL certificates:
- ✅ Vercel: Automatic
- ✅ Netlify: Automatic
- ✅ AWS Amplify: Automatic
- ✅ GitHub Pages: Automatic for `*.github.io` domains

---

## Continuous Deployment

### Automatic Deploys

Most platforms auto-deploy when you push to Git:

**Vercel/Netlify/Amplify**:
- Push to `main` → Auto deploy to production
- Push to other branches → Auto deploy to preview

### Manual Control

**Vercel**:
```bash
vercel --prod  # Deploy to production
vercel         # Deploy to preview
```

**Netlify**:
```bash
netlify deploy --prod  # Deploy to production
netlify deploy         # Deploy to preview
```

---

## Rollback

### Vercel

1. Go to Deployments
2. Find previous deployment
3. Click "Promote to Production"

### Netlify

1. Go to Deploys
2. Find previous deploy
3. Click "Publish deploy"

---

## Monitoring & Analytics

### Vercel Analytics

```bash
# Install
npm install @vercel/analytics

# Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics

```bash
# Install
npm install @next/third-parties

# Add to app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

---

## Troubleshooting

### Build Fails

**Check build logs for errors**:
- TypeScript errors → Run `npm run build` locally
- Missing dependencies → Check `package.json`
- Environment variables → Verify they're set

### 404 Errors

**For static export**:
- Ensure `output: 'export'` in `next.config.ts`
- Check routing (no dynamic routes with static export)

### Slow Load Times

**Optimize**:
- Enable image optimization
- Use code splitting
- Minimize dependencies
- Check bundle analyzer

---

## Post-Deployment Checklist

- [ ] Test all features work
- [ ] Verify mobile responsiveness
- [ ] Check dark/light mode
- [ ] Test import/export
- [ ] Verify search and filters
- [ ] Test on different browsers
- [ ] Check performance (Lighthouse)
- [ ] Set up monitoring/analytics
- [ ] Configure custom domain
- [ ] Enable HTTPS
- [ ] Set up error tracking (optional)

---

## Support & Updates

### Keeping Updated

```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

### Security Updates

```bash
# Check for security issues
npm audit

# Fix automatically
npm audit fix
```

---

## Cost Estimates

### Free Tier (All you need for MVP)

- **Vercel**: Unlimited deployments, 100GB bandwidth/month
- **Netlify**: 300 build minutes/month, 100GB bandwidth
- **AWS Amplify**: 1000 build minutes/month, 15GB bandwidth
- **GitHub Pages**: Unlimited for public repos

### Paid Tiers (Future scaling)

- **Vercel Pro**: $20/month (more bandwidth, analytics)
- **Netlify Pro**: $19/month (more builds, forms)
- **AWS Amplify**: Pay-as-you-go (very affordable for small apps)

---

## Recommended Setup

For this MVP:

1. **Deploy to Vercel** (easiest, best Next.js support)
2. **Connect to Git** (auto-deploy on push)
3. **Add custom domain** (optional but professional)
4. **Enable analytics** (understand usage)

**Total time**: ~5 minutes
**Cost**: Free

---

**Need help?** Check the platform-specific documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [AWS Amplify Docs](https://docs.amplify.aws)
