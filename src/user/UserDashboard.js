import React, { useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
import AuthContext from "../context/AuthContext";
import { BACKEND_URL } from "../Config";
import { useNavigate } from "react-router-dom";

const API_URL = BACKEND_URL;

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const uploadedDocsCount = 8;
    const issuedDocsCount = 5;
    const flaggedDocsCount = 1;

    useEffect(() => {
        if (!user) navigate("/");
        if (user?.role !== "user") {
            navigate("/authority/");
        }
    }, [user, navigate]);

    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden bg-gray-50">
            <Sidebar role="user" />
            
            <main className="flex-1 flex flex-col items-center justify-start px-4 py-6">
                <h2 className="text-3xl font-semibold mb-6 text-indigo-700 text-center">User Dashboard</h2>
                
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-6xl">
                    <div className="bg-white shadow rounded-lg p-6 text-center w-full">
                        <h3 className="text-xl font-medium text-gray-700 mb-2">Uploaded Documents</h3>
                        <p className="text-4xl font-bold text-indigo-600">{uploadedDocsCount}</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6 text-center w-full">
                        <h3 className="text-xl font-medium text-gray-700 mb-2">Documents Issued on You</h3>
                        <p className="text-4xl font-bold text-indigo-600">{issuedDocsCount}</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6 text-center w-full">
                        <h3 className="text-xl font-medium text-gray-700 mb-2">Flagged Documents</h3>
                        <p className="text-4xl font-bold text-red-600">{flaggedDocsCount}</p>
                    </div>
                </section>

                <section className="w-full flex flex-col items-center gap-6 px-4 max-w-4xl">
                    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md text-center">
                        <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Upload a Document</h3>
                        <p className="text-gray-600">Here users can upload their documents securely.</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md text-center">
                        <h3 className="text-2xl font-semibold mb-4 text-indigo-700">View Your Documents</h3>
                        <p className="text-gray-600">List and manage your uploaded and issued documents.</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md text-center">
                        <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Flag a Document</h3>
                        <p className="text-gray-600">Report lost or invalid documents.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserDashboard;

export const getUserDashboard = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}/dashboard`);
        if (!response.ok) {
            throw new Error("Failed to fetch user dashboard data");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching user dashboard:", error);
        throw error;
    }
};
