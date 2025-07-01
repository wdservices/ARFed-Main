import React from 'react';

export default function ARModelsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center p-8">
      <img src="/images/3d model.png" alt="AR Models" className="w-40 h-40 mb-8 rounded-xl shadow-lg" />
      <h1 className="text-4xl font-bold text-white mb-4">AR Models</h1>
      <p className="text-lg text-indigo-100 max-w-2xl text-center mb-8">
        Explore a vast library of interactive Augmented Reality models designed for education. Visualize complex concepts in 3D, from molecules to historical artifacts, and bring your lessons to life. Our AR models are optimized for classroom and remote learning, making abstract ideas tangible and engaging for all learners.
      </p>
      <ul className="text-indigo-200 text-left max-w-xl space-y-2">
        <li>• 3D models for science, math, history, and more</li>
        <li>• Easy integration into lesson plans</li>
        <li>• Compatible with mobile and desktop devices</li>
        <li>• Regularly updated with new content</li>
      </ul>
    </div>
  );
} 