"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROMPT_TEMPLATES, type PromptTemplate } from "@/lib/templates";
import { useStore } from "@/store/useStore";
import { generateId } from "@/lib/utils";

interface TemplatesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatesDialog({ isOpen, onClose }: TemplatesDialogProps) {
  const { addPrompt } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(PROMPT_TEMPLATES.map((t) => t.category)))];

  const filteredTemplates =
    selectedCategory === "All"
      ? PROMPT_TEMPLATES
      : PROMPT_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = (template: PromptTemplate) => {
    addPrompt({
      ...template,
      isFavorite: false,
      isTemplate: true,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Prompt Templates
          </DialogTitle>
          <DialogDescription>
            Choose from pre-built templates to get started quickly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleUseTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-start justify-between">
                    <span>{template.title}</span>
                    <Badge variant="outline" className="ml-2">
                      {template.aiModel}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {template.content}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                    {template.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  {template.notes && (
                    <p className="text-xs text-muted-foreground italic">
                      {template.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
