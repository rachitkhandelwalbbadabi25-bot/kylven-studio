import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Client Firebase Project Configuration
// Supports environment overrides with strict default fallback to the authoritative kreate-studio-d95f0 project.
export const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyAQtb148wIL4SRZW3YiXDgq1wTNn8-ycUg",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "kreate-studio-d95f0.firebaseapp.com",
  databaseURL: import.meta.env?.VITE_FIREBASE_DATABASE_URL || "https://kreate-studio-d95f0-default-rtdb.firebaseio.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "kreate-studio-d95f0",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "kreate-studio-d95f0.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "854014484387",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:854014484387:web:5ca3bf5aab7dd247504416",
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-ZDFFV14PK9"
};

// Singleton initialization: initialize Firebase only once
export const app: FirebaseApp = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApp();

// Firebase Authentication
export const auth: Auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: "select_account"
});

// Firebase Realtime Database
export const database: Database = getDatabase(app, firebaseConfig.databaseURL);

// Firebase Storage (for previews & assets)
export const storage: FirebaseStorage = getStorage(app);
