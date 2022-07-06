import { useContext } from "react";
import "./App.css";
import LoginScreen from "./components/LoginScreen";
import LoginContext from "./Context";

function App() {
  const userContext = useContext(LoginContext);
  return <>{!userContext.isLoggedIn && <LoginScreen />}</>;
}

export default App;
