import React, { FC } from "react";

interface Props {
  channel: any;
}

const ChatNav: FC<Props> = ({ channel }) => {
  return (
    <div>
      <p key={channel.id} className="btn">
        # {channel.name}
      </p>
    </div>
  );
};

export default ChatNav;
