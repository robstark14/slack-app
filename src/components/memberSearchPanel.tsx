import { memberArrInterface } from "./AddChannel";
import { SetStateAction } from "react";
const MemberSearchPanel = ({
  membersQuery,
  setMembersArr,
  membersArr,
  setMembersInput,
}: {
  membersQuery: { name: string; email: string }[];
  setMembersArr: React.Dispatch<SetStateAction<memberArrInterface[]>>;
  membersArr: memberArrInterface[];
  setMembersInput: React.Dispatch<SetStateAction<string>>;
}) => {
  if (membersQuery.length === 0) return <></>;
  const returnArr: any = [];
  membersQuery.forEach((member) => {
    returnArr.push(
      <div
        className="flex flex-col border-b-2 w-100 h-fit"
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
