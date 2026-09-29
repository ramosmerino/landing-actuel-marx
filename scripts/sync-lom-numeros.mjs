/**
 * Obtiene metadatos de lom.cl y actualiza src/content/numeros/*.mdx y portadas.json.
 * Uso: node scripts/sync-lom-numeros.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NUMEROS_DIR = join(ROOT, "src/content/numeros");
const PORTADAS_PATH = join(ROOT, "src/content/portadas.json");

const PRODUCT_PATHS = [
    "/products/desbandes-y-emergencias-en-la-epoca-del-capitalismo-mundial-actuel-marx-no-1",
    "/products/fronteras-de-la-emancipacion-actuel-marx-no-2",
    "/products/trabajo-explotacion-flexible-y-resistencias-actuel-marx-no-5",
    "/products/memorias-en-busca-de-historia-actuel-marx-no-6",
    "/products/insustentabilidades-del-capitalismo-actuel-marx-no-7",
    "/products/la-pesantez-de-la-vida-cotidiana-actuel-marx-no-8",
    "/products/cuerpos-contemporaneos-nuevas-practicas-antiguos-retos-otras-pasiones-actuel-marx-no-9",
    "/products/bicentenario-s-latinoamericanos-actuel-marx-no-10",
    "/products/la-sonrisa-de-los-explotados-huellas-y-porvenir-de-la-revolucion-actuel-marx-no-11",
    "/products/extranjero-y-extranjeridad-actuel-marx-no-12",
    "/products/movimientos-sociales-populares-y-sindicales-actuel-marx-no-13",
    "/products/la-condicion-anti-intelectual-actuel-marx-no-14",
    "/products/los-golpes-por-venir-actuel-marx-n-15",
    "/products/comenzar-de-otro-modo-reflexiones-sobre-materialismo-e-historia-actuel-marx-n-16",
    "/products/el-humanismo-y-sus-ficciones-educacion-investigacion-temas-relacionados-con-la-filosofia-actuel-marx-n-17",
    "/products/materialismo-critica-y-produccion-actuel-marx-n-18",
    "/products/naturaleza-americana-extractivismo-y-geopolitica-del-capital-actuel-marx-n-19",
    "/products/el-sociometabolismo-del-capital-y-la-depredacion-de-la-vida-actuel-marx-n-20",
    "/products/intervenciones-y-recepciones-de-marx-actuel-marx-n-21",
    "/products/racismos-actuel-marx-n-22",
    "/products/democracia-y-representacion-actuel-marx-n-23",
    "/products/queer-articulaciones-contra-el-progreso-actuel-marx-n-24",
    "/products/los-68s-actuel-marx-n-25",
    "/products/sexo-genero-raza-clase-latinoamerica-desde-una-optica-interseccional-actuel-marx-n-26",
    "/products/el-resurgimiento-y-el-auge-de-los-fascismos-actuel-marx-n-27",
    "/products/la-financiarizacion-en-las-logicas-del-capitalismo-mundializado-revista-actuel-marx-intervenciones-n-28",
    "/products/rebelion-popular-chilena-y-crisis-de-acumulacion-capitalista-mundial",
    "/products/actuel-marx-n-30-los-intelectuales-poder-dominacion-y-resistencia",
    "/products/actuel-marx-n%C2%BA-31-las-violencias-practicas-sociales-experiencias-y-teorias",
    "/products/actuel-marx-n%C2%BA-32-proceso-revolucionario-y-contrarrevolucionario-en-chile-historia-memoria-politica-i",
    "/products/actuel-marx-n%C2%BA-33-proceso-revolucionario-y-contrarrevolucionario-en-chile-historia-memoria-politica-ii",
    "/products/actuel-marx-n-34-entre-la-cultura-como-campos-de-batalla-y-las-esteticas-del-fragmento",
    "/products/actuel-marx-n-35-guerras-y-lucha-de-clases-el-complejo-inductrial-militar-financiero-i",
];

const FETCH_DELAY_MS = 400;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeHtml(text) {
    return text
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');
}

function stripTags(html) {
    return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function cleanLomSummary(text) {
    return text
        .replace(
            /^cantidad:\s*producto sin stock,?\s*selecciona otra opción para poder comprar\s*/i,
            "",
        )
        .replace(/^precio internet:\s*\$[\d.,]+\s*/i, "")
        .trim();
}

