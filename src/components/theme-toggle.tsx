"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const saved = localStorage.getItem("theme");
    const dark = saved ? saved === "dark" : prefersDark;
    root.classList.toggle("dark", dark);
    setIsDark(dark);
  }, []);

  if (!mounted) return null;

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="fixed right-5 bottom-5 z-40 rounded-md border border-white/10 px-3 py-2 text-sm text-neutral-200 hover:text-white hover:bg-white/5 transition-colors"
    >
      {isDark ? "☾" : "☀"}
    </button>
  );
}


