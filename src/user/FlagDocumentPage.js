import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { BACKEND_URL } from "../Config";
import Sidebar from "../components/Sidebar";

const FlagDocumentPage = () => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [message, setMessage] = React.useState(null);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/blockchain/flag/`, {
        index: data.index,
        flag: data.flag,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Something went wrong" });
    }
  };

  return (
    <div className="flex">
      <Sidebar role="user" />
      <div className="flex-1 max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
        <h1 className="text-2xl font-bold mb-6">Flag a Document</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Document Index</label>
            <input
              type="number"
              {...register("index", { required: "Document index is required" })}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter document index"
            />
            {errors.index && <p className="text-red-600">{errors.index.message}</p>}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Flag</label>
            <select
              {...register("flag", { required: "Flag value is required" })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select flag status</option>
              <option value="true">True (Flag)</option>
              <option value="false">False (Unflag)</option>
            </select>
            {errors.flag && <p className="text-red-600">{errors.flag.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Flag"}
          </button>

          {message && (
            <div className={`mt-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FlagDocumentPage;
