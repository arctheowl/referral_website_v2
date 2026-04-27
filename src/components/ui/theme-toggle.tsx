"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  /*
    toggle-sun / toggle-moon handle all color + hover states.
    They sit outside @layer in globals.css and therefore override Tailwind
    utilities — no specificity tricks needed.
    Sun = warm amber (oklch 78% 0.17 72).
    Moon = cool indigo (oklch 54% 0.20 265).
  */
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative p-2 rounded-md active:scale-90 transition-all duration-150 ${
        theme === "dark" ? "toggle-sun" : "toggle-moon"
      }`}
    >
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
