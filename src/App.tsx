import React, { FC, SetStateAction, useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SideBar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import ChatPanel from "./components/ChatPanel";
import { collection, onSnapshot } from "firebase/firestore";
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
  // const [isAuth, setIsAuth] = useState(false);
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

  return (
    <>
      <LoginContext.Provider value={value}>
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
            <AddChannel setAddChannel={setAddChannel} addChannel={addChannel} />
            <Routes>
              <Route path="/:panelId" element={<ChatPanel />}></Route>
              <Route
                path="/"
                element={<h1>This is a Slack Clone by Team RoRo</h1>}
              ></Route>
            </Routes>
          </div>
        )}
      </LoginContext.Provider>
    </>
  );
}

export default App;
