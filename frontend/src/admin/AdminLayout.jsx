import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";
import { ADMIN_PASSWORD } from "../config";

const AdminLayout = () => {
  const navigate = useNavigate();
  // Unlock state lives only while the admin section is mounted, so leaving the
  // admin page (or refreshing) automatically logs you out.
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Clear any stale unlock flag from older sessions on mount.
  useEffect(() => {
    sessionStorage.removeItem("adminUnlocked");
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#f3fff7] flex items-center justify-center px-4">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-[380px] bg-white rounded-lg shadow-md p-8 flex flex-col gap-5"
        >
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Admin Access
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 text-sm rounded p-2.5 text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Enter Password:
            </label>
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border-2 border-gray-300 rounded px-4 py-2.5 outline-none focus:border-green-600"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white font-semibold rounded py-2.5 hover:bg-gray-800"
          >
            Unlock
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            ← Back to app
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-start min-h-screen">
      <AdminSidebar />
      <div className="flex-1 h-screen overflow-y-scroll bg-[#f3fff7]">
        <AdminNavbar />
        <div className="pt-8 pl-5 sm:pt-12 sm:pl-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
