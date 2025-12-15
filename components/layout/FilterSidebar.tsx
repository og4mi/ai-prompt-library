"use client";

import { Star, X } from "lucide-react";
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
  "Other",
];

export function FilterSidebar() {
  const { categories, prompts, filters, setFilters, resetFilters } = useStore();

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
          <h3 className="font-medium text-sm mb-2 text-muted-foreground">
            Categories
          </h3>
          <div className="space-y-1">
            {categories.map((category) => {
              const count = prompts.filter(
                (p) => p.category === category.name
              ).length;
              const isActive = filters.categories.includes(category.name);

              return (
                <button
                  key={category.id}
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
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-muted-foreground">{count}</span>
                </button>
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
