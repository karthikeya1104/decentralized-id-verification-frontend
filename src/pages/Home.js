import React, { useEffect, useState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { getStats } from "../services/statsService"; // Adjust path as needed

const Home = () => {
  const [stats, setStats] = useState({
    documents_issued: 0,
    documents_verified: 0,
    authorities_registered: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStats();
      if (data) setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-white">
      {/* Navbar */}
      <header className="w-full bg-white shadow sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700 select-none">DocuChain</h1>
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link smooth to="#about" className="hover:text-indigo-600">
            About
          </Link>
          <Link smooth to="#features" className="hover:text-indigo-600">
            Features
          </Link>
          <Link smooth to="#stats" className="hover:text-indigo-600">
            Stats
          </Link>
          <Link smooth to="#login" className="hover:text-indigo-600">
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="login" className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-700 mb-4 scroll-mt-24">
          Welcome to DocuChain
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-8">
          A decentralized platform for secure and verifiable document management. Built for users and authorities to ensure transparency and trust.
        </p>
        <div id="login" className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md text-lg transition duration-300"
          >
            Login as User
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 text-indigo-600 border border-indigo-600 hover:bg-indigo-100 rounded-md shadow-md text-lg transition duration-300"
          >
            Login as Authority
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="bg-white rounded-lg shadow-md p-8 my-12 max-w-5xl mx-auto scroll-mt-24"
      >
        <h2 className="text-3xl font-bold text-indigo-700 mb-4 text-center">
          What is DocuChain?
        </h2>
        <p className="text-gray-700 text-lg text-center">
          DocuChain is a blockchain-powered system that allows users to upload and manage identity documents while enabling authorities to issue and verify them. Say goodbye to forgery and hello to trust.
        </p>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center scroll-mt-24"
      >
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">
            Decentralized & Secure
          </h3>
          <p className="text-gray-600">
            Uses blockchain to ensure document authenticity and prevent tampering.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">
            User-Focused
          </h3>
          <p className="text-gray-600">
            Upload, manage, and flag lost documents — your identity, your control.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">
            Authority-Verified
          </h3>
          <p className="text-gray-600">
            Authorized bodies can issue and verify documents instantly and securely.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        className="max-w-5xl mx-auto py-16 px-6 text-center"
      >
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">Live Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-4xl font-extrabold text-indigo-600">
              {stats.documents_issued}
            </h3>
            <p className="mt-2 text-gray-700">Documents Issued</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-4xl font-extrabold text-indigo-600">
              {stats.documents_verified}
            </h3>
            <p className="mt-2 text-gray-700">Documents Verified</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-4xl font-extrabold text-indigo-600">
              {stats.authorities_registered}
            </h3>
            <p className="mt-2 text-gray-700">Authorities Registered</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6 mt-12">
        © {new Date().getFullYear()} DocuChain. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
