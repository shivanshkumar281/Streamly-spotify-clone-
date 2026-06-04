import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "./AuthContext";
import {
  songsData as localSongs,
  albumsData as localAlbums,
} from "../assets/frontend-assets/assets";

export const PlayerContext = createContext();

// Offline fallback data
const fallbackAlbums = localAlbums.map((a) => ({
  _id: String(a.id),
  name: a.name,
  desc: a.desc,
  bgColour: a.bgColor,
  image: a.image,
}));

const fallbackSongs = localSongs.map((s) => ({
  _id: String(s.id),
  name: s.name,
  desc: s.desc,
  image: s.image,
  file: s.file,
  duration: s.duration,
  album: localAlbums[s.id % localAlbums.length].name,
}));

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const { user } = useContext(AuthContext);
  const userId = user?.id || null;
  const prevUserId = useRef(userId);

  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [podcastsData, setPodcastsData] = useState([]);
  const [track, setTrack] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playlists, setPlaylists] = useState([]);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });
  const [displayBg, setDisplayBg] = useState("#121212");
  const [musicFilter, setMusicFilter] = useState("all");

  const play = () => {
    audioRef.current?.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlayStatus(false);
  };

  const playWithId = (id) => {
    const song = songsData.find((item) => item._id === id);
    if (!song) return;
    setTrack(song);
    setPlayStatus(true);
  };

  const playTrack = (item) => {
    if (!item) return;
    setTrack(item);
    setPlayStatus(true);
  };

  const indexOfTrack = () =>
    songsData.findIndex((item) => item._id === track?._id);

  const previous = () => {
    if (!songsData.length) return;
    const index = indexOfTrack();
    const prevIndex = (index - 1 + songsData.length) % songsData.length;
    setTrack(songsData[prevIndex]);
    setPlayStatus(true);
  };

  const next = () => {
    if (!songsData.length) return;
    if (shuffle) {
      let randomIndex = Math.floor(Math.random() * songsData.length);
      if (songsData.length > 1) {
        while (randomIndex === indexOfTrack()) {
          randomIndex = Math.floor(Math.random() * songsData.length);
        }
      }
      setTrack(songsData[randomIndex]);
    } else {
      const index = indexOfTrack();
      const nextIndex = (index + 1) % songsData.length;
      setTrack(songsData[nextIndex]);
    }
    setPlayStatus(true);
  };

  const toggleShuffle = () => setShuffle((prev) => !prev);
  const toggleLoop = () => setLoop((prev) => !prev);

  const setVolumeLevel = (value) => {
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  };

  // Seek to fraction (0..1)
  const seekToFraction = (fraction) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const clamped = Math.min(Math.max(fraction, 0), 1);
    audioRef.current.currentTime = clamped * audioRef.current.duration;
    if (seekBar.current) seekBar.current.style.width = clamped * 100 + "%";
  };

  const createPlaylist = () => {
    const name = `My Playlist #${playlists.length + 1}`;
    const newPlaylist = {
      id: Date.now(),
      name,
      description: "",
      image: "",
      isPrivate: false,
      songs: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const addSongToPlaylist = (playlistId, song) => {
    let added = false;
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        const songs = pl.songs || [];
        if (songs.some((s) => s._id === song._id)) return pl;
        added = true;
        return {
          ...pl,
          songs: [...songs, { ...song, addedAt: Date.now() }],
        };
      })
    );
    return added;
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId
          ? { ...pl, songs: (pl.songs || []).filter((s) => s._id !== songId) }
          : pl
      )
    );
  };

  const updatePlaylist = (id, data) => {
    setPlaylists((prev) =>
      prev.map((pl) => (pl.id === id ? { ...pl, ...data } : pl))
    );
  };

  const deletePlaylist = (id) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== id));
  };

  const togglePlaylistPrivacy = (id) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === id ? { ...pl, isPrivate: !pl.isPrivate } : pl
      )
    );
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    if (seekBar.current) {
      seekBar.current.style.width =
        Math.floor((audio.currentTime / audio.duration) * 100) + "%";
    }
    setTime({
      currentTime: {
        second: Math.floor(audio.currentTime % 60),
        minute: Math.floor(audio.currentTime / 60),
      },
      totalTime: {
        second: Math.floor(audio.duration % 60) || 0,
        minute: Math.floor(audio.duration / 60) || 0,
      },
    });
  };

  const handleEnded = () => {
    if (loop) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      next();
    }
  };

  const getSongsData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/song/list`);
      if (response.data.success && response.data.songs.length > 0) {
        setSongsData(response.data.songs);
        setTrack(response.data.songs[0]);
        return;
      }
      throw new Error("Empty response");
    } catch (error) {
      setSongsData(fallbackSongs);
      setTrack(fallbackSongs[0]);
    }
  };

  const getAlbumsData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/album/list`);
      if (response.data.success && response.data.albums.length > 0) {
        setAlbumsData(response.data.albums);
        return;
      }
      throw new Error("Empty response");
    } catch (error) {
      setAlbumsData(fallbackAlbums);
    }
  };

  const getPodcastsData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/podcast/list`);
      if (response.data.success) {
        setPodcastsData(response.data.podcasts);
      }
    } catch (error) {
      setPodcastsData([]);
    }
  };

  useEffect(() => {
    if (track && playStatus && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    getSongsData();
    getAlbumsData();
    getPodcastsData();
  }, []);

  // Load on user switch, persist on change (scoped per user)
  useEffect(() => {
    if (prevUserId.current !== userId) {
      prevUserId.current = userId;
      if (!userId) {
        setPlaylists([]);
        return;
      }
      try {
        setPlaylists(
          JSON.parse(localStorage.getItem(`playlists_${userId}`)) || []
        );
      } catch {
        setPlaylists([]);
      }
      return;
    }
    if (!userId) return;
    localStorage.setItem(`playlists_${userId}`, JSON.stringify(playlists));
  }, [playlists, userId]);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    play,
    pause,
    playWithId,
    playTrack,
    previous,
    next,
    shuffle,
    toggleShuffle,
    loop,
    toggleLoop,
    volume,
    setVolumeLevel,
    seekToFraction,
    handleTimeUpdate,
    handleEnded,
    playlists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    togglePlaylistPrivacy,
    addSongToPlaylist,
    removeSongFromPlaylist,
    displayBg,
    setDisplayBg,
    musicFilter,
    setMusicFilter,
    songsData,
    albumsData,
    podcastsData,
    getPodcastsData,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
