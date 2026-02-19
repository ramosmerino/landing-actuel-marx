// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
    site: "https://hipersticion.cl",
    base: "/",
    integrations: [mdx(), sitemap(), solidJs()],
});