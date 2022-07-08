import logo from "../logo512.png";
import React, { useContext, useState } from "react";
import LoginContext from "../Context";
import { queryUser } from "../config/firebase_config";

const LoginScreen: React.FC = () => {
  //for userInfo
  const loginContext = useContext(LoginContext);

  interface loginInterface {
    email?: string;
    password?: string;
  }
  const [loginInput, setLoginInput] = useState<loginInterface>({
    email: "",
    password: "",
  });

  //input states

  //login handler
  async function handeLogin(): Promise<void> {
    const result = await queryUser(loginInput);
    result["isLoggedIn"] = true;
    loginContext.setUserInfo(result);
  }

  return (
    <>
      <div className="flex-col gap-y-5 flex items-center mt-10 text-white justify-center h-100 md:h-fit w-screen my-4">
        <div className="flex h-fit items-center justify-center">
          <img src={logo} alt="react-logo" className="logo w-1/5"></img>
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-5xl font-bold"> Sign in to Slack</h1>
          <p>
            We suggest using the
            <span className="font-bold "> email you use at work.</span>
          </p>
        </div>
        <div className="flex flex-col gap-y-2 w-6/12 md:w-2/5 l:w-1/5 xl:w-1/5">
          <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Sign in with Google
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            Sign in with Apple
          </button>
        </div>
        <div className="flex flex-row gap-x-4 justify-center items-center l:w-5/12 xl:w-5/12 md:w-10/12 w-11/12 ">
          <hr className="w-1/5"></hr>
          <span>OR</span>
          <hr className="w-1/5"></hr>
        </div>
        <form
          method="post"
          action="/"
          className="md:w-2/5 w-6/12 l:w-1/5 xl:w-1/5"
          onSubmit={(e) => {
            e.preventDefault();
            handeLogin();
          }}
        >
          <div className="flex flex-col gap-y-2 justify-center">
            <div>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="name@work-email.com"
                value={loginInput.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setLoginInput((prev) => ({
                    ...prev,
                    email: value,
                  }));
                }}
              ></input>
            </div>
            <div>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  const value = e.target.value;
                  setLoginInput((prev) => ({
                    ...prev,
                    password: value,
                  }));
                }}
                value={loginInput.password}
              ></input>
            </div>
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
            >
              Sign in with email
            </button>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
              }}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
            >
              Create an Account
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginScreen;
