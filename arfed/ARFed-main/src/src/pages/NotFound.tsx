import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-accent/30 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 max-w-md text-center"
        style={{
          backgroundColor: "hsl(var(--background) / 0.95)",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          border: "1px solid hsl(var(--border))"
        }}
      >
        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-6xl font-bold mb-4"
          style={{
            backgroundImage: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary), 0.7))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent"
          }}
        >
          404
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl mb-6"
          style={{ color: "hsl(var(--foreground))" }}
        >
          The page you're looking for doesn't exist
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-md font-semibold shadow-md transition"
            style={{
              color: "hsl(var(--primary-foreground))",
              backgroundImage: "linear-gradient(to right, hsl(var(--primary)), #9333ea)"
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Editor</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
