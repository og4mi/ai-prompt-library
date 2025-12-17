"use client";

import { useState, useEffect } from "react";
import {
  X, Briefcase, Code, Lightbulb, Rocket, Target, Zap,
  Heart, Star, Flame, Trophy, Crown, Sparkles,
  MessageSquare, Mail, Phone, Globe, Book, FileText,
  Database, Server, Cloud, Lock, Shield, Key,
  ShoppingCart, DollarSign, TrendingUp, PieChart, BarChart, Activity,
  Users, User, UserPlus, Smile, Coffee, Music,
  Camera, Image, Video, Headphones, Mic, Radio,
  Calendar, Clock, Timer, Bell, AlertCircle, CheckCircle,
  Settings, Wrench, Package, Box, Archive,
  Layers, Grid, Layout, Sidebar, Menu, MoreHorizontal,
  Folder, FolderOpen, File, FilePlus, FileCode, FileImage,
  Tag, Bookmark, Flag, Pin, Paperclip, Link,
  Search, Filter, SortAsc, Eye, EyeOff, Edit,
  Trash, Download, Upload, Share, Send, Save,
  Home, Building, MapPin, Map, Navigation, Compass,
  Smartphone, Laptop, Monitor, Tablet, Watch, Cpu,
  Wifi, Bluetooth, Battery, Power, Plug, Zap as Lightning
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryModalProps {
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string, icon: string) => void;
}

const PRESET_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#6366f1", // indigo
];

const ICON_OPTIONS = [
  { name: "briefcase", Icon: Briefcase },
  { name: "code", Icon: Code },
  { name: "lightbulb", Icon: Lightbulb },
  { name: "rocket", Icon: Rocket },
  { name: "target", Icon: Target },
  { name: "zap", Icon: Zap },
  { name: "heart", Icon: Heart },
  { name: "star", Icon: Star },
  { name: "flame", Icon: Flame },
  { name: "trophy", Icon: Trophy },
  { name: "crown", Icon: Crown },
  { name: "sparkles", Icon: Sparkles },
  { name: "message", Icon: MessageSquare },
  { name: "mail", Icon: Mail },
  { name: "phone", Icon: Phone },
  { name: "globe", Icon: Globe },
  { name: "book", Icon: Book },
  { name: "file", Icon: FileText },
  { name: "database", Icon: Database },
  { name: "server", Icon: Server },
  { name: "cloud", Icon: Cloud },
  { name: "lock", Icon: Lock },
  { name: "shield", Icon: Shield },
  { name: "key", Icon: Key },
  { name: "cart", Icon: ShoppingCart },
  { name: "dollar", Icon: DollarSign },
  { name: "trending", Icon: TrendingUp },
  { name: "pie", Icon: PieChart },
  { name: "bar", Icon: BarChart },
  { name: "activity", Icon: Activity },
  { name: "users", Icon: Users },
  { name: "user", Icon: User },
  { name: "smile", Icon: Smile },
  { name: "coffee", Icon: Coffee },
  { name: "music", Icon: Music },
  { name: "camera", Icon: Camera },
  { name: "image", Icon: Image },
  { name: "calendar", Icon: Calendar },
  { name: "clock", Icon: Clock },
  { name: "bell", Icon: Bell },
  { name: "check", Icon: CheckCircle },
  { name: "settings", Icon: Settings },
  { name: "wrench", Icon: Wrench },
  { name: "package", Icon: Package },
  { name: "box", Icon: Box },
  { name: "layers", Icon: Layers },
  { name: "grid", Icon: Grid },
  { name: "folder", Icon: Folder },
  { name: "tag", Icon: Tag },
  { name: "bookmark", Icon: Bookmark },
  { name: "flag", Icon: Flag },
  { name: "home", Icon: Home },
  { name: "building", Icon: Building },
  { name: "map", Icon: MapPin },
  { name: "laptop", Icon: Laptop },
];

export function CategoryModal({
  category,
  isOpen,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState("folder");
  const [customColorInput, setCustomColorInput] = useState("");

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setSelectedColor(category.color || PRESET_COLORS[0]);
      setSelectedIcon(category.icon || "folder");
      setCustomColorInput(category.color || "");
    } else {
      setCategoryName("");
      setSelectedColor(PRESET_COLORS[0]);
      setSelectedIcon("folder");
      setCustomColorInput("");
    }
  }, [category, isOpen]);

  const isValidHex = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  const handleColorInputChange = (value: string) => {
    setCustomColorInput(value);
    // Auto-update if valid hex
    if (isValidHex(value)) {
      setSelectedColor(value.toLowerCase());
    }
  };

  const handleColorInputBlur = () => {
    // Validate and apply on blur
    if (customColorInput && isValidHex(customColorInput)) {
      setSelectedColor(customColorInput.toLowerCase());
    } else if (customColorInput && !customColorInput.startsWith("#")) {
      // Try adding # prefix
      const withHash = `#${customColorInput}`;
      if (isValidHex(withHash)) {
        setCustomColorInput(withHash);
        setSelectedColor(withHash.toLowerCase());
      }
    }
  };

  const handlePresetColorClick = (color: string) => {
    setSelectedColor(color);
    setCustomColorInput(color);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onSave(categoryName.trim(), selectedColor, selectedIcon);
      setCategoryName("");
      setSelectedColor(PRESET_COLORS[0]);
      setSelectedIcon("folder");
      setCustomColorInput("");
      onClose();
    }
  };

  const SelectedIconComponent = ICON_OPTIONS.find(opt => opt.name === selectedIcon)?.Icon || Folder;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Category Name <span className="text-destructive">*</span>
            </label>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Icon & Color</label>
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-full border-2 border-muted shadow-sm flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: selectedColor }}
              >
                <SelectedIconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-2">Preset Colors</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handlePresetColorClick(color)}
                      className={cn(
                        "w-7 h-7 rounded-full transition-all",
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-primary scale-110"
                          : "hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Custom Color</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        value={customColorInput}
                        onChange={(e) => handleColorInputChange(e.target.value)}
                        onBlur={handleColorInputBlur}
                        placeholder="#3b82f6"
                        className={cn(
                          "pr-10 font-mono text-sm",
                          customColorInput && !isValidHex(customColorInput) && customColorInput.startsWith("#") && "border-destructive"
                        )}
                      />
                      <div
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded border border-border"
                        style={{ backgroundColor: isValidHex(customColorInput) ? customColorInput : selectedColor }}
                      />
                    </div>
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => {
                        setSelectedColor(e.target.value);
                        setCustomColorInput(e.target.value);
                      }}
                      className="w-10 h-10 rounded cursor-pointer border border-input"
                      title="Color picker"
                    />
                  </div>
                  {customColorInput && !isValidHex(customColorInput) && customColorInput.startsWith("#") && (
                    <p className="text-xs text-destructive">Invalid hex color format</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Icon</p>
              <div className="grid grid-cols-8 gap-1.5 max-h-40 overflow-y-auto p-1 border rounded-md">
                {ICON_OPTIONS.map(({ name, Icon }) => {
                  const IconComp = Icon;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setSelectedIcon(name)}
                      className={cn(
                        "w-9 h-9 rounded-md flex items-center justify-center transition-all",
                        selectedIcon === name
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                      title={name}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {category ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
