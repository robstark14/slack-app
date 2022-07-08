// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrOcaDJ8I9kLSx0u28BZxH9WiUXYpRA-Y",
  authDomain: "slack-app-17978.firebaseapp.com",
  projectId: "slack-app-17978",
  storageBucket: "slack-app-17978.appspot.com",
  messagingSenderId: "306400928071",
  appId: "1:306400928071:web:7c552122ae1d3198292c62",
  measurementId: "G-NVGDHSRD88",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
