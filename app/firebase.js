import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

// Firebase configuration
// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCb8y9xbAdgn3sHTNrMsWLXG0N1utsk4M",
  authDomain: "pantryapp-19360.firebaseapp.com",
  projectId: "pantryapp-19360",
  storageBucket: "pantryapp-19360.appspot.com",
  messagingSenderId: "508214670209",
  appId: "1:508214670209:web:d2e4581f1fa75347a0ae80",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// get database
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export { app, db, provider, auth };
