"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("theme") as Theme | null) : null;
    let initial: Theme = "light";
    if (stored === "light" || stored === "dark") initial = stored;
    else initial = getSystemPrefersDark() ? "dark" : "light";
    setThemeState(initial);
    applyThemeClass(initial);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    if (typeof window !== "undefined") localStorage.setItem("theme", t);
    applyThemeClass(t);
  };

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
