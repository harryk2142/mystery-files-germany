// Importiere nur den Vertrag aus dem anderen Ordner

import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from "@firebase/firestore";
import type { BlogRepository, Comment } from "../blog-interactions/types";
import { db } from "./config";

const FIRESTORE_DB_PATH = "mystery-files-germany-blog";

// Der Adapter setzt den Vertrag in Firebase-Sprache um
export const firestoreBlogRepository: BlogRepository = {
    incrementLikes: async (slug: string) => {
        const postRef = doc(db, FIRESTORE_DB_PATH, slug);

        // Erstellt das Dokument mit likeCount: 1, falls es nicht existiert.
        // Erhöht um 1, falls es bereits existiert.
        await setDoc(
            postRef,
            {
                likeCount: increment(1),
            },
            { merge: true },
        );
    },
    getLikes: async (slug: string): Promise<number> => {
        const postRef = doc(db, FIRESTORE_DB_PATH, slug);
        const docSnap = await getDoc(postRef);

        if (docSnap.exists()) {
            return docSnap.data().likeCount ?? 0;
        } else {
            return 0;
        }
    },
    // === NEU: Kommentare abrufen ===
    getComments: async (slug: string): Promise<Comment[]> => {
        const commentsRef = collection(db, FIRESTORE_DB_PATH, slug, "comments");

        // Wir sortieren aufsteigend (asc) nach Erstellungsdatum
        const q = query(commentsRef, orderBy("createdAt", "asc"));

        const snapshot = await getDocs(q);

        // Mappe die Firestore-Dokumente auf unser TypeScript-Interface
        const comments: Comment[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                authorName: data.authorName,
                text: data.text,
                parentId: data.parentId || null,
                // Firestore speichert ein spezielles Timestamp-Objekt.
                // Mit .toDate() machen wir ein normales JavaScript-Date daraus.
                // Fallback auf new Date(), falls createdAt ganz frisch ist und vom Server noch fehlt.
                createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
            };
        });

        return comments;
    },

    // === NEU: Kommentar hinzufügen ===
    addComment: async (slug: string, commentData) => {
        // 1. Referenz zur Subcollection "comments" dieses spezifischen Posts
        const commentsRef = collection(db, FIRESTORE_DB_PATH, slug, "comments");

        // 2. Den Kommentar in die Subcollection schreiben
        await addDoc(commentsRef, {
            authorName: commentData.authorName,
            text: commentData.text,
            parentId: commentData.parentId, // Ist entweder eine ID (String) oder null
            createdAt: serverTimestamp(), // Firebase setzt die genaue Serverzeit
        });

        // 3. Den commentCount im Hauptdokument um 1 erhöhen
        const postRef = doc(db, FIRESTORE_DB_PATH, slug);
        await setDoc(
            postRef,
            {
                commentCount: increment(1),
            },
            { merge: true },
        );
    },

    getCommentCount: async (slug: string): Promise<number> => {
        const postRef = doc(db, FIRESTORE_DB_PATH, slug);
        const docSnap = await getDoc(postRef);

        if (docSnap.exists()) {
            return docSnap.data().commentCount ?? 0;
        } else {
            return 0;
        }
    },
};
