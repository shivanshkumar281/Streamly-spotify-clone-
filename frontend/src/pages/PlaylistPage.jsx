import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { assets } from "../assets/frontend-assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const formatDate = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const PlaylistPage = () => {
  const { id } = useParams();
  const {
    playlists,
    songsData,
    playWithId,
    addSongToPlaylist,
    removeSongFromPlaylist,
    setDisplayBg,
  } = useContext(PlayerContext);

  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const playlist = playlists.find((pl) => String(pl.id) === id);
  const firstSongImage = playlist?.songs?.[0]?.image;

  useEffect(() => {
    if (!openMenu) return;
    const close = () => setOpenMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [openMenu]);

  // Gradient from first cover
  useEffect(() => {
    if (!firstSongImage) {
      setDisplayBg("#121212");
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = firstSongImage;
    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        setDisplayBg(`linear-gradient(rgb(${r}, ${g}, ${b}), #121212)`);
      } catch {
        setDisplayBg("#121212");
      }
    };
    img.onerror = () => !cancelled && setDisplayBg("#121212");
    return () => {
      cancelled = true;
    };
  }, [firstSongImage, setDisplayBg]);

  if (!playlist) {
    return (
      <>
        <Navbar />
        <p className="mt-10 text-[#a7a7a7]">
          This playlist doesn't exist or was deleted.
        </p>
      </>
    );
  }

  const songs = playlist.songs || [];
  const songIds = new Set(songs.map((s) => s._id));

  const q = query.trim().toLowerCase();
  const results = q
    ? songsData.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.desc?.toLowerCase().includes(q) ||
          s.album?.toLowerCase().includes(q)
      )
    : [];

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="mt-8 flex gap-6 flex-col md:flex-row md:items-end">
        {playlist.image ? (
          <img
            className="w-48 h-48 rounded object-cover shadow-2xl"
            src={playlist.image}
            alt=""
          />
        ) : (
          <div className="w-48 h-48 rounded bg-[#3e3e3e] flex items-center justify-center shadow-2xl">
            <img className="w-16 opacity-70" src={assets.stack_icon} alt="" />
          </div>
        )}
        <div className="flex flex-col">
          <p className="text-sm">
            {playlist.isPrivate ? "Private playlist" : "Public playlist"}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold my-3 break-words">
            {playlist.name}
          </h1>
          {playlist.description && (
            <p className="text-[#a7a7a7] mb-2">{playlist.description}</p>
          )}
          <p className="text-sm text-[#a7a7a7]">
            <b className="text-white">You</b> • {songs.length}{" "}
            {songs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      {/* Songs table */}
      {songs.length > 0 && (
        <>
          <div className="grid grid-cols-[16px_4fr_2fr_2fr_minmax(60px,1fr)_40px] gap-4 mt-10 mb-2 px-4 text-[#a7a7a7] text-sm border-b border-[#ffffff1a] pb-2">
            <p>#</p>
            <p>Title</p>
            <p className="hidden md:block">Album</p>
            <p className="hidden md:block">Date Added</p>
            <img className="w-4 justify-self-center" src={assets.clock_icon} alt="Duration" />
            <p></p>
          </div>

          {songs.map((song, index) => (
            <div
              key={song._id}
              className="group grid grid-cols-[16px_4fr_2fr_2fr_minmax(60px,1fr)_40px] gap-4 items-center px-4 py-2 rounded hover:bg-[#ffffff1a] text-[#a7a7a7]"
            >
              <p className="text-sm">{index + 1}</p>
              <div
                onClick={() => playWithId(song._id)}
                className="flex items-center gap-3 cursor-pointer min-w-0"
              >
                <img className="w-10 h-10 rounded object-cover" src={song.image} alt="" />
                <p className="text-white truncate">{song.name}</p>
              </div>
              <p className="text-sm hidden md:block truncate">
                {song.album && song.album !== "none" ? song.album : "—"}
              </p>
              <p className="text-sm hidden md:block">{formatDate(song.addedAt)}</p>
              <p className="text-sm justify-self-center">{song.duration}</p>
              <div className="relative justify-self-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === song._id ? null : song._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-white text-lg leading-none px-2 hover:scale-110"
                  title="More options"
                >
                  ⋯
                </button>
                {openMenu === song._id && (
                  <div
                    className="absolute right-0 top-6 z-20 w-48 bg-[#282828] rounded shadow-xl py-1 text-sm text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        removeSongFromPlaylist(playlist.id, song._id);
                        setOpenMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#3e3e3e]"
                    >
                      Remove from this playlist
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Find songs */}
      <div className="mt-12 mb-10">
        <h2 className="text-2xl font-bold text-white">
          Let's find something for your playlist
        </h2>

        <div className="mt-4 flex items-center gap-3 bg-white rounded-full px-4 py-2 max-w-[450px]">
          <img className="w-5 opacity-60" src={assets.search_icon} alt="" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search for songs"
            className="bg-transparent outline-none text-black w-full"
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 max-w-[700px]">
          {q &&
            results.map((song) => {
              const already = songIds.has(song._id);
              return (
                <div
                  key={song._id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-[#ffffff14]"
                >
                  <img className="w-12 h-12 rounded object-cover" src={song.image} alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">{song.name}</p>
                    <p className="text-[#a7a7a7] text-sm truncate">
                      {song.album && song.album !== "none" ? song.album : song.desc}
                    </p>
                  </div>
                  <button
                    disabled={already}
                    onClick={() => addSongToPlaylist(playlist.id, song)}
                    className={`rounded-full px-4 py-1.5 font-bold text-sm border ${
                      already
                        ? "border-[#3e3e3e] text-[#a7a7a7] cursor-default"
                        : "border-[#878787] text-white hover:scale-105 hover:border-white transition-transform"
                    }`}
                  >
                    {already ? "Added" : "Add"}
                  </button>
                </div>
              );
            })}
          {q && results.length === 0 && (
            <p className="text-[#a7a7a7]">No songs found for "{query}".</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PlaylistPage;
