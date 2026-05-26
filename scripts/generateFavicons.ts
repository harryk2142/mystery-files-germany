import fs from "node:fs";
import path from "node:path";

import sharp, {
    type AvailableFormatInfo,
    type AvifOptions,
    type GifOptions,
    type HeifOptions,
    type Jp2Options,
    type JpegOptions,
    type JxlOptions,
    type OutputOptions,
    type PngOptions,
    type RawOptions,
    type TiffOptions,
    type WebpOptions,
} from "sharp";

const { format } = sharp; // Or access via sharp.format if it exists on the default export

import { SITE_TITLE } from "../src/consts.ts";

const SOURCE_IMAGE = path.join(process.cwd(), "src/assets/images/logo.png");
const TARGET_DIR = path.join(process.cwd(), "public");
const FAVICON_NAME = "logo";
type Size = {
    size: number;
    name: string;
    purpose: string;
    forManifest: boolean;
    format: AvailableFormatInfo;
    options?:
        | OutputOptions
        | JpegOptions
        | PngOptions
        | WebpOptions
        | AvifOptions
        | HeifOptions
        | JxlOptions
        | GifOptions
        | Jp2Options
        | RawOptions
        | TiffOptions;
};
// Definition der benötigten Standardgrößen für moderne Webseiten
const SIZES: Size[] = [
    {
        size: 64,
        name: "favicon.png",
        purpose: "favicon",
        forManifest: false,
        format: format.png,
        options: { compressionLevel: 9, quality: 100 },
    },
    {
        size: 180,
        name: `${FAVICON_NAME}-180.png`,
        purpose: "apple-touch",
        forManifest: true,
        format: format.png,
        options: { compressionLevel: 9, quality: 100 },
    }, // Apple Standard
    {
        size: 192,
        name: `${FAVICON_NAME}-192.png`,
        purpose: "any",
        forManifest: true,
        format: format.png,
        options: { compressionLevel: 9, quality: 100 },
    }, // Android / PWA
    {
        size: 512,
        name: `${FAVICON_NAME}-512.png`,
        purpose: "any",
        forManifest: true,
        format: format.png,
        options: { compressionLevel: 9, quality: 100 },
    }, // Android / PWA Splachscreen
    {
        size: 192,
        name: "logo.png",
        purpose: "any",
        forManifest: false,
        format: format.png,
        options: { quality: 100 },
    },
];
async function generateIcons() {
    // 2. Bilder in allen Größen generieren
    for (const item of SIZES) {
        await sharp(SOURCE_IMAGE)
            .resize(item.size, item.size, {
                fit: "contain",
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .toFormat(item.format, item.options)
            .toFile(path.join(TARGET_DIR, item.name));
    }
    console.log("✅ Alle Logo-Größen erfolgreich generiert!");
}
async function generateManifest() {
    // 3. Web App Manifest (manifest.json) dynamisch erstellen
    const manifest = {
        name: SITE_TITLE, // Hier Ihren App-Namen eintragen
        short_name: SITE_TITLE,
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: SIZES.filter((item) => item.forManifest).map((item) => ({
            src: `/${item.name}`,
            sizes: `${item.size}x${item.size}`,
            type: `image/${item.format.id}`,
            purpose: "any",
        })),
    };

    fs.writeFileSync(
        path.join(TARGET_DIR, "manifest.json"),
        JSON.stringify(manifest, null, 2),
    );
    console.log("✅ manifest.json erfolgreich generiert!");
}
async function generateAssets() {
    try {
        // 1. Zielverzeichnis sicherstellen
        if (!fs.existsSync(TARGET_DIR)) {
            fs.mkdirSync(TARGET_DIR, { recursive: true });
        }

        await generateIcons();
        await generateManifest();
    } catch (error) {
        console.error("❌ Fehler bei der Asset-Generierung:", error);
        process.exit(1);
    }
}

generateAssets();
