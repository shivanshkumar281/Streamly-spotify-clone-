import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/frontend-assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const PlaylistEditModal = ({ playlist, onClose }) => {
  const { updatePlaylist } = useContext(PlayerContext);
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description || "");
  const [image, setImage] = useState(playlist.image || "");

  const onPickImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const onSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Playlist name can't be empty");
      return;
    }
    updatePlaylist(playlist.id, {
      name: name.trim(),
      description: description.trim(),
      image,
    });
    toast.success("Playlist updated");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <form
        onSubmit={onSave}
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] max-w-[520px] bg-[#282828] rounded-lg p-6 text-white"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Edit details</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-4">
          <label className="relative w-40 h-40 shrink-0 bg-[#3e3e3e] rounded shadow-lg flex items-center justify-center cursor-pointer overflow-hidden group">
            {image ? (
              <img className="w-full h-full object-cover" src={image} alt="" />
            ) : (
              <img className="w-12 opacity-60" src={assets.stack_icon} alt="" />
            )}
            <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm transition-opacity">
              Choose photo
            </span>
            <input type="file" accept="image/*" hidden onChange={onPickImage} />
          </label>

          <div className="flex-1 flex flex-col gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist name"
              className="bg-[#3e3e3e] rounded px-4 py-2.5 outline-none focus:ring-2 focus:ring-white"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add an optional description"
              rows={4}
              className="bg-[#3e3e3e] rounded px-4 py-2.5 outline-none focus:ring-2 focus:ring-white resize-none flex-1"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-white text-black font-bold rounded-full px-8 py-2.5 hover:scale-105 transition-transform"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaylistEditModal;
