import ModelViewer from '@/components/ModelViewer';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#3B82F6] overflow-hidden">
      {/* Decorative background dots */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-400 opacity-30 rounded-full blur-2xl z-0 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-indigo-200 opacity-20 rounded-full blur-2xl z-0 animate-pulse" style={{transform: 'translate(-50%, -50%)'}} />
      {/* Main content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-5xl p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl flex flex-col min-h-[80vh]"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">ARFed 3D Model Viewer</h1>
          <p className="text-gray-200">View, annotate, and interact with 3D models in real time.</p>
        </div>
        <div className="flex-1 flex flex-col">
          <ModelViewer />
        </div>
        <footer className="mt-8 text-center text-sm text-white/80">
          ARFed 3D Editor • Designed with precision • Powered by Three.js
        </footer>
      </motion.div>
    </div>
  );
};

export default Index;
