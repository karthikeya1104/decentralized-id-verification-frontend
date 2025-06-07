import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { BACKEND_URL } from "../Config";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // adjust path if needed

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

      if (response.status !== 201) {
        throw new Error("Failed to issue document");
      }

      setResult(response.data.document); // assuming it's in .document
      setPreviewURL(null);
      reset();
    } catch (error) {
      setResult({ error: error.response?.data?.error || error.message });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role="authority" />

      <div className="flex-1 p-8">
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-6">Issue Document</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Receiver */}
            <div>
              <label className="block mb-1 font-semibold">Receiver Public ID</label>
              <input
                type="text"
                {...register("receiver_id", { required: "Receiver ID is required" })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter receiver's public ID"
              />
              {errors.receiver_id && <p className="text-red-600">{errors.receiver_id.message}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block mb-1 font-semibold">Title</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full border px-3 py-2 rounded"
              />
              {errors.title && <p className="text-red-600">{errors.title.message}</p>}
            </div>

            {/* File */}
            <div>
              <label className="block mb-1 font-semibold">File</label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                {...register("file", { required: "File is required" })}
                className="w-full"
              />
              {errors.file && <p className="text-red-600">{errors.file.message}</p>}
            </div>

            {/* Image Preview */}
            {previewURL && (
              <div className="mt-4">
                <p className="font-semibold text-sm text-gray-700 mb-1">Image Preview:</p>
                <img
                  src={previewURL}
                  alt="Preview"
                  className="w-full max-h-80 object-contain border rounded"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? "Issuing..." : "Issue Document"}
            </button>
          </form>

          {/* Response */}
          {result && (
            <div className="mt-8 bg-white border border-green-300 shadow-md rounded-lg p-6 max-w-xl mx-auto space-y-4">
              {result.error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-300">
                  <p className="font-semibold flex items-center gap-2">
                    <span>⚠️</span>Error:
                  </p>
                  <p>{result.error}</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                    <span>✅</span> Document Issued Successfully
                  </h2>

                  <div className="space-y-1 text-gray-800">
                    <p><strong>📄 Title:</strong> {result.title}</p>
                    <p><strong>👤 Receiver:</strong> {result.receiver_name} <span className="text-sm text-gray-600">({result.receiver_public_id})</span></p>
                    <p className="font-mono break-all"><strong>🗃 IPFS Hash:</strong> {result.ipfs_hash}</p>
                    <p className="font-mono break-all"><strong>🔗 Transaction Hash:</strong> {result.tx_hash}</p>
                    <p><strong>📑 Document Index:</strong> {result.document_index}</p>
                    <p><strong>⏰ Issued At:</strong> {new Date(result.issued_at || result.uploaded_at).toLocaleString()}</p>
                  </div>

                  <a
                    href={`https://ipfs.io/ipfs/${result.ipfs_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    View on IPFS
                  </a>

                  {/* Image preview: check mime-type from ipfs_hash extension */}
                  {result.ipfs_hash && /\.(jpg|jpeg|png|gif)$/i.test(result.ipfs_hash) && (
                    <div className="mt-6">
                      <img
                        src={`https://ipfs.io/ipfs/${result.ipfs_hash}`}
                        alt="Issued Document Preview"
                        className="w-full max-h-96 object-contain rounded border"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueDocumentPage;
