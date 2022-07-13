import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
  onSnapshot,
  setDoc,
  doc,
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
interface AllUsers {
  name: string;
  // users: string;
}
interface AddedUser {
  accId: string;
  addedUser: object | null;
}
const AddChannel: FC<Props> = ({ setAddChannel }) => {
  interface memberArrInterface {
    name: string;
    accId: string;
    email: string;
    password: string;
  }

  const [memberQueryResults, setQueryResults] = useState<any>([]);
  const userContext = useContext(LoginContext);

  const [channelName, setChannelName] = useState<string>("");
  const membersArr: memberArrInterface[] = [userContext.userInfo];
  const [memberInput, setMemberInput] = useState<string>("");
  const [isNewChannel, setIsNewChannel] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<AllUsers[]>([]);
  const loginContext = useContext(LoginContext);
  const { userInfo, setUserInfo } = loginContext;
  const [addedUser, setAddedUser] = useState<any>(null);
  const [displayUsers, setdisplayUsers] = useState<boolean>(false);

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

  const returnArr: any = [];
  const AddedMembers = ({ members }: { members: memberArrInterface[] }) => {
    const addedMemKeys = useId();
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

      addUserToChannel(newChannelDoc.id);
    } catch (err: any) {
      console.log(err.message);
    }
  };
  const getAllUsers: Function = () => {
    const q = query(
      collection(db, "users"),
      where("accId", "!=", userInfo.accId),
      orderBy("accId", "asc")
    );
    onSnapshot(q, (snapshot: any) =>
      setAllUsers(
        snapshot?.docs?.map((doc: any) => ({
          ...doc?.data(),
        }))
      )
    );
  };
  const addUserToChannel: Function = async (channelId: string) => {
    try {
      // await setDoc(
      //   doc(db, "channels", channelId),
      //   {
      //     userName: selectedUser.name,
      //     userId: selectedUser.accId,
      //     userImage: "",
      //     timestamp: serverTimestamp(),
      //   }
      // );
      const q = query(
        collection(db, "users"),
        where("accId", "==", addedUser.id)
      );
      onSnapshot(q, (snapshot: any) => membersArr.push(snapshot.doc.data()));
      // console.log(directMsg);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className="absolute left-[45%] bottom-[35%] w-[300px] bg-stone-200 rounded-lg p-4 shadow-md m-auto z-10">
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
        <div
          className="absolute right-0 top-0  w-8 h-8 rounded-full btn"
          onClick={() => {
            setAddChannel(false);
          }}
        >
          <h1 className="text-center  text-[16px] text-black">x</h1>
        </div>
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
          onFocus={(e: React.FocusEvent<HTMLInputElement, Element>) => {
            getAllUsers();
            setdisplayUsers(true);
          }}
          onBlur={() => {
            setdisplayUsers(false);
          }}
        />
        <MemberSearchPanel members={memberQueryResults} />

        <button className="rounded bg-[#481249] p-1 text-white" type="submit">
          Add Channel
        </button>
      </form>
      {displayUsers && (
        <div className="absolute w-[300px] h-[150px] left-[100%] top-[70%] bg-gray-200 rounded-lg p-4 shadow-md m-auto  overflow-auto">
          {allUsers.map((user) => (
            <h1
              className="hover:bg-gray-800 hover:text-white btn"
              onClick={() => {
                setAddedUser(user);
              }}
            >
              {user?.name}
            </h1>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddChannel;
