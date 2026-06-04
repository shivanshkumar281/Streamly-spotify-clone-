import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

const ListAlbum = () => {
  const [data, setData] = useState([]);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/album/list`);
      if (response.data.success) setData(response.data.albums);
    } catch (error) {
      toast.error("Error fetching albums");
    }
  };

  const removeAlbum = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/api/album/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAlbums();
      }
    } catch (error) {
      toast.error("Error removing album");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div>
      <p>All Albums List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Album Colour</b>
          <b>Action</b>
        </div>
        {data.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_2fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm"
          >
            <img className="w-12" src={item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.desc}</p>
            <input type="color" value={item.bgColour} disabled />
            <p
              onClick={() => removeAlbum(item._id)}
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

export default ListAlbum;
