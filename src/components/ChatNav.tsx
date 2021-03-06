import { collection, doc, onSnapshot, query } from "firebase/firestore";
import React, { FC, useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { db } from "../config/firebase_config";
import LoginContext from "../Context";
import NewMessageCountContext from "../NewMessageCountContext";

interface Props {
  name?: string;
  id?: string;
  getDirectMessagesNav: any;
}

const ChatNav: FC<Props> = ({ name, id, getDirectMessagesNav }) => {
  const navigate = useNavigate();
  let activeStyle: any = { backgroundColor: "rgb(47,79,79)" };
  const { newMessageCount } = useContext(NewMessageCountContext);
  const loginContext = useContext(LoginContext);
  const { userInfo, setUserInfo } = loginContext;

  useEffect(() => {
    // getUnreadMessagesFromSender();
    getDirectMessagesNav();
    return () => {
      getDirectMessagesNav();
    };
  }, [id]);

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(null);
  // const getUnreadMessagesFromSender = () => {
  //   if (id) {
  //     onSnapshot(
  //       doc(db, "users", userInfo.accId, "messages", id),
  //       (snapshot: { data: any; unreadMessages?: number }) => {
  //         // console.log(snapshot.data().unreadMessages);
  //         setUnreadMessagesCount(snapshot?.data().unreadMessages);
  //       }
  //     );
  //   }
  // };
  return (
    <NavLink
      style={({ isActive }): any => (isActive ? activeStyle : undefined)}
      to={`/${id}`}
      className="w-full flex justify-between hover:bg-gray-300 hover:text-black pl-2"
    >
      <p className="text-left  py-1 px-2 w-full bg-inherit">{name}</p>
      {/* <span className="w-4">
        {unreadMessagesCount === 0 ? "" : unreadMessagesCount}
      </span> */}
    </NavLink>
  );
};

export default ChatNav;
