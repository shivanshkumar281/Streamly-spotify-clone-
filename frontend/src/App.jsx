import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainLayout from "./components/MainLayout";
import DisplayHome from "./components/DisplayHome";
import DisplayAlbum from "./components/DisplayAlbum";
import Search from "./pages/Search";
import PlaylistPage from "./pages/PlaylistPage";
import BrowsePodcasts from "./pages/BrowsePodcasts";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthPrompt from "./components/AuthPrompt";

import AdminLayout from "./admin/AdminLayout";
import AddSong from "./admin/pages/AddSong";
import AddAlbum from "./admin/pages/AddAlbum";
import ListSong from "./admin/pages/ListSong";
import ListAlbum from "./admin/pages/ListAlbum";
import AddPodcast from "./admin/pages/AddPodcast";
import ListPodcast from "./admin/pages/ListPodcast";

import { PlayerContext } from "./context/PlayerContext";

const App = () => {
  const { audioRef, track, handleTimeUpdate, handleEnded } =
    useContext(PlayerContext);

  return (
    <>
      <ToastContainer theme="dark" autoClose={2000} />
      <AuthPrompt />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<DisplayHome />} />
          <Route path="/album/:id" element={<DisplayAlbum />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          <Route path="/podcasts" element={<BrowsePodcasts />} />
          <Route path="/search" element={<Search />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AddSong />} />
          <Route path="add-song" element={<AddSong />} />
          <Route path="add-album" element={<AddAlbum />} />
          <Route path="list-song" element={<ListSong />} />
          <Route path="list-album" element={<ListAlbum />} />
          <Route path="add-podcast" element={<AddPodcast />} />
          <Route path="list-podcast" element={<ListPodcast />} />
        </Route>

        {/* Any unknown route (e.g. navigating back past app history) falls
            back to the home page so the UI never renders blank. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {track && (
        <audio
          ref={audioRef}
          src={track.file}
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={handleEnded}
        ></audio>
      )}
    </>
  );
};

export default App;
