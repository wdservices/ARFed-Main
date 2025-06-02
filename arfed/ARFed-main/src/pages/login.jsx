import React, { useState } from "react";
import Link from "next/link.js";
import axios from "axios";
import { motion } from "framer-motion";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationType, setRegistrationType] = useState("individual");
  const [organization, setOrganization] = useState("");
  const router = useRouter();

  const login = async () => {
    setLoading(true);
    try {
      await axios
        .post(
          "https://arfed-api.onrender.com/api/user/login",
          {
            email: email,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          setCookie("token", response.data.token);
          setCookie("id", response.data.id);
          toast.success("Logged in successfully!");
          if (response.data.role === "user") {
            router.push("/subjects");
          } else {
            router.push("/admin");
          }
          setLoading(false);
        });
      setLoading(false);
    } catch (err) {
      console.log('Login error:', err, err?.response);
      if (err?.response?.data?.message) {
        toast.warn('Login failed: ' + err.response.data.message);
      } else if (err?.response?.data) {
        toast.warn('Login failed: ' + JSON.stringify(err.response.data));
      } else {
        toast.warn('Login failed: Unknown error');
      }
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] overflow-hidden">
      {/* Decorative background dots */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-400 opacity-30 rounded-full blur-2xl z-0 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-indigo-200 opacity-20 rounded-full blur-2xl z-0 animate-pulse" style={{transform: 'translate(-50%, -50%)'}} />
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-2 tracking-tight"
          >
            ARFed
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-200 mt-2">Sign in to continue your learning journey</p>
        </motion.div>

        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <label className="mr-4 text-white">
              <input
                type="radio"
                value="individual"
                checked={registrationType === "individual"}
                onChange={() => setRegistrationType("individual")}
                className="mr-1"
              />
              Individual
            </label>
            <label className="text-white">
              <input
                type="radio"
                value="group"
                checked={registrationType === "group"}
                onChange={() => setRegistrationType("group")}
                className="mr-1"
              />
              Group/Organization
            </label>
          </div>
          {registrationType === "group" && (
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="relative">
              <input
                onChange={(e) => setOrganization(e.target.value)}
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-200"
                placeholder="Organization Name"
              />
            </motion.div>
          )}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-200"
              placeholder="Email Address"
            />
          </motion.div>
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <input
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-200"
              placeholder="Password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={login}
            className="w-full bg-white text-purple-600 py-3 rounded-lg font-medium hover:bg-white/90 transition-all duration-200 shadow-lg shadow-purple-500/20"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-purple-600 rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex flex-col items-center space-y-4"
        >
          <Link href="/signup" className="text-white font-medium hover:underline">
            Don't have an account? Sign up
          </Link>
          <button className="text-gray-200 hover:text-white transition-colors duration-200">
            Forgot Password?
          </button>
        </motion.div>
      </div>
      <div className="absolute bottom-6 left-0 w-full flex justify-center z-10">
        <span className="text-white/80 text-sm">From Waves Digital Services</span>
      </div>
      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default Login;
