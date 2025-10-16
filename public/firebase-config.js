// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-functions.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz0wL5-jR-fwznu6SG4JQFY6VOu4zwuSg",
  authDomain: "devltd-website.firebaseapp.com",
  projectId: "devltd-website",
  storageBucket: "devltd-website.firebasestorage.app",
  messagingSenderId: "1041378931193",
  appId: "1:1041378931193:web:72eca677148f0e470bcd28",
  measurementId: "G-11Q2ZHP7E6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const functions = getFunctions(app, 'us-central1');

// Uncomment for local testing:
// connectFunctionsEmulator(functions, "localhost", 5001);

export { app, analytics, functions, httpsCallable };
