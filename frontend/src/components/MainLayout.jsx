import { useContext, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Player from "./Player";
import { PlayerContext } from "../context/PlayerContext";

const MainLayout = () => {
  const { displayBg } = useContext(PlayerContext);
  const displayRef = useRef();

  useEffect(() => {
    if (!displayRef.current) return;
    displayRef.current.style.background = displayBg;
  }, [displayBg]);

  return (
    <div className="h-screen bg-black">
      <div className="h-[90%] flex">
        <Sidebar />
        <div
          ref={displayRef}
          className="w-full m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0"
        >
          <Outlet />
        </div>
      </div>
      <Player />
    </div>
  );
};

export default MainLayout;
