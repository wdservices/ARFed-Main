import React from 'react';

export default function LessonPlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center p-8">
      <img src="/images/For Lesson plan.png" alt="Lesson Plans" className="w-40 h-40 mb-8 rounded-xl shadow-lg" />
      <h1 className="text-4xl font-bold text-white mb-4">Lesson Plans</h1>
      <p className="text-lg text-cyan-100 max-w-2xl text-center mb-8">
        Discover a library of AR-enhanced lesson plans for every subject and grade level. Each plan includes step-by-step instructions, interactive 3D models, and AI-generated quizzes to reinforce learning. Perfect for teachers and students alike!
      </p>
      <ul className="text-cyan-200 text-left max-w-xl space-y-2">
        <li>• Science, Math, History, and more</li>
        <li>• AR models embedded in every lesson</li>
        <li>• Printable worksheets and digital resources</li>
        <li>• Aligned with curriculum standards</li>
      </ul>
    </div>
  );
} 