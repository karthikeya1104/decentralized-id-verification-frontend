import React, { useEffect, useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserDashboard } from "../services/statsService";
import { motion } from "framer-motion";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [uploadedDocsCount, setUploadedDocsCount] = useState(0);
  const [issuedDocsCount, setIssuedDocsCount] = useState(0);
  const [flaggedDocsCount, setFlaggedDocsCount] = useState(0);

  useEffect(() => {
    if (!user) navigate("/");
    if (user?.role !== "user") navigate("/authority/");

    const fetchDashboardStats = async () => {
      try {
        const data = await getUserDashboard();
        setUploadedDocsCount(data.uploaded_documents);
        setIssuedDocsCount(data.authority_issued_documents);
        setFlaggedDocsCount(data.flagged_documents);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-indigo-300 via-purple-100 to-blue-100 overflow-hidden relative">
      {/* Glass blur blobs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-400 opacity-20 rounded-full blur-[160px] -top-32 -left-32" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-300 opacity-20 rounded-full blur-[130px] bottom-[-100px] right-[-100px]" />

      <Sidebar role="user" />

      <main className="flex-1 flex flex-col px-6 py-10 space-y-12 z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-indigo-700 text-center"
        >
          User Dashboard
        </motion.h2>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <GlassStatCard color="indigo" title="Uploaded Documents" count={uploadedDocsCount} />
          <GlassStatCard color="blue" title="Documents Issued on You" count={issuedDocsCount} />
          <GlassStatCard color="red" title="Flagged Documents" count={flaggedDocsCount} />
        </section>

        {/* Actions Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <GlassActionCard title="📤 Upload a Document" description="Securely upload your personal documents." />
          <GlassActionCard title="📁 View Your Documents" description="View and manage all your documents." />
          <GlassActionCard title="🚩 Flag a Document" description="Report a lost or invalid document." />
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;

// 🧊 Stat Card with Glassmorphism
const GlassStatCard = ({ title, count, color = "indigo" }) => {
  const colorStyles = {
    indigo: "text-indigo-600 border-indigo-400",
    blue: "text-blue-600 border-blue-400",
    red: "text-red-600 border-red-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/30 backdrop-blur-md shadow-lg rounded-xl p-6 border-l-4 ${colorStyles[color]} transform transition hover:scale-[1.03] hover:shadow-2xl`}
    >
      <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
      <p className={`text-5xl font-bold ${colorStyles[color]}`}>{count}</p>
    </motion.div>
  );
};

// 🧊 Action Card with Emoji and Glassmorphism
const GlassActionCard = ({ title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-white/30 backdrop-blur-md shadow-md rounded-xl p-6 text-center transform transition hover:scale-[1.03] hover:shadow-xl"
  >
    <h3 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h3>
    <p className="text-sm text-gray-700">{description}</p>
  </motion.div>
);
