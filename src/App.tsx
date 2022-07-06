import { useState } from "react";
import "./App.css";
import LoginScreen from "./components/LoginScreen";
import LoginContext from "./Context";
import { userInfoInterface } from "./Context";

function App() {
  const [userInfo, setUserInfo] = useState<userInfoInterface>({
    isLoggedIn: false,
    name: "",
    accId: "",
    email: "",
  });

  const value = { userInfo, setUserInfo };
  return (
    <>
      <LoginContext.Provider value={value}>
        <LoginScreen />
      </LoginContext.Provider>
    </>
  );
}

export default App;
