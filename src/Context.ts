import { createContext } from "react";

export interface userInfoInterface {
  isLoggedIn: boolean;
  name: string;
  accId: string;
  email: string;
}
export interface footerDataInterface {
  description?: string;
  labels: { title: string; links: string[]; href: string[] }[];
}

interface LoginContextInterface {
  userInfo: userInfoInterface;
  setUserInfo: any;
}

const LoginContext = createContext<LoginContextInterface>({
  userInfo: { isLoggedIn: false, name: "", accId: "", email: "" },
  setUserInfo: (state: void) => {},
});

export default LoginContext;
