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
    <div>
      <p
        onClick={() => {
          openChannel();
        }}
        className="btn"
      >
        # {name}
      </p>
    </div>
  );
};

export default ChatNav;
