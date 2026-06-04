import { useContext } from "react";
import { assets } from "../assets/frontend-assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const PodcastItem = ({ podcast }) => {
  const { playTrack } = useContext(PlayerContext);

  return (
    <div
      onClick={() => playTrack(podcast)}
      className="w-[200px] p-3 rounded-lg bg-[#181818] hover:bg-[#282828] cursor-pointer transition-colors"
    >
      <img
        className="w-full aspect-square object-cover rounded mb-3"
        src={podcast.image}
        alt={podcast.name}
      />
      <p className="font-bold text-white truncate">{podcast.name}</p>
      <p className="text-sm text-[#a7a7a7] mt-1 line-clamp-2 min-h-[40px]">
        {podcast.desc}
      </p>
      <div className="flex items-center gap-1.5 mt-2 text-xs text-[#a7a7a7]">
        <img className="w-3.5" src={assets.clock_icon} alt="" />
        <span>{podcast.duration}</span>
      </div>
    </div>
  );
};

export default PodcastItem;
