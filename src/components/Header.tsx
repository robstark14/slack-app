import { useEffect, useRef, useState } from "react";
import sample from "../sample.jpg";
import useOnOutsideClick from "./useOnOutsideClick";
const Header = () => {
  const [recentModal, setRecentModal] = useState(false);
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
          className="w-[90%] h-2/3 bg-white opacity-30 rounded focus:outline-none self-center text-white p-2"
          placeholder={`Search channel`}
        />
        <span className="btn material-symbols-outlined text-white text-right relative right-[50px]">
          tune
        </span>
        <span className="btn material-symbols-outlined text-white text-right relative right-[50px]">
          search
        </span>
      </div>
      <div className="flex items-center justify-end w-full pr-4">
        <span className="btn material-symbols-outlined text-white pr-4 scale-75">
          help
        </span>
        <img
          src={sample}
          alt="profile picture"
          className="btn w-[25px] rounded"
        />
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
