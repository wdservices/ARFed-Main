import React from "react";

const Terms = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center p-8">
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg max-w-2xl w-full p-8">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Terms of Service</h1>
      <p className="mb-4 text-indigo-100">By using ARFed, you agree to the following terms and conditions:</p>
      <ul className="list-disc pl-6 mb-4 text-indigo-200">
        <li>Use ARFed for educational and non-commercial purposes only.</li>
        <li>Do not misuse or attempt to disrupt the service.</li>
        <li>Respect intellectual property and copyright laws.</li>
        <li>We reserve the right to update these terms at any time.</li>
      </ul>
      <p className="text-indigo-100">Contact us at <a href="mailto:hello.arfed@gmail.com" className="text-blue-300 underline">hello.arfed@gmail.com</a> for questions about these terms.</p>
    </div>
  </div>
);

export default Terms; 