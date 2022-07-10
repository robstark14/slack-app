import {
  addDoc,
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import React, {
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { db } from "../config/firebase_config";
import LoginContext from "../Context";

interface Props {
  setAddChannel: React.Dispatch<SetStateAction<boolean>>;
}
// interface channelDoc{
//   newChannelDoc: DocumentReference<DocumentData>
// }
const AddChannel: FC<Props> = ({ setAddChannel }) => {
  let memberQueryResults = [];
  const userContext = useContext(LoginContext);

  const [channelName, setChannelName] = useState<string>("");
  const membersArr: string[] = [userContext.userInfo.accId];
  const [memberInput, setMemberInput] = useState<string>("");

  useEffect(() => {
    const debounceFn = setTimeout(async () => {
      if (memberInput === "") return;
      memberQueryResults = [];
      const users = collection(db, "users");
      const req = query(users, where("name", "==", memberInput));
      await getDocs(req).then((res) =>
        res.docs.forEach((doc) => {
          memberQueryResults.push(doc.data());
          console.log(doc.data());
        })
      );
    }, 1000);
    return () => {
      clearTimeout(debounceFn);
    };
  }, [memberInput]);

  const addNewChannel = async () => {
    try {
      const newChannelDoc = await addDoc(collection(db, "channels"), {
        name: channelName,
        members: membersArr,
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
        <label htmlFor="memberInput">Enter channel name</label>
        <input
          id="memberInput"
          className="w-full"
          type="text"
          value={memberInput}
          onChange={(e) => {
            setMemberInput(e.target.value);
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
