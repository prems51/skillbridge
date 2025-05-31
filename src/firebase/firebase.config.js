import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';




// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDto0Xcueu7gfUNrym29H3A3VA9xNYU2Ik",
  authDomain: "skillbridge-14c7c.firebaseapp.com",
  projectId: "skillbridge-14c7c",
  storageBucket: "skillbridge-14c7c.firebasestorage.app",
  messagingSenderId: "625357797567",
  appId: "1:625357797567:web:69d80f5878ab463efd6e0a",
  measurementId: "G-C81WHGZG99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { serverTimestamp };
const analytics = getAnalytics(app);