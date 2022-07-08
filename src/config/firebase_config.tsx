// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, get, query, equalTo } from "firebase/database";

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

export const queryUser: Function = async (login: {
  email: string;
  password: string;
}) => {
  const dbRef = ref(getDatabase(app), "users");
  const res = query(dbRef, equalTo(login.email));
  return await get(res).then((response) => {
    return response.val().password === login.password
      ? response.val()
      : { msg: "failed" };
  });
};
