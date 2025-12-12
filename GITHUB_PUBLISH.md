# Publishing to GitHub - Quick Guide

Your local git repository is ready! Choose one method below:

## Method 1: GitHub Website (Recommended)

### Step 1: Create Repository
1. Go to: https://github.com/new
2. Repository name: `ai-prompt-library`
3. Description: `A modern web app for organizing and managing AI prompts`
4. Visibility: Public ✅
5. **DON'T** check any initialization options
6. Click "Create repository"

### Step 2: Push Code

**IMPORTANT**: Replace `YOUR-USERNAME` with your actual GitHub username!

```bash
cd /Users/evan/Claude/Prompt/prompt-library

# Add GitHub remote
git remote add origin https://github.com/YOUR-USERNAME/ai-prompt-library.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Verify
Go to: `https://github.com/YOUR-USERNAME/ai-prompt-library`

You should see all your files!

---

## Method 2: GitHub CLI (If installed)

```bash
cd /Users/evan/Claude/Prompt/prompt-library

# First time setup (if not authenticated)
gh auth login

# Create repo and push in one command
gh repo create ai-prompt-library --public --source=. --remote=origin --push

# Add description
gh repo edit --description "A modern web app for organizing and managing AI prompts"

# Add topics/tags
gh repo edit --add-topic nextjs,typescript,tailwindcss,react,prompt-library
```

---

## After Publishing

### Add Topics/Tags (Makes your repo discoverable)

On GitHub:
1. Go to your repository
2. Click the gear icon ⚙️ next to "About"
3. Add topics:
   - `nextjs`
   - `typescript`
   - `tailwindcss`
   - `react`
   - `prompt-library`
   - `ai-tools`
   - `prompt-management`

### Update Repository Description

Add this to the "About" section:
```
A modern, production-ready web application for organizing and managing AI prompts.
Built with Next.js 15, TypeScript, and Tailwind CSS.
```

### Add Website (Optional)

If you deploy to Vercel:
1. Deploy: `vercel --prod`
2. Add the URL to your GitHub repo's "Website" field

---

## Future Updates

When you make changes:

```bash
# Stage changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to GitHub
git push
```

---

## Useful Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull

# View remote URL
git remote -v
```

---

## Troubleshooting

### "Permission denied" error?
Use SSH instead:
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to GitHub: Settings → SSH Keys → New SSH Key
# Paste contents of: ~/.ssh/id_ed25519.pub

# Change remote to SSH
git remote set-url origin git@github.com:YOUR-USERNAME/ai-prompt-library.git
```

### "Authentication failed"?
Use Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when pushing

---

## Next Steps After Publishing

1. **Add a README badge**: Show build status
2. **Enable GitHub Pages**: Host documentation
3. **Set up GitHub Actions**: Auto-deploy on push
4. **Add contributing guidelines**: If open source
5. **Create releases**: Tag versions

---

**Your repository is ready to push!** 🚀

Choose Method 1 or 2 above and follow the steps.
