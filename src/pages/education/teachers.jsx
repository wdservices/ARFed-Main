import React from 'react';

export default function TeachersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8">
      <img src="/images/For teachers.png" alt="For Teachers" className="w-40 h-40 mb-8 rounded-xl shadow-lg" />
      <h1 className="text-4xl font-bold text-white mb-4">For Teachers</h1>
      <p className="text-lg text-purple-100 max-w-2xl text-center mb-8">
        ARFed empowers teachers with interactive AR models, AI-driven lesson planning, and real-time student engagement analytics. Bring your lessons to life and make complex concepts easy to visualize and understand. Our platform is designed to save you time, boost classroom participation, and inspire a love of learning in every student.
      </p>
      <ul className="text-purple-200 text-left max-w-xl space-y-2">
        <li>• Ready-to-use AR lesson plans</li>
        <li>• Customizable 3D models for any subject</li>
        <li>• AI chatbot for instant Q&A and support</li>
        <li>• Analytics dashboard to track student progress</li>
      </ul>
    </div>
  );
} 