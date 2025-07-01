import React from 'react';

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center p-8">
      <img src="/images/For research@2x.png" alt="Research" className="w-40 h-40 mb-8 rounded-xl shadow-lg" />
      <h1 className="text-4xl font-bold text-white mb-4">Research</h1>
      <p className="text-lg text-indigo-100 max-w-2xl text-center mb-8">
        ARFed is built on the latest research in education technology, cognitive science, and augmented reality. Learn more about our evidence-based approach, published studies, and the impact of AR on student outcomes.
      </p>
      <ul className="text-indigo-200 text-left max-w-xl space-y-2">
        <li>• Peer-reviewed studies on AR in education</li>
        <li>• Whitepapers and case studies</li>
        <li>• Collaborations with leading universities</li>
        <li>• Continuous improvement based on user feedback</li>
      </ul>
    </div>
  );
} 