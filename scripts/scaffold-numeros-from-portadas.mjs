import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORTADAS_PATH = join(ROOT, "src/content/portadas.json");
const NUMEROS_DIR = join(ROOT, "src/content/numeros");

const PLACEHOLDER_PUB_DATE = "2000-01-01";

function escapeYamlString(value) {
    if (/[:#{}[\],&*?|>!%@`"']/.test(value) || value.includes("\n")) {
        return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return value;
}

function buildFrontmatter(portada) {
    const { number, title, purchaseUrl } = portada;
    const displayTitle = `N°${number}`;
    const summary = title
        ? `Actuel Marx/Intervenciones N°${number}: ${title}.`
        : `Actuel Marx/Intervenciones N°${number}.`;

    const lines = [
        "---",
        `title: ${escapeYamlString(displayTitle)}`,
        `number: ${number}`,
        `pubDate: ${PLACEHOLDER_PUB_DATE}`,
        `summary: ${escapeYamlString(summary)}`,
        "articles: []",
    ];

    if (purchaseUrl) {
        lines.push(`purchaseUrl: ${purchaseUrl}`);
    }

    lines.push("---", "", "");

    return lines.join("\n");
}

const portadas = JSON.parse(readFileSync(PORTADAS_PATH, "utf8"));
let created = 0;
let skipped = 0;

for (const portada of portadas) {
    if (portada.number === undefined) {
        continue;
    }

    const filePath = join(NUMEROS_DIR, `numero-${portada.number}.mdx`);

    if (existsSync(filePath)) {
        skipped += 1;
        continue;
    }

    writeFileSync(filePath, buildFrontmatter(portada), "utf8");
    created += 1;
}

console.log(`Scaffold complete: ${created} created, ${skipped} skipped (already exist).`);
