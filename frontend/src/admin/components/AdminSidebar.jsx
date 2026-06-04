import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../assets/admin-assets/assets";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2.5 text-gray-800 border border-gray-300 border-r-0 p-2 pl-4 sm:pl-8 pr-4 sm:pr-[max(8vw,28px)] cursor-pointer ${
    isActive ? "bg-[#cfffe5]" : "bg-white"
  }`;

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f3fff7] min-h-screen pl-[4vw]">
      <img
        className="mt-5 w-[max(10vw,100px)] hidden sm:block"
        src={assets.logo}
        alt=""
      />
      <img
        className="mt-5 w-[40px] sm:hidden block"
        src={assets.logo_small}
        alt=""
      />
      <div className="flex flex-col gap-5 mt-10">
        <NavLink to="/admin/add-song" className={linkClass}>
          <img className="w-5" src={assets.add_song} alt="" />
          <p className="hidden sm:block">Add Song</p>
        </NavLink>
        <NavLink to="/admin/list-song" className={linkClass}>
          <img className="w-5" src={assets.song_icon} alt="" />
          <p className="hidden sm:block">List Songs</p>
        </NavLink>
        <NavLink to="/admin/add-album" className={linkClass}>
          <img className="w-5" src={assets.add_album} alt="" />
          <p className="hidden sm:block">Add Album</p>
        </NavLink>
        <NavLink to="/admin/list-album" className={linkClass}>
          <img className="w-5" src={assets.album_icon} alt="" />
          <p className="hidden sm:block">List Albums</p>
        </NavLink>
        <NavLink to="/admin/add-podcast" className={linkClass}>
          <img className="w-5" src={assets.add_song} alt="" />
          <p className="hidden sm:block">Add Podcast</p>
        </NavLink>
        <NavLink to="/admin/list-podcast" className={linkClass}>
          <img className="w-5" src={assets.song_icon} alt="" />
          <p className="hidden sm:block">List Podcasts</p>
        </NavLink>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 text-gray-800 border border-gray-300 border-r-0 p-2 pl-4 sm:pl-8 pr-4 sm:pr-[max(8vw,28px)] cursor-pointer bg-white hover:bg-gray-100"
        >
          <p className="hidden sm:block">← Back to App</p>
          <p className="sm:hidden">←</p>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
