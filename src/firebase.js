import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  getDoc,
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  where
} from "firebase/firestore";

// إعدادات فايربيز الخاصة بمشروع المستخدم
const firebaseConfig = {
  apiKey: "AIzaSyBLrzXP6H5U9McX4k6rlE5TOc5CLwdupsc",
  authDomain: "study-17808.firebaseapp.com",
  projectId: "study-17808",
  storageBucket: "study-17808.firebasestorage.app",
  messagingSenderId: "590271643123",
  appId: "1:590271643123:web:1709adf8cf7fbc8cc82686",
  measurementId: "G-FT6WP5JL1C"
};

// تهيئة تطبيق فايربيز
const app = initializeApp(firebaseConfig);

// تهيئة قاعدة بيانات Firestore
export const db = getFirestore(app);

export {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  where
};
