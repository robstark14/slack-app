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
  updateDoc,
  where,
} from "firebase/firestore";
import { FC, useEffect, useState, useContext, SetStateAction } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { db } from "../config/firebase_config";
import ChatNav from "./ChatNav";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

interface Props {
  setAddChannel: React.Dispatch<SetStateAction<boolean>>;
  userImageUrl: string | undefined;
  // downloadImage: () => void;
  setUserImageUrl: React.Dispatch<SetStateAction<string | undefined>>;
  downloadUserImage: () => void;
  setCurrentUserDetails: React.Dispatch<SetStateAction<any>>;
  currentUserDetails: any;
  getFile: React.Dispatch<any>;
  file: any;
  uploadImage: () => void;
}
export interface ChannelObjects {
  name: string;
  id: string;
  members: string[];
}
interface Users {
  name: string;
  // users: string;
}
interface SelectedUser {
  accId: string;
}
export interface UserDetails {
  userImage: string;
}
// interface NewMessageCount {
//   newMessageCount: number | null | undefined;
//   setNewMessageCount: () => number | null | undefined;
// }
const SideBar: FC<Props> = ({
  setAddChannel,
  userImageUrl,
  downloadUserImage,
  setUserImageUrl,
  setCurrentUserDetails,
  currentUserDetails,
  getFile,
  file,
  uploadImage,
}) => {
  const loginContext = useContext(LoginContext);
  const { userInfo, setUserInfo } = loginContext;
  const [channels, setChannels] = useState<ChannelObjects[]>([]);
  const [isNewMessage, setIsNewMessage] = useState<boolean>(false);
  const [users, setUsers] = useState<Users[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [directMessagesNav, setDirectMessagesNav] = useState<any>([]);
  const [showCurrentUserDetails, setShowCurrentUserDetails] =
    useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(currentUserDetails);

    getAllChannels();
    getDirectMessagesNav();

    downloadUserImage();
    onSnapshot(doc(db, "users", userInfo.accId), (snapshot: any) => {
      return setCurrentUserDetails(snapshot.data());
    });
  }, [userImageUrl]);

  const getAllChannels: Function = () => {
    onSnapshot(collection(db, "channels"), (snapshot) => {
      setChannels(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          members: doc.data().members,
        }))
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
          userImage: currentUserDetails.userImage,
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
      (snapshot) => {
        setDirectMessagesNav(snapshot.docs.map((doc) => ({ ...doc.data() })));
      }
      // console.log(snapshot.docs.map((doc) => ({ ...doc.data() })))
    );
  };

  return (
    <div className="w-[260px] h-screen bg-gray-900 shadow-lg text-white text-left items-center">
      <div className="flex justify-between items-center w-full h-[50px] border border-x-transparent  border-y-gray-800 p-4 bg-gray-900 ">
        <div
          className="flex items-center cursor-pointer hover:bg-slate-800 rounded pr-2"
          onClick={() => {
            setShowCurrentUserDetails(true);
          }}
        >
          <img
            src={
              currentUserDetails?.userImage
                ? currentUserDetails.userImage
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            }
            alt="img"
            className="w-[40px] h-[40px] mr-2 rounded object-cover"
          />
          <h1 className="font-bold w-fit">{userInfo.name}</h1>
        </div>
        <span
          className="material-symbols-outlined text-white btn"
          onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) =>
            handleNewMessage()
          }
        >
          edit_square
        </span>
      </div>
      {showCurrentUserDetails && (
        <div
          className="bg-black absolute top-0 left-0 w-screen h-screen opacity-90 z-10"
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget)
              setShowCurrentUserDetails((prev) => !prev);
          }}
        >
          <div className="relative top-[20%] left-[45%] h-max w-[320px] bg-gray-400 rounded shadow-md grid text-left overflow-hidden">
            <div
              className="absolute right-0 top-0  w-8 h-8 rounded-full btn"
              onClick={() => {
                setShowCurrentUserDetails(false);
              }}
            >
              <h1 className="text-center  text-[16px]">x</h1>
            </div>
            <h1 className="border-b-2 font-bold text-lg text-black w-full p-2 text-center">
              Upload Profile Image
            </h1>
            <div className="grid gap-4 w-full p-2">
              <img
                src={
                  currentUserDetails.userImage
                    ? currentUserDetails.userImage
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                alt="img"
                className="w-[150px] h-[150px] m-auto object-cover rounded-md"
              />
              <div className="bg-white rounded-md p-4 shadow-lg flex items-center m-auto">
                <label
                  htmlFor="image"
                  className="bg-gray-700 rounded p-1 hover:bg-gray-900 cursor-pointer mr-2"
                >
                  Browse..
                  <input
                    id="image"
                    type="file"
                    className="w-[100px] bg-gray-700 hidden"
                    onChange={(e: any) => {
                      e.preventDefault();
                      getFile(e.target.files[0]);
                    }}
                  />
                </label>
                <p className="text-black w-fit">{file?.name}</p>
              </div>
              <button className="btn bg-gray-900 rounded" onClick={uploadImage}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
      {isNewMessage && (
        <div
          className="bg-black absolute top-0 left-0 w-screen h-screen opacity-95 z-10"
          onClick={(e) => {
            e.preventDefault();
            if (e.target === e.currentTarget) {
              setIsNewMessage((prev) => !prev);
            }
          }}
        >
          <div className="relative top-[20%] left-[40%] h-[300px] w-[300px]  bg-gray-500 rounded shadow-md grid text-left text-black p-8 opacity-100">
            <div
              className="absolute right-0 top-0  w-8 h-8 rounded-full btn"
              onClick={() => {
                setIsNewMessage(false);
              }}
            >
              <h1 className="text-center  text-[16px] text-black">x</h1>
            </div>
            <h1 className="font-bold text-lg">Send new message to</h1>
            <ul className="overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-400">
              {users?.map((user: any) => (
                <div
                  className="flex items-center hover:bg-gray-800 hover:text-white btn p-2"
                  key={user.accId}
                >
                  <img
                    src={
                      user.userImage
                        ? user.userImage
                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    }
                    alt=""
                    className="w-[25px] h-[25px] mr-4 object-cover rounded"
                  />
                  <li
                    onClick={() => {
                      setSelectedUser(user);
                      setDirectMessageToDb();
                      getDirectMessagesNav();
                      setIsNewMessage(false);
                      navigate(`/${user.accId}`);
                    }}
                  >
                    {user?.name}
                  </li>
                </div>
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
        <div className="flex flex-col h-[150px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-400">
          {/* <span className="material-symbols-outlined scale-75 pr-2">lock</span>
          <span>batch19 </span> */}
          {channels.map((channel) => {
            if (channel.members.includes(loginContext.userInfo.accId)) {
              return (
                <div
                  className="flex items-center hover:bg-gray-300 hover:text-black h-fit btn py-0"
                  key={channel.id}
                >
                  <ChatNav
                    name={channel.name}
                    id={channel.id}
                    getDirectMessagesNav={getDirectMessagesNav}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
      <div className="btn flex items-center p-4 ">
        <span className="material-symbols-outlined">add</span>
        <span className="text-left w-full ">Browse Channels</span>
      </div>
      <div className="btn w-full items-center h-[35%]">
        <div className="flex">
          <span className="material-symbols-outlined">navigate_next </span>
          <h1>Direct messages</h1>
        </div>
        <div className="text-white w-full text-left h-[100%] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-400">
          {directMessagesNav?.map((dm: any) => {
            return (
              <div key={dm.id}>
                <ChatNav
                  name={dm.userName}
                  id={dm.userId}
                  getDirectMessagesNav={getDirectMessagesNav}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
