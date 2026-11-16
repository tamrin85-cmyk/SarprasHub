import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMeVuE2LaE_UfwyJRwB8DUbPCil-yHwK8",
  authDomain: "sarpras-smkn6-tb.firebaseapp.com",
  projectId: "sarpras-smkn6-tb",
  storageBucket: "sarpras-smkn6-tb.firebasestorage.app",
  messagingSenderId: "842238279297",
  appId: "1:842238279297:web:f7d4df6742d11c5f3c1780"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
