import { useEffect, useRef, useState } from "react";
import sample from "../sample.jpg";
import useOnOutsideClick from "./useOnOutsideClick";
const Header: React.FC = () => {
  const [recentModal, setRecentModal] = useState<boolean>(false);
  const ref = useRef();

  useOnOutsideClick(ref, () => setRecentModal(false));
  return (
    <div className="w-full h-full bg-[#350d36] shadow-sm grid grid-cols-[1.85fr,7fr,1fr] gap-2 col-span-2">
      <span
        className="btn material-symbols-outlined text-white self-center text-right"
        onClick={() => {
          setRecentModal(true);
        }}
      >
        schedule
      </span>
      <div className="flex items-center w-[90%]">
        <input
          type="text"
          className="w-[90%] h-2/3 opacity-30 rounded text-black focus:outline-none self-center p-2"
          placeholder="Search User"
        ></input>
        <span className="btn material-symbols-outlined text-white text-right relative right-[50px]">
          tune
        </span>
        <span className="btn material-symbols-outlined text-white text-right relative right-[50px]">
          search
        </span>
      </div>

      {recentModal && (
        <div className="absolute top-8 left-[250px] h-max w-[320px] bg-stone-100 rounded p-4 shadow-md">
          <small className="opacity-50">Recent</small>
        </div>
      )}
    </div>
  );
};

export default Header;
