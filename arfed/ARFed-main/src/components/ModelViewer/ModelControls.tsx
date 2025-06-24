
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AnimationControls, { Animation } from '@/components/AnimationControls';
import * as THREE from 'three';

interface ModelControlsProps {
  isModelLoaded: boolean;
  isAddingAnnotation: boolean;
  showAnimationControls: boolean;
  activeModel: THREE.Object3D | null;
  animationMixer: THREE.AnimationMixer | null;
  handleAddAnnotation: () => void;
  handleExportToApp: () => void;
  handleAnimationChange: (animations: Animation[]) => void;
  toggleAnimationControls: () => void;
}

const ModelControls: React.FC<ModelControlsProps> = ({
  isModelLoaded,
  isAddingAnnotation,
  showAnimationControls,
  activeModel,
  animationMixer,
  handleAddAnnotation,
  handleExportToApp,
  handleAnimationChange,
  toggleAnimationControls
}) => {
  if (!isModelLoaded) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 glass-panel"
    >
      <div className="flex flex-wrap gap-3 mb-3">
        <Button
          onClick={handleAddAnnotation}
          disabled={isAddingAnnotation}
          className="button-secondary"
        >
          Add Annotation
        </Button>
        <Button
          onClick={toggleAnimationControls}
          className="button-secondary"
          variant={showAnimationControls ? "default" : "outline"}
        >
          {showAnimationControls ? 'Hide Animations' : 'Show Animations'}
        </Button>
        <Button
          onClick={handleExportToApp}
          className="button-primary ml-auto"
        >
          Deploy to App
        </Button>
      </div>
      
      {/* Animation Controls */}
      {showAnimationControls && (
        <div className="mt-4 animate-fade-in">
          <AnimationControls 
            object={activeModel} 
            mixer={animationMixer}
            onAnimationChange={handleAnimationChange}
          />
        </div>
      )}
    </motion.div>
  );
};

export default ModelControls;
