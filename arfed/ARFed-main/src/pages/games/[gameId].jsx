import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPlay, FaPause, FaExpand, FaCompress } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Head from 'next/head';

const GamePage = () => {
  const router = useRouter();
  const { gameId } = router.query;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const games = {
    tetris: {
      title: "Maths Tetris",
      description: "A mathematical version of Tetris where you solve equations while playing. Drop number blocks and use operators to clear lines!",
      category: "Mathematics",
      difficulty: "Intermediate",
      icon: "🎮",
      color: "from-purple-500 to-blue-600"
    },
    // Add more games here as needed
  };

  const currentGame = games[gameId] || {
    title: "Game Not Found",
    description: "This game is not available yet.",
    category: "Unknown",
    difficulty: "Unknown",
    icon: "❓",
    color: "from-gray-500 to-gray-600"
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Add game play/pause logic here
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Head>
        <title>ARFed - {currentGame.title}</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center text-white hover:text-white/80 mr-4 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Games
            </button>
            <h1 className="text-4xl font-bold text-white flex items-center">
              <span className="mr-3 text-4xl">{currentGame.icon}</span>
              {currentGame.title}
            </h1>
          </div>

          {/* Game Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              {isPlaying ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              {isFullscreen ? <FaCompress className="mr-2" /> : <FaExpand className="mr-2" />}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>

        {/* Game Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">About This Game</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                {currentGame.description}
              </p>
              <div className="flex items-center space-x-4">
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                  {currentGame.category}
                </span>
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                  {currentGame.difficulty}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className={`w-32 h-32 bg-gradient-to-br ${currentGame.color} rounded-2xl flex items-center justify-center text-6xl shadow-lg`}>
                {currentGame.icon}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Game Canvas */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Game Canvas</h3>
            <p className="text-white/60 text-sm">{gameId === 'tetris' ? 'Enjoy the game below!' : 'Game script will be loaded here'}</p>
          </div>
          <div className="p-0 min-h-[600px] flex items-center justify-center bg-black/80">
            {gameId === 'tetris' ? (
              <iframe
                src="/games/tetris.html"
                title="Maths Tetris"
                width="100%"
                height="600px"
                style={{ border: 'none', minHeight: '600px', width: '100%' }}
                allowFullScreen
              />
            ) : (
              <div className="text-center text-white/60 w-full py-16">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold mb-2">Game Script Placeholder</h3>
                <p className="text-sm">
                  The game script for {currentGame.title} will be loaded here.<br />
                  Please provide the game script to integrate it.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">How to Play</h3>
          <div className="grid md:grid-cols-2 gap-6 text-white/80">
            <div>
              <h4 className="font-semibold text-white mb-2">Controls</h4>
              <ul className="space-y-1 text-sm">
                <li>• Use arrow keys to move pieces</li>
                <li>• Spacebar to drop pieces quickly</li>
                <li>• R key to rotate pieces</li>
                <li>• P key to pause/resume</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Objective</h4>
              <ul className="space-y-1 text-sm">
                <li>• Clear lines by completing rows</li>
                <li>• Solve mathematical equations</li>
                <li>• Score points for speed and accuracy</li>
                <li>• Try to achieve the highest score!</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GamePage; 