import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Layout.module.css";
import { applyTheme, getInitialTheme, type Theme } from "../theme";

export function Layout() {
    const [quickQuery, setQuickQuery] = useState("");
    const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
    const navigate = useNavigate();

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const handleQuickSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickQuery.trim()) return;
        navigate(`/search?q=${encodeURIComponent(quickQuery)}`);
    };

    const toggleTheme = () => {
        setTheme((t) => (t === "dark" ? "light" : "dark"));
    };

    return (
        <div>
            <header className={styles.header}>
                <nav className={styles.nav} aria-label="Main navigation">
                    <div className={styles.left}>
                        <Link to="/" className={styles.brand}>
                            Library
                        </Link>
                        <Link to="/" className={styles.link}>
                            Home
                        </Link>
                        <Link to="/search" className={styles.link}>
                            Advanced search
                        </Link>
                    </div>

                    <div className={styles.right}>
                        <form
                            className={styles.search}
                            onSubmit={handleQuickSearch}
                            role="search"
                        >
                            <input
                                type="search"
                                placeholder="Quick search…"
                                value={quickQuery}
                                onChange={(e) => setQuickQuery(e.target.value)}
                                className={styles.input}
                                aria-label="Quick search"
                            />
                            <button type="submit" className={styles.button}>
                                OK
                            </button>
                        </form>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={styles.themeToggle}
                            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                            title="Toggle dark mode"
                        >
                            {theme === "dark" ? "☀️" : "🌙"}
                        </button>
                    </div>
                </nav>
            </header>

            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}
