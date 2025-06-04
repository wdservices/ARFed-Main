
import { motion } from 'framer-motion';
import NavigationBar from '@/components/NavigationBar';
import ModelViewer from '@/components/ModelViewer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="container mx-auto px-4 py-6 flex flex-col h-screen max-w-full">
        <NavigationBar />
        
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex flex-col"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-6 text-center"
          >
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              ARFed 3D Model Viewer
            </h1>
          </motion.div>
          
          <ModelViewer />
        </motion.main>
        
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="py-4 text-center text-sm text-gray-500"
        >
          <p>ARFed 3D Editor • Designed with precision • Powered by Three.js</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
