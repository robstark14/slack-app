<<<<<<< HEAD
import React, { FC, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import SideBar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import ChatPanel from "./components/ChatPanel";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./config/firebase_config";
import AddChannel from "./components/AddChannel";

function App() {
  const [channels, setChannels] = useState<object[]>([]);
  useEffect(() => {
    getAllChannels();
  }, [channels]);
  const getAllChannels = () => {
    onSnapshot(collection(db, "channels"), (snapshot) => {
      setChannels(
        snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }))
      );
    });
  };
  return (
    <div className="grid grid-rows-[40px,1fr] grid-cols-[260px,1fr] h-screen w-full ">
      <Header />
      <SideBar channels={channels} />
      <Routes>
        <Route path="/chatPanel/:panelId" element={<ChatPanel />}></Route>
        <Route path="/addChannel" element={<AddChannel />}></Route>
      </Routes>
=======
import "./App.css";
import Header from "./components/Header";
import SideBar from "./components/Sidebar";
import { useState } from "react";
import "./App.css";
import LoginScreen from "./components/LoginScreen";
import LoginContext, {
  footerDataInterface,
  userInfoInterface,
} from "./Context";
import Footer from "./components/Footer";

function App() {
  //state managed by userInfo context provider
  const [userInfo, setUserInfo] = useState<userInfoInterface>({
    isLoggedIn: false,
    name: "",
    accId: "",
    email: "",
  });
>>>>>>> a5615e16b5ed021893569a37abba58c6372da0e7

  const value = { userInfo, setUserInfo };

  //see context.ts for footerData
  const footerData: footerDataInterface = {
    description: "bkjbjbjasbdbasdsadsasa",
    labels: [
      {
        title: "Links",
        links: ["link1", "link2"],
        href: ["https://google.com", "https://yahoo.com"],
      },
    ],
  };

  return (
    <>
      <LoginContext.Provider value={value}>
        {!userInfo.isLoggedIn && (
          <div className="h-screen md:h-fit overflow-hidden bg-gray-700 flex flex-col justify-end">
            <LoginScreen />
            <Footer {...footerData /*must use spread operator */} />
          </div>
        )}
        {userInfo.isLoggedIn && (
          <div className="grid grid-rows-[40px,1fr] grid-cols-[260px,1fr] h-screen w-full ">
            <Header />
            <SideBar />

            {/* <div> Chat goes here</div> */}
          </div>
        )}
      </LoginContext.Provider>
    </>
  );
}

export default App;
