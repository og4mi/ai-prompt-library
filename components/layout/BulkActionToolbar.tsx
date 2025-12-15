"use client";

import { Trash2, X, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function BulkActionToolbar() {
  const {
    selectedPromptIds,
    clearSelection,
    bulkDeletePrompts,
    selectAllPrompts,
    getFilteredPrompts,
  } = useStore();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const selectedCount = selectedPromptIds.size;
  const filteredCount = getFilteredPrompts().length;

  const handleSelectAll = () => {
    selectAllPrompts();
  };

  const handleDelete = async () => {
    const ids = Array.from(selectedPromptIds);
    await bulkDeletePrompts(ids);
    setShowDeleteDialog(false);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-lg shadow-lg px-3 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-4 z-50 animate-fade-in max-w-[95vw]">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="font-medium text-xs sm:text-base">
            {selectedCount} {selectedCount === 1 ? "prompt" : "prompts"}
          </span>
        </div>

        <div className="h-5 sm:h-6 w-px bg-primary-foreground/20" />

        <div className="flex items-center gap-1.5 sm:gap-2">
          {selectedCount < filteredCount && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSelectAll}
              className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Select All ({filteredCount})</span>
              <span className="sm:hidden">All</span>
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={clearSelection}
            className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Cancel</span>
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} prompts?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {selectedCount} {selectedCount === 1 ? "prompt" : "prompts"} from
              your library and from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
