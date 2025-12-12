import type { Prompt, Category, AppSettings } from "@/types";

const STORAGE_KEYS = {
  PROMPTS: "prompt-library-prompts",
  CATEGORIES: "prompt-library-categories",
  SETTINGS: "prompt-library-settings",
} as const;

// Safe storage access with SSR support
const getStorage = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage;
};

// Prompts storage
export const loadPrompts = (): Prompt[] => {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const data = storage.getItem(STORAGE_KEYS.PROMPTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading prompts:", error);
    return [];
  }
};

export const savePrompts = (prompts: Prompt[]): void => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(prompts));
  } catch (error) {
    console.error("Error saving prompts:", error);
  }
};

// Categories storage
export const loadCategories = (): Category[] => {
  const storage = getStorage();
  if (!storage) return getDefaultCategories();

  try {
    const data = storage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : getDefaultCategories();
  } catch (error) {
    console.error("Error loading categories:", error);
    return getDefaultCategories();
  }
};

export const saveCategories = (categories: Category[]): void => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving categories:", error);
  }
};

// Settings storage
export const loadSettings = (): AppSettings => {
  const storage = getStorage();
  if (!storage) return getDefaultSettings();

  try {
    const data = storage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : getDefaultSettings();
  } catch (error) {
    console.error("Error loading settings:", error);
    return getDefaultSettings();
  }
};

export const saveSettings = (settings: AppSettings): void => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

// Export/Import utilities
export const exportData = (): string => {
  const data = {
    prompts: loadPrompts(),
    categories: loadCategories(),
    settings: loadSettings(),
    exportedAt: new Date().toISOString(),
    version: "1.0",
  };
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);

    if (data.prompts) savePrompts(data.prompts);
    if (data.categories) saveCategories(data.categories);
    if (data.settings) saveSettings(data.settings);

    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};

// CSV export for prompts
export const exportPromptsToCSV = (prompts: Prompt[]): string => {
  const headers = [
    "Title",
    "Content",
    "Category",
    "Tags",
    "AI Model",
    "Source URL",
    "Notes",
    "Favorite",
    "Date Added",
  ];

  const rows = prompts.map((prompt) => [
    escapeCSV(prompt.title),
    escapeCSV(prompt.content),
    escapeCSV(prompt.category),
    escapeCSV(prompt.tags.join("; ")),
    escapeCSV(prompt.aiModel),
    escapeCSV(prompt.sourceUrl || ""),
    escapeCSV(prompt.notes || ""),
    prompt.isFavorite ? "Yes" : "No",
    prompt.dateAdded,
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
};

const escapeCSV = (str: string): string => {
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Default data
const getDefaultCategories = (): Category[] => [
  { id: "writing", name: "Writing", color: "#3B82F6" },
  { id: "code", name: "Code", color: "#10B981" },
  { id: "image", name: "Image Generation", color: "#8B5CF6" },
  { id: "analysis", name: "Analysis", color: "#F59E0B" },
  { id: "creative", name: "Creative", color: "#EC4899" },
  { id: "productivity", name: "Productivity", color: "#6366F1" },
  { id: "other", name: "Other", color: "#6B7280" },
];

const getDefaultSettings = (): AppSettings => ({
  viewMode: "grid",
  sortBy: "dateAdded",
  theme: "system",
});

// Clear all data (useful for testing)
export const clearAllData = (): void => {
  const storage = getStorage();
  if (!storage) return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    storage.removeItem(key);
  });
};
