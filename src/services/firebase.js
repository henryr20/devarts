import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA6YgK5zyQQtUbYBg6PNOf6FCoJuxCTr94",
  authDomain: "devarts-d89d6.firebaseapp.com",
  projectId: "devarts-d89d6",
  storageBucket: "devarts-d89d6.firebasestorage.app",
  messagingSenderId: "750083472100",
  appId: "1:750083472100:web:afd06a8b0e16c0f8220af1",
  measurementId: "G-9FZ59G19M2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

getAnalytics(app);