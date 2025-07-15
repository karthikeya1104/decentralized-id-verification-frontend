import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { BACKEND_URL } from "../Config";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FlagDocumentPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (user.role !== "user") {
      navigate("/authority");
      return;
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setMessage(null);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/blockchain/flag/`,
        {
          index: data.index,
          flag: data.flag,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Something went wrong",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-indigo-300 via-purple-100 to-blue-100 overflow-hidden relative">
      {/* Visual glass blobs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-400 opacity-20 rounded-full blur-[160px] -top-32 -left-32" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-300 opacity-20 rounded-full blur-[130px] bottom-[-100px] right-[-100px]" />

      <Sidebar role="user" />

      <main className="flex-1 flex items-start justify-center px-4 py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl bg-white/30 backdrop-blur-md rounded-xl shadow-lg p-8 space-y-6"
        >
          <h1 className="text-3xl font-bold text-indigo-700 text-center">🚩 Flag a Document</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Document Index */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Document Index</label>
              <input
                type="number"
                placeholder="e.g. 4"
                {...register("index", { required: "Document index is required" })}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.index && (
                <p className="text-red-600 text-sm mt-1">{errors.index.message}</p>
              )}
            </div>

            {/* Flag Selector */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Flag Status</label>
              <select
                {...register("flag", { required: "Flag value is required" })}
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select flag status --</option>
                <option value="true">True (Flag this document)</option>
                <option value="false">False (Unflag)</option>
              </select>
              {errors.flag && (
                <p className="text-red-600 text-sm mt-1">{errors.flag.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Flag"}
            </button>

            {/* Feedback Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`mt-4 p-4 rounded ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default FlagDocumentPage;
