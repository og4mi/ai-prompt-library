"use client";

import { useState } from "react";
import {
  Star,
  Copy,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  X,
  Calendar,
  Tag,
  Cpu,
  Files,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Prompt } from "@/types";
import { useStore } from "@/store/useStore";
import { formatDate, copyToClipboard } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PromptDetailProps {
  prompt: Prompt | null;
  onClose: () => void;
  onEdit: (prompt: Prompt) => void;
}

export function PromptDetail({ prompt, onClose, onEdit }: PromptDetailProps) {
  const [copied, setCopied] = useState(false);
  const { toggleFavorite, deletePrompt, incrementUsage, addPrompt } = useStore();

  if (!prompt) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(prompt.content);
    if (success) {
      setCopied(true);
      incrementUsage(prompt.id);
      toast.success("Copied to clipboard!", {
        description: prompt.title,
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy", {
        description: "Please try again",
      });
    }
  };

  const handleFavorite = () => {
    toggleFavorite(prompt.id);
  };

  const handleEdit = () => {
    onEdit(prompt);
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      deletePrompt(prompt.id);
      onClose();
    }
  };

  const handleDuplicate = () => {
    addPrompt({
      title: `${prompt.title} (Copy)`,
      content: prompt.content,
      category: prompt.category,
      aiModel: prompt.aiModel,
      tags: [...prompt.tags],
      sourceUrl: prompt.sourceUrl,
      notes: prompt.notes,
      isFavorite: false,
    });
    toast.success("Prompt duplicated!", {
      description: `${prompt.title} (Copy)`,
    });
    onClose();
  };

  return (
    <Dialog open={!!prompt} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{prompt.title}</DialogTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{prompt.category}</Badge>
                <Badge variant="secondary">{prompt.aiModel}</Badge>
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
                title={prompt.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star
                  className={cn(
                    "h-5 w-5",
                    prompt.isFavorite && "fill-yellow-400 text-yellow-400"
                  )}
                />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <h4 className="font-semibold">Prompt Content</h4>
                <span className="text-xs text-muted-foreground">
                  {prompt.content.trim().split(/\s+/).filter(Boolean).length} words • {prompt.content.length} characters
                </span>
              </div>
              <Button
                variant={copied ? "default" : "outline"}
                size="sm"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
            <div className="bg-muted/50 rounded-md p-4 whitespace-pre-wrap text-sm">
              {prompt.content}
            </div>
          </div>

          {prompt.notes && (
            <div>
              <h4 className="font-semibold mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {prompt.notes}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Date Added</span>
              </div>
              <p className="text-sm">{formatDate(prompt.dateAdded)}</p>
            </div>

            {prompt.sourceUrl && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <ExternalLink className="h-4 w-4" />
                  <span className="font-medium">Source</span>
                </div>
                <a
                  href={prompt.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View Source
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Cpu className="h-4 w-4" />
                <span className="font-medium">Usage Count</span>
              </div>
              <p className="text-sm">{prompt.usageCount} times</p>
            </div>

            {prompt.lastUsed && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Last Used</span>
                </div>
                <p className="text-sm">{formatDate(prompt.lastUsed)}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-4 border-t">
            <Button onClick={handleEdit} variant="default">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handleDuplicate} variant="outline">
              <Files className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button onClick={onClose} variant="outline" className="ml-auto">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
