import { createContext } from "react";

interface LoginContextInterface {
  isLoggedIn: boolean;
  setIsLoggedIn: any;
}

const LoginContext = createContext<LoginContextInterface>({
  isLoggedIn: false,
  setIsLoggedIn: (state: boolean) => {},
});

export default LoginContext;
