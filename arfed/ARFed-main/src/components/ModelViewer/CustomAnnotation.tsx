import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Flag } from 'lucide-react';

interface CustomAnnotationProps {
  id: string;
  position: THREE.Vector3;
  title: string;
  content: string;
  onDelete: (id: string) => void;
  isLiveMode?: boolean;
  modelRef?: React.RefObject<THREE.Object3D>;
}

export const CustomAnnotation: React.FC<CustomAnnotationProps> = ({
  id,
  position,
  title,
  content,
  onDelete,
  isLiveMode = false,
  modelRef
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [screenPosition, setScreenPosition] = useState({ x: 0, y: 0 });
  const markerRef = useRef<THREE.Mesh>(null);
  const htmlRef = useRef<HTMLDivElement>(null);
  
  // Get camera and renderer from Three.js context
  const { camera, gl } = useThree();
  
  // Update position and screen coordinates on each frame
  useFrame(() => {
    if (!markerRef.current || !isVisible) return;
    
    // Update marker position to follow the model if it moves
    if (modelRef?.current) {
      const worldPosition = new THREE.Vector3();
      modelRef.current.getWorldPosition(worldPosition);
      markerRef.current.position.copy(position.clone().add(worldPosition));
    } else {
      markerRef.current.position.copy(position);
    }
    
    // Calculate screen position for HTML overlay
    const vector = markerRef.current.position.clone();
    vector.project(camera);
    
    const x = (vector.x * 0.5 + 0.5) * gl.domElement.clientWidth;
    const y = (vector.y * -0.5 + 0.5) * gl.domElement.clientHeight;
    
    setScreenPosition({ x, y });
  });

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 3D Marker */}
      <mesh ref={markerRef} position={position}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* HTML Overlay */}
      <Html
        position={position}
        center
        distanceFactor={6}
        zIndexRange={[100, 0]}
        style={{
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      >
        <div className="relative">
          {/* Marker Icon */}
          <div 
            className={`w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform shadow-md border border-white/50 ${showInfo ? 'ring-2 ring-white/50' : ''}`}
            onClick={toggleInfo}
            style={{ 
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))',
              zIndex: 1000
            }}
          >
            <Flag size={8} />
          </div>
          
          {/* Info Panel */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute z-50 -translate-x-1/2 -translate-y-full mb-1 bg-black/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-lg p-1 min-w-[140px] text-white"
                style={{ 
                  top: '-0.25rem', 
                  left: '50%',
                  zIndex: 1001,
                  fontSize: '9px'
                }}
              >
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-medium text-xs text-white truncate max-w-[90px]">{title}</h3>
                  <div className="flex gap-0.5">
                    {!isLiveMode && (
                      <button
                        onClick={handleDelete}
                        className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                        aria-label="Delete annotation"
                      >
                        <X size={7} />
                      </button>
                    )}
                    <button
                      onClick={toggleInfo}
                      className="text-gray-400 hover:text-white transition-colors p-0.5"
                      aria-label={showInfo ? "Hide details" : "Show details"}
                    >
                      {showInfo ? <ChevronUp size={7} /> : <ChevronDown size={7} />}
                    </button>
                  </div>
                </div>
                
                <div className="h-px bg-gray-600 w-full my-0.5" />
                
                <p className="text-xs text-gray-300 leading-tight max-h-10 overflow-y-auto" style={{ fontSize: '9px', lineHeight: '1.2' }}>{content}</p>
                
                <div className="absolute w-1 h-1 bg-black/95 transform rotate-45 left-1/2 -ml-0.5 -bottom-0.5 border-r border-b border-gray-600"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Html>
    </>
  );
};

export default CustomAnnotation; 