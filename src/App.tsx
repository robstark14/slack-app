import { useContext, useState } from "react";
import "./App.css";
import LoginScreen from "./components/LoginScreen";
import LoginContext from "./Context";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const value = { isLoggedIn, setIsLoggedIn };
  return (
    <>
      <LoginContext.Provider value={value}>
        <LoginScreen />
      </LoginContext.Provider>
    </>
  );
}

export default App;
