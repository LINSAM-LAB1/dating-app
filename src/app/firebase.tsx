

import { getAuth } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD34PZ_hqhXLM0VAdKJX5qxM1qg8f3r7Wk",
  authDomain: "dating-app-a689a.firebaseapp.com",
  projectId: "dating-app-a689a",
  storageBucket: "dating-app-a689a.firebasestorage.app",
  messagingSenderId: "801254071518",
  appId: "1:801254071518:web:d72f354e7311079c09764f"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth };
export { db };
