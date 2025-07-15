import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { BACKEND_URL } from "../Config";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";

const UploadDocumentPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch, formState: { isSubmitting, errors } } = useForm();
  const [uploadResult, setUploadResult] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const watchFile = watch("file");

  useEffect(() => {
    if (!user) navigate("/");
    if (user?.role !== "user") navigate("/authority/");
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
      formData.append("title", data.title);
      formData.append("file", data.file[0]);

      const response = await axios.post(`${BACKEND_URL}/documents/upload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status !== 201) throw new Error("Failed to upload document");

      setUploadResult(response.data.document);
      setPreviewURL(null);
      reset();
    } catch (error) {
      setUploadResult({ error: error.response?.data?.error || error.message });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-indigo-300 via-purple-100 to-blue-100 overflow-hidden relative">
      {/* Glass blur blobs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-400 opacity-20 rounded-full blur-[160px] -top-32 -left-32" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-300 opacity-20 rounded-full blur-[130px] bottom-[-100px] right-[-100px]" />

      <Sidebar role="user" />

      <main className="flex-1 flex flex-col px-6 py-10 space-y-8 z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-indigo-700 text-center"
        >
          Upload Document
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-lg space-y-6"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Title</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full border border-gray-300 px-3 py-2 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">File</label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                {...register("file", { required: "File is required" })}
                className="w-full"
              />
              {errors.file && <p className="text-red-600 text-sm mt-1">{errors.file.message}</p>}
            </div>

            {previewURL && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                <img
                  src={previewURL}
                  alt="Preview"
                  className="w-full max-h-80 object-contain border rounded-lg shadow-sm"
                />
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Uploading..." : "Upload"}
            </button>
          </form>

          {uploadResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/30 backdrop-blur-md border border-green-300 shadow-md rounded-xl p-6 space-y-4"
            >
              {uploadResult.error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-300">
                  <p className="font-semibold flex items-center gap-2">⚠️ Error:</p>
                  <p>{uploadResult.error}</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
                    ✅ Document Uploaded Successfully
                  </h2>

                  <div className="space-y-1 text-sm text-gray-800">
                    <p><strong>📄 Title:</strong> {uploadResult.title}</p>
                    <p><strong>👤 Owner:</strong> {uploadResult.owner_name} <span className="text-gray-500">({uploadResult.owner_public_id})</span></p>
                    <p className="break-all font-mono"><strong>🗃 IPFS Hash:</strong> {uploadResult.ipfs_hash}</p>
                    <p className="break-all font-mono"><strong>🔗 Tx Hash:</strong> {uploadResult.tx_hash}</p>
                    <p><strong>📑 Index:</strong> {uploadResult.document_index}</p>
                    <p><strong>⏰ Uploaded:</strong> {new Date(uploadResult.uploaded_at).toLocaleString()}</p>
                  </div>

                  <a
                    href={`https://ipfs.io/ipfs/${uploadResult.ipfs_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    View on IPFS
                  </a>

                  {uploadResult.ipfs_hash && /\.(jpg|jpeg|png|gif)$/i.test(uploadResult.ipfs_hash) && (
                    <div className="mt-6">
                      <img
                        src={`https://ipfs.io/ipfs/${uploadResult.ipfs_hash}`}
                        alt="Uploaded Preview"
                        className="w-full max-h-96 object-contain rounded border shadow"
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

export default UploadDocumentPage;
