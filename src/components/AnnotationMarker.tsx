"use client";

import { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import { Vector3 } from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Flag } from 'lucide-react';

type AnnotationMarkerProps = {
  id: string;
  position: Vector3;
  title: string;
  content: string;
  onDelete: (id: string) => void;
  isLiveMode?: boolean;
};

export const AnnotationMarker = ({ 
  id, 
  position, 
  title, 
  content, 
  onDelete, 
  isLiveMode = false 
}: AnnotationMarkerProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);
  
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  
  return (
    <Html position={[position.x, position.y, position.z]}>
      <div className="relative" ref={markerRef}>
        <div 
          className={`w-6 h-6 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform shadow-lg ${showInfo ? 'ring-2 ring-white/50' : ''}`}
          onClick={toggleInfo}
        >
          <Flag size={12} />
        </div>
        
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute z-50 -translate-x-1/2 -translate-y-full mb-2 bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-3 min-w-[220px] text-white"
              style={{ top: '-0.5rem', left: '50%' }}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-sm">{title}</h3>
                <div className="flex gap-1">
                  {!isLiveMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Delete annotation"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    onClick={toggleInfo}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    aria-label={showInfo ? "Hide details" : "Show details"}
                  >
                    {showInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>
              <div className="h-px bg-gray-700 w-full my-1" />
              <p className="text-xs text-gray-300 mt-1">{content}</p>
              <div className="absolute w-3 h-3 bg-black/90 transform rotate-45 left-1/2 -ml-1.5 -bottom-1.5 border-r border-b border-gray-700"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Html>
  );
};
