import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  name?: string;
  id?: string;
}

const ChatNav: FC<Props> = ({ name, id }) => {
  const navigate = useNavigate();

  const openChannel = () => {
    if (id) {
      navigate(`/${id}`);
    }
  };
  return (
    <div className="w-100">
      <p
        onClick={() => {
          openChannel();
        }}
        className="text-left hover:bg-gray-300 hover:text-black py-1 px-2 w-fit"
      >
        {name}
      </p>
    </div>
  );
};

export default ChatNav;
