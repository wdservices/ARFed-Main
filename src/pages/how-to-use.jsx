import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaArrowRight, FaMobile, FaGlasses, FaPlay, FaUser, FaBook, FaGamepad, FaRobot, FaCrown } from 'react-icons/fa';
import Link from 'next/link';

const HowToUse = () => {
  const steps = [
    {
      icon: <FaUser className="text-3xl text-blue-400" />,
      title: "Create Your Account",
      description: "Sign up for a free account to access ARFed's educational content.",
      details: ["Visit the signup page", "Verify your email", "Choose your plan"]
    },
    {
      icon: <FaBook className="text-3xl text-green-400" />,
      title: "Explore Subjects",
      description: "Browse through our collection of subjects including Biology, Chemistry, Physics.",
      details: ["Navigate to Subjects page", "Choose a subject", "View available models"]
    },
    {
      icon: <FaMobile className="text-3xl text-purple-400" />,
      title: "Access AR Models",
      description: "Open any model to view it in 3D. Rotate, zoom, and interact with the model.",
      details: ["Click on any model", "Use touch gestures", "Tap on hotspots", "Use AR button"]
    },
    {
      icon: <FaGlasses className="text-3xl text-orange-400" />,
      title: "Experience Augmented Reality",
      description: "Point your camera at a flat surface and watch the model appear in your environment.",
      details: ["Ensure mobile device", "Find well-lit surface", "Tap AR button", "Follow instructions"]
    },
    {
      icon: <FaPlay className="text-3xl text-red-400" />,
      title: "Listen to Audio Descriptions",
      description: "Every model comes with detailed audio descriptions.",
      details: ["Look for microphone icon", "Tap to start narration", "Use pause/resume controls"]
    },
    {
      icon: <FaRobot className="text-3xl text-teal-400" />,
      title: "Chat with AI Tutor",
      description: "Get help anytime with our AI tutor! Ask questions about any subject.",
      details: ["Find chat icon", "Ask questions", "Get instant responses", "Request explanations"]
    },
    {
      icon: <FaGamepad className="text-3xl text-pink-400" />,
      title: "Play Educational Games",
      description: "Reinforce your learning through interactive games.",
      details: ["Visit Games section", "Choose games", "Test knowledge", "Track progress"]
    },
    {
      icon: <FaCrown className="text-3xl text-yellow-400" />,
      title: "Upgrade to Premium",
      description: "Unlock unlimited access to all premium content and features.",
      details: ["Access premium models", "Unlimited AI tutor", "Priority support", "Advanced tracking"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] relative overflow-hidden">
      <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-400 opacity-30 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse" />
      
      <Head>
        <title>How to Use ARFed - Step by Step Guide</title>
        <meta name="description" content="Learn how to use ARFed step by step. Get started with AR education." />
      </Head>

      <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white hover:text-white/80 transition-colors">
                <FaArrowRight className="rotate-180" size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">How to Use ARFed</h1>
                <p className="text-white/60 text-sm">Step by Step Guide</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Master ARFed in 8 Simple Steps
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Follow this comprehensive guide to unlock the full potential of ARFed's augmented reality educational platform.
          </p>
        </motion.div>

        <div className="space-y-12 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col lg:flex-row items-start gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border-2 border-white/30">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/80 text-lg mb-4">{step.description}</p>
                
                <div className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-white/70">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 border border-white/20">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h3>
            <p className="text-white/80 text-lg mb-6">
              Now that you know how to use ARFed, it's time to explore our subjects!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subjects" className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-white/90 transition-colors">
                Explore Subjects
              </Link>
              <Link href="/signup" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default HowToUse; 