import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// __dirname für ES-Module nachbauen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, "export_data.json");
const outputPath = path.resolve(__dirname, "export_data_new.json");

// Interfaces für Typsicherheit (Altes Schema)
interface OldComment {
    id: string;
    date: Date;
    author: string;
    text: string;
    parentId?: string;
}

interface OldRecord {
    id: string;
    likeCount: number;
    identifier: string;
    __subcollections__?: {
        comments?: OldComment[];
        [key: string]: any;
    };
    [key: string]: any;
}

// Interfaces für Typsicherheit (Neues Schema)
interface NewComment {
    id: string;
    authorName: string;
    text: string;
    parentId: string | null;
    createdAt: Date;
}

interface NewRecord {
    id: string;
    likeCount: number;
    commentCount: number;
    __subcollections__?: {
        comments?: NewComment[];
        [key: string]: any;
    };
    [key: string]: any;
}

function migrateData() {
    if (!fs.existsSync(inputPath)) {
        console.error(`❌ Fehler: Eingabedatei nicht gefunden unter ${inputPath}`);
        process.exit(1);
    }

    console.log(`Lese alte Daten aus '${path.basename(inputPath)}'...`);
    const rawData = fs.readFileSync(inputPath, "utf-8");
    const oldData: OldRecord[] = JSON.parse(rawData);

    console.log(`Transformiere ${oldData.length} Datensätze in das neue Schema...`);

    const migratedData: NewRecord[] = oldData.map((oldItem) => {
        const oldComments = oldItem.__subcollections__?.comments || [];

        // 1. Subcollection 'comments' transformieren
        const newComments: NewComment[] = oldComments.map((oldComment) => {
            return {
                id: oldComment.id, // Bestehende ID behalten, um Relationen nicht zu verlieren
                authorName: oldComment.author,
                text: oldComment.text,
                parentId: oldComment.parentId || null, // Explizit null setzen, falls undefined
                createdAt: oldComment.date,
            };
        });

        // 2. Hauptdokument transformieren
        // Wir kopieren eventuelle Zusatzfelder via Spread, passen aber die Kernfelder an
        const { id, identifier, __subcollections__, ...restFields } = oldItem;

        const newItem: NewRecord = {
            id: identifier || id, // Der alte 'identifier' wird zur neuen Haupt-ID
            ...restFields,
            commentCount: newComments.length, // Dynamisch berechnete Anzahl der Kommentare
        };

        // 3. Subcollections wieder einhängen, falls sie existierten
        if (__subcollections__) {
            newItem.__subcollections__ = {
                ...__subcollections__,
                comments: newComments,
            };
        }

        return newItem;
    });

    // 4. Transformierte Daten speichern
    console.log(`Speichere migrierte Daten in '${path.basename(outputPath)}'...`);
    fs.writeFileSync(outputPath, JSON.stringify(migratedData, null, 2), "utf-8");

    console.log(`✅ Migration erfolgreich! Du kannst nun die neue Datei für den Import nutzen.`);
}

migrateData();
