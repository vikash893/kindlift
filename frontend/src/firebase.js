// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics — lazy init, skip if blocked (ad blockers, mobile privacy settings)
try {
  if (typeof window !== 'undefined') {
    import("firebase/analytics").then(({ getAnalytics }) => {
      getAnalytics(app);
    }).catch(() => {});
  }
} catch (e) {
  // Analytics is optional — don't crash if it fails
  
}

export default app;