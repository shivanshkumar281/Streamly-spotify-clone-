import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/frontend-assets/assets";
import { AuthContext } from "../context/AuthContext";
import { PlayerContext } from "../context/PlayerContext";
import AccountModal from "./AccountModal";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const { musicFilter, setMusicFilter, getPodcastsData } =
    useContext(PlayerContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountModal, setAccountModal] = useState(null); // 'name' | 'password' | 'avatar' | null

  const openModal = (mode) => {
    setMenuOpen(false);
    setAccountModal(mode);
  };

  // Chips scope the current Search view; elsewhere All/Music go Home and
  // Podcasts opens (or reloads) the Browse Podcasts page.
  const selectFilter = (filter) => {
    const onSearch = location.pathname.startsWith("/search");
    const onPodcasts = location.pathname.startsWith("/podcasts");

    setMusicFilter(filter);

    if (onSearch) return; // stay on Search, just scope the results

    if (filter === "podcasts") {
      if (onPodcasts) {
        getPodcastsData(); // reload the Browse Podcasts page content
      } else {
        navigate("/podcasts");
      }
      return;
    }

    // All / Music → Home
    navigate("/");
  };

  const chipClass = (active) =>
    `px-4 py-1 rounded-2xl cursor-pointer transition-colors ${
      active ? "bg-white text-black" : "bg-[#2a2a2a] text-white hover:bg-[#3e3e3e]"
    }`;

  return (
    <>
      {accountModal && (
        <AccountModal mode={accountModal} onClose={() => setAccountModal(null)} />
      )}
      <div className="w-full flex justify-between items-center font-semibold">
        <div className="flex items-center gap-2">
          <img
            onClick={() => navigate(-1)}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_left}
            alt=""
          />
          <img
            onClick={() => navigate(1)}
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            src={assets.arrow_right}
            alt=""
          />
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.spotify.com/premium/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer hover:scale-105 transition-transform"
          >
            Explore Premium
          </a>
          <a
            href="https://www.spotify.com/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black py-1 px-3 rounded-2xl text-[15px] cursor-pointer hover:text-green-400"
          >
            Install App
          </a>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="bg-purple-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold uppercase overflow-hidden hover:scale-105 transition-transform"
                title={user?.name}
              >
                {user?.image ? (
                  <img
                    className="w-full h-full object-cover"
                    src={user.image}
                    alt=""
                  />
                ) : (
                  user?.name?.charAt(0) || "U"
                )}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#282828] rounded shadow-lg py-1 z-50 text-sm">
                  <div className="px-4 py-2 text-[#a7a7a7] border-b border-[#3e3e3e] truncate">
                    {user?.name}
                  </div>
                  <button
                    onClick={() => openModal("avatar")}
                    className="w-full text-left px-4 py-2 hover:bg-[#3e3e3e]"
                  >
                    Change profile picture
                  </button>
                  <button
                    onClick={() => openModal("name")}
                    className="w-full text-left px-4 py-2 hover:bg-[#3e3e3e]"
                  >
                    Change account name
                  </button>
                  <button
                    onClick={() => openModal("password")}
                    className="w-full text-left px-4 py-2 hover:bg-[#3e3e3e]"
                  >
                    Change password
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#3e3e3e] border-t border-[#3e3e3e]"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="text-[#a7a7a7] text-[15px] hover:text-white hover:scale-105 transition-transform"
              >
                Sign up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-black text-[15px] px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => selectFilter("all")}
          className={chipClass(musicFilter === "all")}
        >
          All
        </button>
        <button
          onClick={() => selectFilter("music")}
          className={chipClass(musicFilter === "music")}
        >
          Music
        </button>
        <button
          onClick={() => selectFilter("podcasts")}
          className={chipClass(musicFilter === "podcasts")}
        >
          Podcasts
        </button>
      </div>
    </>
  );
};

export default Navbar;
