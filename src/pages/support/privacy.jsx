import React from "react";

const Privacy = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center p-8">
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg max-w-2xl w-full p-8">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Privacy Policy</h1>
      <p className="mb-4 text-indigo-100">Your privacy is important to us. This page explains how ARFed collects, uses, and protects your information.</p>
      <ul className="list-disc pl-6 mb-4 text-indigo-200">
        <li>We do not sell your data to third parties.</li>
        <li>Information is used to improve your experience and provide AR features.</li>
        <li>We use cookies for analytics and essential functionality.</li>
        <li>Contact us at <a href="mailto:hello.arfed@gmail.com" className="text-blue-300 underline">hello.arfed@gmail.com</a> for privacy questions.</li>
      </ul>
      <p className="text-indigo-100">For more details, please read our full privacy policy or contact our support team.</p>
    </div>
  </div>
);

export default Privacy; 