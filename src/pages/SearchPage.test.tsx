import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SearchPage, clean } from './SearchPage';


// simule le hook pour pas faire de vrai appel api pdt le test --> isole le truc
const mocksData = {
    docs: [
        {
            key: '/works/OL12345W',
            title: 'Harry Potter and the Philosopher Stone',
            author_name: ['J.K. Rowling'],
            first_publish_year: 1997,
            cover_i: 123456
        },
        {
            key: '/works/OL67890W',
            title: 'The Hobbit',
            author_name: ['J.R.R. Tolkien'],
            first_publish_year: 1937,
            cover_i: 789012
        }
    ]
};
// simule url
vi.mock('../hooks/useFetch', () => ({
    useFetch: (url: string | null) => {
        // si url null --> renvoie vide
        if (!url) return { data: null, isLoading: false, error: null };

        // sinon en voie fake donnee
        return {
            data: mocksData,
            isLoading: false,
            error: null
        };
    }
}));


// test
describe('SearchPage Logic', () => {

    // 1. test clean
    it('clean function removes quotes and trims spaces', () => {
        expect(clean('"Hello World"')).toBe('Hello World');
        expect(clean('  "Victor Hugo"  ')).toBe('Victor Hugo');
        expect(clean('Simple')).toBe('Simple');
    });

});

describe('SearchPage UI', () => {

    // 2. test affichage page
    it('renders the search page correctly', () => {
        render(
            <MemoryRouter>
                <SearchPage />
            </MemoryRouter>
        );
        // check titre existe
        expect(screen.getByText(/Search results/i)).toBeInTheDocument();
        // check boutton filtre
        expect(screen.getByText(/Apply filter/i)).toBeInTheDocument();
    });

    // 3. test resultat --> simulation
    it('displays books when URL has parameters', () => {
        // memoryrouter permet de simuler l'url (check google)
        render(
            <MemoryRouter initialEntries={['/search?q=Harry']}>
                <SearchPage />
            </MemoryRouter>
        );

        // grace a mock usefetch la page va croire qu'elle a recu les donnees

        // check si harry potter est affiche
        expect(screen.getByText('Harry Potter and the Philosopher Stone')).toBeInTheDocument();

        // check si auteur est affiche
        expect(screen.getByText('J.K. Rowling')).toBeInTheDocument();

        // check si hobbit est aussi la
        expect(screen.getByText('The Hobbit')).toBeInTheDocument();
    });
});