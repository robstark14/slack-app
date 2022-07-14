import { memberArrInterface } from "./AddChannel";
import { SetStateAction } from "react";
const MemberSearchPanel = ({
  membersQuery,
  setMembersArr,
  membersArr,
  channelName,
  setMembersInput,
}: {
  membersQuery: { name: string; email: string }[];
  setMembersArr: React.Dispatch<SetStateAction<memberArrInterface[]>>;
  membersArr: memberArrInterface[];
  channelName: string;
  setMembersInput: React.Dispatch<SetStateAction<string>>;
}) => {
  if (membersQuery.length === 0) return <></>;
  const returnArr: any = [];
  membersQuery.forEach((member) => {
    returnArr.push(
      <div
        className="flex flex-col border-b-2 w-full h-fit cursor-pointer"
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
