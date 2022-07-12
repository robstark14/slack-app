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
} from "firebase/firestore";

import React, {
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase_config";
import ChatMessages from "./ChatMessages";

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
  email: string;
  channelCreation: any;
  channelCreator: string;
  members: object[];
  seconds: number;
}
interface UserDetails {
  userName: string;
  // email: string;
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
  const [directMessage, setDirectMessage] = useState<string>("");
  const [allDirectMessages, setAllDirectMessages] = useState<
    AllDirectMessages[]
  >([]);
  const [channelMessages, setChannelMessages] = useState<ChannelMessages[]>([]);
  const loginContext = useContext(LoginContext);
  const { userInfo, setUserInfo } = loginContext;
  useEffect(() => {
    if (panelId) {
      onSnapshot(doc(db, "channels", panelId), (snapshot: any) =>
        setChannelDetails(snapshot.data())
      );
      onSnapshot(
        doc(db, "users", userInfo.accId, "messages", panelId),
        (snapshot: any) => setUserDetails(snapshot.data())
      );
    }
    getChannelMessages();
    getdirectMessages();
    // scrollDown();
    // return () => scrollDown();
  }, [panelId]);
  const targetChat = useRef<HTMLDivElement | null>(null);
  const scrollDown: Function = () => {
    const chat = targetChat;
    const { scrollX, scrollY } = window;
    window.scrollTo(scrollX, scrollY);
    chat?.current?.scrollIntoView(true);
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
          }
        );
      }

      // console.log(directMsg);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const getdirectMessages: Function = () => {
    if (panelId && userInfo) {
      const q = query(
        collection(
          db,
          "users",
          userInfo.accId,
          "messages",
          panelId,
          "message-thread"
        ),
        orderBy("timestamp")
      );
      onSnapshot(q, (snapshot: any) =>
        setAllDirectMessages(snapshot.docs.map((doc: any) => doc.data()))
      );
      console.log(allDirectMessages);
    }
  };
  return (
    <div className="text-center w-full h-screen">
      <div className="flex justify-between p-[20px] border-b-2">
        {channelDetails && (
          <div
            className="flex items-center justify-center w-fit btn"
            onClick={() => {
              setShowChannelDetails(true);
            }}
          >
            <h1 className="font-bold">{channelDetails?.name}</h1>
            <span className="material-symbols-outlined pt-1">expand_more</span>
          </div>
        )}
        {userDetails && (
          <>
            <div
              className="flex items-center justify-center w-fit btn"
              onClick={() => {
                setShowChannelDetails(true);
              }}
            >
              <h1 className="font-bold">{userDetails?.userName}</h1>
              <span className="material-symbols-outlined pt-1">
                expand_more
              </span>
            </div>
            <form
              className="absolute bottom-0 mb-8 border border-gray w:[400px] md:w-[450px] rounded-lg h-[70px] flex  items-end"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (directMessage) {
                  // scrollDown();
                  addMessage();
                  getChannelMessages();
                  console.log(directMessage);
                  setDirectMessage("");
                }
              }}
            >
              <input
                type="text"
                className="h-full w-[95%] focus:border-gray-900 p-4 resize-none"
                value={directMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDirectMessage(e.target.value)
                }
              />
              <button type="submit" className="scale-125 mr-4">
                <span className="material-symbols-outlined text-center text-gray-500">
                  send
                </span>
              </button>
            </form>
          </>
        )}
        {showChannelDetails && (
          <div className="bg-black absolute top-0 left-0 w-screen h-screen opacity-60">
            <div className="relative top-[20%] left-1/2 h-max w-[320px] bg-stone-100 rounded shadow-md grid text-left">
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
                  {channelDetails?.members.map((member: any) => {
                    return (
                      <div className="flex justify-between">
                        <span>{member.name}</span>
                        <span className="text-stone-400">({member.email})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        <div></div>
        {/* <div>Members</div> */}
      </div>
      {channelMessages?.map((msg) => (
        <ChatMessages
          user={msg?.user}
          userImage={msg?.userImage}
          message={msg?.message}
          timestamp={msg?.timestamp}
        />
      ))}
      <div className="overflow-y-scroll h-[60%]">
        {allDirectMessages?.map((msg) => (
          <ChatMessages
            user={msg.from}
            userImage=""
            message={msg?.message}
            timestamp={msg?.timestamp}
          />
        ))}
        <div ref={targetChat} className="bg-transparent w-full" />
      </div>
    </div>
  );
};

export default ChatPanel;
