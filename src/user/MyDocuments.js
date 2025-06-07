import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { BACKEND_URL } from "../Config";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gray-50">
      <Sidebar role="user" />
      <main className="flex-1 px-4 py-6 flex flex-col items-center">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6 text-center">My Documents</h2>

        <section className="w-full max-w-5xl mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Uploaded by Me</h3>
          <div className="grid gap-4">
            {userDocs.length === 0 ? (
              <p className="text-gray-500">No documents uploaded yet.</p>
            ) : (
              userDocs.map((doc, index) => (
                <div 
                    key={index}
                    onClick={() => navigate(`/documents/${doc.id}`, { state: { doc, source: "uploaded" } })}
                    className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100 transition"
                >
                  <p className="font-medium text-gray-800">{doc.title || "Untitled Document"}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(doc.uploaded_at).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="w-full max-w-5xl">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Issued to Me</h3>
          <div className="grid gap-4">
            {issuedDocs.length === 0 ? (
              <p className="text-gray-500">No issued documents yet.</p>
            ) : (
              issuedDocs.map((doc, index) => (
                <div 
                    key={index}
                    onClick={() => navigate(`/documents/${doc.id}`, { state: { doc, source: "uploaded" } })}
                    className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100 transition"
                >
                  <p className="font-medium text-gray-800">{doc.title || "Untitled Issued Document"}</p>
                  <p className="text-sm text-gray-500">Issued by: {doc.issuer_name || "Authority"}<br />  
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

export default MyDocuments;
