import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "url";

import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// 1. __dirname für ES-Module (ESM) nachbauen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.FIRESTORE_EMULATOR_HOST) {
    // --- LOKALER EMULATOR MODUS ---
    console.log(`⚠️ VERBINDE MIT LOKALEM EMULATOR (${process.env.FIRESTORE_EMULATOR_HOST}) ⚠️`);

    initializeApp({
        // Für den Emulator brauchst du keinen Service Account, nur die Projekt-ID.
        // Das 'demo-'-Präfix stellt sicher, dass Firebase garantiert nichts in die Cloud sendet.
        projectId: "my-blog-42",
    });
} else {
    // 2. Pfad zum Service Account Key (JSON-Datei)
    // ACHTUNG: Diese Datei niemals in Git einchecken (.gitignore anpassen!)
    const serviceAccountPath = path.resolve(__dirname, "./my-blog-42-firebase-adminsdk-bw9x5-c938efb07f.json");

    if (!fs.existsSync(serviceAccountPath)) {
        console.error(`Fehler: Service Account Key nicht gefunden unter ${serviceAccountPath}`);
        process.exit(1);
    }

    // 3. JSON-Datei manuell lesen und parsen (da require() in ESM nicht existiert)
    const serviceAccountRaw = fs.readFileSync(serviceAccountPath, "utf-8");
    const serviceAccount = JSON.parse(serviceAccountRaw);

    // 4. Firebase Admin modular initialisieren
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const db = getFirestore();

/**
 * Rekursive Funktion, um eine Collection inklusive aller Subcollections auszulesen.
 */
async function fetchCollectionData(collectionRef: any): Promise<any[]> {
    const snapshot = await collectionRef.get();
    const data: any[] = [];

    for (const doc of snapshot.docs) {
        const docData: any = {
            id: doc.id,
            ...doc.data(),
        };

        // Suche nach Subcollections im aktuellen Dokument
        const subcollections = await doc.ref.listCollections();

        if (subcollections.length > 0) {
            docData.__subcollections__ = {};

            // Gehe durch alle gefundenen Subcollections und rufe sie rekursiv ab
            for (const subColl of subcollections) {
                // console.log(`  -> Lese Subcollection '${subColl.id}' von Dokument '${doc.id}'...`);
                docData.__subcollections__[subColl.id] = await fetchCollectionData(subColl);
            }
        }

        data.push(docData);
    }

    return data;
}

/**
 * Exportiert eine spezifische Firestore Collection in eine JSON-Datei.
 * @param collectionName Der Name der Collection (z.B. 'users' oder 'charging_sessions')
 * @param outputFilename Der Name der Zieldatei
 */
async function exportCollection(collectionName: string, outputFilename: string) {
    console.log(`Starte tiefen Export der Collection: '${collectionName}' (inkl. Subcollections)...`);

    try {
        const collectionRef = db.collection(collectionName);
        const exportData = await fetchCollectionData(collectionRef);

        if (exportData.length === 0) {
            console.log(`Die Collection '${collectionName}' ist leer oder existiert nicht.`);
            return;
        }

        // Zielpfad definieren und Datei schreiben
        const outputPath = path.resolve(__dirname, `${outputFilename}`);
        fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), "utf-8");

        console.log(`✅ Export erfolgreich abgeschlossen! Daten gespeichert in: ${outputPath}`);
    } catch (error) {
        console.error("❌ Fehler beim Exportieren der Daten:", error);
    } finally {
        process.exit(0);
    }
}

// 3. Skript ausführen (Passe den Collection-Namen hier an)
const TARGET_COLLECTION = "mystery-files-germany-blog"; // <-- Hier deine Collection eintragen
const datum = new Date();
const formattedDate = `${datum.getFullYear()}-${datum.getMonth() + 1}-${datum.getDate()}_${datum.getHours()}-${datum.getMinutes()}-${datum.getSeconds()}`;

const OUTPUT_FILE = "export_data.json";

exportCollection(TARGET_COLLECTION, OUTPUT_FILE);
exportCollection(TARGET_COLLECTION, formattedDate + "_" + OUTPUT_FILE);
