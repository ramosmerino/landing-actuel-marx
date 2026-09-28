import type { CollectionEntry } from "astro:content";

import { withBase } from "./url";

type NumeroEntry = CollectionEntry<"numeros">;
type PortadaEntry = CollectionEntry<"portadas">;
type BlogEntry = CollectionEntry<"blog">;

export function getNumeroSlug(entry: NumeroEntry): string {
    return entry.data.slug ?? entry.id;
}

export function getPortadaByNumber(
    portadas: PortadaEntry[],
    number: number,
): PortadaEntry | undefined {
    return portadas.find((portada) => portada.data.number === number);
}

export function resolvePurchaseUrl(
    numero: NumeroEntry,
    portada?: PortadaEntry,
): string | undefined {
    return numero.data.purchaseUrl ?? portada?.data.purchaseUrl;
}

export function buildSeparataHrefMap(blogEntries: BlogEntry[]): Map<string, string> {
    const map = new Map<string, string>();

    for (const entry of blogEntries) {
        if (entry.data.section !== "separatas") {
            continue;
        }
        const slug = entry.data.slug ?? entry.id;
        map.set(slug, withBase(`/blog/${slug}`));
    }

    return map;
}

export function getCurrentNumero(numeros: NumeroEntry[]): NumeroEntry | undefined {
    if (numeros.length === 0) {
        return undefined;
    }

    return [...numeros].sort((a, b) => {
        if (b.data.number !== a.data.number) {
            return b.data.number - a.data.number;
        }
        return b.data.pubDate.getTime() - a.data.pubDate.getTime();
    })[0];
}

export function buildNumerosByNumber(numeros: NumeroEntry[]): Map<number, NumeroEntry> {
    const map = new Map<number, NumeroEntry>();

    for (const entry of numeros) {
        map.set(entry.data.number, entry);
    }

    return map;
}
