    import { describe, it, expect, vi } from 'vitest';
    import { render, screen } from '@testing-library/react';
    import { MemoryRouter, Routes, Route } from 'react-router-dom';
    import { BookPage } from './BookPage';


    const mockBookData = {
        title: "Harry Potter",
        description: { value: "A wizard boy..." },
        covers: [123]
    };

    const mockWikiData = {
        extract: "Harry Potter is a series of novels...",
        thumbnail: { source: "http://image.wiki/hp.jpg" },
        content_urls: { desktop: { page: "http://wiki.com/hp" } }
    };

    // mock simule url avec la fct bookPage modifier apres le merge qui a tout casse
    vi.mock('../data/bookInfo', () => ({
        useBookDetailsWithFallback: vi.fn(() => ({
            isLoading: false,
            error: null,
            title: "Harry Potter",
            description: "A wizard boy...",
            coverUrl: "http://example.com/cover.jpg",
            wikiUrl: "http://wiki.com/hp",
            subjects: ["Magic", "Fantasy"],
            firstPublishDate: "1997",
            book: { key: "OL123W" }
        })),
        useOpenLibraryAuthors: vi.fn(() => ({
            authors: ["J.K. Rowling"],
            loadingAuthors: false
        }))
    }));

    describe('BookPage Integration', () => {
        it('displays book details and wikipedia link', () => {
            render(
                <MemoryRouter initialEntries={['/book/OL123W']}>
                    <Routes>
                        <Route path="/book/:id" element={<BookPage />} />
                    </Routes>
                </MemoryRouter>
            );

            // Vérification du titre
            expect(screen.getByRole('heading', { name: /Harry Potter/i })).toBeInTheDocument();

            // Vérification de la description
            expect(screen.getByText(/A wizard boy/i)).toBeInTheDocument();

            // Vérification du lien Wikipedia (Le texte est "Read on Wikipedia →")
            const wikiLink = screen.getByRole('link', { name: /Wikipedia/i });
            expect(wikiLink).toBeInTheDocument();
            expect(wikiLink).toHaveAttribute('href', 'http://wiki.com/hp');

            // Vérification de l'auteur
            expect(screen.getByText(/J.K. Rowling/i)).toBeInTheDocument();
        });
    });