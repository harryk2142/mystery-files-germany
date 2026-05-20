// @ts-check

import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
    site: "https://the-ai-files.de",
    integrations: [mdx(), sitemap(), preact()],
    server: {
        port: 3000,
    },
    fonts: [
        {
            provider: fontProviders.local(),
            name: "Atkinson",
            cssVariable: "--font-atkinson",
            fallbacks: ["sans-serif"],
            options: {
                variants: [
                    {
                        src: ["./src/assets/fonts/atkinson-regular.woff"],
                        weight: 400,
                        style: "normal",
                        display: "swap",
                    },
                    {
                        src: ["./src/assets/fonts/atkinson-bold.woff"],
                        weight: 700,
                        style: "normal",
                        display: "swap",
                    },
                ],
            },
        },
    ],
});
