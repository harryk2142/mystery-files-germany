// Import the functions you need from the SDKs you need

import { connectFirestoreEmulator, getFirestore } from "@firebase/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD1nZqbuHh4KgpBOhapzpoG_dmhaKpaiW8",
    authDomain: "my-blog-42.firebaseapp.com",
    projectId: "my-blog-42",
    storageBucket: "my-blog-42.firebasestorage.app",
    messagingSenderId: "1076442557584",
    appId: "1:1076442557584:web:a7d068cdd2d589b1913c15",
    measurementId: "G-TH52GSRF2Y",
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
if (import.meta.env.DEV) {
    connectFirestoreEmulator(db, "127.0.0.1", 8088);

    console.log("✔ Firebase: Emulator-Modus aktiv (Port 8088)");
}
