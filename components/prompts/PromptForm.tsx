"use client";

import { useState, useEffect } from "react";
import { X, Eye, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
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

export function PromptForm({ prompt, isOpen, onClose }: PromptFormProps) {
  const { categories, addPrompt, updatePrompt, prompts } = useStore();

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
  const [customAIModel, setCustomAIModel] = useState("");
  const [customModelError, setCustomModelError] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  // Get all unique tags from existing prompts
  const allExistingTags = Array.from(
    new Set(prompts.flatMap((p) => p.tags))
  ).sort();

  // Filter suggestions based on input
  const tagSuggestions = allExistingTags.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !tags.includes(tag) &&
      tagInput.length > 0
  );

  // Get all unique custom AI models from existing prompts
  const existingCustomModels = Array.from(
    new Set(
      prompts
        .map((p) => p.aiModel)
        .filter((model) => !AI_MODELS.includes(model as AIModelType))
    )
  ).map((model) => model.toLowerCase());

  const validateCustomModel = (value: string): string => {
    if (!value.trim()) {
      return "";
    }

    const customModelLower = value.trim().toLowerCase();

    // Check if it matches a predefined model (case-insensitive)
    const matchesPredefined = AI_MODELS.some(
      (model) => model.toLowerCase() === customModelLower
    );

    if (matchesPredefined) {
      return `"${value.trim()}" already exists in the dropdown. Please select it from the list.`;
    }

    // Check if it matches an existing custom model (case-insensitive)
    const isEditingSameModel = prompt && prompt.aiModel.toLowerCase() === customModelLower;

    if (!isEditingSameModel && existingCustomModels.includes(customModelLower)) {
      return `"${value.trim()}" has already been used. Please use a different name.`;
    }

    return "";
  };

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
    setCustomAIModel("");
    setCustomModelError("");
  };

  useEffect(() => {
    if (prompt) {
      // Check if the AI model is a custom one (not in predefined list)
      const isCustomModel = !AI_MODELS.includes(prompt.aiModel as AIModelType);

      setFormData({
        title: prompt.title,
        content: prompt.content,
        category: prompt.category,
        aiModel: isCustomModel ? "Other" : (prompt.aiModel as AIModelType),
        sourceUrl: prompt.sourceUrl || "",
        notes: prompt.notes || "",
        isFavorite: prompt.isFavorite,
      });
      setTags(prompt.tags);
      setCustomAIModel(isCustomModel ? prompt.aiModel : "");
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, isOpen]);

  const handleCustomModelChange = (value: string) => {
    setCustomAIModel(value);
    // Clear error when user starts typing
    if (customModelError) {
      setCustomModelError("");
    }
  };

  const handleCustomModelBlur = () => {
    const error = validateCustomModel(customAIModel);
    setCustomModelError(error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Title and content are required");
      return;
    }

    if (formData.aiModel === "Other") {
      if (!customAIModel.trim()) {
        setCustomModelError("Please enter a custom AI model name");
        return;
      }

      const error = validateCustomModel(customAIModel);
      if (error) {
        setCustomModelError(error);
        return;
      }
    }

    const promptData = {
      ...formData,
      aiModel: formData.aiModel === "Other" ? customAIModel.trim() : formData.aiModel,
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

  const handleAddTag = (tagToAdd?: string) => {
    const tag = (tagToAdd || tagInput).trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
      setShowTagSuggestions(false);
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium">
                Prompt Content <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formData.content.trim().split(/\s+/).filter(Boolean).length} words • {formData.content.length} characters
                </span>
                {formData.content && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                    className="h-7 text-xs"
                  >
                    {showMarkdownPreview ? (
                      <>
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        Preview
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            {showMarkdownPreview ? (
              <div className="min-h-[150px] bg-background border rounded-md p-4 text-sm prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />
                    ),
                    code: ({ node, inline, className, children, ...props }: any) => (
                      inline ? (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    ),
                  }}
                >
                  {formData.content}
                </ReactMarkdown>
              </div>
            ) : (
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Enter your prompt here..."
                className="min-h-[150px]"
                required
              />
            )}
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
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    aiModel: e.target.value as AIModelType,
                  });
                  if (e.target.value !== "Other") {
                    setCustomAIModel("");
                    setCustomModelError("");
                  }
                }}
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

          {formData.aiModel === "Other" && (
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Custom AI Model Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={customAIModel}
                onChange={(e) => handleCustomModelChange(e.target.value)}
                onBlur={handleCustomModelBlur}
                placeholder="Enter AI model name (e.g., GPT-5, Claude Opus)"
                className={customModelError ? "border-destructive" : ""}
                required
              />
              {customModelError && (
                <p className="text-xs text-destructive mt-1.5">
                  {customModelError}
                </p>
              )}
              {!customModelError && existingCustomModels.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  Previously used custom models: {prompts
                    .map((p) => p.aiModel)
                    .filter((model) => !AI_MODELS.includes(model as AIModelType))
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .join(", ")}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1.5 block">Tags</label>
            <div className="relative">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  onFocus={() => setShowTagSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                  placeholder="Add tags (press Enter)"
                />
                <Button type="button" onClick={() => handleAddTag()} variant="outline">
                  Add
                </Button>
              </div>
              {showTagSuggestions && tagSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {tagSuggestions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
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
