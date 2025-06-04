import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { AnnotationMarker } from '@/components/AnnotationMarker';
import ModelLoader from './ModelLoader';

// Define annotation type that was previously in ModelViewer
export type Annotation = {
  id: string;
  position: THREE.Vector3;
  content: string;
  title: string;
};

// Loading indicator component
const LoadingIndicator = () => (
  <Html center>
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
      <p className="mt-4 text-sm text-white bg-black/80 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm">
        Loading model...
      </p>
    </div>
  </Html>
);

// Scene component with event handlers
const Scene = ({ isAddingAnnotation }: { isAddingAnnotation: boolean }) => {
  const threeState = useThree();
  const { scene, camera, raycaster, mouse, gl } = threeState;
  
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isAddingAnnotation) return;
      
      // Calculate mouse position in normalized device coordinates
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!isAddingAnnotation) return;
      
      // Update raycaster with current mouse position
      raycaster.setFromCamera(mouse, camera);
      
      // Check for intersections with the model
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const intersection = intersects[0];
        // We need to communicate this back to the parent component
        window.dispatchEvent(new CustomEvent('annotation-position-selected', {
          detail: { position: intersection.point.clone() }
        }));
        
        // Temporarily turn off adding annotation mode to prevent multiple clicks
        window.dispatchEvent(new CustomEvent('annotation-position-set'));
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    
    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [scene, camera, raycaster, mouse, gl, isAddingAnnotation]);

  return null;
};

interface ModelCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  modelUrl: string;
  modelScale: number;
  isLoading: boolean;
  isModelLoaded: boolean;
  annotations: Annotation[];
  isAddingAnnotation: boolean;
  handleModelLoaded: () => void;
  handleModelError: (error: Error) => void;
  handleAnimationSetup: (model: THREE.Object3D, mixer: THREE.AnimationMixer) => void;
  handleCanvasClick: (event: React.MouseEvent) => void;
  handleDeleteAnnotation: (id: string) => void;
  modelColor?: string;
}

const ModelCanvas: React.FC<ModelCanvasProps> = ({
  canvasRef,
  modelUrl,
  modelScale = 1,
  isLoading,
  isModelLoaded,
  annotations,
  isAddingAnnotation,
  handleModelLoaded,
  handleModelError,
  handleAnimationSetup,
  handleCanvasClick,
  handleDeleteAnnotation,
  modelColor = '#ffffff'
}) => {
  return (
    <div className="relative flex-1 bg-white rounded-2xl overflow-hidden animate-fade-in h-[calc(100vh-180px)]">
      <Canvas
        ref={canvasRef}
        gl={{ antialias: true, alpha: true, logarithmicDepthBuffer: true }}
        shadows
        dpr={[1, 2]}
        onClick={handleCanvasClick}
        className="w-full h-full"
      >
        <Scene isAddingAnnotation={isAddingAnnotation} />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={1}
          maxDistance={100}
          enableZoom={true}
          zoomSpeed={1.0}
          enablePan={true}
          panSpeed={0.5}
        />
        
        {/* Much brighter lighting setup for white background */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} />
        <directionalLight position={[0, 10, 0]} intensity={1} />
        <directionalLight position={[0, -10, 0]} intensity={0.8} />
        <pointLight position={[10, 0, 10]} intensity={1.5} />
        <pointLight position={[-10, 0, -10]} intensity={1.5} />
        <pointLight position={[0, 10, 0]} intensity={1} />
        <pointLight position={[0, -10, 0]} intensity={1} />
        
        <Suspense fallback={<LoadingIndicator />}>
          {modelUrl && (
            <ModelLoader 
              url={modelUrl}
              scale={modelScale}
              onLoaded={handleModelLoaded} 
              onError={handleModelError}
              onAnimationSetup={handleAnimationSetup}
              color={modelColor}
            />
          )}

          {/* Render annotations */}
          {isModelLoaded && annotations.map((annotation) => (
            <AnnotationMarker
              key={annotation.id}
              id={annotation.id}
              position={annotation.position}
              title={annotation.title}
              content={annotation.content}
              onDelete={handleDeleteAnnotation}
            />
          ))}
        </Suspense>
      </Canvas>

      {!modelUrl && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center max-w-md px-8 py-12 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-300 shadow-lg">
            <h2 className="text-gray-900 text-2xl font-bold mb-4">ARFed 3D Model Viewer</h2>
            <p className="text-gray-700 text-lg">
              Enter a URL to a 3D model (.glb or .gltf format) to get started. You can then view, annotate, and export your model.
            </p>
          </div>
        </div>
      )}
      
      {isModelLoaded && (
        <div className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-300 shadow-lg">
          <p className="text-gray-900 text-sm font-medium">
            Use mouse to zoom, pan and rotate
          </p>
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <p className="mt-4 text-lg text-gray-900">Loading model...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelCanvas;
