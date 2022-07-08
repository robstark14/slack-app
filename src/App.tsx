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
