import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const titles = {
  name: "Edit account name",
  password: "Change password",
  avatar: "Change profile picture",
};

const AccountModal = ({ mode, onClose }) => {
  const { user, updateName, updatePassword, updateAvatar } =
    useContext(AuthContext);

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let result;
    if (mode === "name") {
      result = await updateName(name);
    } else if (mode === "password") {
      result = await updatePassword(currentPassword, newPassword);
    } else if (mode === "avatar") {
      if (!file) {
        setLoading(false);
        toast.error("Please choose an image");
        return;
      }
      result = await updateAvatar(file);
    }
    setLoading(false);
    if (result.success) {
      toast.success(result.message || "Updated");
      onClose();
    } else {
      toast.error(result.message || "Update failed");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] max-w-[420px] bg-[#282828] rounded-lg p-6 text-white"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">{titles[mode]}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {mode === "name" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#a7a7a7]">Account name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#3e3e3e] rounded px-4 py-2.5 outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>
        )}

        {mode === "password" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#a7a7a7]">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-[#3e3e3e] rounded px-4 py-2.5 outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#a7a7a7]">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="bg-[#3e3e3e] rounded px-4 py-2.5 outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>
          </div>
        )}

        {mode === "avatar" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-[#3e3e3e] flex items-center justify-center">
              {file ? (
                <img
                  className="w-full h-full object-cover"
                  src={URL.createObjectURL(file)}
                  alt=""
                />
              ) : user?.image ? (
                <img
                  className="w-full h-full object-cover"
                  src={user.image}
                  alt=""
                />
              ) : (
                <span className="text-4xl font-bold uppercase">
                  {user?.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <label className="bg-white text-black font-bold rounded-full px-5 py-2 cursor-pointer hover:scale-105 transition-transform">
              Choose photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1ed760] hover:bg-[#3be477] text-black font-bold rounded-full py-2.5 mt-6 transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default AccountModal;
