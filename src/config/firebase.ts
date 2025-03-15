
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // This is a publishable config object - safe to include in client-side code
  apiKey: "YOUR_API_KEY", // Replace with your Firebase API key
  authDomain: "match-memory-game.firebaseapp.com", // Replace with your Firebase domain
  projectId: "match-memory-game", // Replace with your project ID
  storageBucket: "match-memory-game.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
