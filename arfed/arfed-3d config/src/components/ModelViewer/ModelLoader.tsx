
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface ModelLoaderProps {
  url: string;
  scale: number;
  onLoaded: () => void;
  onError: (error: Error) => void;
  onAnimationSetup: (model: THREE.Object3D, mixer: THREE.AnimationMixer) => void;
  color?: string;
}

const ModelLoader = forwardRef<THREE.Object3D | null, ModelLoaderProps>(({ 
  url, 
  scale = 1,
  onLoaded, 
  onError,
  onAnimationSetup,
  color = '#ffffff'
}, ref) => {
  const { camera } = useThree();
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const hasNotifiedRef = useRef<boolean>(false);
  const [model, setModel] = useState<THREE.Group | null>(null);

  useImperativeHandle(ref, () => modelRef.current);
  
  useEffect(() => {
    let isActive = true;
    hasNotifiedRef.current = false;
    
    const loadModel = async () => {
      try {
        if (!url) return;
        
        console.log("Starting model load from URL:", url);
        
        // Use GLTFLoader directly with better error handling
        const gltfLoader = new GLTFLoader();
        
        // Add a timeout to the loading process
        const loadPromise = new Promise<any>((resolve, reject) => {
          gltfLoader.load(
            url,
            (gltf) => resolve(gltf),
            (progress) => {
              console.log("Loading progress:", (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
              console.error("GLTFLoader error:", error);
              reject(error);
            }
          );
        });

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Model loading timeout after 30 seconds')), 30000);
        });

        const gltf = await Promise.race([loadPromise, timeoutPromise]);
        
        if (!isActive) return;
        
        const loadedScene = gltf.scene.clone();
        
        // Get the bounding box of the model
        const box = new THREE.Box3().setFromObject(loadedScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Center the model
        loadedScene.position.sub(center);
        
        // Calculate the maximum dimension to properly scale the model
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Auto-resize very large models to fit in the viewport
        if (maxDim > 10) {
          const autoScale = 5 / maxDim;
          loadedScene.scale.multiplyScalar(autoScale);
        }
        
        // Apply the user-defined scale
        loadedScene.scale.multiplyScalar(scale);
        
        // Position camera appropriately
        if (camera instanceof THREE.PerspectiveCamera) {
          const fov = camera.fov * (Math.PI / 180);
          // Position camera at a distance where the model fits in view
          const cameraDistance = (maxDim / 2) / Math.tan(fov / 2) * 1.2; 
          camera.position.set(0, 0, Math.max(cameraDistance, 3));
          camera.updateProjectionMatrix();
        }
        
        modelRef.current = loadedScene;
        
        // Set up animation mixer if animations exist
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(loadedScene);
          mixerRef.current = mixer;
          
          // Pass the animations to the scene
          loadedScene.animations = gltf.animations;
          onAnimationSetup(loadedScene, mixer);
        }
        
        setModel(loadedScene);
        
        // Only call onLoaded once
        if (!hasNotifiedRef.current) {
          hasNotifiedRef.current = true;
          console.log("Model loaded successfully");
          onLoaded();
        }
        
      } catch (error) {
        console.error("Error in loadModel:", error);
        if (!hasNotifiedRef.current) {
          hasNotifiedRef.current = true;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error loading model';
          onError(new Error(`Failed to load model: ${errorMessage}. Please check the URL and ensure the model is accessible.`));
        }
      }
    };
    
    loadModel();
    
    return () => {
      isActive = false;
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [url, camera, scale, onLoaded, onError, onAnimationSetup]);

  // Apply color to model
  useEffect(() => {
    if (model) {
      model.traverse((object) => {
        if (object instanceof THREE.Mesh && object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => {
              if (material.color) {
                material.color.set(color);
              }
            });
          } else if (object.material.color) {
            object.material.color.set(color);
          }
        }
      });
    }
  }, [model, color]);
  
  // Update animations
  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });
  
  return model ? <primitive object={model} ref={modelRef} /> : null;
});

ModelLoader.displayName = 'ModelLoader';

export default ModelLoader;
