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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-lg shadow-lg px-6 py-3 flex items-center gap-4 z-50 animate-fade-in">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          <span className="font-medium">
            {selectedCount} {selectedCount === 1 ? "prompt" : "prompts"} selected
          </span>
        </div>

        <div className="h-6 w-px bg-primary-foreground/20" />

        <div className="flex items-center gap-2">
          {selectedCount < filteredCount && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSelectAll}
            >
              Select All ({filteredCount})
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={clearSelection}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
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
