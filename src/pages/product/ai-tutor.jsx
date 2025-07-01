import React from 'react';

export default function AITutorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 flex flex-col items-center justify-center p-8">
      <img src="/images/ai tutor.png" alt="AI Tutor" className="w-40 h-40 mb-8 rounded-xl shadow-lg" />
      <h1 className="text-4xl font-bold text-white mb-4">AI Tutor</h1>
      <p className="text-lg text-pink-100 max-w-2xl text-center mb-8">
        Meet your personal AI Tutor! ARFed's AI Tutor answers questions, explains concepts, and provides instant feedback. Whether you're a student needing help with homework or a teacher looking for classroom support, our AI Tutor is available 24/7 to make learning interactive and personalized.
      </p>
      <ul className="text-pink-200 text-left max-w-xl space-y-2">
        <li>• Real-time Q&A and explanations</li>
        <li>• Adaptive learning paths</li>
        <li>• Supports multiple subjects and grade levels</li>
        <li>• Integrates with AR models for deeper understanding</li>
      </ul>
    </div>
  );
} 