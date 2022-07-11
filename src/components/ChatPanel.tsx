import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentSnapshot,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { FC, SetStateAction, useEffect, useState } from "react";
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
  channelCreation: string;
  channelCreator: string;
  members: object[];
}
const ChatPanel: FC = () => {
  const { panelId } = useParams();
  const [channelDetails, setChannelDetails] = useState<
    ChannelDetails | null | undefined
  >(null);
  const [showChannelDetails, setShowChannelDetails] = useState<boolean>(false);

  const [channelMessages, setChannelMessages] = useState<ChannelMessages[]>([]);

  useEffect(() => {
    if (panelId) {
      onSnapshot(doc(db, "channels", panelId), (snapshot: any) =>
        setChannelDetails(snapshot.data())
      );
    }
    getChannelMessages();
    // console.log(channelDetails.members.forEach((member)=>{

    // }));
  }, [panelId]);

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
  console.log(channelMessages);

  return (
    <div className="text-center pb-[150px] overflow-y-auto">
      <div className="flex justify-between p-[20px] border-b-2">
        <div
          className="flex items-center justify-center w-fit btn"
          onClick={() => {
            setShowChannelDetails(true);
          }}
        >
          <h1 className="font-bold">#{channelDetails?.name}</h1>
          <span className="material-symbols-outlined pt-1">expand_more</span>
        </div>
        {showChannelDetails && (
          <div className="absolute h-max w-[320px] bg-stone-100 rounded shadow-md grid text-left">
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
                <h1>{channelDetails?.channelCreation}</h1>
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
        )}
        <div></div>
        <div>Members</div>
      </div>
      {channelMessages?.map((msg) => (
        <ChatMessages
          user={msg?.user}
          userImage={msg?.userImage}
          message={msg?.message}
          timestamp={msg?.timestamp}
        />
      ))}
    </div>
  );
};

export default ChatPanel;
