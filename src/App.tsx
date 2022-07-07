import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import SideBar from "./components/Sidebar";

function App() {
  return (
    <div className="grid grid-rows-[40px,1fr] grid-cols-[260px,1fr] h-screen w-full ">
      <Header />
      <SideBar />

      {/* <div> Chat goes here</div> */}
    </div>
  );
}

export default App;
