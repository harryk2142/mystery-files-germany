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
    // --- PRODUKTIONS MODUS ---
    console.log("🌍 VERBINDE MIT PRODUKTIONS-DATENBANK 🌍");

    // 2. Pfad zum Service Account Key
    const serviceAccountPath = path.resolve(__dirname, "./my-blog-42-firebase-adminsdk-bw9x5-c938efb07f.json");
    if (!fs.existsSync(serviceAccountPath)) {
        console.error(`Fehler: Service Account Key nicht gefunden unter ${serviceAccountPath}`);
        process.exit(1);
    }

    const serviceAccountRaw = fs.readFileSync(serviceAccountPath, "utf-8");
    const serviceAccount = JSON.parse(serviceAccountRaw);

    // 3. Firebase Admin modular initialisieren
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const db = getFirestore();

/**
 * Rekursive Funktion, um Daten (inklusive Subcollections) in Firestore zu schreiben.
 * collectionRef ist 'any', um TS-ESM-Konflikte zu vermeiden.
 */
async function restoreCollectionData(collectionRef: any, data: any[]) {
    for (const item of data) {
        // id und __subcollections__ aus dem Objekt extrahieren, der Rest sind die eigentlichen Dokumentdaten
        const { id, __subcollections__, ...docData } = item;

        if (!id) {
            console.warn("Überspringe Datensatz ohne ID:", item);
            continue;
        }

        // Dokument referenzieren und Daten schreiben (.set überschreibt existierende Daten)
        const docRef = collectionRef.doc(id);
        await docRef.set(docData);

        // Prüfen, ob Subcollections existieren und diese rekursiv verarbeiten
        if (__subcollections__) {
            for (const [subCollName, subCollData] of Object.entries(__subcollections__)) {
                const subCollRef = docRef.collection(subCollName);
                await restoreCollectionData(subCollRef, subCollData as any[]);
            }
        }
    }
}

/**
 * Hauptfunktion für den Import
 */
async function importCollection(collectionName: string, inputFilename: string) {
    const inputPath = path.resolve(__dirname, `${inputFilename}`);

    if (!fs.existsSync(inputPath)) {
        console.error(`❌ Fehler: Die Datei ${inputPath} existiert nicht.`);
        process.exit(1);
    }

    console.log(`Lese Daten aus '${inputFilename}'...`);
    const rawData = fs.readFileSync(inputPath, "utf-8");
    const importData = JSON.parse(rawData);

    if (!Array.isArray(importData)) {
        console.error("❌ Fehler: Die JSON-Datei muss ein Array von Dokumenten enthalten.");
        process.exit(1);
    }

    console.log(`Starte tiefen Import in die Collection: '${collectionName}'...`);

    try {
        const rootCollectionRef = db.collection(collectionName);
        await restoreCollectionData(rootCollectionRef, importData);

        console.log(`✅ Import erfolgreich abgeschlossen!`);
    } catch (error) {
        console.error("❌ Fehler beim Importieren der Daten:", error);
    } finally {
        process.exit(0);
    }
}

// 4. Skript ausführen
const TARGET_COLLECTION = "mystery-files-germany-blog"; // <-- Ziel-Collection
const INPUT_FILE = "export_data_new.json"; // <-- Deine exportierte Datei

importCollection(TARGET_COLLECTION, INPUT_FILE);
