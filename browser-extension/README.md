# Prompt Library Browser Extension

A Chrome extension that gives you quick access to your prompt library from anywhere. Copy prompts with one click and insert them directly into ChatGPT, Claude, or Google Gemini.

## Features

- **Quick Access Popup**: Click the extension icon to search and copy prompts
- **Floating Button**: On AI tool pages (ChatGPT, Claude, Gemini), a floating button gives instant access to your prompts
- **Direct Insertion**: Click any prompt to insert it directly into the AI tool's input
- **Search & Filter**: Find prompts by search term, category, or AI model
- **Auto-Sync**: Automatically syncs with your web app every 30 minutes
- **Save Selection**: Right-click any selected text and save it as a prompt

## Installation

### Option 1: Load Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right
3. Click "Load unpacked"
4. Navigate to the `browser-extension` folder and select it
5. The extension should now appear in your extensions list

### Option 2: Create Icons First

Before loading the extension, you'll need to create icon files. You can:

1. Create 16x16, 32x32, 48x48, and 128x128 PNG icons
2. Place them in the `icons/` folder with names:
   - `icon16.png`
   - `icon32.png`
   - `icon48.png`
   - `icon128.png`

Or temporarily comment out the icon references in `manifest.json` to test without icons.

## Usage

### From the Extension Popup

1. Click the extension icon in Chrome toolbar
2. Search for prompts or use filters
3. Click any prompt to copy it to clipboard
4. Paste wherever you need it

### On AI Tool Pages

1. Visit ChatGPT, Claude, or Google Gemini
2. Look for the floating purple button in the bottom right
3. Click it to open the prompt panel
4. Search and click any prompt to insert it directly into the input

### Syncing with Your Web App

The extension automatically syncs prompts from your web app. To manually configure:

1. Update `background.js` line 51 with your app's URL:
   ```javascript
   const defaultAppUrl = 'https://your-app-url.com';
   ```

2. Update `popup.js` line 66 with your app's URL:
   ```javascript
   chrome.tabs.create({ url: 'https://your-app-url.com' });
   ```

## Supported AI Tools

- **ChatGPT** (chat.openai.com)
- **Claude** (claude.ai)
- **Google Gemini** (gemini.google.com)

## Permissions

- **storage**: Store prompts locally in Chrome
- **activeTab**: Insert prompts into AI tool pages
- **clipboardWrite**: Copy prompts to clipboard
- **contextMenus**: Right-click to save selections as prompts

## Development

### File Structure

```
browser-extension/
├── manifest.json           # Extension configuration
├── popup/
│   ├── popup.html         # Popup interface
│   ├── popup.css          # Popup styles
│   └── popup.js           # Popup logic
├── content/
│   ├── content.js         # Content script for AI tools
│   └── content.css        # Styles for floating button/panel
├── background/
│   └── background.js      # Service worker
├── icons/
│   └── (icon files)
└── README.md
```

### Updating the Extension

After making changes:
1. Go to `chrome://extensions/`
2. Click the refresh icon on your extension card
3. Test the changes

### Debugging

- **Popup**: Right-click the extension icon → Inspect popup
- **Content Script**: Open DevTools on the AI tool page → Console
- **Background Script**: Go to `chrome://extensions/` → Click "service worker"

## API Integration

To sync prompts from your web app, create an API endpoint:

```typescript
// app/api/prompts/route.ts
export async function GET() {
  const prompts = await getPromptsFromDatabase();
  return Response.json(prompts);
}
```

The extension expects an array of prompt objects:
```typescript
{
  id: string;
  title: string;
  content: string;
  category: string;
  aiModel: string;
  tags: string[];
}
```

## Troubleshooting

**Extension won't load**
- Make sure all files are in the correct directories
- Check for syntax errors in the console
- Create placeholder icons or comment out icon references

**Prompts not showing**
- Click the refresh button in the popup
- Check Chrome storage: DevTools → Application → Storage → Local Storage
- Verify the API endpoint is accessible

**Can't insert prompts**
- Make sure you're on a supported AI tool page
- Check the browser console for errors
- The AI tool's interface may have changed (selectors need updating)

## Future Enhancements

- Firefox support (requires Manifest V3 adaptation)
- Export/import prompts
- Prompt templates
- Keyboard shortcuts
- Dark mode
- Prompt statistics and favorites

## License

Same as the main Prompt Library application.
