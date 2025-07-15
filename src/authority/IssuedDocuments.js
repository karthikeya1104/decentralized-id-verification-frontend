import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { BACKEND_URL } from "../Config";
import { motion } from "framer-motion";

const IssuedDocuments = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [issuedDocs, setIssuedDocs] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (user.role !== "authority") {
      navigate("/user/");
      return;
    }

    const fetchIssuedDocuments = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/documents/authority-documents/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch documents");
        const data = await response.json();
        setIssuedDocs(data || []);
      } catch (error) {
        console.error("Error fetching issued documents:", error);
      }
    };

    fetchIssuedDocuments();
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-indigo-300 via-purple-100 to-blue-100 overflow-hidden relative">
      {/* Glass blur blobs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-400 opacity-20 rounded-full blur-[160px] -top-32 -left-32" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-300 opacity-20 rounded-full blur-[130px] bottom-[-100px] right-[-100px]" />

      {/* Sidebar */}
      <Sidebar role="authority" />

      {/* Main Content */}
      <main className="flex-1 px-6 py-10 z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-indigo-700 mb-10 text-center"
        >
          📄 Issued Documents
        </motion.h2>

        <section className="w-full max-w-6xl mx-auto">
          {issuedDocs.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-gray-600 text-center text-lg"
            >
              No documents issued yet.
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {issuedDocs.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() =>
                    navigate(`/documents/${doc.id}`, {
                      state: { doc, source: "issued" },
                    })
                  }
                  className="bg-white/30 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-5 cursor-pointer transition transform hover:scale-[1.03] hover:shadow-2xl"
                >
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2 truncate">
                    {doc.title || "Untitled Document"}
                  </h3>
                  <p className="text-sm text-gray-700">
                    👤 Issued to:{" "}
                    <span className="font-medium">
                      {doc.receiver_name || "User"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    ⏰{" "}
                    {new Date(doc.issued_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default IssuedDocuments;
