import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Helper to check both Vite standard (import.meta.env) and legacy/polyfill (process.env)
const getEnv = (key: string) => {
  const meta = import.meta as any;
  // Check VITE_ prefix first (Standard Vite)
  if (meta.env && meta.env[`VITE_${key}`]) {
    return meta.env[`VITE_${key}`];
  }
  // Check direct name (Standard Vite or specific overrides)
  if (meta.env && meta.env[key]) {
    return meta.env[key];
  }
  // Check process.env (Legacy/Polyfilled via vite.config.ts)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[`VITE_${key}`] || process.env[key];
  }
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnv('FIREBASE_API_KEY'),
  authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('FIREBASE_APP_ID')
};

let app;
let auth: firebase.auth.Auth | undefined;
let db: firebase.firestore.Firestore | undefined;

// Validate Config
const isConfigValid = Object.values(firebaseConfig).every(value => value !== undefined && value !== '');

if (isConfigValid) {
  try {
    if (!firebase.apps.length) {
      app = firebase.initializeApp(firebaseConfig);
    } else {
      app = firebase.app();
    }
    
    // Initialize services
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Optional: Enable offline persistence
    db.enablePersistence().catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn('Firebase persistence failed: Multiple tabs open.');
        } else if (err.code == 'unimplemented') {
            console.warn('Firebase persistence not supported in this browser.');
        }
    });

    console.log("🔥 Firebase initialized successfully.");
  } catch (e) {
    console.error("Firebase initialization error:", e);
  }
} else {
  console.log("⚠️ Firebase config missing. App running in Local Storage mode.");
  console.log("To enable Firebase, set VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc. in your .env file.");
}

export { app, auth, db };