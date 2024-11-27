// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5IgAe_YcMtLoqXrUh8v_v1aY3qXax6-8",
  authDomain: "oracao24h-2ccb6.firebaseapp.com",
  projectId: "oracao24h-2ccb6",
  storageBucket: "oracao24h-2ccb6.firebasestorage.app",
  messagingSenderId: "821792681781",
  appId: "1:821792681781:web:fb9f2defe5906f70d2e67c",
  measurementId: "G-24Q8H66R4J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
