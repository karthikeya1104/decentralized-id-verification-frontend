import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerUser } from "../services/authService";
import { motion } from "framer-motion";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    public_id: "",
    sector: "",
  });
  const [proofDocument, setProofDocument] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
    if (proofDocument) payload.append("proof_document", proofDocument);

    try {
      const data = await registerUser(payload);
      if (data?.username) navigate("/login");
    } catch (error) {
      setErrorMessage(error.response?.data?.username || "Something went wrong.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-200 to-blue-100 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute w-[700px] h-[700px] bg-indigo-400 opacity-20 rounded-full blur-[160px] top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-300 opacity-20 rounded-full blur-[130px] bottom-[-150px] right-[-150px]" />

      {/* Glassmorphic Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 bg-white/30 backdrop-blur-md shadow-xl border border-white/40 rounded-xl p-8 w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Register</h2>
        <form onSubmit={handleRegister} encType="multipart/form-data" className="space-y-4">
          <input name="username" type="text" placeholder="Username" required onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-white/60 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input name="password" type="password" placeholder="Password" required onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-white/60 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input name="name" type="text" placeholder="Authority Name" required onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-white/60 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input name="public_id" type="text" placeholder="Public ID" required onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-white/60 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input name="sector" type="text" placeholder="Sector" required onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-white/60 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input name="proof_document" type="file" required onChange={(e) => setProofDocument(e.target.files[0])}
            className="w-full px-4 py-2 bg-white/60 rounded text-gray-800" />
          <button type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition duration-200">
            Register
          </button>
        </form>
        {errorMessage && <p className="text-red-600 text-sm mt-4 text-center">{errorMessage}</p>}
        <p className="text-sm text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">Login</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
