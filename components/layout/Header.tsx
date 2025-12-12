"use client";

import { Plus, Download, Upload, Moon, Sun, Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useTheme } from "next-themes";
import { exportData, exportPromptsToCSV } from "@/lib/storage";
import { downloadFile } from "@/lib/utils";

interface HeaderProps {
  onAddPrompt: () => void;
  onImport: () => void;
}

export function Header({ onAddPrompt, onImport }: HeaderProps) {
  const { settings, setViewMode, prompts } = useStore();
  const { theme, setTheme } = useTheme();

  const handleExportJSON = () => {
    const data = exportData();
    downloadFile(
      data,
      `prompt-library-${new Date().toISOString().split("T")[0]}.json`,
      "application/json"
    );
  };

  const handleExportCSV = () => {
    const csv = exportPromptsToCSV(prompts);
    downloadFile(
      csv,
      `prompts-${new Date().toISOString().split("T")[0]}.csv`,
      "text/csv"
    );
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleView = () => {
    setViewMode(settings.viewMode === "grid" ? "list" : "grid");
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Prompt Library</h1>
            <p className="text-sm text-muted-foreground">
              Organize and manage your AI prompts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleView}
              title={`Switch to ${settings.viewMode === "grid" ? "list" : "grid"} view`}
            >
              {settings.viewMode === "grid" ? (
                <List className="h-5 w-5" />
              ) : (
                <Grid3x3 className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <div className="h-6 w-px bg-border" />

            <Button variant="outline" size="sm" onClick={onImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              title="Export all data as JSON"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button onClick={onAddPrompt} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Prompt
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
