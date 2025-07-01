import React from 'react';
import { motion } from 'framer-motion';
import { FaGamepad, FaArrowLeft, FaPlay } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Games = () => {
  const router = useRouter();

  const openGame = (gameId) => {
    router.push(`/games/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Head>
        <title>ARFed - Educational Games</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white hover:text-white/80 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-white flex items-center">
            <FaGamepad className="mr-3" />
            Educational Games
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden cursor-pointer hover:bg-white/15 transition-all duration-200"
            onClick={() => openGame('tetris')}
          >
            <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-2">🎮</div>
                <div className="text-xl font-bold">Maths Tetris</div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Maths Tetris</h3>
              <p className="text-white/70 text-sm mb-4">
                A mathematical version of Tetris where you solve equations while playing. Drop number blocks and use operators to clear lines!
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                  Mathematics
                </span>
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                  Intermediate
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openGame('tetris');
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FaPlay className="mr-2" />
                Play Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Games; 