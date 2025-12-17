"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { FilterSidebar } from "@/components/layout/FilterSidebar";
import { SearchBar } from "@/components/layout/SearchBar";
import { BulkActionToolbar } from "@/components/layout/BulkActionToolbar";
import { PromptCard } from "@/components/prompts/PromptCard";
import { PromptForm } from "@/components/prompts/PromptForm";
import { PromptDetail } from "@/components/prompts/PromptDetail";
import { ImportDialog } from "@/components/layout/ImportDialog";
import { TemplatesDialog } from "@/components/prompts/TemplatesDialog";
import { AuthModal } from "@/components/auth/AuthModal";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/components/providers/AuthProvider";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import type { Prompt } from "@/types";
import { Loader2, Sparkles, Plus, CheckSquare } from "lucide-react";
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
    setCurrentUserId,
    syncWithSupabase,
    isBulkMode,
    toggleBulkMode,
  } = useStore();

  const { user } = useAuth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Sync with Supabase when user logs in
  useEffect(() => {
    if (user) {
      setCurrentUserId(user.id);
      syncWithSupabase(user.id);
    } else {
      setCurrentUserId(null);
    }
  }, [user, setCurrentUserId, syncWithSupabase]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "k",
      ctrlKey: true,
      metaKey: true,
      action: () => {
        const searchInput = document.querySelector('input[placeholder="Search prompts..."]') as HTMLInputElement;
        searchInput?.focus();
      },
      description: "Focus search",
    },
    {
      key: "p",
      ctrlKey: true,
      metaKey: true,
      action: () => handleAddPrompt(),
      description: "New prompt",
    },
    {
      key: "b",
      ctrlKey: true,
      metaKey: true,
      action: () => setIsTemplatesOpen(true),
      description: "Browse templates",
    },
    {
      key: "Escape",
      action: () => {
        if (isFormOpen) setIsFormOpen(false);
        else if (isImportOpen) setIsImportOpen(false);
        else if (isTemplatesOpen) setIsTemplatesOpen(false);
        else if (selectedPrompt) setSelectedPrompt(null);
      },
      description: "Close modal",
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
        onSignInClick={() => setIsAuthModalOpen(true)}
        onBrowseTemplates={() => setIsTemplatesOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        <FilterSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
              <SearchBar />
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTemplatesOpen(true)}
                  className="flex-1 sm:flex-none h-9"
                >
                  <Sparkles className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Templates</span>
                </Button>
                <Button
                  variant={isBulkMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleBulkMode}
                  className="flex-1 sm:flex-none h-9"
                >
                  <CheckSquare className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{isBulkMode ? "Exit Bulk Mode" : "Bulk Select"}</span>
                  <span className="sm:hidden">{isBulkMode ? "Exit" : "Bulk"}</span>
                </Button>
              </div>
            </div>

            {filteredPrompts.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  No prompts found. Get started by adding a prompt or using a template!
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button onClick={handleAddPrompt} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prompt
                  </Button>
                  <Button variant="outline" onClick={() => setIsTemplatesOpen(true)} className="w-full sm:w-auto">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Browse Templates
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={
                  settings.viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                    : "space-y-2 sm:space-y-3"
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
              <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground pb-20 sm:pb-6">
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

      <AuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        onSuccess={() => {
          // Reload to trigger sync
          window.location.reload();
        }}
      />

      <BulkActionToolbar />

      {/* Keyboard shortcuts hint - only on desktop */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur px-3 py-2 rounded-lg border hidden lg:block">
        <div className="space-y-1">
          <div><kbd className="px-1.5 py-0.5 rounded bg-muted">⌘K</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-muted">Ctrl+K</kbd> Search</div>
          <div><kbd className="px-1.5 py-0.5 rounded bg-muted">⌘P</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-muted">Ctrl+P</kbd> New Prompt</div>
          <div><kbd className="px-1.5 py-0.5 rounded bg-muted">⌘B</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-muted">Ctrl+B</kbd> Templates</div>
          <div><kbd className="px-1.5 py-0.5 rounded bg-muted">Esc</kbd> Close</div>
        </div>
      </div>
    </div>
  );
}
