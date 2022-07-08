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
import LoginScreen from "./components/LoginScreen";
import LoginContext, {
  footerDataInterface,
  userInfoInterface,
} from "./Context";
import Footer from "./components/Footer";
function App() {
  const [channels, setChannels] = useState<object[]>([]);
  //state managed by userInfo context provider
  const [userInfo, setUserInfo] = useState<userInfoInterface>({
    isLoggedIn: false,
    name: "",
    accId: "",
    email: "",
    password: "",
  });

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
  const value = { userInfo, setUserInfo };

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

  return (
    <>
      <LoginContext.Provider value={value}>
        {!userInfo.isLoggedIn && (
          <div className="h-screen bg-gray-700 grid grid-rows-[70%, 30%] overflow-x-hidden grid-cols-1 justify-end items-end">
            <LoginScreen />
            <Footer {...footerData /*must use spread operator */} />
          </div>
        )}
        {userInfo.isLoggedIn && (
          <div className="grid grid-rows-[40px,1fr] grid-cols-[260px,1fr] h-screen w-full ">
            <Header />
            <SideBar channels={channels} />

            <Routes>
              <Route path="/chatPanel/:panelId" element={<ChatPanel />}></Route>
              <Route path="/addChannel" element={<AddChannel />}></Route>
            </Routes>
          </div>
        )}
      </LoginContext.Provider>
    </>
  );
}

export default App;
