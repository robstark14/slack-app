// Import the functions you need from the SDKs you need
import { v4 as uuidv4 } from "uuid";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  collection,
  getFirestore,
  query,
  where,
  limit,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
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

export const db = getFirestore(app);
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const queryUser: Function = async (login: {
  email: string;
  password: string;
}) => {
  const users = collection(db, "users");
  const req = query(users, where("email", "==", login.email), limit(1));
  return await getDocs(req).then((res) => res.docs[0].data());
};

export const createUser: Function = async (newUser: {
  email: string;
  name: string;
  password: string;
}): Promise<object> => {
  const newUuid: string = uuidv4();
  const users = doc(db, "users", newUuid);
  const current = {
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
    accId: newUuid,
  };
  await setDoc(users, current);
  const find = query(
    collection(db, "users"),
    where("email", "==", current.email),
    limit(1)
  );
  return await getDocs(find).then((res) => res.docs[0].data());
};

// const analytics = getAnalytics(app);
