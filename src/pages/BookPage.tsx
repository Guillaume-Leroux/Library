import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import styles from "./BookPage.module.css";

function isWikiNotFound(wikiData: any) {
    return (
        wikiData?.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found"
    );
}

export function BookPage() {
    const { id } = useParams();

    const bookUrl = id ? `https://openlibrary.org/works/${id}.json` : null;
    const { data: book, isLoading, error } = useFetch<any>(bookUrl);

    const wikiUrl =
        book?.title ? `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(book.title)}` : null;

    const { data: wikiData } = useFetch<any>(wikiUrl);

    if (isLoading) {
        return <p className={`${styles.center} ${styles.muted}`}>Loading…</p>;
    }
    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }
    if (!book) return null;

    const openLibraryDescription =
        typeof book.description === "string"
            ? book.description
            : book.description?.value || "No description available.";

    const showWiki = wikiData && !isWikiNotFound(wikiData);

    return (
        <div className={styles.page}>
            <header>
                <h1 className={styles.title}>{book.title}</h1>
            </header>

            {showWiki && (
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>On Wikipedia</h2>
                        <span className={styles.badge}>External source</span>
                    </div>

                    <div className={styles.wikiMedia}>
                        {wikiData.thumbnail?.source && (
                            <img
                                className={styles.thumb}
                                src={wikiData.thumbnail.source}
                                alt={`Cover for ${book.title} (Wikipedia)`}
                                loading="lazy"
                            />
                        )}

                        <div>
                            <p className={styles.wikiText}>{wikiData.extract}</p>

                            {wikiData.content_urls?.desktop?.page && (
                                <a
                                    className={styles.link}
                                    href={wikiData.content_urls.desktop.page}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    See the full article on Wikipedia →
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
