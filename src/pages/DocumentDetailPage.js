import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DocumentDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const doc = state?.doc;

  if (!doc) {
    return (
      <div className="h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <p className="text-red-500">No document data found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const documentUrl = `http://127.0.0.1:8080/ipfs/${doc.ipfs_hash}`;

  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-50 sm:p-6 overflow-auto">
      <div className="w-full max-w-4xl flex flex-col items-center bg-white rounded-lg shadow p-4 sm:p-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
          {doc.title || "Untitled Document"}
        </h2>

        {/* Metadata */}
        <div className="text-gray-700 text-sm space-y-1 mb-6 w-full max-w-md mx-auto">
          {doc.owner_name && <p><strong>Uploaded by:</strong> {doc.owner_name}</p>}
          {doc.issuer_name && <p><strong>Issued by:</strong> {doc.issuer_name}</p>}
          {doc.receiver_name && <p><strong>Issued to:</strong> {doc.receiver_name}</p>}
          {doc.uploaded_at && (
            <p><strong>Uploaded at:</strong> {new Date(doc.uploaded_at).toLocaleString()}</p>
          )}
          {doc.issued_at && (
            <p><strong>Issued at:</strong> {new Date(doc.issued_at).toLocaleString()}</p>
          )}
          <p><strong>IPFS Hash:</strong> {doc.ipfs_hash}</p>
          <p><strong>Transaction Hash:</strong> {doc.tx_hash}</p>
          {doc.document_index !== null && (
            <p><strong>Document Index:</strong> {doc.document_index}</p>
          )}
        </div>

        {/* Image Preview */}
        <div className="w-full flex justify-center items-center mb-6 px-2">
          <img
            src={documentUrl}
            alt="Document"
            className="w-full max-w-full max-h-[60vh] sm:max-h-[80vh] object-contain rounded border"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Go Back
          </button>
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Open on IPFS
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
