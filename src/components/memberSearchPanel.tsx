const MemberSearchPanel = ({
  members,
}: {
  members: { name: string; email: string }[];
}) => {
  if (members.length === 0) return <></>;
  const returnArr: any = [];
  members.forEach((member) => {
    returnArr.push(
      <>
        <span>{member.name}</span>
        <span>{member.email}</span>
      </>
    );
  });
  return <>{returnArr}</>;
};

export default MemberSearchPanel;
