import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { AnnotationMarker } from '@/components/AnnotationMarker';
import ModelLoader from './ModelLoader.jsx';

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
const Scene = ({ isAddingAnnotation, onModelClick }) => {
  const threeState = useThree();
  const { scene, camera, raycaster, gl } = threeState;

  // Configure scene and renderer for better shadows
  useEffect(() => {
    if (scene) {
      scene.environment = null;
      scene.background = null;
    }
    if (gl) {
      gl.toneMapping = THREE.NoToneMapping;
      gl.toneMappingExposure = 1;
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }, [scene, gl]);

  useEffect(() => {
    if (!isAddingAnnotation) return;
    const handleClick = (event) => {
      if (!isAddingAnnotation) return;
      event.preventDefault();
      event.stopPropagation();
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
      const mouseY = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
      const clickMouse = new THREE.Vector2(mouseX, mouseY);
      raycaster.setFromCamera(clickMouse, camera);
      const meshes = [];
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && !object.userData?.isAnnotation && !object.userData?.isHelper && object.visible) {
          meshes.push(object);
        }
      });
      const intersects = raycaster.intersectObjects(meshes, true);
      if (intersects.length > 0) {
        const intersection = intersects[0];
        const clickPoint = intersection.point.clone();
        window.dispatchEvent(new CustomEvent('annotation-position-selected', {
          detail: { position: clickPoint }
        }));
        window.dispatchEvent(new CustomEvent('annotation-position-set'));
      }
    };
    const canvas = gl.domElement;
    canvas.addEventListener('click', handleClick, false);
    canvas.style.cursor = 'crosshair';
    return () => {
      canvas.removeEventListener('click', handleClick, false);
      canvas.style.cursor = 'grab';
    };
  }, [scene, camera, raycaster, gl, isAddingAnnotation]);
  return null;
};

const ModelCanvas = ({
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
  const orbitControlsRef = useRef(null);
  const modelRef = useRef(null);
  const handleModelClick = (clickPoint) => {
    console.log("Model click registered at:", clickPoint);
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
          scene.environment = null;
          scene.background = null;
          gl.toneMapping = THREE.NoToneMapping;
          gl.toneMappingExposure = 1;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        style={{ touchAction: 'none' }}
      >
        <Scene 
          isAddingAnnotation={isAddingAnnotation} 
          onModelClick={handleModelClick}
        />
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
        <OrbitControls
          ref={ref => {
            orbitControlsRef.current = ref;
            if (ref) window.orbitControlsRef = ref;
          }}
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={50}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={1.2}
        />
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} />
        <pointLight position={[10, 0, 10]} intensity={1.5} />
        <pointLight position={[-10, 0, -10]} intensity={1.5} />
        <Suspense fallback={<LoadingIndicator />}>
          {modelUrl && (
            <ModelLoader
              url={modelUrl}
              scale={modelScale}
              onLoaded={handleModelLoaded}
              onError={handleModelError}
              onAnimationSetup={handleAnimationSetup}
              modelRef={modelRef}
              modelColor={modelColor}
            />
          )}
          {annotations.map((annotation) => (
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
          <div className="mt-2 text-xs text-gray-600">
            <p>Annotations: {annotations.length}</p>
            <p>Live Mode: {isLiveMode ? 'Yes' : 'No'}</p>
            <p>Model Loaded: {isModelLoaded ? 'Yes' : 'No'}</p>
          </div>
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