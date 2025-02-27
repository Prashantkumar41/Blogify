// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// console.log(import.meta.env.VITE_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-3b5b2.firebaseapp.com",
  projectId: "mern-blog-3b5b2",
  storageBucket: "mern-blog-3b5b2.firebasestorage.app",
  messagingSenderId: "385329048300",
  appId: "1:385329048300:web:831292c5d98527ffc753c9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
















