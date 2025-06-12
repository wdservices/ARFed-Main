
import { motion } from 'framer-motion';
import { Download, UploadCloud, Search } from 'lucide-react';

const NavigationBar = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full py-4 px-6 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg flex items-center justify-between mb-6 z-10"
    >
      <div className="flex items-center">
        <motion.div
          initial={{ rotate: -5, scale: 0.98 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">AR</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">ARFed 3D Editor</h1>
          </div>
        </motion.div>
      </div>
      
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex text-sm space-x-1">
          <span className="text-primary font-medium">Load Model</span>
          <span className="mx-1 text-gray-400">•</span>
          <span className="text-gray-600">Add Annotations</span>
          <span className="mx-1 text-gray-400">•</span>
          <span className="text-gray-600">Deploy to App</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-300 bg-white">
          <Search size={20} className="text-gray-700" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-300 bg-white">
          <Download size={20} className="text-gray-700" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-300 bg-white">
          <UploadCloud size={20} className="text-gray-700" />
        </button>
      </div>
    </motion.header>
  );
};

export default NavigationBar;
