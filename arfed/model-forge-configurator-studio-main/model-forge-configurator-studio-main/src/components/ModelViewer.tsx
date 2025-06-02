
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import AnnotationDisplay from './AnnotationDisplay';

interface ModelProps {
  url: string;
  color: string;
  annotations: Array<{
    id: string;
    position: [number, number, number];
    title: string;
    description: string;
  }>;
  onAddAnnotation: (position: [number, number, number]) => void;
  onAnnotationClick: (annotation: any) => void;
  preserveOriginalMaterial: boolean;
  textureUrl?: string;
}

function Model({ 
  url, 
  color, 
  annotations, 
  onAddAnnotation, 
  onAnnotationClick, 
  preserveOriginalMaterial,
  textureUrl 
}: ModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  const originalMaterials = useRef<Map<string, THREE.Material>>(new Map());

  const handleClick = (event: any) => {
    event.stopPropagation();
    const position = event.point;
    onAddAnnotation([position.x, position.y, position.z]);
  };

  const handleAnnotationClick = (annotation: any) => {
    if (meshRef.current && camera) {
      // Calculate direction from annotation to camera
      const annotationPos = new THREE.Vector3(...annotation.position);
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      
      // Position camera to look at annotation
      const distance = 3;
      const newCameraPos = annotationPos.clone().add(cameraDirection.multiplyScalar(-distance));
      
      // Smoothly move camera
      camera.position.lerp(newCameraPos, 0.1);
    }
    
    onAnnotationClick(annotation);
  };

  if (url) {
    try {
      const { scene } = useGLTF(url);
      
      // Store original materials only once
      if (originalMaterials.current.size === 0) {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            originalMaterials.current.set(child.uuid, child.material.clone());
          }
        });
      }

      // Apply materials based on settings
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (preserveOriginalMaterial) {
            const originalMaterial = originalMaterials.current.get(child.uuid);
            if (originalMaterial) {
              child.material = originalMaterial.clone();
            }
          } else if (textureUrl) {
            const texture = new THREE.TextureLoader().load(textureUrl);
            child.material = new THREE.MeshStandardMaterial({ map: texture });
          } else {
            child.material = new THREE.MeshStandardMaterial({ color: color });
          }
        }
      });

      return (
        <group>
          <primitive
            ref={meshRef}
            object={scene}
            onClick={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={hovered ? 1.05 : 1}
          />
          {annotations.map((annotation) => (
            <group key={annotation.id}>
              <mesh 
                position={annotation.position}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnnotationClick(annotation);
                }}
              >
                <sphereGeometry args={[0.05]} />
                <meshBasicMaterial color="#FFD700" />
              </mesh>
              <mesh position={[annotation.position[0], annotation.position[1] + 0.1, annotation.position[2]]}>
                <planeGeometry args={[0.5, 0.2]} />
                <meshBasicMaterial 
                  color="white" 
                  transparent 
                  opacity={0.9}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          ))}
        </group>
      );
    } catch (error) {
      console.log('Error loading model:', error);
    }
  }

  // Fallback cube when no model URL or model fails to load
  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={color} />
      {annotations.map((annotation) => (
        <group key={annotation.id}>
          <mesh 
            position={annotation.position}
            onClick={(e) => {
              e.stopPropagation();
              handleAnnotationClick(annotation);
            }}
          >
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        </group>
      ))}
    </mesh>
  );
}

interface ModelViewerProps {
  modelUrl: string;
  color: string;
  annotations: Array<{
    id: string;
    position: [number, number, number];
    title: string;
    description: string;
  }>;
  onAddAnnotation: (position: [number, number, number]) => void;
  preserveOriginalMaterial: boolean;
  textureUrl?: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  modelUrl, 
  color, 
  annotations, 
  onAddAnnotation, 
  preserveOriginalMaterial,
  textureUrl 
}) => {
  const [selectedAnnotation, setSelectedAnnotation] = useState<any>(null);

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden relative backdrop-blur-sm border border-white/20 shadow-xl">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg"></div>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} className="relative z-10">
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <Model 
          url={modelUrl} 
          color={color} 
          annotations={annotations} 
          onAddAnnotation={onAddAnnotation}
          onAnnotationClick={setSelectedAnnotation}
          preserveOriginalMaterial={preserveOriginalMaterial}
          textureUrl={textureUrl}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={false} />
      </Canvas>
      
      <AnnotationDisplay 
        annotation={selectedAnnotation}
        onClose={() => setSelectedAnnotation(null)}
      />
      
      {!modelUrl && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-600 z-20">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-white/30 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">ARFed 3D Model Viewer</h3>
            <p>Enter a URL to a 3D model (.glb or .gltf format)</p>
            <p>to get started. You can then view, annotate, and</p>
            <p>export your model.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
