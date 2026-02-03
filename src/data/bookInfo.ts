import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";

/* -------------------- Open Library types -------------------- */

export type OpenLibraryDescription =
    | string
    | {
    value: string;
    type?: string;
};

export interface OpenLibraryAuthorRef {
    author: {
        key: string;
    };
}

export interface OpenLibraryWork {
    key: string;
    title: string;
    description?: OpenLibraryDescription;
    covers?: number[];
    subjects?: string[];
    first_publish_date?: string;
    authors?: OpenLibraryAuthorRef[];
}

export interface OpenLibraryTrendingWork {
    key: string;
    title: string;
    cover_i?: number;
    author_name?: string[];
    first_publish_year?: number;
}

/* -------------------- Wikipedia types -------------------- */

export interface WikiThumbnail {
    source: string;
    width: number;
    height: number;
}

export interface WikiContentUrls {
    desktop?: {
        page?: string;
    };
}

export interface WikiSummary {
    type?: string;
    extract?: string;
    thumbnail?: WikiThumbnail;
    content_urls?: WikiContentUrls;
}

const WIKI_NOT_FOUND =
    "https://mediawiki.org/wiki/HyperSwitch/errors/not_found";

/* Open Library */

export function getOpenLibraryDescription(
    book?: OpenLibraryWork | null
): string | undefined {
    if (!book?.description) return undefined;

    if (typeof book.description === "string") {
        const value = book.description.trim();
        return value || undefined;
    }

    if (typeof book.description === "object") {
        const value = book.description.value?.trim();
        return value || undefined;
    }

    return undefined;
}

export function getOpenLibraryCover(
    book?: OpenLibraryWork | null,
    size: "S" | "M" | "L" = "L"
): string | undefined {
    const coverId = book?.covers?.[0];
    if (typeof coverId !== "number") return undefined;
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function getOpenLibraryCoverFromTrending(
    work?: OpenLibraryTrendingWork | null,
    size: "S" | "M" | "L" = "M"
): string | undefined {
    const coverId = work?.cover_i;
    if (typeof coverId !== "number") return undefined;
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

/* Wikipedia helpers */

function isWikiNotFound(wiki?: WikiSummary | null): boolean {
    return wiki?.type === WIKI_NOT_FOUND;
}

export function getWikiDescription(
    wiki?: WikiSummary | null
): string | undefined {
    if (!wiki || isWikiNotFound(wiki)) return undefined;
    const text = wiki.extract?.trim();
    return text || undefined;
}

export function getWikiThumbnail(
    wiki?: WikiSummary | null
): string | undefined {
    if (!wiki || isWikiNotFound(wiki)) return undefined;
    return wiki.thumbnail?.source;
}

export function getWikiPageUrl(
    wiki?: WikiSummary | null
): string | undefined {
    if (!wiki || isWikiNotFound(wiki)) return undefined;
    return wiki.content_urls?.desktop?.page;
}

/* Hook */

export function useWikiSummary(title: string | null) {
    const url = title
        ? `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            title
        )}`
        : null;

    return useFetch<WikiSummary>(url);
}

export function useBookDetailsWithFallback(workId?: string) {
    const bookUrl = workId
        ? `https://openlibrary.org/works/${workId}.json`
        : null;

    const {
        data: book,
        isLoading,
        error,
    } = useFetch<OpenLibraryWork>(bookUrl);

    const title = book?.title ?? null;

    const { data: wiki } = useWikiSummary(title);

    const description =
        getOpenLibraryDescription(book) ??
        getWikiDescription(wiki);

    const coverUrl =
        getOpenLibraryCover(book, "L") ??
        getWikiThumbnail(wiki);

    const wikiUrl = getWikiPageUrl(wiki);

    return {
        isLoading,
        error,
        title,
        description,
        coverUrl,
        wikiUrl,
        book,
        wiki,
        subjects: book?.subjects ?? [],
        firstPublishDate: book?.first_publish_date,
        sources: {
            description: getOpenLibraryDescription(book)
                ? "openlibrary"
                : getWikiDescription(wiki)
                    ? "wikipedia"
                    : "none",
            cover: getOpenLibraryCover(book)
                ? "openlibrary"
                : getWikiThumbnail(wiki)
                    ? "wikipedia"
                    : "none",
        } as const,
    };
}

/* Author */

interface OpenLibraryAuthor {
    key: string;
    name: string;
}

function authorKeyToUrl(key: string) {
    return `https://openlibrary.org${key}.json`;
}

export function useOpenLibraryAuthors(
    work?: OpenLibraryWork | null
) {
    const [authors, setAuthors] = useState<string[]>([]);
    const [loadingAuthors, setLoadingAuthors] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            const refs = work?.authors ?? [];
            if (refs.length === 0) {
                setAuthors([]);
                return;
            }

            setLoadingAuthors(true);

            try {
                const names = await Promise.all(
                    refs.map(async (ref) => {
                        const res = await fetch(authorKeyToUrl(ref.author.key));
                        if (!res.ok) return null;
                        const data = (await res.json()) as OpenLibraryAuthor;
                        return data.name;
                    })
                );

                if (!cancelled) {
                    setAuthors(names.filter(Boolean) as string[]);
                }
            } catch {
                if (!cancelled) setAuthors([]);
            } finally {
                if (!cancelled) setLoadingAuthors(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [work?.key]);

    return { authors, loadingAuthors };
}
