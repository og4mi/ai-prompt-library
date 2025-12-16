import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Exception: Allow Escape key even in inputs
        if (event.key !== "Escape") {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const ctrlOrCmd = event.ctrlKey || event.metaKey;

        // Check if key matches
        if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
          continue;
        }

        // Check if modifier keys match
        const needsCtrlOrCmd = shortcut.ctrlKey || shortcut.metaKey;
        const hasCtrlOrCmd = ctrlOrCmd;
        const needsShift = shortcut.shiftKey === true;
        const hasShift = event.shiftKey;

        // If shortcut needs Ctrl/Cmd but event doesn't have it, skip
        if (needsCtrlOrCmd && !hasCtrlOrCmd) {
          continue;
        }

        // If shortcut doesn't need Ctrl/Cmd but event has it, skip
        if (!needsCtrlOrCmd && hasCtrlOrCmd) {
          continue;
        }

        // If shortcut needs Shift but event doesn't have it, skip
        if (needsShift && !hasShift) {
          continue;
        }

        // If shortcut doesn't need Shift but event has it, skip
        if (!needsShift && hasShift) {
          continue;
        }

        // Match found!
        event.preventDefault();
        shortcut.action();
        break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export const getShortcutDisplay = (shortcut: KeyboardShortcut): string => {
  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const parts: string[] = [];

  if (shortcut.ctrlKey || shortcut.metaKey) {
    parts.push(isMac ? "⌘" : "Ctrl");
  }
  if (shortcut.shiftKey) {
    parts.push("Shift");
  }
  parts.push(shortcut.key.toUpperCase());

  return parts.join("+");
};
