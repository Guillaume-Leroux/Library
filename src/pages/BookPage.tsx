import { useParams } from "react-router-dom";
import styles from "./BookPage.module.css";
import { useBookDetailsWithFallback, useOpenLibraryAuthors } from "../data/bookInfo";

export function BookPage() {
    const { id } = useParams();

    const {
        isLoading,
        error,
        title,
        description,
        coverUrl,
        wikiUrl,
        book,
        subjects,
        firstPublishDate,
    } = useBookDetailsWithFallback(id);

    const { authors, loadingAuthors } = useOpenLibraryAuthors(book);

    if (isLoading) return <p className={`${styles.center} ${styles.muted}`}>Loading…</p>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!title) return null;

    const shownSubjects = subjects.slice(0, 8); // keep UI clean

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>{title}</h1>

            <div className={styles.layout}>
                {/* LEFT: Cover */}
                <aside className={styles.left}>
                    <div className={styles.coverCard}>
                        {coverUrl ? (
                            <img
                                className={styles.cover}
                                src={coverUrl}
                                alt={`Cover for ${title}`}
                                loading="lazy"
                            />
                        ) : (
                            <div className={styles.noCover}>No cover</div>
                        )}
                    </div>
                </aside>

                {/* MIDDLE: Description + Wikipedia */}
                <section className={styles.middle}>
                    <div className={styles.card}>
                        <h2 className={styles.sectionTitle}>Description</h2>
                        <p className={styles.descText}>
                            {description ?? "No description available."}
                        </p>

                        {wikiUrl && (
                            <a className={styles.link} href={wikiUrl} target="_blank" rel="noreferrer">
                                Read on Wikipedia →
                            </a>
                        )}
                    </div>
                </section>

                {/* RIGHT: Info */}
                <aside className={styles.right}>
                    <div className={styles.card}>
                        <h2 className={styles.sectionTitle}>Book information</h2>

                        <dl className={styles.dl}>
                            <div className={styles.row}>
                                <dt className={styles.dt}>Author</dt>
                                <dd className={styles.dd}>
                                    {loadingAuthors
                                        ? "Loading…"
                                        : authors.length > 0
                                            ? authors.join(", ")
                                            : "Unknown"}
                                </dd>
                            </div>

                            <div className={styles.row}>
                                <dt className={styles.dt}>First published</dt>
                                <dd className={styles.dd}>{firstPublishDate ?? "Unknown"}</dd>
                            </div>

                            <div className={styles.row}>
                                <dt className={styles.dt}>Genres / subjects</dt>
                                <dd className={styles.dd}>
                                    {shownSubjects.length > 0 ? (
                                        <div className={styles.tags}>
                                            {shownSubjects.map((s) => (
                                                <span key={s} className={styles.tag}>{s}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        "Unknown"
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </aside>
            </div>
        </div>
    );
}
