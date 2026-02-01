export interface Book {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number; // l'id pour la cover
}

export interface SearchResult {
    numFound: number;
    docs: Book[];
}

export interface RecentChange {
    id: string;
    kind: string;
    timestamp: string;
    comment: string;
}

