import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { BACKEND_URL } from "../Config";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VerifyDocumentPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role !== "authority") {
      navigate("/user/");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setResult(null);
    setError(null);
    try {
      const response = await axios.post(`${BACKEND_URL}/blockchain/verify/`, {
        index: data.index,
        tx_hash: data.tx_hash
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed.");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-indigo-300 via-purple-100 to-blue-100 overflow-hidden relative">
      {/* Glass blur blobs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-400 opacity-20 rounded-full blur-[160px] -top-32 -left-32" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-300 opacity-20 rounded-full blur-[130px] bottom-[-100px] right-[-100px]" />

      <Sidebar role="authority" />

      <main className="flex-1 px-6 py-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto bg-white/30 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-8"
        >
          <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">🔍 Verify Document</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Transaction Hash */}
            <div>
              <label className="block mb-1 font-medium text-gray-800">Transaction Hash</label>
              <input
                type="text"
                {...register("tx_hash")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.tx_hash && <p className="text-sm text-red-600 mt-1">{errors.tx_hash.message}</p>}
            </div>

            {/* Document Index */}
            <div>
              <label className="block mb-1 font-medium text-gray-800">Document Index</label>
              <input
                type="number"
                {...register("index")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.index && <p className="text-sm text-red-600 mt-1">{errors.index.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "✅ Verify Document"}
            </button>
          </form>

          {/* Result Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10 border-t pt-6"
            >
              {result.exists ? (
                <div className="bg-green-100/30 border border-green-400 text-green-900 rounded-lg shadow-md backdrop-blur-md p-6 space-y-4">
                  <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
                    ✅ Document Verified
                  </h2>
                  <div className="grid gap-3 text-sm sm:text-base text-gray-800">
                    <div className="flex justify-between">
                      <span className="font-medium">📄 Title:</span>
                      <span>{result.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">🧾 Issuer Address:</span>
                      <span className="font-mono break-all">{result.issuer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">👤 Receiver Address:</span>
                      <span className="font-mono break-all">{result.receiver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">⏰ Timestamp:</span>
                      <span>{new Date(result.timestamp * 1000).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">🚩 Flagged:</span>
                      <span className={`font-semibold ${result.flagged ? "text-red-600" : "text-green-600"}`}>
                        {result.flagged ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 bg-yellow-100/30 border border-yellow-400 text-yellow-900 rounded-md p-4 backdrop-blur-md shadow-md">
                  ⚠️ Document not found on the blockchain.
                </div>
              )}
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mt-6 bg-red-100/30 border border-red-400 text-red-800 p-4 rounded-md shadow-md backdrop-blur-md"
            >
              ❌ {error}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default VerifyDocumentPage;
