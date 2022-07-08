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

      {/* <div> Chat goes here</div> */}
    </div>
  );
}

export default App;
