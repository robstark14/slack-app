import { createContext, Dispatch, SetStateAction } from "react";

// const defaultState = {
//   newMessageCount: 0,
//   setNewMessageCount:()=>void
// };
interface NewMessageCountContext {
  newMessageCount: number;
  setNewMessageCount: Dispatch<SetStateAction<number>>;
}
const NewMessageCountContext = createContext({} as NewMessageCountContext);

export default NewMessageCountContext;
