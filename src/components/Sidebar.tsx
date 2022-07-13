import LoginContext from "../Context";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { FC, useEffect, useState, useContext, SetStateAction } from "react";
import { Link, NavLink } from "react-router-dom";
import { db } from "../config/firebase_config";
import ChatNav from "./ChatNav";

interface Props {
  setAddChannel: React.Dispatch<SetStateAction<boolean>>;
}
export interface ChannelObjects {
  name: string;
  id: string;
}
interface Users {
  name: string;
  // users: string;
}
interface SelectedUser {
  accId: string;
}
const SideBar: FC<Props> = ({ setAddChannel }) => {
  const loginContext = useContext(LoginContext);
  const { userInfo, setUserInfo } = loginContext;
  const [channels, setChannels] = useState<ChannelObjects[]>([]);
  const [isNewMessage, setIsNewMessage] = useState<boolean>(false);
  const [users, setUsers] = useState<Users[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [directMessagesNav, setDirectMessagesNav] = useState<any>([]);
  useEffect(() => {
    getAllChannels();
    getDirectMessagesNav();
  }, []);

  const getAllChannels: Function = () => {
    onSnapshot(collection(db, "channels"), (snapshot) => {
      setChannels(
        snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }))
      );
    });
  };

  const handleNewMessage: Function = () => {
    setIsNewMessage(true);
    getUsers();
  };
  const getUsers: Function = () => {
    const q = query(
      collection(db, "users"),
      where("accId", "!=", userInfo.accId),
      orderBy("accId", "asc")
    );
    onSnapshot(q, (snapshot) =>
      setUsers(
        snapshot.docs.map((doc: any) => ({
          ...doc?.data(),
        }))
      )
    );
  };
  const setDirectMessageToDb: Function = async () => {
    try {
      await setDoc(
        doc(db, "users", userInfo.accId, "messages", selectedUser.accId),
        {
          userName: selectedUser.name,
          userId: selectedUser.accId,
          userImage: "",
          timestamp: serverTimestamp(),
        }
      );

      // console.log(directMsg);
    } catch (err: any) {
      console.log(err.message);
    }
  };
  const getDirectMessagesNav: Function = () => {
    const q = query(
      collection(db, "users", userInfo.accId, "messages"),
      orderBy("timestamp", "desc")
    );
    onSnapshot(
      q,
      (snapshot) =>
        setDirectMessagesNav(snapshot.docs.map((doc) => ({ ...doc.data() })))
      // console.log(snapshot.docs.map((doc) => ({ ...doc.data() })))
    );
  };
  return (
    <div className="w-[260px] h-screen bg-gray-900 shadow-lg text-white text-left items-center">
      <div className="flex justify-between w-full h-[50px] border border-x-transparent  border-y-gray-800 p-4 bg-gray-900 ">
        <h1 className="font-bold w-fit">{userInfo.name}</h1>
        <span
          className="material-symbols-outlined text-white btn"
          onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) =>
            handleNewMessage()
          }
        >
          edit_square
        </span>
      </div>
      {isNewMessage && (
        <div className="bg-black absolute top-0 left-0 w-screen h-screen opacity-80 z-10">
          <div className="relative top-[20%] left-1/3 h-[300px] w-[320px] md:w-[500px] bg-stone-100 rounded shadow-md grid text-left text-black p-8">
            <div
              className="absolute right-0 top-0  w-8 h-8 rounded-full btn"
              onClick={() => {
                setIsNewMessage(false);
              }}
            >
              <h1 className="text-center  text-[16px] text-black">x</h1>
            </div>
            <h1 className="font-bold">New Message to</h1>
            <ul>
              {users?.map((user: any) => (
                <li
                  className="hover:bg-gray-800 hover:text-white btn"
                  onClick={() => {
                    setSelectedUser(user);
                    setDirectMessageToDb();
                    setIsNewMessage(false);
                  }}
                >
                  {user?.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="text-left w-full ">
        <div className="flex justify-between items-center">
          <h1 className="p-4">Channels</h1>
          <span
            className="material-symbols-outlined btn scale-75 pr-2"
            onClick={() => {
              setAddChannel((prev) => !prev);
            }}
          >
            add
          </span>
        </div>
        <div className="grid">
          {/* <span className="material-symbols-outlined scale-75 pr-2">lock</span>
          <span>batch19 </span> */}
          {channels.map((channel) => (
            <div className="flex items-center hover:bg-gray-300 hover:text-black btn px-4 py-0">
              #<ChatNav name={channel.name} id={channel.id} />
            </div>
          ))}
        </div>
      </div>
      <div className="btn flex items-center p-4 ">
        <span className="material-symbols-outlined">add</span>
        <span className="text-left w-full ">Browse Channels</span>
      </div>
      <div className="btn w-full grid items-center">
        <div className="flex">
          <span className="material-symbols-outlined">navigate_next </span>
          <h1>Direct messages</h1>
        </div>
        <div className="text-white w-full grid text-left">
          {directMessagesNav?.map((dm: any) => {
            return (
              <div className="px-2">
                <ChatNav name={dm.userName} id={dm.userId} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
