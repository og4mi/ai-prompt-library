"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { FilterSidebar } from "@/components/layout/FilterSidebar";
import { SearchBar } from "@/components/layout/SearchBar";
import { PromptCard } from "@/components/prompts/PromptCard";
import { PromptForm } from "@/components/prompts/PromptForm";
import { PromptDetail } from "@/components/prompts/PromptDetail";
import { ImportDialog } from "@/components/layout/ImportDialog";
import { TemplatesDialog } from "@/components/prompts/TemplatesDialog";
import { useStore } from "@/store/useStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import type { Prompt } from "@/types";
import { Loader2, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { importData } from "@/lib/storage";

export default function HomePage() {
  const {
    isLoading,
    initializeStore,
    getFilteredPrompts,
    settings,
    selectedPrompt,
    setSelectedPrompt,
  } = useStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "k",
      ctrl: true,
      callback: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      },
    },
    {
      key: "n",
      ctrl: true,
      callback: () => handleAddPrompt(),
    },
    {
      key: "t",
      ctrl: true,
      callback: () => setIsTemplatesOpen(true),
    },
    {
      key: "Escape",
      callback: () => {
        if (isFormOpen) setIsFormOpen(false);
        if (isImportOpen) setIsImportOpen(false);
        if (isTemplatesOpen) setIsTemplatesOpen(false);
        if (selectedPrompt) setSelectedPrompt(null);
      },
    },
  ]);

  const filteredPrompts = getFilteredPrompts();

  const handleAddPrompt = () => {
    setEditingPrompt(undefined);
    setIsFormOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPrompt(undefined);
  };

  const handleCloseDetail = () => {
    setSelectedPrompt(null);
  };

  const handleLoadSamples = async () => {
    const response = await fetch("/sample-data.json");
    const data = await response.json();
    importData(JSON.stringify(data));
    initializeStore();
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header
        onAddPrompt={handleAddPrompt}
        onImport={() => setIsImportOpen(true)}
        onLoadSamples={handleLoadSamples}
      />

      <div className="flex-1 flex overflow-hidden">
        <FilterSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6 flex items-center gap-3">
              <SearchBar />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTemplatesOpen(true)}
                className="flex-shrink-0"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </div>

            {filteredPrompts.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  No prompts found. Get started by adding a prompt or using a template!
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleAddPrompt}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prompt
                  </Button>
                  <Button variant="outline" onClick={() => setIsTemplatesOpen(true)}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Browse Templates
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={
                  settings.viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-3"
                }
              >
                {filteredPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    viewMode={settings.viewMode}
                    onEdit={handleEditPrompt}
                  />
                ))}
              </div>
            )}

            {filteredPrompts.length > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Showing {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </main>
      </div>

      <PromptForm
        prompt={editingPrompt}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />

      <PromptDetail
        prompt={selectedPrompt}
        onClose={handleCloseDetail}
        onEdit={handleEditPrompt}
      />

      <ImportDialog isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />

      <TemplatesDialog
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
      />

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur px-3 py-2 rounded-lg border hidden md:block">
        <div className="space-y-1">
          <div><kbd className="px-1.5 py-0.5 rounded bg-muted">Ctrl+K</kbd> Search</div>
          <div><kbd className="px-1.5 py-0.5 rounded bg-muted">Ctrl+N</kbd> New Prompt</div>
          <div><kbd className="px-1.5 py-0.5 rounded bg-muted">Ctrl+T</kbd> Templates</div>
          <div><kbd className="px-1.5 py-0.5 rounded bg-muted">Esc</kbd> Close</div>
        </div>
      </div>
    </div>
  );
}
