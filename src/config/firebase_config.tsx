// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  collection,
  getFirestore,
  getDoc,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";

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
  databaseURL: "slack-app-17978.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const queryUser: Function = async (login: {
  email: string;
  password: string;
}) => {
  const db = getFirestore(app);
  const users = collection(db, "users");
  const req = query(users, where("email", "==", login.email), limit(1));
  return await getDocs(req).then((res) => res.docs[0].data());
};
