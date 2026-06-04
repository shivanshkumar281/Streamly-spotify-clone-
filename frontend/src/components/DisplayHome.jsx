import { useContext, useEffect } from "react";
import Navbar from "./Navbar";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import PodcastItem from "./PodcastItem";
import { PlayerContext } from "../context/PlayerContext";

const DisplayHome = () => {
  const {
    songsData,
    albumsData,
    podcastsData,
    setDisplayBg,
    musicFilter,
    setMusicFilter,
    getPodcastsData,
  } = useContext(PlayerContext);

  useEffect(() => {
    setDisplayBg("#121212");
    getPodcastsData();
    // Podcasts have their own page, so Home only handles "all"/"music".
    if (musicFilter === "podcasts") setMusicFilter("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      {musicFilter === "all" && (
        <div className="mb-4">
          <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
          <div className="flex overflow-auto">
            {albumsData.map((item) => (
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
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        <div className="flex overflow-auto">
          {songsData.map((item) => (
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
      {musicFilter === "all" && podcastsData.length > 0 && (
        <div className="mb-4">
          <h1 className="my-5 font-bold text-2xl">Podcasts</h1>
          <div className="flex overflow-auto gap-4">
            {podcastsData.map((podcast) => (
              <PodcastItem key={podcast._id} podcast={podcast} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayHome;
