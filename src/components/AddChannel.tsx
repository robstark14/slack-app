import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import React, { FC, SetStateAction, useState } from "react";
import { db } from "../config/firebase_config";

interface Props {
  setAddChannel: React.Dispatch<SetStateAction<boolean>>;
}
// interface channelDoc{
//   newChannelDoc: DocumentReference<DocumentData>
// }
const AddChannel: FC<Props> = ({ setAddChannel }) => {
  const [channelName, setChannelName] = useState<string>("");

  const addNewChannel = async () => {
    try {
      const newChannelDoc = await addDoc(collection(db, "channels"), {
        name: channelName,
      });
      console.log(newChannelDoc);

      await addDoc(
        collection(db, "channels", newChannelDoc.id, "channel-messages"),
        {}
      );
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
          if (channelName) {
            addNewChannel();
            setAddChannel(false);
          }
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
