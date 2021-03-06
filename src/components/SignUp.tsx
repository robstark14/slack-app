import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../config/firebase_config";
import LoginContext from "../Context";

interface propsInterface {
  setSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUp = ({ setSignUp }: propsInterface) => {
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);
  interface signUpContext {
    name: string;
    email: string;
    password: string;
    repassword: string;
  }

  const [isNew, setIsNew] = useState<boolean>(true);

  const [signUpInput, setSignUpInput] = useState<signUpContext>({
    name: "",
    email: "",
    password: "",
    repassword: "",
  });

  const handleSignUp = async (): Promise<void> => {
    if (signUpInput.password === signUpInput.repassword) {
      const newUser = {
        email: signUpInput.email,
        name: signUpInput.name,
        password: signUpInput.password,
      };
      await createUser(newUser).then((current: any) => {
        if (current.isNew) {
          console.log(current);
          loginContext.setUserInfo({
            isLoggedIn: true,
            name: current.current.name,
            accId: current.current.accId,
            email: current.current.email,
            password: current.current.password,
          });
          navigate("/");
          window.localStorage.setItem("currentUser", current.current.accId);
        } else {
          setIsNew(false);
        }
      });
    }
  };

  return (
    <>
      <h5 className="mx-auto text-bold text-center mb-4 text-2xl">Sign Up!</h5>
      {!isNew && (
        <p className="text-red-600 text-center">Email already exists</p>
      )}
      <div className="grid grid-cols-1 gap-y-2 items-center justify-center my-2">
        <input
          className="shadow appearance-none border rounded w-100 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="name@work-email.com"
          value={signUpInput.email}
          onChange={(e) => {
            setSignUpInput((prev: any) => ({
              ...prev,
              email: e.target.value,
            }));
          }}
        ></input>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Name"
          value={signUpInput.name}
          onChange={(e) => {
            setSignUpInput((prev: any) => ({
              ...prev,
              name: e.target.value,
            }));
          }}
        ></input>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Password"
          value={signUpInput.password}
          onChange={(e) => {
            setSignUpInput((prev: any) => ({
              ...prev,
              password: e.target.value,
            }));
          }}
        ></input>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="passwordcheck"
          type="password"
          placeholder="Confirm Password"
          value={signUpInput.repassword}
          onChange={(e) => {
            setSignUpInput((prev: any) => ({
              ...prev,
              repassword: e.target.value,
            }));
          }}
        ></input>
      </div>

      <div className="grid gap-y-1 grid-rows-2">
        <button
          type="button"
          onClick={handleSignUp}
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
        >
          Create an Account
        </button>
        <button
          onClick={() => {
            setSignUp(false);
          }}
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default SignUp;
