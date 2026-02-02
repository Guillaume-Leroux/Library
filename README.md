# React Library Project

This is a modern web application built with **React**, **Vite**, and **TypeScript**. It allows users to search for books using the Open Library API, view detailed information (including Wikipedia integration), and filter results by subject or year.

## Features
* **Search Engine**: Real-time search using Open Library API.
* **Advanced Filters**: Filter by title, author, subject (dropdown), and year.
* **Book Details**: Full book descriptions and related Wikipedia extracts.
* **Unit & Integration Tests**: Robust testing suite with Vitest and React Testing Library.
* **Modern UI**: Responsive design with CSS Modules and custom assets.

---

##  Installation Steps

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) installed on your system. You can check your version by running:
```bash
node -v
```

If you haven't already, navigate to your working directory and clone the repository:
```bash
git clone [https://github.com/Guillaume-Leroux/Library.git](https://github.com/Guillaume-Leroux/Library.git)
cd Library-main
```

This project uses several libraries (Vite, Vitest, React Router, etc.). Install them all at once using:
```bash
npm install
```
### 2. How to Run
Start the Development Server
To launch the application in development mode:
```bash
npm run dev
```

Once started, the terminal will provide a local URL (usually http://localhost:5173). Open this link in your browser to view the application.

Build for Production
To create an optimized production build:
```bash
npm run build
```
### 2. Testing
We use Vitest and React Testing Library to ensure the reliability of the application's core functions.

Run All Tests
To execute the test suite (Search logic, UI rendering, and API integration mocks):
```bash
npm run test
```

The current suite includes:
* **SSearchPage Tests**: Validates input cleaning, UI components, and mock data rendering.
* **BookPage Tests**: Ensures book details and Wikipedia extracts are displayed correctly via API mocks.

### Project Structure

* **/src/pages** Main application views (Home, Search, Details).
* **/src/hooks**: Custom hooks like useFetch for API calls.
* **/src/components**: Reusable UI layout components.
* **/public** : Static assets like the logo and default book covers.
* **/src/styles**: Global CSS tokens and variables.

### Contributors
* **Mateo** - Development and Testing.
* **Guillaume** - Development