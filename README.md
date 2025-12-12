# AI Prompt Library Manager

A modern, polished web application for curating, organizing, and managing AI prompts. Built with Next.js, TypeScript, and Tailwind CSS.

![AI Prompt Library](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Features

### Core Functionality
- **Full CRUD Operations**: Add, edit, delete, and view prompts with ease
- **Smart Organization**: Category and tag-based organization system
- **Powerful Search**: Real-time fuzzy search across titles, content, tags, and notes
- **Advanced Filtering**: Filter by categories, tags, AI models, and favorites
- **Multiple Views**: Toggle between grid and list view modes
- **Sort Options**: Sort by date added, alphabetical, last used, favorites, or most used

### User Experience
- **Copy to Clipboard**: One-click copying with visual feedback
- **Usage Tracking**: Track how many times prompts are used
- **Favorites System**: Star your most-used prompts
- **Dark/Light Mode**: Full theme support with system preference detection
- **Responsive Design**: Mobile-first design that works on all devices
- **Smooth Animations**: Polished micro-interactions and transitions

### Data Management
- **Local Storage**: Client-side persistence with auto-save
- **Export/Import**: JSON export for backup and portability
- **CSV Export**: Export prompts to CSV format
- **Data Backup**: Easy backup and restore functionality

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **Search**: Fuse.js (fuzzy search)
- **UI Components**: Custom components based on shadcn/ui patterns
- **Icons**: Lucide React
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd prompt-library
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
prompt-library/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles and theme variables
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   ├── prompts/            # Prompt-specific components
│   │   ├── PromptCard.tsx
│   │   ├── PromptDetail.tsx
│   │   └── PromptForm.tsx
│   ├── layout/             # Layout components
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterSidebar.tsx
│   │   └── ImportDialog.tsx
│   └── providers/
│       └── ThemeProvider.tsx
├── store/
│   └── useStore.ts         # Zustand state management
├── lib/
│   ├── storage.ts          # Local storage utilities
│   └── utils.ts            # Helper functions
├── types/
│   └── index.ts            # TypeScript type definitions
└── public/                 # Static assets
```

## Usage Guide

### Adding a Prompt

1. Click the "Add Prompt" button in the header
2. Fill in the required fields:
   - Title (required)
   - Prompt content (required)
   - Category (required)
   - AI Model (required)
3. Optionally add:
   - Tags for better organization
   - Source URL for reference
   - Notes for additional context
   - Mark as favorite
4. Click "Add Prompt" to save

### Searching and Filtering

- **Search Bar**: Type to search across all prompt fields (fuzzy matching enabled)
- **Categories**: Click category filters in the sidebar to filter prompts
- **Tags**: Click tags to filter by specific topics
- **AI Models**: Filter prompts by the AI model they're designed for
- **Favorites Only**: Toggle to show only starred prompts
- **Sort Options**: Use the dropdown to change sort order

### Managing Prompts

- **View Details**: Click any prompt card to see full details
- **Copy**: Use the copy button to copy prompt content to clipboard
- **Edit**: Click the edit icon to modify a prompt
- **Delete**: Click the trash icon to remove a prompt (with confirmation)
- **Favorite**: Click the star icon to add/remove from favorites

### Exporting and Importing

- **Export JSON**: Exports all data (prompts, categories, settings) as JSON
- **Export CSV**: Exports only prompts in CSV format
- **Import**: Upload a previously exported JSON file to restore data

### Keyboard Navigation

The application supports full keyboard navigation for accessibility:
- Tab through interactive elements
- Enter/Space to activate buttons
- Escape to close dialogs

## Customization

### Adding New Categories

Categories are initialized with defaults. To add more:

1. Open `lib/storage.ts`
2. Modify the `getDefaultCategories()` function
3. Add your custom categories with unique IDs, names, and colors

### Changing Theme Colors

1. Open `app/globals.css`
2. Modify the CSS variables in `:root` (light mode) and `.dark` (dark mode)
3. Colors use HSL format for easy customization

### Modifying AI Models

1. Open `types/index.ts`
2. Update the `AIModelType` union type
3. Update the `AI_MODELS` array in components that use it

## Performance Considerations

- **Local Storage**: All data is stored client-side (no backend required)
- **Fuzzy Search**: Uses Fuse.js for fast, typo-tolerant search
- **Optimized Rendering**: Components use React best practices
- **Debounced Search**: Search input is debounced to reduce re-renders
- **Responsive Images**: Uses modern image formats and lazy loading

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements

### Phase 2 Features
- User authentication and cloud sync
- Sharing prompts with other users
- Community/public prompt library
- Browser extension for quick saving
- AI-powered prompt suggestions
- Prompt templates and variables
- Collaboration features (teams, shared collections)
- Analytics and insights

## Contributing

This is a standalone project. Feel free to fork and customize for your needs!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Built with [Next.js](https://nextjs.org/)

## Troubleshooting

### Data not persisting
- Check browser localStorage is enabled
- Check browser console for storage quota errors
- Try clearing browser cache and reimporting data

### Search not working
- Ensure prompts have content in searchable fields
- Check browser console for JavaScript errors
- Try clearing search and filters

### Theme not changing
- Check browser supports localStorage
- Verify system dark mode settings
- Try refreshing the page

## Support

For issues, questions, or suggestions, please open an issue on the project repository.

---

**Built with** ❤️ **using Claude Code**
