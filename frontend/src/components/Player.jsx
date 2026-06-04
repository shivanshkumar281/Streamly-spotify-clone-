import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/frontend-assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const Player = () => {
  const {
    track,
    seekBar,
    seekBg,
    playStatus,
    play,
    pause,
    time,
    previous,
    next,
    shuffle,
    toggleShuffle,
    loop,
    toggleLoop,
    volume,
    setVolumeLevel,
    seekToFraction,
  } = useContext(PlayerContext);

  const [dragging, setDragging] = useState(false);
  const [pipWindow, setPipWindow] = useState(null);

  const seekFromClientX = (clientX) => {
    if (!seekBg.current) return;
    const rect = seekBg.current.getBoundingClientRect();
    const fraction = (clientX - rect.left) / rect.width;
    seekToFraction(fraction);
  };

  const onSeekDown = (e) => {
    setDragging(true);
    seekFromClientX(e.clientX);
  };

  // Seek bar drag
  useEffect(() => {
    if (!dragging) return;
    const move = (e) => seekFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  const togglePiP = async () => {
    if (!("documentPictureInPicture" in window)) {
      toast.info("Picture-in-Picture isn't supported in this browser.");
      return;
    }
    if (pipWindow) {
      pipWindow.close();
      return;
    }
    const newPipWindow = await window.documentPictureInPicture.requestWindow({
      width: 460,
      height: 150,
    });
    // Copy page styles into PiP window
    [...document.styleSheets].forEach((styleSheet) => {
      try {
        const cssRules = [...styleSheet.cssRules]
          .map((rule) => rule.cssText)
          .join("");
        const style = document.createElement("style");
        style.textContent = cssRules;
        newPipWindow.document.head.appendChild(style);
      } catch {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = styleSheet.href;
        newPipWindow.document.head.appendChild(link);
      }
    });
    newPipWindow.document.body.style.margin = "0";
    newPipWindow.document.body.style.background = "#000";
    newPipWindow.addEventListener("pagehide", () => setPipWindow(null));
    setPipWindow(newPipWindow);
  };

  if (!track) return null;

  return (
    <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
      <div className="hidden lg:flex items-center gap-4">
        <img className="w-12" src={track.image} alt="" />
        <div>
          <p>{track.name}</p>
          <p className="text-[#a7a7a7] text-sm">{track.desc?.slice(0, 20)}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4 items-center">
          <img
            onClick={toggleShuffle}
            className={`w-4 cursor-pointer ${
              shuffle ? "opacity-100" : "opacity-60"
            }`}
            src={assets.shuffle_icon}
            alt="Shuffle"
            title="Shuffle"
          />
          <img
            onClick={previous}
            className="w-4 cursor-pointer"
            src={assets.prev_icon}
            alt="Previous"
            title="Previous"
          />
          {playStatus ? (
            <img
              onClick={pause}
              className="w-4 cursor-pointer"
              src={assets.pause_icon}
              alt="Pause"
            />
          ) : (
            <img
              onClick={play}
              className="w-4 cursor-pointer"
              src={assets.play_icon}
              alt="Play"
            />
          )}
          <img
            onClick={next}
            className="w-4 cursor-pointer"
            src={assets.next_icon}
            alt="Next"
            title="Next"
          />
          <img
            onClick={toggleLoop}
            className={`w-4 cursor-pointer ${
              loop ? "opacity-100" : "opacity-60"
            }`}
            src={assets.loop_icon}
            alt="Repeat"
            title="Repeat"
          />
          {shuffle && (
            <span className="text-green-500 text-xs hidden sm:inline">·</span>
          )}
        </div>
        <div className="flex items-center gap-5">
          <p>
            {time.currentTime.minute}:
            {String(time.currentTime.second).padStart(2, "0")}
          </p>
          <div
            ref={seekBg}
            onPointerDown={onSeekDown}
            className="group relative w-[60vw] max-w-[500px] h-2 flex items-center bg-gray-600 rounded-full cursor-pointer"
          >
            <div
              ref={seekBar}
              className="relative h-1 w-0 bg-green-500 group-hover:bg-green-400 rounded-full"
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"></span>
            </div>
          </div>
          <p>
            {time.totalTime.minute}:
            {String(time.totalTime.second).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3 opacity-90">
        <img className="w-4" src={assets.volume_icon} alt="Volume" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
          className="w-20 h-1 accent-green-500 cursor-pointer"
          title="Volume"
        />
        <img
          onClick={togglePiP}
          className="w-4 cursor-pointer hover:opacity-100 opacity-80"
          src={assets.mini_player_icon}
          alt="Picture in Picture"
          title="Picture-in-Picture"
        />
        <img
          onClick={toggleFullscreen}
          className="w-4 cursor-pointer hover:opacity-100 opacity-80"
          src={assets.zoom_icon}
          alt="Fullscreen"
          title="Fullscreen"
        />
      </div>

      {/* PiP mini player */}
      {pipWindow &&
        createPortal(
          <div className="h-screen w-screen bg-black text-white flex items-center gap-4 px-4">
            <img className="w-16 h-16 rounded" src={track.image} alt="" />
            <div className="flex-1 min-w-0">
              <p className="truncate font-semibold">{track.name}</p>
              <p className="truncate text-sm text-[#a7a7a7]">
                {track.desc?.slice(0, 30)}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-[#a7a7a7]">
                <span>
                  {time.currentTime.minute}:
                  {String(time.currentTime.second).padStart(2, "0")}
                </span>
                <span>/</span>
                <span>
                  {time.totalTime.minute}:
                  {String(time.totalTime.second).padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-5 pr-2">
              <img
                onClick={previous}
                className="w-5 cursor-pointer"
                src={assets.prev_icon}
                alt="Previous"
              />
              {playStatus ? (
                <img
                  onClick={pause}
                  className="w-5 cursor-pointer"
                  src={assets.pause_icon}
                  alt="Pause"
                />
              ) : (
                <img
                  onClick={play}
                  className="w-5 cursor-pointer"
                  src={assets.play_icon}
                  alt="Play"
                />
              )}
              <img
                onClick={next}
                className="w-5 cursor-pointer"
                src={assets.next_icon}
                alt="Next"
              />
            </div>
          </div>,
          pipWindow.document.body
        )}
    </div>
  );
};

export default Player;
