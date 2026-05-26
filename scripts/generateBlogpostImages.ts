import fs from "fs";
import path from "path";

import sharp from "sharp";

const pathToOriginalImages = "./src/assets/images/blog";
const targetExt = "webp";

import task from "tasuku";

const outputDirs = {
    blog: "./public/images/blog",
};
let originalImages: string[] = [];
let heroCounter = 0;
let smallCounter = 0;
let ogCounter = 0;
let twitterCounter = 0;

const transform = async (src, dest, quality, width, height) => {
    const metadata = await sharp(src).metadata();

    // Calculate the source and the target aspect ratio
    const srcAspectRatio = metadata.width / metadata.height;
    const destAspectRatio = width / height;

    // Resize the image so that it covers the target dimensions, apply blur and
    // store the result in memory
    const backgroundBuffer = await sharp(src)
        .resize({ width, height, fit: "cover" })
        .blur(10)
        .toBuffer();

    // Resize the image so that it's contained within the target dimensions and
    // store the result in memory
    const foregroundBuffer = await sharp(src)
        .resize(srcAspectRatio > destAspectRatio ? { width } : { height })
        .toBuffer();

    // Combine the background and the foreground and store the result in a file
    await sharp(backgroundBuffer)
        .composite([{ input: foregroundBuffer, gravity: "center" }])
        .webp({ quality: quality })
        .toFile(dest);
};
async function generateHero(inputFilePath: string, metadata: sharp.Metadata) {
    const parsed = path.parse(inputFilePath);
    const name = `${parsed.name}.${targetExt}`;

    const destHero = path.join(outputDirs.blog, name);
    if (!fs.existsSync(destHero)) {
        // Original
        await transform(
            inputFilePath,
            destHero,
            100,
            metadata.width,
            metadata.height,
        );
        heroCounter++;
    }
}

async function generateSmall(inputFilePath: string, metadata: sharp.Metadata) {
    const parsed = path.parse(inputFilePath);
    const nameSmall = `${parsed.name}.small.${targetExt}`;
    const destSmall = path.join(outputDirs.blog, nameSmall);
    if (!fs.existsSync(destSmall)) {
        // Small
        await transform(
            inputFilePath,
            destSmall,
            50,
            metadata.width,
            metadata.height,
        );
        smallCounter++;
    }
}

async function generateOg(inputFilePath: string) {
    const parsed = path.parse(inputFilePath);
    const nameOg = `${parsed.name}.og.${targetExt}`;
    const destOg = path.join(outputDirs.blog, nameOg);
    if (!fs.existsSync(destOg)) {
        // Sharing Open Graph / Facebook 1200 x 630
        await transform(inputFilePath, destOg, 80, 1200, 630);
        ogCounter++;
    }
}
async function generateTwitter(inputFilePath: string) {
    const parsed = path.parse(inputFilePath);
    const nameTwitter = `${parsed.name}.twitter.${targetExt}`;
    const destTwitter = path.join(outputDirs.blog, nameTwitter);
    if (!fs.existsSync(destTwitter)) {
        // Sharing Twitter 800 x 420
        await transform(inputFilePath, destTwitter, 80, 800, 420);
        twitterCounter++;
    }
}

const main = async () => {
    // Stelle sicher, dass die Ausgabeordner existieren
    Object.values(outputDirs).forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    originalImages = fs.readdirSync(pathToOriginalImages).filter((file) => {
        return (
            file.endsWith(".png") ||
            file.endsWith(".jpg") ||
            file.endsWith(".jpeg") ||
            file.endsWith(".webp")
        );
    });
    for (const filePath of originalImages) {
        const inputFilePath = path.join(pathToOriginalImages, filePath);
        const metadata = await sharp(inputFilePath).metadata();

        await generateOg(inputFilePath);
        await generateTwitter(inputFilePath);
        await generateHero(inputFilePath, metadata);
        await generateSmall(inputFilePath, metadata);
    }
};
task("Create Images", async ({ setTitle }) => {
    await main();

    setTitle("Create Images done");
    console.log("Result:\t");
    console.log("Original:\t" + originalImages.length);
    console.log("Hero:\t\t" + heroCounter);
    console.log("Small:\t\t" + smallCounter);
    console.log("Og:\t\t" + ogCounter);
    console.log("Twitter:\t" + twitterCounter);
});
