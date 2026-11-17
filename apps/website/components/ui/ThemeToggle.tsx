"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur hover:bg-white dark:hover:bg-black/60 transition-colors shadow-sm"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-600" />
      )}
    </button>
  );
}
