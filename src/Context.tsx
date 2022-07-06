import { createContext } from "react";

const LoginContext = createContext({ isLoggedIn: false, userData: {} });

export default LoginContext;
