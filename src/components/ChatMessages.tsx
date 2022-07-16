import React, { FC } from "react";

interface Props {
  user: string;
  userImage: string;
  message: string;
  timestamp: string | any;
}

const ChatMessages: FC<Props> = ({
  userImage,
  user,
  message,
  timestamp,
}: Props) => {
  return (
    <div
      className="w-full flex items-center text-left p-4 text-[15px]"
      key={timestamp}
    >
      <img
        src={userImage}
        alt="img"
        className="w-[36px] h-[36px] object-cover mr-2 rounded-md"
      />
      <div>
        <span className="font-bold mr-2">{user}</span>
        <span className="text-[13px] text-stone-400">
          {new Date(timestamp?.toDate()).toLocaleTimeString()}
        </span>
        <p>{message}</p>
      </div>
    </div>
  );
};
export default ChatMessages;
