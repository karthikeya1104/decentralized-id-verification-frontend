import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { login } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

const Login = () => {
  const [PublicID, setPublicID] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const data = await login(PublicID, password);
      if (data?.access && data?.refresh) {
        localStorage.setItem("accessToken", data.access);
        const decodedUser = jwtDecode(data.access);
        setUser(decodedUser);
        navigate(decodedUser.role === "authority" ? "/authority/" : "/user/");
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-200 to-blue-100 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute w-[700px] h-[700px] bg-indigo-400 opacity-20 rounded-full blur-[160px] top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-300 opacity-20 rounded-full blur-[130px] bottom-[-150px] right-[-150px]" />

      {/* Glassmorphic Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 bg-white/30 backdrop-blur-md shadow-xl border border-white/40 rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Public ID"
            value={PublicID}
            onChange={(e) => setPublicID(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-white/60 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-white/60 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition duration-200"
          >
            Login
          </button>
        </form>
        {errorMessage && <p className="text-red-600 text-sm mt-4 text-center">{errorMessage}</p>}
        <p className="text-sm text-center text-gray-700 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
