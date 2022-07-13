import {
  addDoc,
  collection,
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
  addChannel: boolean;
}
// interface channelDoc{
//   newChannelDoc: DocumentReference<DocumentData>
// }
export interface memberArrInterface {
  name?: string;
  accId?: string;
  email?: string;
  password?: string;
}
const AddChannel: FC<Props> = ({ setAddChannel, addChannel }) => {
  const [memeberQueryResults, setQueryResults] = useState<any>([]);
  const userContext = useContext(LoginContext);

  const [channelName, setChannelName] = useState<string>("");
  const [membersArr, setMembersArr] = useState<memberArrInterface[]>([
    userContext.userInfo,
  ]);
  const [memberInput, setMemberInput] = useState<string>("");

  useEffect(() => {
    const debounceFn = setTimeout(async () => {
      setQueryResults([]);
      if (memberInput === "") return;
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
  }, [memberInput, membersArr]);

  const AddedMembers = ({ members }: { members: memberArrInterface[] }) => {
    const addedMemKeys = useId();
    const returnArr: any = [];
    members.map((member) => {
      returnArr.push(
        <div key={addedMemKeys}>
          <span key={addedMemKeys}>{member.name}</span>
        </div>
      );
    });
    return <>{returnArr}</>;
  };

  const addNewChannel = async () => {
    try {
      const newChannelDoc = await addDoc(collection(db, "channels"), {
        name: channelName,
        members: membersArr.map((member) => member.accId),
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
    <div
      className={`bg-black bg-opacity-25 h-full w-full flex items-center z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
        !addChannel && "hidden"
      }`}
      onClick={(e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
          setAddChannel((prev) => !prev);
          setMembersArr([userContext.userInfo]);
        }
      }}
    >
      <div
        className={`${addChannel === false ? "hidden " : ""}
 bg-stone-200 rounded-lg p-4 shadow-xl m-auto z-50 h-fit w-fit `}
      >
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
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
          <div>
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
            <div
              className={`absolute mt-1 hover:bg-slate-50 gap-x-2 z-10 bg-white h-fit w-3/12 p-2 border-black shadow-md ${
                memeberQueryResults.length === 0 ? "hidden" : "flex"
              }`}
            >
              <MemberSearchPanel
                membersQuery={memeberQueryResults}
                setMembersArr={setMembersArr}
                membersArr={membersArr}
                setMembersInput={setMemberInput}
              />
            </div>
          </div>
          <button
            className="rounded bg-[#481249] z-0 p-1 text-white"
            onClick={() => {
              addNewChannel();
              setAddChannel(false);
            }}
          >
            Add Channel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChannel;
