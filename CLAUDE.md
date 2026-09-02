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
- `src/content/portadas.json` — a `data` collection (Astro's `file()` loader, declared in `content.config.ts` as `portadas`) listing every cover: `{ number?, title, src }`. It was generated once from the filenames in `public/img/portadas/` (see the naming convention note below) and is now the source of truth — add/edit/reorder covers by editing this JSON directly rather than relying on filename parsing. `src/components/CoverGallery.astro` just does `getCollection("portadas")` and renders a grid; used by `numeros-anteriores.mdx`.
- `public/img/` — static image assets served as-is (logo, issue covers). Not run through Astro's image pipeline. Cover filenames follow the loose convention `<slug>---Actuel-Marx-<N>_1800x.webp` (the trailing `-<N>` is what let the one-time generation script parse the issue number); keep new covers named this way if you ever need to regenerate `portadas.json` from the folder.
- `src/data/social.ts` — single source of truth for the journal's social links (Instagram/Facebook/Mastodon), consumed by `Footer.astro`.
- `src/styles/colors.css` — every color used across the site's `<style>` blocks, as `:root` CSS custom properties (`--color-*`, `--overlay-*`), imported once globally in `Layout.astro`. Add new colors here and reference them with `var(--...)` rather than hardcoding hex/rgba in a component. The one deliberate exception is `HeroSlider.astro`'s per-slide `color` field (`slides` array in its frontmatter) — those are content data (a distinct accent color per issue), not shared design tokens, so they stay as literals; `--color-slide-fallback` only covers the CSS default when no per-slide color is set.
- `src/layouts/Layout.astro` — the single HTML shell (head, fonts, global CSS reset/base styles, imports `colors.css`). All pages wrap in this (directly or via `PageTemplate`).
- `src/components/` — `Header`, `Navigation`, `Footer`, `HeroSlider`, `AboutSection` are shared building blocks; `Footer` reads its own content from `src/content/footer.md` the same way page content is read. `Navigation`'s nav items (including the `BLOG` dropdown) are a hardcoded array in the component — update it and `Footer`'s `footerLinks` together when adding/removing pages, they're not derived from `src/pages/` automatically.
- `astro.config.mjs` registers the `mdx`, `sitemap`, and `solid-js` integrations; site is `https://hipersticion.cl`.

### Entry collections (números, convocatorias, blog, enciclopedia, cápsulas, noticias)

Six sections have real Astro content collections in `src/content.config.ts` — `numeros`, `convocatorias`, `blog`, `enciclopedia`, `capsulas`, `noticias` — each backed by `src/content/<name>/**/*.{md,mdx}` and, unlike `pages`, actually queried with `getCollection`/`render` rather than imported directly. This is the pattern to follow when adding real content to any of these sections. Each collection ships one `*-ejemplo.mdx` entry as an authoring template — replace/remove it as real content lands.

- `blog` is split into subfolders by section (`src/content/blog/columnas-de-opinion/`, `cuadernos-tematicos/`, `separatas/`); each entry's frontmatter also carries a matching `section` enum field (folder placement is for organization only, the `section` field is what the code actually filters/labels on — keep both in sync). Detail pages are flat under `/blog/[...slug]` (a rest param, since ids include the subfolder segment, e.g. `columnas-de-opinion/mi-post`); the three `src/pages/blog/*.astro` index pages are static routes and take routing priority over that rest route.
- The other five collections are flat (no subfolders) with plain `/<section>/[slug].astro` detail routes.
- Every entry schema has an optional `slug` field to override the URL segment (defaults to the file-based `entry.id`); every page that builds `getStaticPaths()` or link `href`s uses `entry.data.slug ?? entry.id` — keep using that fallback when adding new routes so overriding a slug doesn't require a filename change.
- Each section's `src/pages/<section>.astro` index page still renders its `src/content/pages/<section>.md` intro copy via `PageTemplate`, then passes an `<EntryList>` of the matching collection entries into `PageTemplate`'s slot (added for this purpose — see `PageTemplate.astro`). `EntryList.astro` takes a plain `{href, title, date?, summary?}[]` so index pages don't need to know each other's field names.
- Each detail route (`src/pages/<section>/[slug].astro`) renders through `EntryTemplate.astro` (title/date/summary/back-link chrome + `<Content />`); `capsulas-podcast/[slug].astro` is the one exception that passes extra slotted markup into `EntryTemplate` to embed the episode's `videoUrl`/`audioUrl`.
- `src/lib/formatDate.ts` is the one shared date formatter (`es-CL`, long month) — used by both `EntryList` and `EntryTemplate`; don't reformat dates inline elsewhere.
