import { createContext, useContext } from "react";

export interface userInfoInterface {
  isLoggedIn?: boolean;
  name: string;
  accId: string;
  email: string;
  password: string;
}
export interface footerDataInterface {
  description?: string;
  labels: { title: string; links: string[]; href: string[] }[];
}

interface LoginContextInterface {
  userInfo: userInfoInterface;
  setUserInfo: Function;
}

const LoginContext = createContext<LoginContextInterface>({
  userInfo: { isLoggedIn: false, name: "", accId: "", email: "", password: "" },
  setUserInfo: (state: void) => {},
});

export default LoginContext;
