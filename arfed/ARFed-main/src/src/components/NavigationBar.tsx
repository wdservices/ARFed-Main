
import { motion } from 'framer-motion';
import { Download, UploadCloud, Search } from 'lucide-react';

const NavigationBar = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full py-4 px-6 glass-panel flex items-center justify-between mb-6 z-10" // Used glass-panel class
    >
      <div className="flex items-center">
        <motion.div
          initial={{ rotate: -5, scale: 0.98 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">AR</span> {/* Ensured text-primary-foreground */}
            </div>
            <h1 className="text-xl font-semibold text-foreground">ARFed 3D Editor</h1> {/* Changed text-gray-900 */}
          </div>
        </motion.div>
      </div>
      
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex text-sm space-x-1">
          <span className="text-primary font-medium">Load Model</span>
          <span className="mx-1 text-muted-foreground">•</span> {/* Changed text-gray-400 */}
          <span className="text-foreground">Add Annotations</span> {/* Changed text-gray-600 */}
          <span className="mx-1 text-muted-foreground">•</span> {/* Changed text-gray-400 */}
          <span className="text-foreground">Deploy to App</span> {/* Changed text-gray-600 */}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-accent rounded-full transition-colors border border-transparent hover:border-border bg-background text-foreground"> {/* Theming changes */}
          <Search size={20} />
        </button>
        <button className="p-2 hover:bg-accent rounded-full transition-colors border border-transparent hover:border-border bg-background text-foreground"> {/* Theming changes */}
          <Download size={20} />
        </button>
        <button className="p-2 hover:bg-accent rounded-full transition-colors border border-transparent hover:border-border bg-background text-foreground"> {/* Theming changes */}
          <UploadCloud size={20} />
        </button>
      </div>
    </motion.header>
  );
};

export default NavigationBar;
