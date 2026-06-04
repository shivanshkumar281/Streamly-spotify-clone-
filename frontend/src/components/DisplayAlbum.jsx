import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { assets } from "../assets/frontend-assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const DisplayAlbum = () => {
  const { id } = useParams();
  const { playWithId, albumsData, songsData, setDisplayBg } =
    useContext(PlayerContext);
  const [albumData, setAlbumData] = useState(null);

  useEffect(() => {
    const found = albumsData.find((item) => item._id === id);
    setAlbumData(found || null);
  }, [id, albumsData]);

  useEffect(() => {
    setDisplayBg(
      albumData?.bgColour
        ? `linear-gradient(${albumData.bgColour}, #121212)`
        : "#121212"
    );
  }, [albumData, setDisplayBg]);

  if (!albumData) return <Navbar />;

  const albumSongs = songsData.filter((item) => item.album === albumData.name);

  const totalSeconds = albumSongs.reduce((sum, song) => {
    const [min, sec] = (song.duration || "0:0").split(":").map(Number);
    return sum + (min || 0) * 60 + (sec || 0);
  }, 0);

  const formatRuntime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    if (hours > 0) return `${hours} hr ${minutes} min`;
    return `${minutes} min ${seconds} sec`;
  };

  return (
    <>
      <Navbar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img className="w-48 rounded" src={albumData.image} alt="" />
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">
            {albumData.name}
          </h2>
          <h4>{albumData.desc}</h4>
          <p className="mt-1">
            <img className="inline-block w-5" src="/streamly.svg" alt="" />
            <b> Streamly </b>•{" "}
            <b>
              {albumSongs.length} {albumSongs.length === 1 ? "song" : "songs"}
            </b>{" "}
            • {formatRuntime(totalSeconds)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p>Album</p>
        <p className="hidden sm:block">Date Added</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="" />
      </div>
      <hr />
      {albumSongs.map((item, index) => (
        <div
          onClick={() => playWithId(item._id)}
          key={item._id}
          className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
        >
          <p className="text-white">
            <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
            <img className="inline w-10 mr-5" src={item.image} alt="" />
            {item.name}
          </p>
          <p className="text-[15px]">{albumData.name}</p>
          <p className="text-[15px] hidden sm:block">5 days ago</p>
          <p className="text-[15px] text-center">{item.duration}</p>
        </div>
      ))}
    </>
  );
};

export default DisplayAlbum;
