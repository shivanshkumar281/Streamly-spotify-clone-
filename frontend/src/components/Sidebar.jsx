import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/frontend-assets/assets";
import { PlayerContext } from "../context/PlayerContext";
import { AuthContext } from "../context/AuthContext";
import PlaylistEditModal from "./PlaylistEditModal";

const Sidebar = () => {
  const navigate = useNavigate();
  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    togglePlaylistPrivacy,
  } = useContext(PlayerContext);
  const { isLoggedIn, showAuthPrompt } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, playlist }
  const [editing, setEditing] = useState(null); // playlist being edited

  // Close the context menu on any outside click / scroll / escape.
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [contextMenu]);

  const openContextMenu = (e, playlist) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, playlist });
  };

  const handleCreatePlaylist = () => {
    if (!isLoggedIn) {
      showAuthPrompt(
        "Create a playlist",
        "Log in to create and share playlists. It's free and easy."
      );
      return;
    }
    const playlist = createPlaylist();
    toast.success(`Created "${playlist.name}"`);
  };

  const browsePodcasts = () => {
    navigate("/podcasts");
  };

  return (
    <>
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 pl-8 cursor-pointer hover:text-green-400"
        >
          <img className="w-6" src={assets.home_icon} alt="" />
          <p className="font-bold">Home</p>
        </div>
        <div
          onClick={() => navigate("/search")}
          className="flex items-center gap-3 pl-8 cursor-pointer hover:text-green-400"
        >
          <img className="w-6" src={assets.search_icon} alt="" />
          <p className="font-bold">Search</p>
        </div>
      </div>
      <div className="bg-[#121212] h-[85%] rounded">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-8" src={assets.stack_icon} alt="" />
            <p className="font-semibold">Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <img
              onClick={() => setCollapsed((prev) => !prev)}
              className={`w-5 cursor-pointer transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
              src={assets.arrow_icon}
              alt="Toggle library"
              title={collapsed ? "Expand library" : "Collapse library"}
            />
            <img
              onClick={handleCreatePlaylist}
              className="w-5 cursor-pointer hover:scale-110 transition-transform"
              src={assets.plus_icon}
              alt="Create playlist"
              title="Create playlist"
            />
          </div>
        </div>

        {playlists.length > 0 && (
          <div className="px-2 max-h-[40%] overflow-auto">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                onContextMenu={(e) => openContextMenu(e, pl)}
                onClick={() => navigate(`/playlist/${pl.id}`)}
                title="Open playlist (right-click for options)"
                className="flex items-center gap-3 p-2 rounded hover:bg-[#ffffff1a] cursor-pointer"
              >
                {pl.image ? (
                  <img
                    className="w-10 h-10 rounded object-cover"
                    src={pl.image}
                    alt=""
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-[#3e3e3e] flex items-center justify-center">
                    <img className="w-5 opacity-70" src={assets.stack_icon} alt="" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{pl.name}</p>
                  <p className="text-xs text-[#a7a7a7] flex items-center gap-1">
                    {pl.isPrivate && <span title="Private">🔒</span>}
                    {pl.isPrivate ? "Private playlist" : "Playlist"} • You
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!collapsed && (
          <>
            <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4">
              <h1>Create your first playlist</h1>
              <p className="font-light">It's easy, we will help you</p>
              <button
                onClick={handleCreatePlaylist}
                className="px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4 hover:scale-105 transition-transform"
              >
                Create Playlist
              </button>
            </div>
            <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4">
              <h1>Let's find some podcasts to follow</h1>
              <p className="font-light">
                We'll keep you updated on new episodes
              </p>
              <button
                onClick={browsePodcasts}
                className="px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4 hover:scale-105 transition-transform"
              >
                Browse Podcasts
              </button>
            </div>
          </>
        )}
      </div>
    </div>

      {contextMenu && (
        <div
          className="fixed z-50 w-52 bg-[#282828] rounded shadow-xl py-1 text-sm text-white"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setEditing(contextMenu.playlist);
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 hover:bg-[#3e3e3e]"
          >
            Edit details
          </button>
          <button
            onClick={() => {
              togglePlaylistPrivacy(contextMenu.playlist.id);
              toast.success(
                contextMenu.playlist.isPrivate
                  ? "Playlist is now public"
                  : "Playlist is now private"
              );
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 hover:bg-[#3e3e3e]"
          >
            {contextMenu.playlist.isPrivate
              ? "Make public"
              : "Make private"}
          </button>
          <button
            onClick={() => {
              deletePlaylist(contextMenu.playlist.id);
              toast.success("Playlist deleted");
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 hover:bg-[#3e3e3e] text-red-400 border-t border-[#3e3e3e]"
          >
            Delete
          </button>
        </div>
      )}

      {editing && (
        <PlaylistEditModal
          playlist={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
};

export default Sidebar;
