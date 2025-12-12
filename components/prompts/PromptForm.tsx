"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Prompt, AIModelType } from "@/types";
import { useStore } from "@/store/useStore";

interface PromptFormProps {
  prompt?: Prompt;
  isOpen: boolean;
  onClose: () => void;
}

const AI_MODELS: AIModelType[] = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Midjourney",
  "DALL-E",
  "Stable Diffusion",
  "Other",
];

export function PromptForm({ prompt, isOpen, onClose }: PromptFormProps) {
  const { categories, addPrompt, updatePrompt } = useStore();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    aiModel: "ChatGPT" as AIModelType,
    sourceUrl: "",
    notes: "",
    isFavorite: false,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: categories[0]?.name || "",
      aiModel: "ChatGPT",
      sourceUrl: "",
      notes: "",
      isFavorite: false,
    });
    setTags([]);
    setTagInput("");
  };

  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title,
        content: prompt.content,
        category: prompt.category,
        aiModel: prompt.aiModel,
        sourceUrl: prompt.sourceUrl || "",
        notes: prompt.notes || "",
        isFavorite: prompt.isFavorite,
      });
      setTags(prompt.tags);
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Title and content are required");
      return;
    }

    const promptData = {
      ...formData,
      tags,
    };

    if (prompt) {
      updatePrompt(prompt.id, promptData);
    } else {
      addPrompt(promptData);
    }

    onClose();
    resetForm();
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{prompt ? "Edit Prompt" : "Add New Prompt"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter prompt title"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Prompt Content <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Enter your prompt here..."
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Category <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                AI Model <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.aiModel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aiModel: e.target.value as AIModelType,
                  })
                }
                required
              >
                {AI_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Tags</label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add tags (press Enter)"
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pl-3 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-background rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Source URL (optional)
            </label>
            <Input
              type="url"
              value={formData.sourceUrl}
              onChange={(e) =>
                setFormData({ ...formData, sourceUrl: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Notes (optional)
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Add any additional notes..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.isFavorite}
              onChange={(e) =>
                setFormData({ ...formData, isFavorite: e.target.checked })
              }
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="favorite" className="text-sm font-medium">
              Add to favorites
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {prompt ? "Update Prompt" : "Add Prompt"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
