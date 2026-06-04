import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

const ListSong = () => {
  const [data, setData] = useState([]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/song/list`);
      if (response.data.success) setData(response.data.songs);
    } catch (error) {
      toast.error("Error fetching songs");
    }
  };

  const removeSong = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/api/song/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSongs();
      }
    } catch (error) {
      toast.error("Error removing song");
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div>
      <p>All Songs List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Album</b>
          <b>Duration</b>
          <b>Action</b>
        </div>
        {data.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_2fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm"
          >
            <img className="w-12" src={item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.album}</p>
            <p>{item.duration}</p>
            <p
              onClick={() => removeSong(item._id)}
              className="cursor-pointer text-lg text-red-600"
            >
              x
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListSong;
