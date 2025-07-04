import React, { useState } from "react";
import Link from "next/link.js";
import axios from "axios";
import { motion } from "framer-motion";
import { setCookies } from "cookies-next";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { useIsMobile } from "../hooks/use-mobile";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  // Load saved email from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('arfed_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Save email to localStorage when it changes
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    localStorage.setItem('arfed_email', newEmail);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://arfed-api.onrender.com/api/user/login", {
        email,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.data.token) {
        setCookies("token", response.data.token);
        setCookies("id", response.data.id);
        toast.success("Logged in successfully!");
        
        console.log("Login successful. Response data:", response.data);

        // Add a small delay to ensure cookies are set before redirect
        setTimeout(() => {
          // Always redirect admin to /admin first
          if (response.data.role === "admin") {
            router.replace("/admin");
          } else if (!isMobile) {
            // If not mobile (desktop site requested), redirect to UseMobile page
            router.replace("/UseMobile");
          } else {
            router.replace("/subjects");
          }
        }, 100);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message || "Login failed. Please check your credentials.");
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("An error occurred. Please try again.");
      }
    } finally {
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
            className="flex flex-col items-center mb-4"
          >
            <Image src="/arfed.png" alt="ARFed Logo" width={80} height={80} className="rounded-lg mb-4" />
            <span className="text-3xl font-bold text-white tracking-tight">ARFed</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-200 mt-2">Sign in to continue your learning journey</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <input
              value={email}
              onChange={handleEmailChange}
              type="email"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-200"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
        </form>

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
