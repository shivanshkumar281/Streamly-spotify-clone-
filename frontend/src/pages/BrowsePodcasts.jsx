import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PodcastItem from "../components/PodcastItem";
import { assets } from "../assets/frontend-assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const BrowsePodcasts = () => {
  const { podcastsData, setDisplayBg, getPodcastsData, setMusicFilter } =
    useContext(PlayerContext);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setDisplayBg("#121212");
    setMusicFilter("podcasts");
    getPodcastsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? podcastsData.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.desc?.toLowerCase().includes(q)
      )
    : podcastsData;

  return (
    <>
      <Navbar />

      <div className="mt-6 flex items-center gap-3 bg-white rounded-full px-4 py-2 max-w-[450px]">
        <img className="w-5 opacity-60" src={assets.search_icon} alt="" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search for a podcast"
          className="bg-transparent outline-none text-black w-full"
        />
      </div>

      <h1 className="my-6 font-bold text-2xl">Popular Podcasts</h1>

      {podcastsData.length === 0 ? (
        <p className="text-[#a7a7a7]">
          No podcasts yet. Add some from the{" "}
          <a className="underline hover:text-white" href="/admin/add-podcast">
            admin panel
          </a>
          .
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-[#a7a7a7]">No podcasts found for "{query}".</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {filtered.map((podcast) => (
            <PodcastItem key={podcast._id} podcast={podcast} />
          ))}
        </div>
      )}
    </>
  );
};

export default BrowsePodcasts;
