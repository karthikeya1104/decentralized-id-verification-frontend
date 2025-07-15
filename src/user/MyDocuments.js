import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { BACKEND_URL } from "../Config";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MyDocuments = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userDocs, setUserDocs] = useState([]);
  const [issuedDocs, setIssuedDocs] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (user.role !== "user") {
      navigate("/authority/");
      return;
    }

    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/documents/user-documents/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch documents");

        const data = await response.json();
        setUserDocs(data.user_uploaded_documents || []);
        setIssuedDocs(data.authority_issued_documents || []);
      } catch (error) {
        console.error("Error fetching user documents:", error);
      }
    };

    fetchDocuments();
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-indigo-300 via-purple-100 to-blue-100 overflow-hidden relative">
      {/* Blurred blobs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-400 opacity-20 rounded-full blur-[160px] -top-32 -left-32" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-300 opacity-20 rounded-full blur-[130px] bottom-[-100px] right-[-100px]" />

      <Sidebar role="user" />

      <main className="flex-1 px-6 py-10 flex flex-col items-center space-y-12 z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-indigo-700 text-center"
        >
          📁 My Documents
        </motion.h2>

        {/* Uploaded Documents */}
        <section className="w-full max-w-5xl">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">📤 Uploaded by Me</h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {userDocs.length === 0 ? (
              <p className="text-gray-600">No documents uploaded yet.</p>
            ) : (
              userDocs.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => navigate(`/documents/${doc.id}`, { state: { doc, source: "uploaded" } })}
                  className="bg-white/30 backdrop-blur-md p-5 rounded-xl shadow-md hover:shadow-xl transition-transform hover:scale-[1.03] cursor-pointer"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {doc.title || "Untitled Document"}
                  </h4>
                  <p className="text-sm text-gray-700">
                    Uploaded on:{" "}
                    {new Date(doc.uploaded_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Issued Documents */}
        <section className="w-full max-w-5xl">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">📨 Issued to Me</h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {issuedDocs.length === 0 ? (
              <p className="text-gray-600">No issued documents yet.</p>
            ) : (
              issuedDocs.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => navigate(`/documents/${doc.id}`, { state: { doc, source: "issued" } })}
                  className="bg-white/30 backdrop-blur-md p-5 rounded-xl shadow-md hover:shadow-xl transition-transform hover:scale-[1.03] cursor-pointer"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {doc.title || "Untitled Issued Document"}
                  </h4>
                  <p className="text-sm text-gray-700">
                    Issued by: {doc.issuer_name || "Authority"} <br />
                    {new Date(doc.issued_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyDocuments;
