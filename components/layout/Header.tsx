"use client";

import { useState } from "react";
import { Plus, Download, Upload, Moon, Sun, Grid3x3, List, Sparkles, LogIn, LogOut, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import { useTheme } from "next-themes";
import { useAuth } from "@/components/providers/AuthProvider";
import { exportData, exportPromptsToCSV } from "@/lib/storage";
import { downloadFile } from "@/lib/utils";
import { signOut } from "@/lib/supabase/auth";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  onAddPrompt: () => void;
  onImport: () => void;
  onSignInClick: () => void;
}

export function Header({ onAddPrompt, onImport, onSignInClick }: HeaderProps) {
  const { settings, setViewMode, prompts } = useStore();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div className="w-full px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-4">
            <Image
              src={logoSrc}
              alt="Curata Logo"
              width={120}
              height={120}
              className="h-auto w-20 md:w-32 lg:w-40"
            />
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
              Never rewrite the perfect prompt.
            </p>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
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

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <Button onClick={onAddPrompt} size="sm">
              <Plus className="h-4 w-4" />
            </Button>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {user && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pb-4 border-b">
                      <User className="h-4 w-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm">View Mode</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toggleView();
                        setIsMenuOpen(false);
                      }}
                    >
                      {settings.viewMode === "grid" ? (
                        <>
                          <List className="h-4 w-4 mr-2" />
                          List
                        </>
                      ) : (
                        <>
                          <Grid3x3 className="h-4 w-4 mr-2" />
                          Grid
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Theme</span>
                    <Button variant="outline" size="sm" onClick={toggleTheme}>
                      {theme === "dark" ? (
                        <>
                          <Sun className="h-4 w-4 mr-2" />
                          Light
                        </>
                      ) : (
                        <>
                          <Moon className="h-4 w-4 mr-2" />
                          Dark
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="h-px bg-border my-2" />

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      onImport();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      handleExportJSON();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>

                  <div className="h-px bg-border my-2" />

                  {user ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        onSignInClick();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
