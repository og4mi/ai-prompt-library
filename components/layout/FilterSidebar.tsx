"use client";

import { useState } from "react";
import { Star, X, Plus, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import type { AIModelType } from "@/types";
import { cn } from "@/lib/utils";

const AI_MODELS: AIModelType[] = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Midjourney",
  "DALL-E",
  "Stable Diffusion",
  "MagicPatterns",
  "Vercel",
  "Lovable",
  "Cursor",
  "Replit",
  "Aura",
  "Anything",
  "Builder",
  "Ideogram",
  "Krea",
  "FLORA",
  "Other",
];

export function FilterSidebar() {
  const { categories, prompts, filters, setFilters, resetFilters, addCategory, updateCategory, deleteCategory } = useStore();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryInput, setCategoryInput] = useState("");

  // Get all unique tags from prompts
  const allTags = Array.from(
    new Set(prompts.flatMap((prompt) => prompt.tags))
  ).sort();

  const toggleCategory = (categoryName: string) => {
    const newCategories = filters.categories.includes(categoryName)
      ? filters.categories.filter((c) => c !== categoryName)
      : [...filters.categories, categoryName];
    setFilters({ categories: newCategories });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    setFilters({ tags: newTags });
  };

  const toggleAIModel = (model: AIModelType) => {
    const newModels = filters.aiModels.includes(model)
      ? filters.aiModels.filter((m) => m !== model)
      : [...filters.aiModels, model];
    setFilters({ aiModels: newModels });
  };

  const toggleFavoritesOnly = () => {
    setFilters({ favoritesOnly: !filters.favoritesOnly });
  };

  const handleAddCategory = () => {
    if (categoryInput.trim()) {
      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      addCategory({ name: categoryInput.trim(), color: randomColor });
      setCategoryInput("");
      setIsAddingCategory(false);
    }
  };

  const handleUpdateCategory = (id: string) => {
    if (categoryInput.trim()) {
      updateCategory(id, { name: categoryInput.trim() });
      setCategoryInput("");
      setEditingCategoryId(null);
    }
  };

  const handleDeleteCategory = (id: string, categoryName: string) => {
    const count = prompts.filter((p) => p.category === categoryName).length;
    if (count > 0) {
      if (confirm(`Delete "${categoryName}"? ${count} prompt(s) use this category and will need to be updated.`)) {
        deleteCategory(id);
      }
    } else {
      if (confirm(`Delete "${categoryName}"?`)) {
        deleteCategory(id);
      }
    }
  };

  const startEditCategory = (id: string, name: string) => {
    setEditingCategoryId(id);
    setCategoryInput(name);
    setIsAddingCategory(false);
  };

  const cancelEdit = () => {
    setEditingCategoryId(null);
    setIsAddingCategory(false);
    setCategoryInput("");
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.aiModels.length > 0 ||
    filters.favoritesOnly;

  return (
    <aside className="hidden lg:block w-64 border-r bg-muted/30 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Favorites */}
        <div>
          <button
            onClick={toggleFavoritesOnly}
            className={cn(
              "flex items-center gap-2 w-full py-2 px-3 rounded-md transition-colors",
              filters.favoritesOnly
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <Star
              className={cn(
                "h-4 w-4",
                filters.favoritesOnly && "fill-current"
              )}
            />
            <span className="text-sm font-medium">Favorites Only</span>
          </button>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm text-muted-foreground">
              Categories
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingCategory(true)}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1">
            {isAddingCategory && (
              <div className="flex items-center gap-1 mb-2">
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="New category..."
                  className="flex-1 px-2 py-1 text-sm border rounded-md bg-background"
                  autoFocus
                />
                <Button size="sm" onClick={handleAddCategory} className="h-7 px-2">
                  Add
                </Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-7 px-2">
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            {categories.map((category) => {
              const count = prompts.filter(
                (p) => p.category === category.name
              ).length;
              const isActive = filters.categories.includes(category.name);
              const isEditing = editingCategoryId === category.id;

              if (isEditing) {
                return (
                  <div key={category.id} className="flex items-center gap-1 mb-2">
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleUpdateCategory(category.id)}
                      className="flex-1 px-2 py-1 text-sm border rounded-md bg-background"
                      autoFocus
                    />
                    <Button size="sm" onClick={() => handleUpdateCategory(category.id)} className="h-7 px-2">
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-7 px-2">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              }

              return (
                <div key={category.id} className="group relative">
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className={cn(
                      "flex items-center justify-between w-full py-2 px-3 rounded-md transition-colors text-sm",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="truncate">{category.name}</span>
                    </div>
                    <span className="text-muted-foreground">{count}</span>
                  </button>
                  <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditCategory(category.id, category.name);
                      }}
                      className="h-6 w-6 p-0 hover:bg-background"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id, category.name);
                      }}
                      className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Models */}
        <div>
          <h3 className="font-medium text-sm mb-2 text-muted-foreground">
            AI Models
          </h3>
          <div className="space-y-1">
            {AI_MODELS.map((model) => {
              const count = prompts.filter((p) => p.aiModel === model).length;
              const isActive = filters.aiModels.includes(model);

              if (count === 0) return null;

              return (
                <button
                  key={model}
                  onClick={() => toggleAIModel(model)}
                  className={cn(
                    "flex items-center justify-between w-full py-2 px-3 rounded-md transition-colors text-sm",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted"
                  )}
                >
                  <span>{model}</span>
                  <span className="text-muted-foreground">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div>
            <h3 className="font-medium text-sm mb-2 text-muted-foreground">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isActive = filters.tags.includes(tag);
                return (
                  <Badge
                    key={tag}
                    variant={isActive ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
