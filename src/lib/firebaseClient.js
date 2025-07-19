import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBvkZ5IgR9e5q7WVaRrhiqW1y4un7o5UTM",
  authDomain: "arfed-authentication.firebaseapp.com",
  projectId: "arfed-authentication",
  storageBucket: "arfed-authentication.appspot.com",
  messagingSenderId: "1034488262064",
  appId: "1:1034488262064:web:4cc2a67a7fb52fa7effa75"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export default app;