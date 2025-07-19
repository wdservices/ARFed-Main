import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import app from "../lib/firebaseClient";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useIsMobile } from "../hooks/use-mobile";

const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAILS = ["hello.wdservices@gmail.com"];

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("individual");
  const [organizationName, setOrganizationName] = useState("");
  const router = useRouter();
  const isMobile = useIsMobile();
  React.useEffect(() => {
    if (isMobile === false && accountType !== "admin") {
      router.replace("/UseMobile");
    }
  }, [isMobile, router, accountType]);

  const signup = async () => {
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        toast.warn("Passwords do not match");
        setLoading(false);
        return;
      }
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Ensure user doc exists
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          name: name || user.displayName || "",
          role: ADMIN_EMAILS.includes(user.email) ? "admin" : "user",
        });
      }
      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      if (userData.role === "admin") {
        router.push("/admin");
      } else if (isMobile === false) {
        router.replace("/UseMobile");
      } else {
        toast.success("Signed up successfully!");
        router.push("/login");
      }
    } catch (err) {
      console.log(err);
      toast.warn(err.message || "Signup failed");
      setLoading(false);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Ensure user doc exists
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName || "",
          role: ADMIN_EMAILS.includes(user.email) ? "admin" : "user",
        });
      }
      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      if (userData.role === "admin") {
        router.push("/admin");
      } else if (isMobile === false) {
        router.replace("/UseMobile");
      } else {
        toast.success("Signed up successfully!");
        router.push("/subjects");
      }
    } catch (err) {
      toast.warn(err.message || "Google signup failed");
    }
    setLoading(false);
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
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="admin"
                  checked={accountType === "admin"}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 focus:ring-purple-500"
                />
                Admin
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

          {accountType === "group" && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <input
                onChange={(e) => setOrganizationName(e.target.value)}
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-200"
                placeholder="Organization Name"
              />
            </motion.div>
          )}
          
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
          className="mt-6 mb-8 text-center text-gray-200"
        >
          Already have an account?{" "}
          <Link href="/login" className="text-white font-medium hover:underline">
            Login here
          </Link>
        </motion.div>
        {/* Move Google sign-up button above the form and use Google-branded UI */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
          <button
            onClick={handleGoogleSignUp}
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
            Sign up with Google
          </button>
        </div>
        {/* Remove the image for Waves Digital Services and add a centered text below the card */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <span style={{ color: '#888', fontSize: 15, fontWeight: 500, opacity: 0.8, letterSpacing: 0.5 }}>From Waves Digital Services</span>
        </div>
      </div>
      <ToastContainer position="top-center" theme="dark" />
    </div>
  );
};

export default Signup;
