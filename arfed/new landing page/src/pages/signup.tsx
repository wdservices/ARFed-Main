import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("individual");

  const signup = async () => {
    setLoading(true);
    try {
      if (password === confirmPassword) {
        // Add your signup logic here
        console.log("Signup successful!");
      }
    } catch (err) {
      console.log(err);
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
            Create Account
          </h1>
          <p className="text-gray-200 mt-2">Join ARFed and start your learning journey</p>
        </motion.div>

        <div className="space-y-4">
          {/* Account Type Selection */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-3 mb-4"
          >
            <label className="text-white font-medium">I am registering as:</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="individual"
                  checked={accountType === "individual"}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 focus:ring-purple-500"
                />
                Individual
              </label>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="group"
                  checked={accountType === "group"}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 focus:ring-purple-500"
                />
                School/Organization
              </label>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="relative"
          >
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-200"
              placeholder={accountType === "individual" ? "Full Name" : "Contact Person Name"}
            />
          </motion.div>
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
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
            transition={{ delay: 0.5 }}
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
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="relative"
          >
            <input
              type={showConfirmPassword ? "text" : "password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-200"
              placeholder="Confirm Password"
            />
            <button
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={signup}
            className="w-full bg-white text-purple-600 py-3 rounded-lg font-medium hover:bg-white/90 transition-all duration-200 shadow-lg shadow-purple-500/20"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-purple-600 rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-gray-200"
        >
          Already have an account?{" "}
          <Link to="/login" className="text-white font-medium hover:underline">
            Login here
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup; 