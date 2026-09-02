import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const pages = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
    schema: z.object({
        title: z.string(),
    }),
});

const portadas = defineCollection({
    loader: file("./src/content/portadas.json"),
    schema: z.object({
        number: z.number().int().optional(),
        title: z.string(),
        src: z.string(),
    }),
});

const numeros = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/numeros" }),
    schema: z.object({
        title: z.string(),
        number: z.number().int(),
        pubDate: z.coerce.date(),
        summary: z.string(),
        cover: z.string().optional(),
        purchaseUrl: z.string().url().optional(),
        slug: z.string().optional(),
    }),
});

const convocatorias = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/convocatorias" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.coerce.date(),
        deadline: z.coerce.date().optional(),
        status: z.enum(["abierta", "cerrada"]).default("abierta"),
        summary: z.string(),
        slug: z.string().optional(),
    }),
});

const blog = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        author: z.string().optional(),
        pubDate: z.coerce.date(),
        section: z.enum(["columnas-de-opinion", "cuadernos-tematicos", "separatas"]),
        summary: z.string(),
        tags: z.array(z.string()).default([]),
        slug: z.string().optional(),
    }),
});

const enciclopedia = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/enciclopedia" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.coerce.date().optional(),
        summary: z.string(),
        tags: z.array(z.string()).default([]),
        slug: z.string().optional(),
    }),
});

const capsulas = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/capsulas" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.coerce.date(),
        summary: z.string(),
        videoUrl: z.string().url().optional(),
        audioUrl: z.string().url().optional(),
        duration: z.string().optional(),
        slug: z.string().optional(),
    }),
});

const noticias = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/noticias" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.coerce.date(),
        eventDate: z.coerce.date().optional(),
        location: z.string().optional(),
        summary: z.string(),
        slug: z.string().optional(),
    }),
});

export const collections = {
    pages,
    portadas,
    numeros,
    convocatorias,
    blog,
    enciclopedia,
    capsulas,
    noticias,
};
