import LoginContext from "../Context";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentSnapshot,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  getDocs,
  limit,
} from "firebase/firestore";

import React, {
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useParams } from "react-router-dom";
import { db, queryUser } from "../config/firebase_config";
import ChatMessages from "./ChatMessages";
import newMessageCountContext from "../NewMessageCountContext";

// type Props = {};
// interface ChannelDetails {
//   // channelDetails:null|object
//   setChannelDetails: React.Dispatch<SetStateAction<object>>;
//   name: string|undefined|null;

// }
interface ChannelMessages {
  user: string;
  userImage: string;
  message: string;
  timestamp: string;
  seconds: number;
  setChannelMessages: React.Dispatch<SetStateAction<object[] | undefined>>;
  channelMessages: object[] | null;
}
interface ChannelDetails {
  name: string;
  channelCreation: any;
  channelCreator: string;
  members: object[];
}
interface UserDetails {
  name: string;
  email: string;
  accId: string;
}
interface AllDirectMessages {
  fromAccId: string;
  from: string;
  message: string;
  timestamp: string;
  allDirectMessages: object[] | null;
  setDirectMessages: React.Dispatch<SetStateAction<object[] | undefined>>;
}
const ChatPanel: FC = () => {
  const { panelId } = useParams();
  const [channelDetails, setChannelDetails] = useState<
    ChannelDetails | null | undefined
  >(null);
  const [userDetails, setUserDetails] = useState<
    UserDetails | null | undefined
  >(null);
  const [showChannelDetails, setShowChannelDetails] = useState<boolean>(false);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [directMessage, setDirectMessage] = useState<string>("");
  const [allDirectMessages, setAllDirectMessages] = useState<
    AllDirectMessages[]
  >([]);

  const [channelMembers, setChannelMembers] = useState<string[]>([]);
  const [channelMessages, setChannelMessages] = useState<ChannelMessages[]>([]);
  const [channelMessengeInput, setChannelMessageInput] = useState<string>("");
  const loginContext = useContext(LoginContext);
  const { userInfo, setUserInfo } = loginContext;
  const { newMessageCount, setNewMessageCount } = useContext(
    newMessageCountContext
  );
  const [newMessagesArr, setNewMessagesArr] = useState<any>([]);
  const location = useLocation();
  useEffect(() => {
    scrollDown();
    if (panelId && `/${panelId}` === location.pathname) {
      onSnapshot(doc(db, "channels", panelId), (snapshot: any) => {
        console.log(snapshot.data());
        setChannelDetails(snapshot.data());
        getChannelMembers();
      });

      onSnapshot(doc(db, "users", panelId), (snapshot: any) => {
        setUserDetails(snapshot.data());
        console.log(snapshot.data());
      });
      getdirectMessages();
      scrollDown();
      getChannelMessages();
      getUnreadMessages();
      console.log(location.pathname);
    }
    return () => getdirectMessages();
  }, [panelId]);
  const targetChat = useRef<HTMLDivElement | null>(null);
  const scrollDown: Function = () => {
    const chat = targetChat;
    const { scrollX, scrollY } = window;
    window.scrollTo(scrollX, scrollY);
    chat?.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
    setTimeout(() => window.scrollTo(0, 0), 0);
  };
  const getChannelMessages: Function = () => {
    if (panelId) {
      const channelMessagesRef = collection(
        db,
        "channels",
        panelId,
        "channel-messages"
      );
      const q = query(channelMessagesRef, orderBy("timestamp", "asc"));
      onSnapshot(q, (snapshot: any) =>
        setChannelMessages(snapshot.docs.map((doc: any) => doc.data()))
      );
    }
  };

  const getChannelMembers: Function = async (): Promise<void> => {
    const newArr: any[] = [];
    channelDetails?.members.forEach(async (member) => {
      const users = collection(db, "users");
      const req = query(users, where("accId", "==", member), limit(1));
      await getDocs(req).then((res: any) => {
        res.docs.forEach((doc: any) => {
          const data = doc.data().name;
          newArr.push(data);
          setChannelMembers(newArr);
        });
      });
    });
  };

  const sendChannelMessage: Function = async (): Promise<void> => {
    try {
      if (panelId && channelDetails) {
        await addDoc(collection(db, "channels", panelId, "channel-messages"), {
          user: loginContext.userInfo.name,
          UserImage: "",
          message: channelMessengeInput,
          timestamp: serverTimestamp(),
          seconds: Date.now(),
        });
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const addMessage: Function = async () => {
    try {
      if (panelId && userInfo) {
        //user
        await addDoc(
          collection(
            db,
            "users",
            userInfo.accId,
            "messages",
            panelId,
            "message-thread"
          ),
          {
            message: directMessage,
            timestamp: serverTimestamp(),
            from: userInfo.name,
            fromAccId: userInfo.accId,
            unread: false,
          }
        );

        // recipient
        await setDoc(
          doc(db, "users", panelId, "messages", userInfo?.accId),

          {
            userName: userInfo.name,
            userId: userInfo.accId,
            userImage: "",
            timestamp: serverTimestamp(),
            unreadMessages: newMessageCount,
          }
        );
        await addDoc(
          collection(
            db,
            "users",
            panelId,
            "messages",
            userInfo.accId,
            "message-thread"
          ),
          {
            from: userInfo.name,
            fromAccId: userInfo.accId,
            message: directMessage,
            timestamp: serverTimestamp(),
            unread: true,
          }
        );
      }
      // if (newMessageCount) {
      // setNewMessageCount(newMessageCount + 1);
      // }
      // console.log(directMsg);
    } catch (err: any) {
      console.log(err.message);
    }
  };
  const getUnreadMessages = () => {
    if (panelId) {
      const q = query(
        collection(
          db,
          "users",
          userInfo.accId,
          "messages",
          panelId,
          "message-thread"
        ),
        where("unread", "==", true)
      );

      onSnapshot(q, (snapshot) =>
        // console.log(snapshot.docs.map((doc) => doc.data()))
        {
          setNewMessageCount(snapshot.docs.map((doc) => doc.data()).length);
          setNewMessagesArr(snapshot.docs);
          console.log(newMessagesArr);
        }
      );
    }
  };
  const handleReadMessages = () => {
    if (panelId) {
      newMessagesArr.forEach(async (msg: { unread: boolean; id: string }) => {
        if (!msg.id) {
          //   return;
          // } else {
          await updateDoc(
            doc(
              db,
              "users",
              userInfo.accId,
              "messages",
              panelId,
              "message-thread",
              msg.id
            ),
            {
              unread: false,
            }
          );
        }

        // console.log(msg.id);
      });
      setNewMessageCount(0);
      getUnreadMessages();
    }
  };
  const getdirectMessages: Function = () => {
    const param = location.pathname.replace("/", "");
    console.log(param);

    if (panelId) {
      const q = query(
        collection(
          db,
          "users",
          userInfo.accId,
          "messages",
          param,
          "message-thread"
        ),
        orderBy("timestamp")
      );
      // if (param === userDetails?.accId) {
      console.log(`/${userDetails?.accId}`);
      console.log(location);

      onSnapshot(q, (snapshot: any) => {
        setAllDirectMessages(snapshot.docs.map((doc: any) => doc.data()));
      });
      // }
      console.log(allDirectMessages);
      handleReadMessages();
    }
  };
  return (
    <div className="text-center w-full h-screen">
      <div className="p-[20px] border-b-2">
        {channelDetails && (
          <>
            <div
              className="flex items-center justify-center w-fit btn"
              onClick={() => {
                getChannelMembers();
                setShowChannelDetails(true);
              }}
            >
              <h1 className="font-bold">#{channelDetails?.name}</h1>
              <span className="material-symbols-outlined pt-1">
                expand_more
              </span>
            </div>
            <form
              className="absolute bottom-0 mb-8 border border-gray h-fit w-8/12 rounded-lg flex items-center justify-center"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                sendChannelMessage();
                setChannelMessageInput("");
              }}
            >
              <input
                type="text"
                className="h-full w-[95%] focus:border-gray-900 p-4 resize-none"
                value={channelMessengeInput}
                onChange={(e) => setChannelMessageInput(e.target.value)}
              />
              <button
                type="submit"
                className="scale-125 mr-4 h-fit mt-auto mb-auto"
              >
                <span className="material-symbols-outlined text-center text-gray-500">
                  send
                </span>
              </button>
            </form>
          </>
        )}
        {userDetails && (
          <>
            <div
              className="flex items-center justify-center w-fit btn"
              onClick={() => {
                setShowUserDetails(true);
              }}
            >
              <h1 className="font-bold">{userDetails?.name}</h1>
              <span className="material-symbols-outlined pt-1">
                expand_more
              </span>
            </div>
            <form
              className="absolute bottom-0 mb-8 border border-gray h-fit w-8/12 rounded-lg flex items-center justify-center"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (directMessage) {
                  scrollDown();
                  addMessage();
                  setDirectMessage("");
                  getUnreadMessages();
                }
              }}
            >
              <input
                type="text"
                className="h-full w-[95%] focus:border-gray-900 p-4 resize-none"
                value={directMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setDirectMessage(e.target.value);
                }}
              />
              <button
                type="submit"
                className="scale-125 mr-4 h-fit mt-auto mb-auto"
              >
                <span className="material-symbols-outlined text-center text-gray-500">
                  send
                </span>
              </button>
            </form>
          </>
        )}
        {showChannelDetails && (
          <div
            className="bg-black absolute top-0 left-0 w-screen h-screen opacity-60"
            onClick={() => {
              setShowChannelDetails((prev) => !prev);
            }}
          >
            <div className="relative top-[20%] left-[45%] h-max w-[320px] bg-stone-100 rounded shadow-md grid text-left">
              <div
                className="absolute right-0 top-0  w-8 h-8 rounded-full btn"
                onClick={() => {
                  setShowChannelDetails(false);
                }}
              >
                <h1 className="text-center  text-[16px]">x</h1>
              </div>
              <h1 className="border-b-2 p-6 font-bold text-lg">
                #{channelDetails?.name}
              </h1>
              <div className="p-6 grid gap-4">
                <div className="bg-white rounded-md p-4 shadow-lg">
                  <h1 className="text-[13px] font-bold">Date Created</h1>
                  <h1>
                    {new Date(
                      Date.now() - channelDetails?.channelCreation?.seconds
                    ).toUTCString()}
                  </h1>
                </div>
                <div className="bg-white rounded-md p-4 shadow-lg">
                  <h1 className="text-[13px] font-bold">Created by</h1>
                  <h1>{channelDetails?.channelCreator}</h1>
                </div>
                <div className="bg-white rounded-md p-4 shadow-lg">
                  <h1 className="text-[13px] font-bold">Members</h1>
                  {channelMembers.map((member: any) => {
                    return (
                      <div className="flex justify-between">
                        <span>{member}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        {showUserDetails && (
          <div
            className="bg-black absolute top-0 left-0 w-screen h-screen opacity-60"
            onClick={() => {
              setShowUserDetails((prev) => !prev);
            }}
          >
            <div className="relative top-[20%] left-[45%] h-max w-[320px] bg-stone-100 rounded shadow-md grid text-left">
              <div
                className="absolute right-0 top-0  w-8 h-8 rounded-full btn"
                onClick={() => {
                  setShowUserDetails(false);
                }}
              >
                <h1 className="text-center  text-[16px]">x</h1>
              </div>
              <h1 className="border-b-2 p-6 font-bold text-lg">
                {userDetails?.name}
              </h1>
              <div className="p-6 grid gap-4">
                <div className="bg-white rounded-md p-4 shadow-lg">
                  <h1 className="text-[13px] font-bold">Email</h1>
                  <h1>{userDetails?.email}</h1>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {channelMessages?.map((msg) => (
        <ChatMessages
          user={msg?.user}
          userImage={msg?.userImage}
          message={msg?.message}
          timestamp={msg?.timestamp}
        />
      ))}
      <div className="overflow-y-scroll h-[60%] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-400">
        {allDirectMessages?.map((msg) => {
          // if (location.pathname === `/${panelId}`) {
          return (
            <ChatMessages
              user={msg.from}
              userImage="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              message={msg?.message}
              timestamp={msg?.timestamp}
            />
          );
          // }
        })}
        <div ref={targetChat} className="bg-transparent w-full" />
      </div>
    </div>
  );
};

export default ChatPanel;
