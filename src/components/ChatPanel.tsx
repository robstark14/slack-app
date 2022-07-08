import React, { FC } from "react";
import { useParams } from "react-router-dom";

// type Props = {};

const ChatPanel: FC = () => {
  const { panelId } = useParams();

  return (
    <div className="text-center pb-[150px] overflow-y-auto">
      <div className="flex justify-between p-[20px] border-b-2">
        <div className="flex items-center justify-center w-fit btn">
          <h1 className="font-bold">#{panelId}</h1>
          <span className="material-symbols-outlined pt-1">expand_more</span>
        </div>
        <div>Members</div>
      </div>
    </div>
  );
};

export default ChatPanel;
