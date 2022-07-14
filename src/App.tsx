import React, { FC, SetStateAction, useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SideBar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import ChatPanel from "./components/ChatPanel";
import {
  collection,
  onSnapshot,
  query,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import { auth, db } from "./config/firebase_config";
import AddChannel from "./components/AddChannel";
import LoginScreen from "./components/LoginScreen";
import LoginContext, {
  footerDataInterface,
  userInfoInterface,
} from "./Context";
import Footer from "./components/Footer";
import { ChannelObjects } from "./components/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import useNewMessageContext from "./Context";
import NewMessageCountContext from "./NewMessageCountContext";

function App() {
  const [addChannel, setAddChannel] = useState<boolean>(false);
  //state managed by userInfo context provider
  const [userInfo, setUserInfo] = useState<userInfoInterface>({
    isLoggedIn: false,
    name: "",
    accId: "",
    email: "",
    password: "",
  });
  const [newMessageCount, setNewMessageCount] = useState<number>(0);
  // const [isAuth, setIsAuth] = useState(false);
  const value = { userInfo, setUserInfo, newMessageCount, setNewMessageCount };
  const newMessageValue = {
    newMessageCount: newMessageCount,
    setNewMessageCount: setNewMessageCount,
  };
  //see context.ts for footerData
  const footerData: footerDataInterface = {
    description:
      "A React/Firebase app made in fulfillment of AvionSchool's Requirements",
    labels: [
      {
        title: "Links",
        links: ["Roman", "Rob"],
        href: ["https://google.com", "https://yahoo.com"],
      },
    ],
  };

  // useEffect(() => {
  //   checkUserAuth();
  // }, [auth]);

  // const checkUserAuth:Function = () => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user !== null && user !== undefined) {
  //       setIsAuth(true);
  //     }
  //   });
  // };

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem("currentUser");
      if (existing) {
        const users = collection(db, "users");
        const req = query(users, where("accId", "==", existing), limit(1));
        getDocs(req)
          .then((res) => res.docs[0].data())
          .then((data) => {
            setUserInfo({
              isLoggedIn: true,
              name: data.name,
              password: data.password,
              email: data.email,
              accId: data.accId,
            });
          });
      }
    } catch (e) {}
  });

  return (
    <>
      <LoginContext.Provider value={value}>
        <NewMessageCountContext.Provider value={newMessageValue}>
          {!userInfo.isLoggedIn && (
            <div className="h-screen bg-gray-700 grid grid-rows-[70%, 30%] overflow-x-hidden grid-cols-1 justify-end items-end">
              <LoginScreen />
              <Footer {...footerData} />
            </div>
          )}
          {userInfo.isLoggedIn && (
            <div className="overflow-hidden grid grid-rows-[40px,1fr] grid-cols-[260px,1fr] h-screen w-screen ">
              <Header />
              <SideBar setAddChannel={setAddChannel} />
              {addChannel && (
                <AddChannel
                  setAddChannel={setAddChannel}
                  addChannel={addChannel}
                />
              )}
              <Routes>
                <Route path="/:panelId" element={<ChatPanel />}></Route>
                <Route
                  path="/"
                  element={<h1>This is a Slack Clone by Team RoRo</h1>}
                ></Route>
              </Routes>
            </div>
          )}
        </NewMessageCountContext.Provider>
      </LoginContext.Provider>
    </>
  );
}

export default App;
