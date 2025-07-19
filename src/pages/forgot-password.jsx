import React, { useState } from 'react';
import app from "../lib/firebaseClient";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth(app);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error(err.message || "Failed to send password reset email");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
      <form onSubmit={handleReset} className="bg-white/10 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Forgot Password</h2>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 mb-4 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all duration-200"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-200"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
} 