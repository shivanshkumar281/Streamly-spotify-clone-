import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthPrompt = () => {
  const { authPrompt, hideAuthPrompt } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authPrompt) return null;

  const go = (path) => {
    hideAuthPrompt();
    navigate(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={hideAuthPrompt}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[90%] max-w-[420px] rounded-xl p-6 text-white shadow-2xl bg-gradient-to-br from-[#509bf5] to-[#0d4ec2]"
      >
        <button
          onClick={hideAuthPrompt}
          aria-label="Close"
          className="absolute top-3 right-4 text-white/80 hover:text-white text-xl leading-none"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">
          {authPrompt.title || "Create a playlist"}
        </h2>
        <p className="text-white/90 mb-6">
          {authPrompt.message ||
            "Log in to create and share playlists. It's free and easy."}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => go("/login")}
            className="bg-white text-[#0d4ec2] font-bold rounded-full px-6 py-2.5 hover:scale-105 transition-transform"
          >
            Log in
          </button>
          <button
            onClick={() => go("/signup")}
            className="font-bold text-white/90 hover:text-white underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPrompt;
