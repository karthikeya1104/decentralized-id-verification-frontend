import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import AuthContext from "../context/AuthContext";
import { getAuthorityDashboard } from "../services/statsService";

const AuthorityDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [issuedDocumentsCount, setIssuedDocumentsCount] = useState(0);
  const [verifiedDocumentsCount, setVerifiedDocumentsCount] = useState(0);

  useEffect(() => {
    if (!user) return navigate("/");
    if (user.role !== "authority") return navigate("/user/");

    const fetchDashboardStats = async () => {
      try {
        const data = await getAuthorityDashboard();
        setIssuedDocumentsCount(data.issued_documents_count);
        setVerifiedDocumentsCount(data.verified_documents_count);
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

      <Sidebar role="authority" />

      <main className="flex-1 flex flex-col px-6 py-10 space-y-12 z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-indigo-700 text-center"
        >
          Authority Dashboard
        </motion.h2>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <GlassStatCard
            color="indigo"
            title="Documents Issued"
            count={issuedDocumentsCount}
          />
          <GlassStatCard
            color="green"
            title="Documents Verified"
            count={verifiedDocumentsCount}
          />
        </section>

        {/* Action Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <GlassActionCard
            title="📄 Issue a Document"
            description="Create and assign official documents securely."
          />
          <GlassActionCard
            title="📂 View Issued Documents"
            description="Track and manage all your previously issued documents."
          />
          <GlassActionCard
            title="✅ Verify a Document"
            description="Authenticate the legitimacy of uploaded documents."
          />
        </section>
      </main>
    </div>
  );
};

export default AuthorityDashboard;

// Stat Card with glass effect
const GlassStatCard = ({ color, title, count }) => {
  const colorStyles = {
    indigo: "text-indigo-600 border-indigo-400",
    green: "text-green-600 border-green-400",
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

// Action Card with emoji + glass style
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
