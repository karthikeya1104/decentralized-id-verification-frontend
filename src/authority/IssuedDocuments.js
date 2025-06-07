import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { BACKEND_URL } from "../Config";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch authority documents");

        const data = await response.json();
        setIssuedDocs(data || []);
      } catch (error) {
        console.error("Error fetching issued documents:", error);
      }
    };

    fetchIssuedDocuments();
  }, [user, navigate]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gray-50">
      <Sidebar role="authority" />
      <main className="flex-1 px-4 py-6 flex flex-col items-center">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6 text-center">Issued Documents</h2>

        <section className="w-full max-w-5xl">
          <div className="grid gap-4">
            {issuedDocs.length === 0 ? (
              <p className="text-gray-500">No documents issued yet.</p>
            ) : (
              issuedDocs.map((doc, index) => (
                <div 
                    key={index}
                    onClick={() => navigate(`/documents/${doc.id}`, { state: { doc, source: "issued" } })}
                    className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100 transition"
                >
                  <p className="font-medium text-gray-800">{doc.title || "Untitled Document"}</p>
                  <p className="text-sm text-gray-500">Issued to: {doc.receiver_name || "User"} <br />
                    {new Date(doc.issued_at).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default IssuedDocuments;
