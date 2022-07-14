import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { db } from "../config/firebase_config";
import LoginContext from "../Context";
import sample from "../sample.jpg";

const Header: React.FC = () => {
  const [recentModal, setRecentModal] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<string>("");
  const ref = useRef();
  const [userQueryResults, setUserQueryResults] = useState<any[]>([]);
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);
  const { userInfo, setUserInfo } = loginContext;
  useEffect(() => {
    const debounceFn = setTimeout(async () => {
      setUserQueryResults([]);
      if (searchUser === "") return;
      const users = collection(db, "users");
      const req = query(users, where("name", ">=", searchUser));
      const req2 = query(users, where("name", "<=", searchUser + "\uf8ff"));

      const NewData: any[] = [];
      await getDocs(req)
        .then((res) =>
          res.docs.forEach((doc) => {
            NewData.push(doc.data());
          })
        )
        .then(async () => {
          await getDocs(req2)
            .then((res) => {
              res.docs.forEach((res) => {
                NewData.push(res.data());
              });
            })
            .then(() => {
              setUserQueryResults((prev: any) => NewData.slice(0, 5));
              console.log(userQueryResults);
            });
        });
    }, 1000);
    return () => {
      clearTimeout(debounceFn);
    };
  }, [searchUser]);
  const setNewDirectMessageToDb: Function = async (queryAccId: any) => {
    try {
      userQueryResults.map(async (user: { name: string; accId: string }) => {
        if (queryAccId !== user.accId) return;
        await setDoc(doc(db, "users", userInfo.accId, "messages", user.accId), {
          userName: user.name,
          userId: user.accId,
          userImage: "",
          timestamp: serverTimestamp(),
        });
      });

      // console.log(directMsg);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleLogout = () => {
    setUserInfo({
      isLoggedIn: false,
      name: "",
      accId: "",
      email: "",
      password: "",
    });
    window.localStorage.clear();
    window.location.reload();
  };
  return (
    <div className="w-full h-full bg-gray-900 shadow-sm grid grid-cols-[1.85fr,7fr,1fr] gap-2 col-span-2">
      <div></div>
      <form
        className="flex items-center w-[90%]"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          className="w-[90%] h-2/3 opacity-30 rounded text-black focus:outline-none self-center p-2"
          placeholder="Search User"
          value={searchUser}
          onChange={(e) => {
            setSearchUser(e.target.value);
          }}
        />
        <button
          className="text-white text-right relative right-[30px] btn flex items-center"
          type="submit"
        >
          <span className=" material-symbols-outlined">search</span>
        </button>

        <div
          id="queryResult"
          className={`absolute top-[43px] w-[55%] h-fit flex flex-col gap-y-1 bg-gray-100 p-2 shadow-xl ${
            userQueryResults.length > 0 ? "" : "hidden"
          }`}
        >
          {userQueryResults.map((user: any) => (
            <div
              className="z-10 flex justify-between border-b-2 w-100 h-fit hover:bg-gray-300  hover:cursor-pointer bg-gray-100 rounded p-2"
              onClick={(e) => {
                e.preventDefault();
                setSearchUser("");
                navigate(`/${user.accId}`);
                setNewDirectMessageToDb(user.accId);
                setUserQueryResults([]);
              }}
            >
              <span className="font-bold">{user.name}</span>
              <span className="text-gray-400">{user.email}</span>
            </div>
          ))}
        </div>
      </form>
      <div
        className="flex items-center gap-x-2 group hover:cursor-pointer "
        onClick={handleLogout}
      >
        <span className="text-white group-hover:text-red-600">Logout </span>
        <span className=" material-symbols-outlined text-white group-hover:text-red-600">
          logout
        </span>
      </div>
    </div>
  );
};

export default Header;
{
  /* // if (membersQuery.length === 0) {return <></>} */
}
