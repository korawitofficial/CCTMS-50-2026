/**
 * firebaseConfig.js
 * ----------------------------------------------------------------
 * Firebase initialization. Get these values from:
 * Firebase Console → Project Settings → General → Your apps → SDK setup and configuration
 * ----------------------------------------------------------------
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyBbLkqrend80WgqJfA2cJSZ8IKz4VaUVoc",
  authDomain: "cctms-50-2026.firebaseapp.com",
  databaseURL: "https://cctms-50-2026-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cctms-50-2026",
  storageBucket: "cctms-50-2026.firebasestorage.app",
  messagingSenderId: "273419328225",
  appId: "1:273419328225:web:9607650b676be53ff435a0",
  measurementId: "G-JY9BS82N78"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * NOTE ON IMPORTS:
 * This file uses the Firebase CDN "gstatic" ES Module URLs so it can run
 * directly in the browser with no build step (matches the rest of this
 * project, which uses plain <script type="module">).
 *
 * If you later add a bundler (Vite/Webpack) and `npm install firebase`,
 * switch these imports to the bare package form instead, e.g.:
 *   import { initializeApp } from 'firebase/app';
 *   import { getFirestore } from 'firebase/firestore';
 *   import { getAuth, GoogleAuthProvider } from 'firebase/auth';
 *   import { getStorage } from 'firebase/storage';
 */
