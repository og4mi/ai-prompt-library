export type AIModelType =
  | "ChatGPT"
  | "Claude"
  | "Gemini"
  | "Midjourney"
  | "DALL-E"
  | "Stable Diffusion"
  | "MagicPatterns"
  | "Vercel"
  | "Lovable"
  | "Cursor"
  | "Replit"
  | "Aura"
  | "Anything"
  | "Builder"
  | "Ideogram"
  | "Krea"
  | "FLORA"
  | "Other";

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  sourceUrl?: string;
  aiModel: AIModelType | string;
  dateAdded: string;
  notes?: string;
  isFavorite: boolean;
  usageCount: number;
  lastUsed?: string;
  collectionId?: string;
  isTemplate?: boolean;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export type ViewMode = "grid" | "list";

export type SortOption =
  | "dateAdded"
  | "alphabetical"
  | "lastUsed"
  | "favorites"
  | "mostUsed";

export interface Collection {
  id: string;
  name: string;
  description?: string;
  color?: string;
  dateCreated: string;
}

export interface FilterOptions {
  categories: string[];
  tags: string[];
  aiModels: (AIModelType | string)[];
  favoritesOnly: boolean;
  searchQuery: string;
  collectionId?: string;
}

export interface AppSettings {
  viewMode: ViewMode;
  sortBy: SortOption;
  theme: "light" | "dark" | "system";
}
