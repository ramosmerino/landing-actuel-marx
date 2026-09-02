# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing/content site for *Actuel Marx Intervenciones*, a political/philosophical journal. Built with Astro 5 + Solid.js (Solid used only where interactivity is needed; most pages are static `.astro`). Spanish is the primary language (`lang="es"`).

## Commands

- `pnpm install` — install dependencies (pnpm is the expected package manager; a `pnpm-lock.yaml` is committed)
- `pnpm dev` — dev server at `localhost:4321`
- `pnpm build` — production build to `./dist/`
- `pnpm preview` — serve the production build locally
- `pnpm astro check` — typecheck the project
- `pnpm astro sync` — sync generated types for content collections

There is no test suite, linter config, or CI test step in this repo currently.

## Architecture

- `src/pages/*.astro` — one file per route, file-based routing (e.g. `src/pages/contactanos.astro` → `/contactanos`; `src/pages/blog/columnas-de-opinion.astro` → `/blog/columnas-de-opinion`). `index.astro` is the only page that composes its own layout by hand (Header/Navigation/HeroSlider/AboutSection/Footer directly) because it has bespoke sections. Every other page is a thin wrapper: it imports its markdown (or MDX) file from `src/content/pages/` directly (not via `getCollection`) and renders it through `PageTemplate.astro`, e.g.:
  ```astro
  import PageTemplate from "../components/PageTemplate.astro";
  import { Content, frontmatter } from "../content/pages/contactanos.md";
  ---
  <PageTemplate frontmatter={frontmatter} Content={Content} />
  ```
  Follow this pattern for any new simple content page; only break from it for pages with custom, non-markdown layout needs like `index.astro`.
- `src/content/pages/*.{md,mdx}` — markdown/MDX content collection (frontmatter `title` + body) backing the simple pages. Most pages are still placeholder copy ("Próximamente...") — real copy needs to be filled in over time. `src/content.config.ts` declares this as the `pages` collection (glob loader over `**/*.{md,mdx}`, `title: z.string()` schema) — this only exists to satisfy Astro's content layer and silence the "auto-generated collection" warning; pages still import the files directly (matching the pattern `Footer.astro` already used for `src/content/footer.md`) rather than calling `getCollection`/`getEntry`. Use `.mdx` instead of `.md` (see `numeros-anteriores.mdx`) when a page's body needs to embed an Astro component.
- `src/components/PageTemplate.astro` — shared layout for markdown-backed pages: renders `Layout` + `Header` + `Navigation` + `<Content />` + `Footer`. Takes `frontmatter: { title }` and `Content: AstroComponentFactory` as props (the two named exports from a direct markdown/MDX import).
- `src/components/CoverGallery.astro` — reads every image in `public/img/portadas/` with Node `fs` at build time (no manual list to maintain) and renders a grid; used by `numeros-anteriores.mdx`. Issue number and title are parsed from filenames, which follow no single naming convention (exported from different tools over the years) — the regexes in this file are heuristic, not exhaustive.
- `public/img/` — static image assets served as-is (logo, issue covers). Not run through Astro's image pipeline, so keep filenames URL-safe when adding new covers.
- `src/data/social.ts` — single source of truth for the journal's social links (Instagram/Facebook/Mastodon), consumed by `Footer.astro`.
- `src/layouts/Layout.astro` — the single HTML shell (head, fonts, global CSS reset/base styles). All pages wrap in this (directly or via `PageTemplate`).
- `src/components/` — `Header`, `Navigation`, `Footer`, `HeroSlider`, `AboutSection` are shared building blocks; `Footer` reads its own content from `src/content/footer.md` the same way page content is read. `Navigation`'s nav items (including the `BLOG` dropdown) are a hardcoded array in the component — update it and `Footer`'s `footerLinks` together when adding/removing pages, they're not derived from `src/pages/` automatically.
- `astro.config.mjs` registers the `mdx`, `sitemap`, and `solid-js` integrations; site is `https://hipersticion.cl`.
