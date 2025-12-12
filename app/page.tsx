"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { FilterSidebar } from "@/components/layout/FilterSidebar";
import { SearchBar } from "@/components/layout/SearchBar";
import { PromptCard } from "@/components/prompts/PromptCard";
import { PromptForm } from "@/components/prompts/PromptForm";
import { PromptDetail } from "@/components/prompts/PromptDetail";
import { ImportDialog } from "@/components/layout/ImportDialog";
import { useStore } from "@/store/useStore";
import type { Prompt } from "@/types";
import { Loader2 } from "lucide-react";

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
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header onAddPrompt={handleAddPrompt} onImport={() => setIsImportOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        <FilterSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <SearchBar />
            </div>

            {filteredPrompts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No prompts found. Add your first prompt to get started!
                </p>
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
    </div>
  );
}
