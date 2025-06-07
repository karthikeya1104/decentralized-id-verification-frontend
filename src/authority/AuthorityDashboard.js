import React, { useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
import AuthContext from "../context/AuthContext";
import { BACKEND_URL } from "../Config";
import { useNavigate } from "react-router-dom";

const API_URL = BACKEND_URL;

const AuthorityDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const issuedDocsCount = 15;
  const verifiedDocsCount = 12;
  const pendingVerificationCount = 3;

  useEffect(() => {
    if (!user) navigate("/");
    if (user?.role !== "authority") {
      navigate("/user/");
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden bg-gray-50">
      <Sidebar role="authority" />
      
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-6">
        <h2 className="text-3xl font-semibold mb-6 text-indigo-700 text-center">
          Authority Dashboard
        </h2>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-6xl">
          <div className="bg-white shadow rounded-lg p-6 text-center w-full">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Documents Issued</h3>
            <p className="text-4xl font-bold text-indigo-600">{issuedDocsCount}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center w-full">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Verified Documents</h3>
            <p className="text-4xl font-bold text-green-600">{verifiedDocsCount}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center w-full">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Pending Verifications</h3>
            <p className="text-4xl font-bold text-yellow-600">{pendingVerificationCount}</p>
          </div>
        </section>

        <section className="w-full flex flex-col items-center gap-6 px-4 max-w-4xl">
          <div className="bg-white shadow rounded-lg p-6 w-full max-w-md text-center">
            <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Issue a Document</h3>
            <p className="text-gray-600">Issue official documents to users securely.</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 w-full max-w-md text-center">
            <h3 className="text-2xl font-semibold mb-4 text-indigo-700">View Issued Documents</h3>
            <p className="text-gray-600">Browse and manage documents you have issued.</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 w-full max-w-md text-center">
            <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Verify a Document</h3>
            <p className="text-gray-600">Confirm the authenticity of user documents.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AuthorityDashboard;
