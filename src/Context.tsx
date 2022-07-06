import { createContext } from "react";
export interface userInfoInterface {
  isLoggedIn: boolean;
  name: string;
  accId: string;
  email: string;
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
