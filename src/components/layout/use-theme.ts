import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getIsDark() {
  return document.documentElement.classList.contains("dark");
}

/** The initial theme is applied before first paint by the inline script in index.html. */
export function useTheme() {
  const isDark = useSyncExternalStore(subscribe, getIsDark);

  const toggleTheme = useCallback(() => {
    const nextIsDark = !getIsDark();
    try {
      localStorage.theme = nextIsDark ? "dark" : "light";
    } catch {
      // Storage can be unavailable (private mode); the switch still applies to this session.
    }
    document.documentElement.classList.toggle("dark", nextIsDark);
    document
      .getElementById("meta-theme-color")
      ?.setAttribute("content", nextIsDark ? "#262626" : "#ffffff");
    listeners.forEach((listener) => listener());
  }, []);

  return { isDark, toggleTheme };
}
