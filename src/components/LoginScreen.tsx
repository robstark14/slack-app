import logo from "../logo512.png";
import { useContext } from "react";
import LoginContext from "../Context";
const LoginScreen = () => {
  const loginContext = useContext(LoginContext);
  return (
    <>
      {!loginContext.userInfo.isLoggedIn && (
        <div className="flex-col gap-y-4 flex items-center justify-center h-screen w-screen">
          <div className="flex items-center justify-center">
            <img src={logo} className="w-20"></img>
          </div>
          <div className="flex flex-col gap-y-2 items-center justify-center">
            <h1 className="text-4xl font-bold"> Sign in to Slack</h1>
            <p>
              We suggest using the
              <span className="font-bold"> email you use at work.</span>
            </p>
          </div>
          <div className="flex flex-col gap-y-2">
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              Sign in with Google
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
              Sign in with Apple
            </button>
          </div>
          <div className="flex flex-row gap-x-4 justify-center items-center w-screen">
            <hr className="w-56"></hr>
            <span>OR</span>
            <hr className="w-56"></hr>
          </div>
          <form
            method="post"
            action="/"
            onSubmit={(e) => {
              e.preventDefault();
              const newUserInfo = {
                name: "roman",
                isLoggedIn: true,
                accId: "289y282",
                email: "roman.cabalum@gmail.com",
              };
              loginContext.setUserInfo(newUserInfo);
              console.log(loginContext.userInfo);
            }}
          >
            <div className="flex flex-col gap-y-2 justify-center">
              <div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder="name@work-email.com"
                ></input>
              </div>
              <div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                ></input>
              </div>
              <button
                type="submit"
                className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign in with email
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default LoginScreen;
