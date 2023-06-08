# Demo Strapi Resume and Porfolio

This is an demo of how to make your own resume and portfolio backed by strapi.

## In the box

### Apps

-   **backend:** The Strapi backend
-   **docs:** The fronent compoment that produces the resume and portfolio
-   **sdk-test:** A continuity tester that ensures the SDK runs in isolation

### Packages

-   **create-pdf:** Simple wrapper around `wkhtmltopdf`
-   **sdk:** JS API abstraction for interacting with the Strapi backend
-   **sdk-react:** Example of how to use the SDK with react

## Installation

1. Install `wkhtmltopdf`
    - **Ubuntu:** `sudo apt install wkhtmltopdf`
2. Install node deps: `npm i`
3. Set up enviroment file: `.env` (example in `.env.example`)

## Scripts

-   **build:** `npm run build` Build the assets
-   **dev:** `npm run dev-` Run the apps in dev mode
-   **format:** `npm run format` Format the code with Prettier

## Useful Links

-   [Strapi](https://docs.strapi.io/dev-docs/intro)
-   [Pug](https://pugjs.org/api/getting-started.html)
-   [SASS](https://sass-lang.com/documentation/)
-   [wkHTMLtoPDF](https://wkhtmltopdf.org/)
-   [markdown-it](https://github.com/markdown-it/markdown-it)
-   [qs](https://github.com/ljharb/qs)
-   [zod](https://zod.dev/)
