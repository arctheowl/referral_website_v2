"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="p-2 rounded-md text-fg-muted hover:text-fg transition-colors duration-150"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
