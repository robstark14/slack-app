import logo from "../logo512.png";
import React, { useContext, useState } from "react";
import LoginContext from "../Context";
import {
  auth,
  createUser,
  provider,
  queryUser,
} from "../config/firebase_config";
import SignUp from "./SignUp";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const LoginScreen: React.FC = () => {
  //for userInfo
  const loginContext = useContext(LoginContext);
  const navigate = useNavigate();
  interface loginInterface {
    email?: string;
    password?: string;
    isIncorrect?: boolean;
  }

  const [loginInput, setLoginInput] = useState<loginInterface>({
    email: "",
    password: "",
  });
  const [isSignUp, setSignUp] = useState<boolean>(false);

  //input states

  //login handler
  async function handeLogin(): Promise<void> {
    try {
      await queryUser(loginInput).then((data: any) => {
        if (!data) return;
        if (data.password === loginInput.password) {
          loginContext.setUserInfo({
            isLoggedIn: true,
            name: data.name,
            accId: data.accId,
            email: data.email,
            password: data.password,
          });
          window.localStorage.setItem("currentUser", data.accId);
          navigate("/");
        } else {
          setLoginInput({
            email: loginInput.email,
            password: "",
            isIncorrect: true,
          });
        }
      });
    } catch (e: any) {
      setLoginInput({
        email: "",
        password: "",
        isIncorrect: true,
      });
    }
  }
  const signInWithGoogle: Function = async () => {
    try {
      const data = await signInWithPopup(auth, provider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(data);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = data.user;

      const current = await createUser({
        name: user.displayName,
        email: user.email,
        password: "",
      });

      loginContext.setUserInfo({
        isLoggedIn: true,
        name: current.current.name,
        accId: current.current.accId,
        email: current.current.email,
        password: current.current.password,
      });
      window.localStorage.setItem("currentUser", current.current.accId);
      // ...
    } catch (err: any) {
      console.log(err.message);
    }
  };
  return (
    <>
      <div className="flex-col gap-y-5 flex items-center mt-10 text-white justify-center md:h-fit w-screen my-4">
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
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.preventDefault();
              signInWithGoogle();
            }}
            className="bg-transparent group flex align-center justify-center group-hover:fill-white hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Sign in with Google
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32px"
              width="32px"
              className="fill-blue-700 group-hover:fill-white "
            >
              <path d="M 16.003906 14.0625 L 16.003906 18.265625 L 21.992188 18.265625 C 21.210938 20.8125 19.082031 22.636719 16.003906 22.636719 C 12.339844 22.636719 9.367188 19.664063 9.367188 16 C 9.367188 12.335938 12.335938 9.363281 16.003906 9.363281 C 17.652344 9.363281 19.15625 9.96875 20.316406 10.964844 L 23.410156 7.867188 C 21.457031 6.085938 18.855469 5 16.003906 5 C 9.925781 5 5 9.925781 5 16 C 5 22.074219 9.925781 27 16.003906 27 C 25.238281 27 27.277344 18.363281 26.371094 14.078125 Z" />
            </svg> */}
          </button>
          {/* <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            Sign in with Apple
          </button> */}
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
          {loginInput.isIncorrect && (
            <p className="text-red-600 text-center">
              Incorrect Email or Password
            </p>
          )}
          {!isSignUp && (
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
                      isIncorrect: false,
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
                      isIncorrect: false,
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
                onClick={(e) => {
                  e.preventDefault();
                  setSignUp(true);
                }}
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
              >
                Create an Account
              </button>
            </div>
          )}
          {isSignUp && <SignUp setSignUp={setSignUp} />}
        </form>
      </div>
    </>
  );
};

export default LoginScreen;
