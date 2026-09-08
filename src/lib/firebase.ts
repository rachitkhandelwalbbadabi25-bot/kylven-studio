import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Client Firebase Project Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAQtb148wIL4SRZW3YiXDgq1wTNn8-ycUg",
  authDomain: "kreate-studio-d95f0.firebaseapp.com",
  databaseURL: "https://kreate-studio-d95f0-default-rtdb.firebaseio.com",
  projectId: "kreate-studio-d95f0",
  storageBucket: "kreate-studio-d95f0.firebasestorage.app",
  messagingSenderId: "854014484387",
  appId: "1:854014484387:web:5ca3bf5aab7dd247504416",
  measurementId: "G-ZDFFV14PK9"
};

// Singleton initialization: initialize Firebase only once
export const app: FirebaseApp = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApp();

// Firebase Authentication
export const auth: Auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Firebase Realtime Database
export const database: Database = getDatabase(app, firebaseConfig.databaseURL);

// Firebase Storage (for previews & assets)
export const storage: FirebaseStorage = getStorage(app);
