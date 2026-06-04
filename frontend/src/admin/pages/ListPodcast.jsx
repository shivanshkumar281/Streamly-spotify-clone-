import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

const ListPodcast = () => {
  const [data, setData] = useState([]);

  const fetchPodcasts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/podcast/list`);
      if (response.data.success) setData(response.data.podcasts);
    } catch (error) {
      toast.error("Error fetching podcasts");
    }
  };

  const removePodcast = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/api/podcast/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchPodcasts();
      }
    } catch (error) {
      toast.error("Error removing podcast");
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  return (
    <div>
      <p>All Podcasts List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
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
            <p>{item.desc}</p>
            <p>{item.duration}</p>
            <p
              onClick={() => removePodcast(item._id)}
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

export default ListPodcast;
