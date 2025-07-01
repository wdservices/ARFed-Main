import React from 'react';
import { useRouter } from 'next/router';

const UseMobile = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-md w-full">
        <img
          src="/images/error.gif"
          alt="Device Not Supported"
          className="w-48 h-48 object-contain mb-6"
        />
        <h1 className="text-3xl font-bold text-white mb-4 text-center">ARFed is Mobile Only</h1>
        <p className="text-lg text-white/80 mb-6 text-center">
          ARFed is designed for use on mobile devices with AR capabilities.<br />
          Please open this site on your phone or tablet to experience ARFed.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
        >
          Return to Landing Page
        </button>
      </div>
    </div>
  );
};

export default UseMobile; 