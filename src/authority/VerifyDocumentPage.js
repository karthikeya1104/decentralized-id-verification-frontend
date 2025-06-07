import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { BACKEND_URL } from "../Config";
import Sidebar from "../components/Sidebar";

const VerifyDocumentPage = () => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);

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
    <div className="flex">
      <Sidebar role="authority" />
      <div className="flex-1 max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
        <h1 className="text-2xl font-bold mb-6">Verify Document</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="block mb-1 font-semibold">Transaction Hash</label>
            <input
              type="text"
              {...register("tx_hash", { required: "Transaction hash is required" })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.tx_hash && <p className="text-red-600">{errors.tx_hash.message}</p>}
          </div> 

          <div>
            <label className="block mb-1 font-semibold">Document Index</label>
            <input
              type="number"
              {...register("index", { required: "Document index is required" })}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.index && <p className="text-red-600">{errors.index.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* Result */}
        {result && (
            <div className="mt-8 border-t pt-6">
                {result.exists ? (
                <div className="bg-white shadow-md rounded-lg p-6 border border-green-300">
                    <div className="flex items-center mb-4">
                    <span className="text-green-600 text-2xl mr-2">✅</span>
                    <h2 className="text-xl font-bold text-green-700">Document Verified</h2>
                    </div>

                    <div className="space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">📄 Title:</span>
                        <span className="text-gray-800">{result.title}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">🧾 Issuer Address:</span>
                        <span className="text-gray-800">{result.issuer}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">👤 Receiver Address:</span>
                        <span className="text-gray-800">{result.receiver}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">⏰ Timestamp:</span>
                        <span className="text-gray-800">
                        {new Date(result.timestamp * 1000).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">🚩 Flagged:</span>
                        <span className={`font-semibold ${result.flagged ? "text-red-600" : "text-green-600"}`}>
                        {result.flagged ? "Yes" : "No"}
                        </span>
                    </div>
                    </div>
                </div>
                ) : (
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded p-4">
                    <p>⚠️ Document not found on the blockchain.</p>
                </div>
                )}
            </div>
        )}
        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-100 text-red-800 p-4 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyDocumentPage;
