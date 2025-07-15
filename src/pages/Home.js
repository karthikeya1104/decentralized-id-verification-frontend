import React, { useEffect, useState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { motion } from "framer-motion";
import { getStats } from "../services/statsService";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CloudUploadIcon,
} from "@heroicons/react/outline";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 20 },
  },
};

const Home = () => {
  const [stats, setStats] = useState({
    documents_issued: 0,
    documents_verified: 0,
    authorities_registered: 0,
  });

  useEffect(() => {
    getStats().then((data) => data && setStats(data));
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-indigo-200 via-purple-100 to-blue-100 min-h-screen scroll-smooth overflow-x-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-150px] left-[-100px] w-[250px] h-[250px] bg-purple-300 opacity-10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-120px] right-[-80px] w-[220px] h-[220px] bg-indigo-300 opacity-10 rounded-full blur-[70px] pointer-events-none" />

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/30 border-b border-white/20 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-indigo-700 tracking-tight">
          DocuChain
        </h1>

        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          {["about", "features", "stats", "login"].map((section) => (
            <Link
              smooth
              to={`#${section}`}
              key={section}
              className="relative group transition-colors duration-300 capitalize"
            >
              <span className="group-hover:text-indigo-600">{section}</span>
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-600 group-hover:w-full transition-all" />
            </Link>
          ))}
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section id="login" className="pt-28 pb-20 px-6 text-center">
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-5xl md:text-6xl font-extrabold text-indigo-700 mb-4"
        >
          Secure your documents with{" "}
          <span className="text-indigo-600">blockchain</span>
        </motion.h1>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-xl text-gray-700 max-w-2xl mx-auto mb-8"
        >
          Upload, verify, and manage documents with transparency, trust, and
          ease.
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            to="/login"
            className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-lg flex items-center gap-2 transition"
          >
            Login as User <ArrowRightIcon className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="px-6 py-4 border-2 border-indigo-600 hover:bg-indigo-100 text-indigo-600 rounded-md shadow-lg flex items-center gap-2 transition"
          >
            Login as Authority <ShieldCheckIcon className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* About */}
      <section
        id="about"
        className="max-w-4xl mx-auto p-8 mb-12 bg-white/30 backdrop-blur-md rounded-xl shadow-lg scroll-mt-24"
      >
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl font-bold text-indigo-700 mb-4 text-center"
        >
          What is DocuChain?
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-gray-700 text-lg text-center"
        >
          A blockchain-powered document management platform ensuring authenticity
          and integrity. Empowering individuals and authorities with verifiable
          trust.
        </motion.p>
      </section>

      {/* Features */}
      <section
        id="features"
        className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 scroll-mt-24"
      >
        {[
          {
            Icon: CloudUploadIcon,
            title: "Upload & Store",
            desc: "Securely store documents on IPFS with full user control.",
          },
          {
            Icon: ShieldCheckIcon,
            title: "Issue & Verify",
            desc: "Authorities can issue & verify instantly on-chain.",
          },
          {
            Icon: CheckCircleIcon,
            title: "Immutable Trust",
            desc: "Blockchain ensures tamper-proof and traceable records.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3, once: false }}
            variants={fadeUp}
            className="p-6 bg-white/30 backdrop-blur rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition"
          >
            <f.Icon className="w-8 h-8 text-indigo-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-indigo-700 mb-2 text-center">
              {f.title}
            </h3>
            <p className="text-gray-600 text-center">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Stats */}
      <section
        id="stats"
        className="max-w-5xl mx-auto py-16 px-6 text-center scroll-mt-24"
      >
        <h2 className="text-3xl font-bold text-indigo-700 mb-8">Live Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Documents Issued", value: stats.documents_issued },
            { label: "Documents Verified", value: stats.documents_verified },
            { label: "Authorities Registered", value: stats.authorities_registered },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.3, once: false }}
              variants={fadeUp}
              className="p-6 bg-white/30 backdrop-blur rounded-xl shadow-lg"
            >
              <h3 className="text-5xl font-extrabold text-indigo-600">
                {s.value}
              </h3>
              <p className="mt-2 text-gray-700">{s.label}</p>
            </motion.div>
          ))}
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
