import { memberArrInterface } from "./AddChannel";
import { SetStateAction } from "react";
const MemberSearchPanel = ({
  membersQuery,
  setMembersArr,
  membersArr,
<<<<<<< HEAD
  channelName,
=======
>>>>>>> 1d59d1c8a626234dbe1bcb84ffd90b925b7eb41e
  setMembersInput,
}: {
  membersQuery: { name: string; email: string }[];
  setMembersArr: React.Dispatch<SetStateAction<memberArrInterface[]>>;
  membersArr: memberArrInterface[];
<<<<<<< HEAD
  channelName: string;
=======
>>>>>>> 1d59d1c8a626234dbe1bcb84ffd90b925b7eb41e
  setMembersInput: React.Dispatch<SetStateAction<string>>;
}) => {
  if (membersQuery.length === 0) return <></>;
  const returnArr: any = [];
  membersQuery.forEach((member) => {
    returnArr.push(
      <div
<<<<<<< HEAD
        className="flex flex-col border-b-2 w-full h-fit cursor-pointer"
=======
        className="flex flex-col border-b-2 w-100 h-fit"
>>>>>>> 1d59d1c8a626234dbe1bcb84ffd90b925b7eb41e
        onClick={() => {
          const currentArr = membersArr;
          currentArr.push(member);
          setMembersArr(currentArr);
          setMembersInput("");
          console.log(currentArr);
        }}
      >
        <span>{member.name}</span>
        <span>{member.email}</span>
      </div>
    );
  });
  return <>{returnArr}</>;
};

export default MemberSearchPanel;
