"use client";

import { useState } from "react";
import { Star, Copy, Edit, Trash2, ExternalLink, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Prompt } from "@/types";
import { useStore } from "@/store/useStore";
import { formatDate, truncateText, copyToClipboard } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  prompt: Prompt;
  viewMode: "grid" | "list";
  onEdit: (prompt: Prompt) => void;
}

export function PromptCard({ prompt, viewMode, onEdit }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const {
    toggleFavorite,
    deletePrompt,
    incrementUsage,
    setSelectedPrompt,
    isBulkMode,
    selectedPromptIds,
    togglePromptSelection
  } = useStore();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(prompt.content);
    if (success) {
      setCopied(true);
      incrementUsage(prompt.id);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(prompt.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(prompt);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this prompt?")) {
      deletePrompt(prompt.id);
    }
  };

  const handleCardClick = () => {
    if (isBulkMode) {
      togglePromptSelection(prompt.id);
    } else {
      setSelectedPrompt(prompt);
    }
  };

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePromptSelection(prompt.id);
  };

  const isSelected = selectedPromptIds.has(prompt.id);

  if (viewMode === "list") {
    return (
      <Card
        className={cn(
          "hover:shadow-md transition-shadow cursor-pointer animate-fade-in",
          isSelected && "ring-2 ring-primary"
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            {isBulkMode && (
              <div className="flex items-center pt-1" onClick={handleCheckboxChange}>
                <Checkbox checked={isSelected} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-base sm:text-lg truncate">{prompt.title}</h3>
                {prompt.isFavorite && (
                  <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                {prompt.content}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Badge variant="outline" className="text-xs">{prompt.category}</Badge>
                <Badge variant="secondary" className="text-xs">{prompt.aiModel}</Badge>
                {prompt.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="default" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {prompt.tags.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{prompt.tags.length - 2} more
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-auto hidden sm:inline">
                  {formatDate(prompt.dateAdded)}
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
                title={prompt.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    prompt.isFavorite && "fill-yellow-400 text-yellow-400"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                title="Edit prompt"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                title="Delete prompt"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            {/* Mobile: Show only copy button, other actions available in detail view */}
            <div className="flex sm:hidden items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "h-full hover:shadow-md transition-shadow cursor-pointer animate-fade-in flex flex-col",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
        {isBulkMode && (
          <div className="flex justify-end mb-2" onClick={handleCheckboxChange}>
            <Checkbox checked={isSelected} />
          </div>
        )}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2 flex-1">{prompt.title}</h3>
          {prompt.isFavorite && (
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-3 flex-1">
          {prompt.content}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="text-xs">{prompt.category}</Badge>
          <Badge variant="secondary" className="text-xs">{prompt.aiModel}</Badge>
          {prompt.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {prompt.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{prompt.tags.length - 2}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-xs text-muted-foreground">
            {formatDate(prompt.dateAdded)}
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={handleEdit}
              title="Edit prompt"
            >
              <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8"
              onClick={handleDelete}
              title="Delete prompt"
            >
              <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
