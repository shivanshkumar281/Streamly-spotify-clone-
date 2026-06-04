import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AlbumItem from "../components/AlbumItem";
import SongItem from "../components/SongItem";
import PodcastItem from "../components/PodcastItem";
import { assets } from "../assets/frontend-assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const Search = () => {
  const {
    songsData,
    albumsData,
    podcastsData,
    setDisplayBg,
    musicFilter,
    getPodcastsData,
  } = useContext(PlayerContext);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setDisplayBg("#121212");
    getPodcastsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPodcasts = musicFilter === "podcasts";
  const q = query.trim().toLowerCase();

  const filteredSongs =
    q && !isPodcasts
      ? songsData.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.desc?.toLowerCase().includes(q)
        )
      : [];
  // Albums only show under the "All" filter.
  const filteredAlbums =
    q && musicFilter === "all"
      ? albumsData.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.desc?.toLowerCase().includes(q)
        )
      : [];
  // Podcasts appear under both "All" and "Podcasts".
  const filteredPodcasts =
    q && (isPodcasts || musicFilter === "all")
      ? podcastsData.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.desc?.toLowerCase().includes(q)
        )
      : [];

  const hasResults =
    filteredSongs.length > 0 ||
    filteredAlbums.length > 0 ||
    filteredPodcasts.length > 0;

  const placeholder = isPodcasts
    ? "Search for podcasts"
    : "What do you want to listen to?";
  const hint = isPodcasts
    ? "Start typing to search podcasts."
    : musicFilter === "all"
    ? "Start typing to search songs, albums and podcasts."
    : "Start typing to search songs.";

  return (
    <>
      <Navbar />
      <div className="mt-6 flex items-center gap-3 bg-white rounded-full px-4 py-2 max-w-[450px]">
        <img className="w-5 opacity-60" src={assets.search_icon} alt="" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder={placeholder}
          className="bg-transparent outline-none text-black w-full"
        />
      </div>

      {!q && <p className="text-[#a7a7a7] mt-8">{hint}</p>}

      {q && !hasResults && (
        <p className="text-[#a7a7a7] mt-8">
          No results found for "<span className="text-white">{query}</span>".
        </p>
      )}

      {filteredPodcasts.length > 0 && (
        <div className="mb-4">
          <h1 className="my-5 font-bold text-2xl">Podcasts</h1>
          <div className="flex flex-wrap gap-4">
            {filteredPodcasts.map((podcast) => (
              <PodcastItem key={podcast._id} podcast={podcast} />
            ))}
          </div>
        </div>
      )}

      {filteredAlbums.length > 0 && (
        <div className="mb-4">
          <h1 className="my-5 font-bold text-2xl">Albums</h1>
          <div className="flex flex-wrap">
            {filteredAlbums.map((item) => (
              <AlbumItem
                key={item._id}
                name={item.name}
                desc={item.desc}
                id={item._id}
                image={item.image}
              />
            ))}
          </div>
        </div>
      )}

      {filteredSongs.length > 0 && (
        <div className="mb-4">
          <h1 className="my-5 font-bold text-2xl">Songs</h1>
          <div className="flex flex-wrap">
            {filteredSongs.map((item) => (
              <SongItem
                key={item._id}
                name={item.name}
                desc={item.desc}
                id={item._id}
                image={item.image}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
