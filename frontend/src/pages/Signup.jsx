import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message || "Sign up failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1f1f1f] to-black flex flex-col items-center text-white px-4">
      <Link to="/" className="mt-10 flex items-center gap-2">
        <img className="w-10" src="/streamly.svg" alt="Streamly" />
        <span className="text-2xl font-bold">Streamly</span>
      </Link>

      <div className="w-full max-w-[734px] bg-[#121212] rounded-lg mt-6 mb-10 px-6 sm:px-16 py-10">
        <h1 className="text-3xl sm:text-5xl font-bold text-center mb-8 leading-tight">
          Sign up to start listening
        </h1>

        {error && (
          <div className="bg-[#e91429] text-white text-sm rounded p-3 mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="max-w-[324px] mx-auto flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Email address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="name@domain.com"
              className="bg-transparent border border-[#878787] rounded px-4 py-3 text-sm outline-none focus:border-white hover:border-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">What should we call you?</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              placeholder="Profile name"
              className="bg-transparent border border-[#878787] rounded px-4 py-3 text-sm outline-none focus:border-white hover:border-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="At least 6 characters"
              className="bg-transparent border border-[#878787] rounded px-4 py-3 text-sm outline-none focus:border-white hover:border-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1ed760] hover:bg-[#3be477] text-black font-bold rounded-full py-3 mt-2 transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <hr className="border-[#292929] my-8" />
        <p className="text-center text-[#a7a7a7]">
          Already have an account?{" "}
          <Link to="/login" className="text-white underline hover:text-[#1ed760]">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
