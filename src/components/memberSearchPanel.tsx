const MemberSearchPanel = ({
  members,
}: {
  members: { name: string; email: string }[];
}) => {
  if (members.length === 0) return <></>;
  const returnArr: any = [];
  members.forEach((member) => {
    returnArr.push(
      <div className="flex flex-col border-b-2 w-fit h-fit">
        <span>{member.name}</span>
        <span>{member.email}</span>
      </div>
    );
  });
  return <>{returnArr}</>;
};

export default MemberSearchPanel;
