import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DocumentDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const doc = state?.doc;
  
  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-300 via-purple-100 to-blue-100 relative overflow-hidden">
        {/* Blurred background blob */}
        <div className="absolute w-[400px] h-[400px] bg-purple-400 opacity-20 rounded-full blur-[160px] -top-20 -left-20" />
        <div className="absolute w-[300px] h-[300px] bg-indigo-300 opacity-20 rounded-full blur-[120px] bottom-[-80px] right-[-80px]" />

        <div className="text-center z-10 bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-md">
          <p className="text-red-600 font-semibold text-lg">⚠️ No document data found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const documentUrl = `https://ipfs.io/ipfs/${doc.ipfs_hash}`;

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-br from-indigo-300 via-purple-100 to-blue-100 sm:p-6 overflow-y-auto overflow-x-hidden relative">
      {/* Blobs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-400 opacity-20 rounded-full blur-[160px] -top-32 -left-32" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-300 opacity-20 rounded-full blur-[130px] bottom-[-100px] right-[-100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl flex flex-col items-center bg-white/30 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 z-10"
      >
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 text-center">
          {doc.title || "Untitled Document"}
        </h2>

        {/* Metadata */}
        <div className="text-gray-700 text-sm sm:text-base space-y-2 mb-6 w-full max-w-md">
          {doc.owner_name && <p><span className="font-semibold">Uploaded by:</span> {doc.owner_name}</p>}
          {doc.issuer_name && <p><span className="font-semibold">Issued by:</span> {doc.issuer_name}</p>}
          {doc.receiver_name && <p><span className="font-semibold">Issued to:</span> {doc.receiver_name}</p>}
          {doc.uploaded_at && (
            <p><span className="font-semibold">Uploaded at:</span> {new Date(doc.uploaded_at).toLocaleString()}</p>
          )}
          {doc.issued_at && (
            <p><span className="font-semibold">Issued at:</span> {new Date(doc.issued_at).toLocaleString()}</p>
          )}
          <p><span className="font-semibold">IPFS Hash:</span> <span className="break-all">{doc.ipfs_hash}</span></p>
          <p><span className="font-semibold">Transaction Hash:</span> <span className="break-all">{doc.tx_hash}</span></p>
          {doc.document_index !== null && (
            <p><span className="font-semibold">Document Index:</span> {doc.document_index}</p>
          )}
          <p><span className="font-semibold">Flagged Status:</span> <span className="break-all">{doc.flagged? "True":"False"}</span></p>
        </div>

        {/* Preview */}
        <div className="w-full flex justify-center items-center mb-6 px-2">
          <img
            src={documentUrl}
            alt="Document Preview"
            className="w-full max-w-full max-h-[60vh] sm:max-h-[80vh] object-contain rounded border shadow-sm"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-image.png";
              e.currentTarget.alt = "Preview unavailable";
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Go Back
          </button>
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Open on IPFS
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentDetailPage;
