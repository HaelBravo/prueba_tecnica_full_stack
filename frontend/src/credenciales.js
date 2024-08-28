// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkCZm5dKihF5vQMXgQotOhwGaAp5NGYes",
  authDomain: "login-frontend-7fb22.firebaseapp.com",
  projectId: "login-frontend-7fb22",
  storageBucket: "login-frontend-7fb22.appspot.com",
  messagingSenderId: "796250392795",
  appId: "1:796250392795:web:5aad2b7f29b70f745b64fe"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;