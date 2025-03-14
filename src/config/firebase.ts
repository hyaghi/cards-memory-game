
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtI0MgtYe9BxUdWaNuQFTHCjTbJRwVrMQ", // This is a public API key, safe to include in client-side code
  authDomain: "yaghiaiacademy-fef26.firebaseapp.com",
  projectId: "yaghiaiacademy-fef26",
  storageBucket: "yaghiaiacademy-fef26.appspot.com",
  messagingSenderId: "623686818849",
  appId: "1:623686818849:web:1234567890abcdef", // You'll need to replace this with the actual appId from your Firebase console
  measurementId: "G-XXXXXXXXXX" // Replace with your measurement ID if you want to use Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics if supported
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
