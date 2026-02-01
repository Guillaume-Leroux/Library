import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import type { RecentChange } from "../types";
import styles from "./HomePage.module.css";

export function HomePage() {
    const {
        data: changesData,
        isLoading: changesLoading,
        error: changesError,
    } = useFetch<RecentChange[]>(
        "https://openlibrary.org/recentchanges.json?limit=10"
    );

    const {
        data: trendingData,
        isLoading: trendingLoading,
        error: trendingError,
    } = useFetch<any>(
        "https://openlibrary.org/trending/daily.json?limit=12"
    );

    return (
        <>
            <section className={styles.hero}>
                <h1 className={styles.title}>Library</h1>
                <p className={styles.subtitle}>
                    Discover trending reads and follow the latest updates.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Popular books recently</h2>

                {trendingLoading && <p className={styles.muted}>Loading trends…</p>}
                {trendingError && (
                    <p className={styles.error}>Trends error: {trendingError}</p>
                )}

                <div className={styles.grid}>
                    {trendingData?.works.map((book: any) => (
                        <div key={book.key} className={styles.card}>
                            <div className={styles.cover}>
                                <div className={styles.coverInner}>
                                    {book.cover_i ? (
                                        <img
                                            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                                            alt={book.title}
                                            className={styles.coverImg}
                                        />
                                    ) : (
                                        <span className={styles.noCover}>No cover</span>
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

                                <div>
                                    <p className={styles.author}>
                                        {book.author_name?.[0] ?? "Unknown author"}
                                    </p>
                                    {book.first_publish_year && (
                                        <p className={styles.year}>
                                            Published in {book.first_publish_year}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h2 className={styles.panelTitle}>Latest database updates</h2>
                    </div>

                    <div className={styles.panelBody} aria-busy={changesLoading}>
                        {changesLoading && (
                            <p className={styles.muted}>Loading history…</p>
                        )}
                        {changesError && (
                            <p className={styles.error}>History error: {changesError}</p>
                        )}

                        {changesData?.map((change, index) => (
                            <div key={index} className={styles.row}>
                                <span className={styles.kind}>{change.kind}</span>
                                <span className={styles.date}>
                  {new Date(change.timestamp).toLocaleDateString()}
                </span>
                                <span className={styles.comment}>
                  {change.comment || "No details"}
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
