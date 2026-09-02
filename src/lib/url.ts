/**
 * Prefixes an absolute internal path (e.g. "/numero-actual", "/img/logo.jpg")
 * with Astro's configured `base`, so links and asset URLs keep working when
 * the site is deployed under a subpath (GitHub Pages project sites).
 */
export function withBase(path: string): string {
    const base = import.meta.env.BASE_URL;
    if (path === "/") {
        return base;
    }
    return base.replace(/\/$/, "") + path;
}
