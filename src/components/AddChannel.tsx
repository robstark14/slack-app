import {
  addDoc,
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import React, {
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import { db } from "../config/firebase_config";
import LoginContext from "../Context";
import MemberSearchPanel from "./memberSearchPanel";

interface Props {
  setAddChannel: React.Dispatch<SetStateAction<boolean>>;
}
// interface channelDoc{
//   newChannelDoc: DocumentReference<DocumentData>
// }
const AddChannel: FC<Props> = ({ setAddChannel }) => {
  interface memberArrInterface {
    name: string;
    accId: string;
    email: string;
    password: string;
  }

  const [memeberQueryResults, setQueryResults] = useState<any>([]);
  const userContext = useContext(LoginContext);

  const [channelName, setChannelName] = useState<string>("");
  const membersArr: memberArrInterface[] = [userContext.userInfo];
  const [memberInput, setMemberInput] = useState<string>("");

  useEffect(() => {
    const debounceFn = setTimeout(async () => {
      if (memberInput === "") return;
      setQueryResults([]);
      const users = collection(db, "users");
      const req = query(users, where("name", "==", memberInput));
      await getDocs(req).then((res) =>
        res.docs.forEach((doc) => {
          const newData = [];
          newData.push(doc.data());
          setQueryResults(newData);
        })
      );
    }, 1000);
    return () => {
      clearTimeout(debounceFn);
    };
  }, [memberInput]);

  const AddedMembers = ({ members }: { members: memberArrInterface[] }) => {
    const addedMemKeys = useId();
    const returnArr: any = [];
    members.forEach((member) => {
      returnArr.push(
        <div key={addedMemKeys}>
          <span>{member.name}</span>
        </div>
      );
    });
    return <>{returnArr}</>;
  };

  const addNewChannel = async () => {
    try {
      const newChannelDoc = await addDoc(collection(db, "channels"), {
        name: channelName,
        members: membersArr,
        channelCreation: serverTimestamp(),
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
    <div className="relative w-fit bg-stone-200 rounded-lg p-4 shadow-md m-auto">
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
        <div>
          <p>Members:</p>
          <div className="flex gap-x-2">
            <AddedMembers members={membersArr} />
          </div>
        </div>
        <label htmlFor="memberInput">Add a member</label>
        <input
          id="memberInput"
          className="w-full"
          type="text"
          value={memberInput}
          onChange={(e) => {
            setMemberInput(e.target.value);
          }}
        />
        <MemberSearchPanel members={memeberQueryResults} />

        <button className="rounded bg-[#481249] p-1 text-white" type="submit">
          Add Channel
        </button>
      </form>
    </div>
  );
};

export default AddChannel;
