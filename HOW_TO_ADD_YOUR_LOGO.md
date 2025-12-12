# How to Add Your Custom Logo

You mentioned you have logo files ready! Here's how to add them:

## Quick Method: Replace the Default

### Step 1: Add Your Logo Files

Place your logo files in the `public/` directory:

```
public/
├── logo.svg          (or logo.png)
├── logo-dark.svg     (optional: for dark mode)
├── favicon.ico       (optional: classic favicon)
└── icon.png          (optional: for app icons)
```

### Step 2: Update the Header Component

Replace the gradient logo with your custom logo in `components/layout/Header.tsx`:

**Find this code (around line 51-54):**
```tsx
<div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
  <Sparkles className="h-6 w-6 text-white" />
</div>
```

**Replace with:**
```tsx
<div className="w-10 h-10">
  <Image
    src="/logo.svg"
    alt="AI Prompt Library"
    width={40}
    height={40}
    className="rounded-lg"
  />
</div>
```

**Note:** `Image` is already imported at the top of the file.

### Step 3: Update the Favicon

If you have a custom favicon, replace `app/icon.tsx`:

**Option A: Use a static file**
1. Delete `app/icon.tsx`
2. Add `public/favicon.ico` (16x16, 32x32, 48x48 in one file)
3. Add `public/apple-touch-icon.png` (180x180 for iOS)

**Option B: Keep dynamic but use your logo**
Edit `app/icon.tsx` to use your logo image.

---

## Advanced: Theme-Aware Logo

If you have separate logos for light/dark mode:

```tsx
"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

function Logo() {
  const { theme } = useTheme();

  return (
    <div className="w-10 h-10">
      <Image
        src={theme === "dark" ? "/logo-dark.svg" : "/logo.svg"}
        alt="AI Prompt Library"
        width={40}
        height={40}
        className="rounded-lg"
      />
    </div>
  );
}
```

---

## Logo File Recommendations

### Formats
- **SVG**: Best for scalability and small file size
- **PNG**: Good for complex logos with gradients
- **ICO**: For favicon.ico (multi-resolution)

### Sizes
- **Header Logo**: 40x40px (or 80x80px @2x)
- **Favicon**: 16x16, 32x32, 48x48 (in one .ico file)
- **Apple Touch Icon**: 180x180px
- **OG Image**: 1200x630px (for social media)

### Optimization
```bash
# Optimize SVG (if needed)
npx svgo logo.svg

# Optimize PNG (if needed)
npx sharp-cli -i logo.png -o logo-optimized.png
```

---

## Quick Steps (TL;DR)

1. **Copy your logo to `public/logo.svg`**

2. **Edit `components/layout/Header.tsx`:**
   ```tsx
   // Find line ~52, replace the gradient div with:
   <Image
     src="/logo.svg"
     alt="AI Prompt Library"
     width={40}
     height={40}
     className="rounded-lg"
   />
   ```

3. **Test:**
   ```bash
   npm run dev
   ```

4. **Commit and push:**
   ```bash
   git add public/ components/layout/Header.tsx
   git commit -m "Add custom logo"
   git push
   ```

---

## Need Help?

Just send me your logo files and I can integrate them for you!

- Send: logo.svg (or logo.png)
- Optional: logo-dark.svg for dark mode
- Optional: favicon.ico

I'll update all the files and commit the changes.

---

## Current Logo

Right now you have:
- **Header**: Gradient background with Sparkles icon
- **Favicon**: Dynamic "P" letter with gradient

Both will be replaced when you add your custom files.
