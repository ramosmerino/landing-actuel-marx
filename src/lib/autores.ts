import { getCollection, type CollectionEntry } from "astro:content";

import { withBase } from "./url";

type NumeroEntry = CollectionEntry<"numeros">;
type BlogEntry = CollectionEntry<"blog">;
type AutorProfile = CollectionEntry<"autores">;

export interface AutorArticle {
    title: string;
    numero: NumeroEntry;
}

export interface Autor {
    slug: string;
    name: string;
    profile?: AutorProfile;
    articles: AutorArticle[];
    posts: BlogEntry[];
}

export function slugifyAuthor(name: string): string {
    return name
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Separa "A, B, C" en nombres individuales, sin partir sufijos como "S.J.".
 * Si el texto usa ";" como separador ("Apellido, N.; Otro, A."), solo se parte por ";".
 */
export function splitAuthors(authors: string): string[] {
    const names: string[] = [];
    const separator = authors.includes(";") ? /\s*;\s*/ : /\s*,\s*/;
    for (const part of authors.split(separator)) {
        const trimmed = part.trim();
        if (!trimmed) {
            continue;
        }
        if (/^S\.J\.$/i.test(trimmed) && names.length > 0) {
            names[names.length - 1] += `, ${trimmed}`;
        } else {
            names.push(trimmed);
        }
    }
    return names;
}

export function autorHref(slug: string): string {
    return withBase(`/autores/${slug}`);
}

export interface AutorIndex {
    autores: Map<string, Autor>;
    /** Slug de la página de un autor, resolviendo alias. */
    slugFor(name: string): string;
}

let cached: Promise<AutorIndex> | undefined;

/**
 * Autores por slug. Se crean a partir de los índices de los números y de los
 * perfiles opcionales de `src/content/autores/` (nombre y alias unifican variantes).
 */
export function getAutores(): Promise<AutorIndex> {
    cached ??= buildAutores();
    return cached;
}

async function buildAutores(): Promise<AutorIndex> {
    const [numeros, blog, profiles] = await Promise.all([
        getCollection("numeros"),
        getCollection("blog"),
        getCollection("autores"),
    ]);

    const canonicalBySlug = new Map<string, string>();
    const autores = new Map<string, Autor>();
    const slugFor = (name: string) => {
        const slug = slugifyAuthor(name);
        return canonicalBySlug.get(slug) ?? slug;
    };

    for (const profile of profiles) {
        const slug = slugifyAuthor(profile.data.name);
        for (const alias of [slug, ...profile.data.aliases.map(slugifyAuthor)]) {
            canonicalBySlug.set(alias, slug);
        }
        autores.set(slug, { slug, name: profile.data.name, profile, articles: [], posts: [] });
    }

    const getOrCreate = (name: string): Autor => {
        const slug = slugFor(name);
        let autor = autores.get(slug);
        if (!autor) {
            autor = { slug, name, articles: [], posts: [] };
            autores.set(slug, autor);
        }
        return autor;
    };

    const numerosNewestFirst = [...numeros].sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || b.data.number - a.data.number,
    );
    for (const numero of numerosNewestFirst) {
        for (const article of numero.data.articles) {
            for (const name of splitAuthors(article.authors)) {
                getOrCreate(name).articles.push({ title: article.title, numero });
            }
        }
    }

    const postsNewestFirst = [...blog].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
    for (const post of postsNewestFirst) {
        if (post.data.author) {
            autores.get(slugFor(post.data.author))?.posts.push(post);
        }
    }

    return { autores, slugFor };
}