function extractNumberFromPath(path) {
    const decoded = decodeURIComponent(path);
    const match =
        decoded.match(/actuel-marx-n[oº°]?\s*-?\s*(\d+)/i) ??
        decoded.match(/n-(\d+)/i) ??
        decoded.match(/no-(\d+)/i);
    return match ? Number.parseInt(match[1], 10) : undefined;
}

function extractNumberFromHtml(html) {
    const match = html.match(/Actuel Marx\s+N[°º]\s*(\d+)/i);
    return match ? Number.parseInt(match[1], 10) : undefined;
}

function parseProductHtml(html) {
    const fichaIndex = html.indexOf("<h3>Ficha Técnica</h3>");
    const keywordsIndex = html.indexOf("<h3>Palabras claves</h3>");

    let descriptionHtml = "";
    if (fichaIndex !== -1) {
        const slice = html.slice(0, fichaIndex);
        const paragraphs = [...slice.matchAll(/<p>([\s\S]*?)<\/p>/g)]
            .map((m) => m[1])
            .map((p) => stripTags(p))
            .filter((text) => text.length > 80)
            .filter((text) => !/^cantidad:/i.test(text))
            .filter((text) => !/producto sin stock/i.test(text))
            .map((text) => cleanLomSummary(text))
            .filter((text) => text.length > 40);
        descriptionHtml = paragraphs.join(" ");
    }

    const summary = cleanLomSummary(stripTags(descriptionHtml));

    let fichaText = "";
    if (fichaIndex !== -1) {
        const end = keywordsIndex !== -1 ? keywordsIndex : fichaIndex + 800;
        fichaText = stripTags(html.slice(fichaIndex, end));
    }

    let keywordsRaw = "";
    if (keywordsIndex !== -1) {
        keywordsRaw = html.slice(keywordsIndex + "<h3>Palabras claves</h3>".length, keywordsIndex + 2000);
        keywordsRaw = stripTags(keywordsRaw.split("<")[0] ?? keywordsRaw);
    }

    const isbnMatch = fichaText.match(/ISBN:\s*([0-9Xx-]+)/i);
    const issnMatch = fichaText.match(/ISSN:\s*([0-9-]+)/i);
    const pagesMatch = fichaText.match(/Nº de Páginas:\s*(\d+)/i);
    const formatMatch = fichaText.match(/Formato:\s*([^A]+?)(?=Peso:|Año|$)/i);
    const weightMatch = fichaText.match(/Peso:\s*([^A]+?)(?=Año|$)/i);
    const yearMatch = fichaText.match(/Año de publicación:\s*(\d{4})/i);

    const keywords = keywordsRaw
        .split(",")
        .map((kw) => kw.trim())
        .filter((kw) => kw.length > 0);

    return {
        summary,
        isbn: isbnMatch?.[1]?.trim(),
        issn: issnMatch?.[1]?.trim(),
        specs: {
            pages: pagesMatch ? Number.parseInt(pagesMatch[1], 10) : undefined,
            format: formatMatch?.[1]?.trim().replace(/\s+/g, " "),
            weight: weightMatch?.[1]?.trim().replace(/\s+/g, " "),
            publicationYear: yearMatch ? Number.parseInt(yearMatch[1], 10) : undefined,
        },
        keywords,
    };
}

