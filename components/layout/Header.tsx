"use client";

import { Plus, Download, Upload, Moon, Sun, Grid3x3, List, Sparkles, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useTheme } from "next-themes";
import { useAuth } from "@/components/providers/AuthProvider";
import { exportData, exportPromptsToCSV } from "@/lib/storage";
import { downloadFile } from "@/lib/utils";
import { signOut } from "@/lib/supabase/auth";
import Image from "next/image";

interface HeaderProps {
  onAddPrompt: () => void;
  onImport: () => void;
  onLoadSamples?: () => void;
  onSignInClick: () => void;
}

export function Header({ onAddPrompt, onImport, onLoadSamples, onSignInClick }: HeaderProps) {
  const { settings, setViewMode, prompts } = useStore();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
    // Optionally reload to clear local state
    window.location.reload();
  };

  // Determine logo based on theme
  const logoSrc = theme === "dark" ? "/Curata_logomark_white.png" : "/logo.png";

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-4">
            <Image
              src={logoSrc}
              alt="Curata Logo"
              width={160}
              height={160}
              className="h-auto"
              style={{ width: '160px', height: 'auto' }}
            />
            <p className="text-sm text-muted-foreground">
              Never rewrite the perfect prompt.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.email}</span>
              </div>
            )}

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

            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onSignInClick}
                title="Sign in to sync across devices"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}

            <div className="h-6 w-px bg-border" />

            {prompts.length === 0 && onLoadSamples && (
              <Button variant="default" size="sm" onClick={onLoadSamples}>
                <Sparkles className="h-4 w-4 mr-2" />
                Load Samples
              </Button>
            )}

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
