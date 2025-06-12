
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

// Scene component with enhanced event handlers for annotation interaction
const Scene = ({ 
  isAddingAnnotation, 
  onModelClick 
}: { 
  isAddingAnnotation: boolean;
  onModelClick?: (point: THREE.Vector3) => void;
}) => {
  const threeState = useThree();
  const { scene, camera, raycaster, mouse, gl } = threeState;
  
  // Configure scene and renderer for better shadows
  useEffect(() => {
    if (scene) {
      scene.environment = null;
      scene.background = null;
    }
    
    // Configure renderer with shadows enabled
    if (gl) {
      gl.toneMapping = THREE.NoToneMapping;
      gl.toneMappingExposure = 1;
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }, [scene, gl]);
  
  useEffect(() => {
    if (!isAddingAnnotation) return;

    const handlePointerDown = (event: PointerEvent) => {
      // Prevent the event from bubbling to orbit controls
      event.stopPropagation();
      
      // Calculate mouse position in normalized device coordinates
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
      const mouseY = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
      
      // Create a new mouse vector for this specific click
      const clickMouse = new THREE.Vector2(mouseX, mouseY);
      
      // Update raycaster with the click position
      raycaster.setFromCamera(clickMouse, camera);
      
      // Check for intersections with the model only
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      // Filter out any non-mesh objects (like lights, cameras, etc.)
      const meshIntersects = intersects.filter(intersect => 
        intersect.object instanceof THREE.Mesh && 
        intersect.object.userData?.isModel !== false
      );
      
      if (meshIntersects.length > 0) {
        const intersection = meshIntersects[0];
        const clickPoint = intersection.point.clone();
        
        console.log("Annotation clicked at:", clickPoint);
        
        // Dispatch the custom event with the position
        window.dispatchEvent(new CustomEvent('annotation-position-selected', {
          detail: { position: clickPoint }
        }));
        
        // Signal that annotation position is set
        window.dispatchEvent(new CustomEvent('annotation-position-set'));
      }
    };

    // Only add the event listener when in annotation mode
    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown, { capture: true });
    
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown, { capture: true });
    };
  }, [scene, camera, raycaster, gl, isAddingAnnotation]);

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
  isLiveMode?: boolean;
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
  modelColor = '#ffffff',
  isLiveMode = false
}) => {
  const orbitControlsRef = useRef<any>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  // Completely remove any automatic camera movement
  const handleModelClick = (clickPoint: THREE.Vector3) => {
    // Do nothing - let the user control the camera manually
    console.log("Model click registered, no automatic rotation");
  };

  return (
    <div className="relative flex-1 bg-white rounded-2xl overflow-hidden animate-fade-in h-[calc(100vh-180px)]">
      <Canvas
        ref={canvasRef}
        gl={{ 
          antialias: true, 
          alpha: true, 
          logarithmicDepthBuffer: true,
          powerPreference: "high-performance"
        }}
        shadows={true}
        dpr={[1, 2]}
        className="w-full h-full"
        onCreated={({ scene, gl }) => {
          // Enable shadows and configure lighting
          scene.environment = null;
          scene.background = null;
          gl.toneMapping = THREE.NoToneMapping;
          gl.toneMappingExposure = 1;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Scene 
          isAddingAnnotation={isAddingAnnotation} 
          onModelClick={handleModelClick}
        />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <OrbitControls
          ref={orbitControlsRef}
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
          enabled={!isAddingAnnotation}
        />
        
        {/* Enhanced lighting setup with much brighter lights */}
        <ambientLight intensity={1.2} color="#ffffff" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={2.5} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight 
          position={[-10, -10, -5]} 
          intensity={1.8} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight 
          position={[5, 5, 5]} 
          intensity={2.0} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight 
          position={[-5, -5, -5]} 
          intensity={1.5} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Add a ground plane to receive shadows */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial transparent opacity={0.2} />
        </mesh>
        
        <Suspense fallback={<LoadingIndicator />}>
          {modelUrl && (
            <ModelLoader 
              ref={modelRef}
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
              isLiveMode={isLiveMode}
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
            {isAddingAnnotation ? "Click on the model to place annotation" : "Use mouse to zoom, pan and rotate"}
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
