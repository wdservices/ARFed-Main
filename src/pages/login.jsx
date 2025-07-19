import React, { useState, useEffect } from "react";
import Link from "next/link.js";
import { motion } from "framer-motion";
import { setCookies } from "cookies-next";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { useIsMobile } from "../hooks/use-mobile";
import app from "../lib/firebaseClient";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebaseClient";

const ADMIN_EMAILS = ["hello.wdservices@gmail.com"];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  const auth = getAuth(app);
  const db = getFirestore(app);

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Always update user doc with correct role
      const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName || "",
        role: isAdmin ? "admin" : "user",
      }, { merge: true });
      // Fetch user role from Firestore
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      if (userData.role === "admin") {
        router.replace("/admin");
      } else if (isMobile === false) {
        toast.error("Admin privilege required to access on desktop.");
        router.replace("/UseMobile");
      } else {
        router.replace("/subjects");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName || "",
        role: isAdmin ? "admin" : "user",
      }, { merge: true });
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      if (userData.role === "admin") {
        router.replace("/admin");
      } else if (isMobile === false) {
        toast.error("Admin privilege required to access on desktop.");
        router.replace("/UseMobile");
      } else {
        router.replace("/subjects");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
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
            disabled={loading}
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
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/forgot-password" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none', fontSize: 15 }}>
            Forgot password?
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              color: '#444',
              border: '1px solid #ddd',
              borderRadius: 4,
              padding: '10px 24px',
              fontWeight: 500,
              fontSize: 16,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              margin: '0 auto',
              width: 260
            }}
          >
            <img src="/images/Icons/google.svg" alt="Google" style={{ width: 24, height: 24, marginRight: 12 }} />
            Sign in with Google
          </button>
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
