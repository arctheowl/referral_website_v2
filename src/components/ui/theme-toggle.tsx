"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative p-2 rounded-md text-fg-muted hover:text-fg hover:bg-brand/[0.06] active:scale-90 transition-all duration-150"
    >
      {/*
        key forces a re-mount on every toggle, restarting the entry animation.
        Sun spins in clockwise (+45°), moon counter-clockwise (−45°) — opposite
        directions give a sense of which way the day is turning.
      */}
      <span
        key={theme}
        className={`block ${theme === "dark" ? "sun-appear" : "moon-appear"}`}
        aria-hidden="true"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </span>
    </button>
  );
}