function yamlString(value) {
    const normalized = value.replace(/\r?\n/g, " ").trim();
    if (/[:#{}[\],&*?|>!%@`"']/.test(normalized) || normalized.includes('"')) {
        return `"${normalized.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `"${normalized}"`;
}

function parseExistingMdx(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) {
        return { articlesYaml: null, body: "" };
    }

    const frontmatter = match[1];
    const body = match[2];
    const articlesBlock = frontmatter.match(/articles:\s*(\[[\s\S]*?\]|(?:\n  -[\s\S]*?)*)/);
    let articlesYaml = null;
    if (articlesBlock) {
        const block = articlesBlock[0];
        if (block.includes("- title:") || block.includes("articles: []") === false) {
            const lines = frontmatter.split("\n");
            const start = lines.findIndex((l) => l.startsWith("articles:"));
            if (start !== -1) {
                const collected = [];
                for (let i = start; i < lines.length; i += 1) {
                    const line = lines[i];
                    if (i > start && /^[a-zA-Z]/.test(line) && !line.startsWith("  ")) {
                        break;
                    }
                    collected.push(line);
                }
                if (collected.some((l) => l.trim().startsWith("- "))) {
                    articlesYaml = collected.join("\n");
                }
            }
        }
    }

    const showDateMatch = frontmatter.match(/^showDate:\s*(.+)$/m);
    let showDate = null;
    if (showDateMatch) {
        const raw = showDateMatch[1].trim();
        if (raw.startsWith('"') && raw.endsWith('"')) {
            showDate = raw.slice(1, -1).replace(/\\"/g, '"');
        } else {
            showDate = raw;
        }
    }

    return { articlesYaml, body, showDate };
}

function buildFrontmatter(number, portadaTitle, lom, existingArticlesYaml, existingShowDate) {
    const year = lom.specs.publicationYear ?? 2000;
    const pubDate = `${year}-07-01`;
    const showDate = existingShowDate ?? `Año ${year}`;
    const lines = [
        "---",
        `title: "N°${number}"`,
        `number: ${number}`,
        `pubDate: ${pubDate}`,
        `showDate: ${yamlString(showDate)}`,
        `summary: ${yamlString(lom.summary || `Actuel Marx/Intervenciones N°${number}: ${portadaTitle}.`)}`,
        existingArticlesYaml ?? "articles: []",
    ];

    if (lom.purchaseUrl) {
        lines.push(`purchaseUrl: ${lom.purchaseUrl}`);
    }
    if (lom.isbn) {
        lines.push(`isbn: "${lom.isbn}"`);
    }
    if (lom.issn) {
        lines.push(`issn: "${lom.issn}"`);
    }

    const specsEntries = Object.entries(lom.specs).filter(([, v]) => v !== undefined && v !== "");
    if (specsEntries.length > 0) {
        lines.push("specs:");
        for (const [key, value] of specsEntries) {
            if (typeof value === "number") {
                lines.push(`  ${key}: ${value}`);
            } else {
                lines.push(`  ${key}: ${yamlString(String(value))}`);
            }
        }
    }

    if (lom.keywords.length > 0) {
        lines.push("keywords:");
        for (const kw of lom.keywords) {
            lines.push(`  - ${yamlString(kw)}`);
        }
    }

    lines.push("---", "", "");

    return lines.join("\n");
}

async function fetchProduct(path) {
    const url = `https://lom.cl${path}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
    }
    const html = await response.text();
    const number = extractNumberFromPath(path) ?? extractNumberFromHtml(html);
    if (!number) {
        throw new Error(`No se pudo determinar el número para ${path}`);
    }

    const parsed = parseProductHtml(html);
    const purchaseUrl = url.split("?")[0];

    return { number, purchaseUrl, ...parsed };
}

const portadas = JSON.parse(readFileSync(PORTADAS_PATH, "utf8"));
const portadaByNumber = new Map(portadas.map((p) => [p.number, p]));

const lomByNumber = new Map();

for (const path of PRODUCT_PATHS) {
    try {
        const data = await fetchProduct(path);
        lomByNumber.set(data.number, data);
        console.log(`OK N°${data.number}`);
    } catch (error) {
        console.error(`FAIL ${path}:`, error.message);
    }
    await sleep(FETCH_DELAY_MS);
}

for (const portada of portadas) {
    if (portada.number === undefined) {
        continue;
    }
    const lom = lomByNumber.get(portada.number);
    if (lom?.purchaseUrl) {
        portada.purchaseUrl = lom.purchaseUrl;
    }
}

writeFileSync(PORTADAS_PATH, `${JSON.stringify(portadas, null, 4)}\n`, "utf8");

const numeroFiles = readdirSync(NUMEROS_DIR).filter((name) => name.endsWith(".mdx"));

for (const file of numeroFiles) {
    const match = file.match(/^numero-(\d+)\.mdx$/);
    if (!match) {
        continue;
    }
    const number = Number.parseInt(match[1], 10);
    const lom = lomByNumber.get(number);
    const portada = portadaByNumber.get(number);
    const title = portada?.title ?? `N°${number}`;

    if (!lom) {
        console.log(`Skip N°${number} (sin ficha en LOM)`);
        continue;
    }

    const bodyPath = join(NUMEROS_DIR, file);
    const existing = readFileSync(bodyPath, "utf8");
    const { articlesYaml, body, showDate } = parseExistingMdx(existing);
    const frontmatter = buildFrontmatter(number, title, lom, articlesYaml, showDate);
    writeFileSync(bodyPath, `${frontmatter}${body}`, "utf8");
}

console.log(`Sincronizados ${lomByNumber.size} números desde LOM.`);
