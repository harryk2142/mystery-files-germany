import path from "path";

interface AstroImageObject {
    src: string;
    width: number;
    height: number;
    format: string;
}

export type GeneratedImagePaths = {
    originalName: string;
    // hero: string;
    // small: string;
    og: string;
    search: string;
    twitter: string;
    // Hier kannst du später easy weitere Pfade ergänzen (z.B. thumbnail: string)
};

/**
 * Analysiert das Astro-HeroImage und liefert die Pfade der
 * bereits generierten Bildvarianten im public-Ordner zurück.
 */
export function getGeneratedImagePaths(heroImage: AstroImageObject): GeneratedImagePaths {
    const srcPath = heroImage.src;
    let originalFilename = "";

    // 1. Dateinamen isolieren (Dev- vs. Build-Pfad)
    if (srcPath.startsWith("/@fs/")) {
        // IM DEV-MODUS: Pfad von Query-Parametern und Vite-Präfix befreien
        const cleanPath = srcPath.split("?")[0];
        originalFilename = cleanPath.substring(cleanPath.lastIndexOf("/") + 1);
    } else {
        // IM PRODUCTION-BUILD: Astro-Hash entfernen (z.B. bild.Bf9z1a8q.png -> bild.png)
        const cleanPath = srcPath.split("?")[0];
        const filenameWithHash = cleanPath.substring(cleanPath.lastIndexOf("/") + 1);
        originalFilename = filenameWithHash.replace(/\.[a-zA-Z0-9_-]{8}\./, ".");
    }
    console.log(originalFilename);

    // 2. Namensbasis ohne Endung extrahieren (falls du sie für die Generierung brauchst)
    const fileBaseName = path.parse(originalFilename).name;

    // 3. Objekt mit den Pfaden strukturieren (relativ zum public-Ordner)
    return {
        originalName: originalFilename,
        // Pfad für das Open-Graph-Bild (z.B. /og/og-aliens-im-cafe.webp)
        og: `/images/blog/${fileBaseName}.og.webp`,
        // Pfad für die interne Suche (z.B. /search/search-aliens-im-cafe.webp)
        search: `/images/blog/${fileBaseName}.small.webp`,
        twitter: `/images/blog/${fileBaseName}.twitter.webp`,
    };
}
