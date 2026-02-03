import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import type { RecentChange } from "../types";
import styles from "./HomePage.module.css";
import { getOpenLibraryCoverFromTrending, useWikiSummary, getWikiThumbnail } from "../data/bookInfo";

type TrendingResult = {
    works: Array<{
        key: string;
        title: string;
        cover_i?: number;
        author_name?: string[];
        first_publish_year?: number;
    }>;
};

function TrendingCard({ book }: { book: TrendingResult["works"][number] }) {
    const olCover = getOpenLibraryCoverFromTrending(book);
    const { data: wiki } = useWikiSummary(olCover ? null : book.title); // only if no OL cover
    const fallbackCover = getWikiThumbnail(wiki);
    const coverUrl = olCover ?? fallbackCover;

    return (
        <div className={styles.card}>
            <div className={styles.cover}>
                <div className={styles.coverInner}>
                    {coverUrl ? (
                        <img
                            src={coverUrl}
                            alt={book.title}
                            className={styles.coverImg}
                            loading="lazy"
                        />
                    ) : (
                        <span className={styles.noCover}>No cover</span>
                    )}
                </div>
            </div>

            <div className={styles.cardBody}>
                <Link to={`/book/${book.key.split("/").pop()}`} className={styles.bookLink}>
                    {book.title}
                </Link>

                <div className={styles.meta}>
                    <p className={styles.author}>{book.author_name?.[0] ?? "Unknown author"}</p>
                    {book.first_publish_year && (
                        <p className={styles.year}>Published in {book.first_publish_year}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

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
    } = useFetch<TrendingResult>(
        "https://openlibrary.org/trending/daily.json?limit=12"
    );


    return (
        <>
            <section className={styles.hero}>
                <h1 className={styles.title}>React Library</h1>
                <p className={styles.subtitle}>
                    Discover trending reads and follow the latest updates.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Popular books recently</h2>

                {trendingLoading && <p className={styles.muted}>Loading trends…</p>}
                {trendingError && <p className={styles.error}>Trends error: {trendingError}</p>}

                <div className={styles.grid}>
                    {trendingData?.works.map((book) => (
                        <TrendingCard key={book.key} book={book} />
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
