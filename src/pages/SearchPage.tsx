import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import type { SearchResult } from "../types";
import styles from "./SearchPage.module.css";

const clean = (str: string) => str.replace(/"/g, "").trim();

export function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const q = searchParams.get("q") || "";
    const title = searchParams.get("title") || "";
    const author = searchParams.get("author") || "";
    const subject = searchParams.get("subject") || "";
    const publishYear = searchParams.get("first_publish_year") || "";

    const [localTitle, setLocalTitle] = useState(title);
    const [localAuthor, setLocalAuthor] = useState(author);
    const [localSubject, setLocalSubject] = useState(subject);
    const [localYear, setLocalYear] = useState(publishYear);

    let apiUrl: string | null = null;

    const clauses: string[] = [];

// quick search
    if (q) clauses.push(q);

// advanced fields (Solr field queries)
    if (title) clauses.push(`title:"${clean(title)}"`);
    if (author) clauses.push(`author:"${clean(author)}"`);
    if (subject) clauses.push(`subject:"${clean(subject)}"`);

// year filter (exact year)
    if (publishYear) {
        const y = clean(publishYear);
        clauses.push(`first_publish_year:[${y} TO ${y}]`);
    }

    if (clauses.length > 0) {
        const apiParams = new URLSearchParams();
        apiParams.set("q", clauses.join(" AND "));
        apiParams.set("limit", "20");
        apiUrl = `https://openlibrary.org/search.json?${apiParams.toString()}`;
    }


    const { data, isLoading, error } = useFetch<SearchResult>(apiUrl);

    const filteredBooks =
        data?.docs.filter((book) => {
            if (author) {
                const searchStr = clean(author).toLowerCase();
                const hasAuthor = book.author_name?.some((a) =>
                    a.toLowerCase().includes(searchStr)
                );
                if (!hasAuthor) return false;
            }
            if (title) {
                const searchStr = clean(title).toLowerCase();
                if (!book.title.toLowerCase().includes(searchStr)) return false;
            }
            return true;
        }) || [];

    const handleReset = () => {
        setSearchParams({});
        setLocalTitle("");
        setLocalAuthor("");
        setLocalSubject("");
        setLocalYear("");
    };

    useEffect(() => {
        if (q) {
            setLocalTitle("");
            setLocalAuthor("");
            setLocalSubject("");
            setLocalYear("");
        }
    }, [q]);

    const handleAdvancedSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (localTitle) params.title = localTitle;
        if (localAuthor) params.author = localAuthor;
        if (localSubject) params.subject = localSubject;
        if (localYear) params.first_publish_year = localYear;

        setSearchParams(params);
    };

    return (
        <div>
            <h2 className={styles.heroTitle}>Search results</h2>

            <section className={`${styles.section} ${styles.panel}`}>
                <div className={styles.panelHeader}>
                    <h3 className={styles.panelTitle}>Advanced filter</h3>
                    <p className={styles.panelHint}>Tip: use title + author for best results</p>
                </div>

                <form onSubmit={handleAdvancedSearch} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Title</label>
                        <input
                            value={localTitle}
                            onChange={(e) => setLocalTitle(e.target.value)}
                            placeholder="Ex: The Hobbit"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Author</label>
                        <input
                            value={localAuthor}
                            onChange={(e) => setLocalAuthor(e.target.value)}
                            placeholder="Ex: Tolkien"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Subject / Theme</label>
                        <input
                            value={localSubject}
                            onChange={(e) => setLocalSubject(e.target.value)}
                            placeholder="Ex: Fantasy, Magic"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Year of publication</label>
                        <input
                            type="number"
                            value={localYear}
                            onChange={(e) => setLocalYear(e.target.value)}
                            placeholder="Ex: 1937"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" className={styles.button}>
                            Apply filter
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className={styles.buttonSecondary}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </section>

            {isLoading && <p className={`${styles.center} ${styles.muted}`}>Loading books…</p>}

            {error && <div className={styles.error}>Error during search: {error}</div>}

            {!isLoading && data && filteredBooks.length === 0 && (
                <p className={styles.muted}>No book found.</p>
            )}

            <div className={styles.grid}>
                {filteredBooks.map((book) => (
                    <div key={book.key} className={styles.card}>
                        <div className={styles.cover}>
                            <div className={styles.coverInner}>
                                {book.cover_i ? (
                                    <img
                                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                                        alt={book.title}
                                        className={styles.coverImg}
                                        loading="lazy"
                                    />
                                ) : (
                                    <span className={styles.noImage}>No image</span>
                                )}
                            </div>
                        </div>

                        <div className={styles.cardBody}>
                            <Link
                                to={`/book/${book.key.split("/").pop()}`}
                                className={styles.bookLink}
                            >
                                {book.title}
                            </Link>

                            <p className={styles.author}>
                                {book.author_name ? book.author_name[0] : "Unknown author"}
                            </p>

                            <p className={styles.year}>
                                {book.first_publish_year ? `Published in ${book.first_publish_year}` : ""}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
