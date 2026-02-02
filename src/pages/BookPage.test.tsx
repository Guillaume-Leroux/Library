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

    // simule url
    vi.mock('../hooks/useFetch', () => ({
        useFetch: (url: string | null) => {
            if (!url) return { data: null, isLoading: false };

            // si url --> "works" (Open Library)
            if (url.includes('openlibrary.org/works')) {
                return { data: mockBookData, isLoading: false, error: null };
            }

            // si url --> "wikipedia" (Wikipedia)
            if (url.includes('wikipedia.org')) {
                return { data: mockWikiData, isLoading: false, error: null };
            }

            return { data: null, isLoading: false, error: null };
        }
    }));

    describe('BookPage Integration', () => {
        it('displays book details and wikipedia extract', () => {
            render(
                <MemoryRouter initialEntries={['/book/OL123W']}>
                    <Routes>
                        {/* set route pour que useParams get l'id "OL123W" */}
                        <Route path="/book/:id" element={<BookPage />} />
                    </Routes>
                </MemoryRouter>
            );

            // 1. check titre livre
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Harry Potter');

            // 2. check wikipedia
            expect(screen.getByText('On Wikipedia')).toBeInTheDocument();

            // 3. check desc wikipedia
            expect(screen.getByText(/Harry Potter is a series of novels/i)).toBeInTheDocument();
        });
    });