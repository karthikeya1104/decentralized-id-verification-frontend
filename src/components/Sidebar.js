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
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 z-40 transform transition-transform duration-300 
        bg-gradient-to-b from-white to-gray-100 shadow-lg 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:shadow-none`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-indigo-600 select-none">DocuChain</h2>
          <button
            className="md:hidden text-gray-600 hover:text-indigo-600 focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="mt-6">
          {navItems.map(({ label, icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                to={path}
                key={label}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-colors
                ${isActive ? "bg-indigo-100 text-indigo-700 font-semibold" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="text-lg mr-3">{icon}</span>
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Hamburger Button */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 md:hidden bg-white border border-gray-300 rounded-md p-2 shadow-md focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          <FiMenu size={24} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
