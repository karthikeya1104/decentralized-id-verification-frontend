import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { BACKEND_URL } from "../Config";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

const IssueDocumentPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();

  const watchFile = watch("file");

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role !== "authority") {
      navigate("/user/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const file = watchFile?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewURL(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewURL(null);
    }
  }, [watchFile]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("receiver_id", data.receiver_id);
      formData.append("title", data.title);
      formData.append("file", data.file[0]);

      const response = await axios.post(`${BACKEND_URL}/documents/issue/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status !== 201) throw new Error("Failed to issue document");

      setResult(response.data.document);
      setPreviewURL(null);
      reset();
    } catch (error) {
      setResult({ error: error.response?.data?.error || error.message });
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
          className="max-w-2xl mx-auto bg-white/30 backdrop-blur-md shadow-xl rounded-xl p-8 border border-white/20"
        >
          <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
            📝 Issue New Document
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Receiver ID */}
            <div>
              <label className="block mb-1 font-medium text-gray-800">Receiver Public ID</label>
              <input
                type="text"
                {...register("receiver_id", { required: "Receiver ID is required" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="e.g. public123xyz"
              />
              {errors.receiver_id && <p className="text-red-600 text-sm">{errors.receiver_id.message}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block mb-1 font-medium text-gray-800">Document Title</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
            </div>

            {/* File */}
            <div>
              <label className="block mb-1 font-medium text-gray-800">Document File</label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                {...register("file", { required: "File is required" })}
                className="w-full text-sm"
              />
              {errors.file && <p className="text-red-600 text-sm">{errors.file.message}</p>}
            </div>

            {/* Image Preview */}
            {previewURL && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="bg-white/20 p-3 border rounded-md">
                  <img
                    src={previewURL}
                    alt="Preview"
                    className="w-full max-h-80 object-contain rounded-md"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Issuing..." : "🚀 Issue Document"}
            </button>
          </form>

          {/* Result Feedback */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10 bg-white/30 backdrop-blur-md border border-white/20 shadow-md rounded-lg p-6 space-y-4"
            >
              {result.error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-md border border-red-300">
                  <p className="font-semibold flex items-center gap-2">⚠️ Error:</p>
                  <p>{result.error}</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
                    ✅ Document Issued Successfully
                  </h2>

                  <div className="text-gray-800 space-y-1 text-sm">
                    <p><strong>📄 Title:</strong> {result.title}</p>
                    <p><strong>👤 Receiver:</strong> {result.receiver_name} <span className="text-gray-500">({result.receiver_public_id})</span></p>
                    <p className="break-all"><strong>🗃 IPFS Hash:</strong> {result.ipfs_hash}</p>
                    <p className="break-all"><strong>🔗 Tx Hash:</strong> {result.tx_hash}</p>
                    <p><strong>📑 Index:</strong> {result.document_index}</p>
                    <p><strong>⏰ Issued:</strong> {new Date(result.issued_at || result.uploaded_at).toLocaleString()}</p>
                  </div>

                  <a
                    href={`https://ipfs.io/ipfs/${result.ipfs_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    🔍 View on IPFS
                  </a>

                  {/* Image from IPFS */}
                  {result.ipfs_hash && /\.(jpg|jpeg|png|gif)$/i.test(result.ipfs_hash) && (
                    <div className="mt-6">
                      <img
                        src={`https://ipfs.io/ipfs/${result.ipfs_hash}`}
                        alt="Issued Document"
                        className="w-full max-h-96 object-contain rounded border"
                      />
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default IssueDocumentPage;
