import React, { useState } from "react";
import { FiHome, FiFileText, FiUpload, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { FaFlag } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ role }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = role === "user"
    ? [
        { label: "Home", icon: <FiHome />, path: "/user" },
        { label: "Upload Document", icon: <FiUpload />, path: "/user/upload" },
        { label: "My Documents", icon: <FiFileText />, path: "/user/my-documents" },
        { label: "Flag Document", icon: <FaFlag />, path: "/user/flag" },
      ]
    : [
        { label: "Home", icon: <FiHome />, path: "/authority" },
        { label: "Issue Document", icon: <FiFileText />, path: "/authority/issue" },
        { label: "Issued Documents", icon: <FiFileText />, path: "/authority/issued-documents" },
        { label: "Verify Document", icon: <FiSearch />, path: "/authority/verify" },
      ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 z-40 bg-white/30 backdrop-blur-xl shadow-lg border-r border-white/20 
        transition-transform duration-500 ease-in-out transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:shadow-none md:border-none`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/30">
          <h2 className="text-2xl font-bold text-indigo-700 tracking-tight">DocuChain</h2>
          <button
            className="md:hidden text-gray-600 hover:text-indigo-600 transition"
            onClick={() => setIsOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-2 px-2">
          {navItems.map(({ label, icon, path }, i) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={label}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    isActive
                      ? "bg-indigo-200/60 text-indigo-800 shadow-inner"
                      : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-md"
                  }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Toggle for mobile */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 md:hidden bg-white/40 backdrop-blur-md border border-gray-300 rounded-md p-2 shadow-md hover:border-indigo-400 transition"
          onClick={() => setIsOpen(true)}
        >
          <FiMenu size={24} className="text-gray-700" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
