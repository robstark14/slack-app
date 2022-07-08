import { addDoc, collection } from "firebase/firestore";
import React, { FC, useState } from "react";
import { db } from "../config/firebase_config";

const AddChannel: FC = () => {
  const [channelName, setChannelName] = useState<string | number>("");

  const addNewChannel = async () => {
    try {
      await addDoc(collection(db, "channels"), {
        name: channelName,
      });
    } catch (err: any) {
      console.log(err.message);
    }
  };
  return (
    <div className="relative w-[300px] h-[200px] bg-stone-200 rounded-lg p-4 shadow-md m-auto">
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          addNewChannel();
        }}
      >
        <label htmlFor="channelName">Enter channel name</label>
        <input
          className="w-full"
          type="text"
          value={channelName}
          onChange={(e) => {
            setChannelName(e.target.value);
          }}
        />
        <button className="rounded bg-[#481249] p-1 text-white" type="submit">
          Add Channel
        </button>
      </form>
    </div>
  );
};

export default AddChannel;
