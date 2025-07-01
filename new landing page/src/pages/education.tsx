import React from 'react';

const Education = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Education Resources
        </h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-cyan-300">For Teachers</h2>
          <p className="text-white/80 mb-2">
            Discover how ARFed can help you bring lessons to life, engage students, and make complex topics more accessible. Access classroom guides, best practices, and tips for integrating AR into your curriculum.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-cyan-300">For Students</h2>
          <p className="text-white/80 mb-2">
            Explore interactive AR models, get instant help from the AI Tutor, and make learning fun and memorable. Find study tips, project ideas, and ways to use ARFed for homework and revision.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-cyan-300">Lesson Plans</h2>
          <p className="text-white/80 mb-2">
            Access ready-made lesson plans designed for ARFed, covering a range of subjects and grade levels. Each plan includes objectives, activities, and assessment ideas to help you get started quickly.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-cyan-300">Research</h2>
          <p className="text-white/80 mb-2">
            Learn about the latest research on AR in education, case studies, and evidence of ARFed's impact on student engagement and learning outcomes. Stay informed with articles, whitepapers, and more.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Education; 