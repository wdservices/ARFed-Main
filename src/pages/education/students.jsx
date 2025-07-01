import React from 'react';

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-8">
      <img src="/images/For students@2x.png" alt="For Students" className="w-40 h-40 mb-8 rounded-xl shadow-lg" />
      <h1 className="text-4xl font-bold text-white mb-4">For Students</h1>
      <p className="text-lg text-blue-100 max-w-2xl text-center mb-8">
        ARFed makes learning fun and interactive! Explore 3D models, ask questions to our AI tutor, and participate in AR challenges. Whether you're studying at home or in the classroom, ARFed helps you understand tough topics, visualize science, and stay curious.
      </p>
      <ul className="text-blue-200 text-left max-w-xl space-y-2">
        <li>• Interactive 3D AR models for hands-on learning</li>
        <li>• AI-powered chatbot for instant help</li>
        <li>• Gamified quizzes and challenges</li>
        <li>• Accessible on any device, anytime</li>
      </ul>
    </div>
  );
} 