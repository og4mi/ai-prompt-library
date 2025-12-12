import { create } from "zustand";
import Fuse from "fuse.js";
import type {
  Prompt,
  Category,
  FilterOptions,
  AppSettings,
  SortOption,
  ViewMode,
} from "@/types";
import {
  loadPrompts,
  savePrompts,
  loadCategories,
  saveCategories,
  loadSettings,
  saveSettings,
} from "@/lib/storage";
import { generateId } from "@/lib/utils";

interface AppState {
  // Data
  prompts: Prompt[];
  categories: Category[];
  settings: AppSettings;

  // UI State
  filters: FilterOptions;
  isLoading: boolean;
  selectedPrompt: Prompt | null;

  // Actions - Prompts
  addPrompt: (prompt: Omit<Prompt, "id" | "dateAdded" | "usageCount" | "lastUsed">) => void;
  updatePrompt: (id: string, updates: Partial<Prompt>) => void;
  deletePrompt: (id: string) => void;
  toggleFavorite: (id: string) => void;
  incrementUsage: (id: string) => void;

  // Actions - Categories
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Actions - Filters & Search
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  getFilteredPrompts: () => Prompt[];

  // Actions - Settings
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sortBy: SortOption) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Actions - UI
  setSelectedPrompt: (prompt: Prompt | null) => void;
  initializeStore: () => void;
}

const defaultFilters: FilterOptions = {
  categories: [],
  tags: [],
  aiModels: [],
  favoritesOnly: false,
  searchQuery: "",
};

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  prompts: [],
  categories: [],
  settings: {
    viewMode: "grid",
    sortBy: "dateAdded",
    theme: "system",
  },
  filters: defaultFilters,
  isLoading: true,
  selectedPrompt: null,

  // Prompt actions
  addPrompt: (promptData) => {
    const newPrompt: Prompt = {
      ...promptData,
      id: generateId(),
      dateAdded: new Date().toISOString(),
      usageCount: 0,
      isFavorite: promptData.isFavorite || false,
    };

    const prompts = [...get().prompts, newPrompt];
    set({ prompts });
    savePrompts(prompts);
  },

  updatePrompt: (id, updates) => {
    const prompts = get().prompts.map((prompt) =>
      prompt.id === id ? { ...prompt, ...updates } : prompt
    );
    set({ prompts });
    savePrompts(prompts);
  },

  deletePrompt: (id) => {
    const prompts = get().prompts.filter((prompt) => prompt.id !== id);
    set({ prompts, selectedPrompt: null });
    savePrompts(prompts);
  },

  toggleFavorite: (id) => {
    const prompts = get().prompts.map((prompt) =>
      prompt.id === id ? { ...prompt, isFavorite: !prompt.isFavorite } : prompt
    );
    set({ prompts });
    savePrompts(prompts);
  },

  incrementUsage: (id) => {
    const prompts = get().prompts.map((prompt) =>
      prompt.id === id
        ? {
            ...prompt,
            usageCount: prompt.usageCount + 1,
            lastUsed: new Date().toISOString(),
          }
        : prompt
    );
    set({ prompts });
    savePrompts(prompts);
  },

  // Category actions
  addCategory: (categoryData) => {
    const newCategory: Category = {
      ...categoryData,
      id: generateId(),
    };

    const categories = [...get().categories, newCategory];
    set({ categories });
    saveCategories(categories);
  },

  updateCategory: (id, updates) => {
    const categories = get().categories.map((category) =>
      category.id === id ? { ...category, ...updates } : category
    );
    set({ categories });
    saveCategories(categories);
  },

  deleteCategory: (id) => {
    const categories = get().categories.filter((category) => category.id !== id);
    set({ categories });
    saveCategories(categories);
  },

  // Filter & Search actions
  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  getFilteredPrompts: () => {
    const { prompts, filters, settings } = get();
    let filtered = [...prompts];

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((prompt) =>
        filters.categories.includes(prompt.category)
      );
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((prompt) =>
        filters.tags.some((tag) => prompt.tags.includes(tag))
      );
    }

    // Apply AI model filter
    if (filters.aiModels.length > 0) {
      filtered = filtered.filter((prompt) =>
        filters.aiModels.includes(prompt.aiModel)
      );
    }

    // Apply favorites filter
    if (filters.favoritesOnly) {
      filtered = filtered.filter((prompt) => prompt.isFavorite);
    }

    // Apply search query with fuzzy matching
    if (filters.searchQuery.trim()) {
      const fuse = new Fuse(filtered, {
        keys: ["title", "content", "tags", "notes"],
        threshold: 0.3,
        includeScore: true,
      });

      const results = fuse.search(filters.searchQuery);
      filtered = results.map((result) => result.item);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (settings.sortBy) {
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "dateAdded":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case "lastUsed":
          if (!a.lastUsed && !b.lastUsed) return 0;
          if (!a.lastUsed) return 1;
          if (!b.lastUsed) return -1;
          return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
        case "favorites":
          if (a.isFavorite === b.isFavorite) return 0;
          return a.isFavorite ? -1 : 1;
        case "mostUsed":
          return b.usageCount - a.usageCount;
        default:
          return 0;
      }
    });

    return filtered;
  },

  // Settings actions
  setViewMode: (mode) => {
    const settings = { ...get().settings, viewMode: mode };
    set({ settings });
    saveSettings(settings);
  },

  setSortBy: (sortBy) => {
    const settings = { ...get().settings, sortBy };
    set({ settings });
    saveSettings(settings);
  },

  setTheme: (theme) => {
    const settings = { ...get().settings, theme };
    set({ settings });
    saveSettings(settings);
  },

  // UI actions
  setSelectedPrompt: (prompt) => {
    set({ selectedPrompt: prompt });
  },

  // Initialize store
  initializeStore: () => {
    const prompts = loadPrompts();
    const categories = loadCategories();
    const settings = loadSettings();

    set({
      prompts,
      categories,
      settings,
      isLoading: false,
    });
  },
}));
