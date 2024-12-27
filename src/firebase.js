// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (tomada de tu configuración previa)
const firebaseConfig = {
  apiKey: "AIzaSyDKKTbYvQphUbUbYmthy3EWJvGrM8W-2w",
  authDomain: "locatme-3497e.firebaseapp.com",
  projectId: "locatme-3497e",
  storageBucket: "locatme-3497e.appspot.com",
  messagingSenderId: "146826760184",
  appId: "1:146826760184:web:47dadfeb750aa03037500d",
  measurementId: "G-9EEDXGB4JV"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

export { db };

