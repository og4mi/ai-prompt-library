"use client";

import { useState } from "react";
import {
  Star, X, Plus, Edit2, Trash2,
  Briefcase, Code, Lightbulb, Rocket, Target, Zap,
  Heart, Flame, Trophy, Crown, Sparkles,
  MessageSquare, Mail, Phone, Globe, Book, FileText,
  Database, Server, Cloud, Lock, Shield, Key,
  ShoppingCart, DollarSign, TrendingUp, PieChart, BarChart, Activity,
  Users, User, Smile, Coffee, Music,
  Camera, Image, Calendar, Clock, Bell, CheckCircle,
  Settings, Wrench, Package, Box, Layers, Grid,
  Folder, Tag, Bookmark, Flag,
  Home, Building, MapPin, Laptop,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import type { AIModelType, Category } from "@/types";
import { cn } from "@/lib/utils";
import { CategoryModal } from "./CategoryModal";

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

const ICON_MAP: Record<string, React.ElementType> = {
  briefcase: Briefcase,
  code: Code,
  lightbulb: Lightbulb,
  rocket: Rocket,
  target: Target,
  zap: Zap,
  heart: Heart,
  star: Star,
  flame: Flame,
  trophy: Trophy,
  crown: Crown,
  sparkles: Sparkles,
  message: MessageSquare,
  mail: Mail,
  phone: Phone,
  globe: Globe,
  book: Book,
  file: FileText,
  database: Database,
  server: Server,
  cloud: Cloud,
  lock: Lock,
  shield: Shield,
  key: Key,
  cart: ShoppingCart,
  dollar: DollarSign,
  trending: TrendingUp,
  pie: PieChart,
  bar: BarChart,
  activity: Activity,
  users: Users,
  user: User,
  smile: Smile,
  coffee: Coffee,
  music: Music,
  camera: Camera,
  image: Image,
  calendar: Calendar,
  clock: Clock,
  bell: Bell,
  check: CheckCircle,
  settings: Settings,
  wrench: Wrench,
  package: Package,
  box: Box,
  layers: Layers,
  grid: Grid,
  folder: Folder,
  tag: Tag,
  bookmark: Bookmark,
  flag: Flag,
  home: Home,
  building: Building,
  map: MapPin,
  laptop: Laptop,
};

export function FilterSidebar() {
  const { categories, prompts, filters, setFilters, resetFilters, addCategory, updateCategory, deleteCategory } = useStore();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

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

  const handleOpenAddCategory = () => {
    setEditingCategory(undefined);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (name: string, color: string, icon: string) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, { name, color, icon });
    } else {
      addCategory({ name, color, icon });
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
              onClick={handleOpenAddCategory}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1">
            {categories.map((category) => {
              const count = prompts.filter(
                (p) => p.category === category.name
              ).length;
              const isActive = filters.categories.includes(category.name);

              const IconComponent = category.icon ? ICON_MAP[category.icon] || Folder : Folder;

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
                        className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: category.color || '#3b82f6' }}
                      >
                        <IconComponent className="w-3.5 h-3.5 text-white" />
                      </div>
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
                        handleOpenEditCategory(category);
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

      <CategoryModal
        category={editingCategory}
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </aside>
  );
}
