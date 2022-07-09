import React from "react";

type Props = {
  user: string;
  userImage: string;
  message: string;
  timestamp: string | any;
};

export default function ChatMessages({
  userImage,
  user,
  message,
  timestamp,
}: Props) {
  return (
    <div className="w-full h-max flex items-center text-left p-4 text-[15px]">
      <img
        src={userImage}
        alt="user image"
        className="w-[36px] h-[36px] object-contain mr-2 rounded-md"
      />
      <div>
        <span className="font-bold mr-2">{user}</span>
        <span className="text-[13px] opacity-50">
          {new Date(timestamp?.toDate()).toLocaleTimeString()}
        </span>
        <p>{message}</p>
      </div>
    </div>
  );
}
