import { Link, NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="w-[260px] h-full bg-[#350d36] shadow-lg text-white grid text-left items-center">
      <div className="grid grid-cols-[3fr,1fr,2fr] w-full h-[50px] border border-x-transparent border-y-[#481249] p-4 ">
        <h1 className="font-bold">Avion School</h1>
        <span className="material-symbols-outlined">expand_more</span>
        <span className="material-symbols-outlined text-right ">
          edit_square
        </span>
      </div>
      <div className="grid text-left justify-start w-full items-center gap-2 p-4 ">
        <div className="btn flex items-center">
          <span className="material-symbols-outlined scale-75 pr-2 ">
            comment
          </span>
          <span className="text-left item-center ">Threads</span>
        </div>
        <div className="btn flex items-center">
          <span className="material-symbols-outlined scale-75 pr-2">
            alternate_email
          </span>
          <span className="text-left">Mentions and reactions</span>
        </div>
        <div className="btn flex items-center">
          <span className="material-symbols-outlined scale-75 pr-2">edit</span>
          <span className="text-left">Drafts</span>
        </div>
        <div className="btn flex items-center">
          <span className="material-symbols-outlined scale-75 pr-2">
            bookmark
          </span>
          <span className="text-left">Saved Items</span>
        </div>
        <div className="btn flex items-center">
          <span className="material-symbols-outlined scale-75 pr-2">group</span>
          <span className="text-left">People & user groups</span>
        </div>
        <div className="btn flex items-center">
          <span className="material-symbols-outlined scale-75 pr-2">apps</span>
          <span className="text-left">Apps</span>
        </div>
        <div className="btn flex items-center">
          <span className="material-symbols-outlined scale-75 pr-2">
            folder
          </span>
          <span className="text-left">Files</span>
        </div>
        <div className="btn flex items-center">
          <span className="text-left p-4 ">Show less</span>
        </div>
      </div>
      <div className="text-left w-full p-4 border border-x-transparent border-b-transparent border-t-[#481249]">
        <h1>Channels</h1>
        <div className="btn flex items-center">
          <span className="material-symbols-outlined scale-75 pr-2">lock</span>
          <span>batch19 </span>
        </div>
      </div>
      <div className="btn flex items-center p-4 ">
        <span className="material-symbols-outlined">add</span>
        <span className="text-left w-full ">Browse Channels</span>
      </div>
      <div className="btn w-full flex items-center">
        <span className="material-symbols-outlined">navigate_next</span>
        <h1>Direct messages</h1>
      </div>
    </div>
  );
};

export default SideBar;