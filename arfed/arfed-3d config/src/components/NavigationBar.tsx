
import { motion } from 'framer-motion';
import { Download, UploadCloud, Search } from 'lucide-react';

const NavigationBar = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full py-4 px-6 glass-panel flex items-center justify-between mb-6 backdrop-blur-md z-10"
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
            <h1 className="text-xl font-semibold">ARFed 3D Editor</h1>
          </div>
        </motion.div>
      </div>
      
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex text-sm space-x-1">
          <span className="text-primary font-medium">Load Model</span>
          <span className="mx-1">•</span>
          <span className="text-muted-foreground">Add Annotations</span>
          <span className="mx-1">•</span>
          <span className="text-muted-foreground">Deploy to App</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-accent rounded-full transition-colors">
          <Search size={20} className="text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-accent rounded-full transition-colors">
          <Download size={20} className="text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-accent rounded-full transition-colors">
          <UploadCloud size={20} className="text-muted-foreground" />
        </button>
      </div>
    </motion.header>
  );
};

export default NavigationBar;
