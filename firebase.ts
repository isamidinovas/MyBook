// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUf9S3Aqty67hAcFzfbsBFiqRzPLODm70",
  authDomain: "bookshop-d37c0.firebaseapp.com",
  projectId: "bookshop-d37c0",
  storageBucket: "bookshop-d37c0.firebasestorage.app",
  messagingSenderId: "957475248763",
  appId: "1:957475248763:web:3dc4da8a41c8598e1ca0de",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
