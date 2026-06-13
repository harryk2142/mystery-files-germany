// @ts-check

import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import pagefind from "astro-pagefind";
import rehypeAstroRelativeMarkdownLinks from "astro-rehype-relative-markdown-links";
import { qrcode } from "vite-plugin-qrcode";

// https://astro.build/config
export default defineConfig({
    site: "https://the-ai-files.de",
    integrations: [
        mdx(),
        sitemap(),
        preact({
            devtools: true,
        }),
        pagefind(),
    ],
    output: "static",
    server: {
        port: 3000,
        host: true,
    },
    vite: {
        plugins: [
            qrcode(),
        ],
        server: {
            allowedHosts: [
                "localhost",
            ],
        },
    },
    markdown: {
        processor: unified({
            rehypePlugins: [
                rehypeAstroRelativeMarkdownLinks,
            ],
            remarkPlugins: [],
        }),
        shikiConfig: {
            theme: "dark-plus",
        },
    },
    fonts: [
        {
            provider: fontProviders.fontsource(),
            name: "Roboto",
            cssVariable: "--font-roboto",
            styles: [
                "normal",
                "italic",
            ],
            display: "swap",
            weights: [
                300,
                400,
                500,
                700,
            ],
            formats: [
                "woff2",
            ],
        },
        {
            provider: fontProviders.fontsource(),
            name: "Lato",
            cssVariable: "--font-lato",
            styles: [
                "normal",
            ],
            display: "swap",
            formats: [
                "woff2",
            ],
        },
        {
            provider: fontProviders.fontsource(),
            name: "Open Sans",
            cssVariable: "--font-open-sans",
            styles: [
                "normal",
            ],
            display: "swap",
            formats: [
                "woff2",
            ],
        },
        {
            provider: fontProviders.fontsource(),
            name: "Playfair Display",
            cssVariable: "--font-playfair-display",
            styles: [
                "normal",
            ],
            display: "swap",
            formats: [
                "woff2",
            ],
        },
    ],
});
