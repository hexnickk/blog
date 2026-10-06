# Nick K blog

A small static blog built with React Router and StyleX.

## Features

- 🚀 Static HTML generated at build time
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Content loading at build time
- 🔒 TypeScript by default
- 🎉 StyleX for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build --build-arg VITE_HOST_URL=https://your-domain.example -t my-app .

# Run the container
docker run -p 3000:80 my-app
```

The production container serves static files with Caddy. No Node server or backend is required.

To preview the production build locally, run `npm start` after `npm run build`.
Deploy the contents of `build/client` to a static host that serves directory `index.html` files.

## Posts and pagination

Content is a plain `links` array in `app/modules/content.ts`, listed newest first. Each link has a `title`, `href`, `date` (ISO date string), and optional `description`. The homepage shows the latest 5 entries. The full list starts at `/pages/1`, with up to 15 entries per page.

The build generates `index.html` for the homepage and `pages/1/index.html`, `pages/2/index.html`, etc. Pagination uses ordinary document navigation and works without JavaScript. Dates are rendered at build time in UTC. All static routes and RSS are also generated at build time. Adding or editing content requires a rebuild.

To add an internal page, create a route module, register its path in `app/routes.ts`, and add a link with that local path to the array:

```ts
{ title: "My article", href: "/my-article", date: "2026-10-06" }
```

Static routes are automatically included in the prerender build. Put their images and other assets in `public/`.

## Styling

Styles use [StyleX](https://stylexjs.com/) and its official Vite plugin for a centered column and light spacing. The page uses a system sans-serif font at 18px, with native headings, lists, and links. Minimal global styles live in `app/app.css`.

Use `stylex.props` to apply styles to native elements.

---

Built with ❤️ using React Router.
