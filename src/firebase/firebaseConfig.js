import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// **PASTE YOUR ACTUAL CONFIG HERE**
const firebaseConfig = {
  apiKey: "AIzaSyD_AajZWQVtC6nC7AXBFESHSrcikKLbl9c",
  authDomain: "student-shelf-9f44a.firebaseapp.com",
  projectId: "student-shelf-9f44a",
  storageBucket: "student-shelf-9f44a.firebasestorage.app",
  messagingSenderId: "885981393644",
  appId: "1:885981393644:web:4af2fee7eb97d47689abc9",
  measurementId: "G-CLH7ZZTM0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// You can also export the app instance if needed for other services (like Storage)
export default app;