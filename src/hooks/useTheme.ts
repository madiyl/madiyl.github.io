import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme | null {
  const value = localStorage.getItem("theme");
  if (value === "light" || value === "dark") return value;
  return null;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme() ?? getSystemTheme());

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return {
    theme,
    isDark: theme === "dark",
    setTheme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };
}
