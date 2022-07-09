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
const ChatPanel: FC = () => {
  const { panelId } = useParams();
  const [channelDetails, setChannelDetails] = useState<any>(null);

  const [channelMessages, setChannelMessages] = useState<ChannelMessages[]>([]);

  useEffect(() => {
    if (panelId) {
      onSnapshot(doc(db, "channels", panelId), (snapshot) =>
        setChannelDetails(snapshot.data())
      );
    }
    getChannelMessages();
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
        <div className="flex items-center justify-center w-fit btn">
          <h1 className="font-bold">#{channelDetails?.name}</h1>
          <span className="material-symbols-outlined pt-1">expand_more</span>
        </div>
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
