const STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export function getInitialTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored) return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.classList.toggle("theme-dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
}
