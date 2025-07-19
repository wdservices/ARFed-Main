import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
// Try different import methods for MeshoptDecoder
let MeshoptDecoder;
try {
  MeshoptDecoder = require('three/examples/jsm/libs/meshopt_decoder.module.js').MeshoptDecoder;
} catch (e) {
  try {
    MeshoptDecoder = require('three/examples/jsm/libs/meshopt_decoder.module.js').default;
  } catch (e2) {
    console.warn("Could not import MeshoptDecoder, compression may not work");
    MeshoptDecoder = null;
  }
}

const ModelLoader = forwardRef(({ 
  url, 
  scale = 1,
  onLoaded, 
  onError,
  onAnimationSetup,
  color = '#ffffff'
}, ref) => {
  const { camera } = useThree();
  const mixerRef = useRef(null);
  const modelRef = useRef(null);
  const hasNotifiedRef = useRef(false);
  const [model, setModel] = useState(null);
  const hasSetCamera = useRef(false);

  useImperativeHandle(ref, () => modelRef.current);
  
  useEffect(() => {
    let isActive = true;
    hasNotifiedRef.current = false;
    
    const loadModel = async () => {
      try {
        if (!url) return;
        
        console.log("Starting model load from URL:", url);
        
        // Use GLTFLoader directly with better error handling
        const loader = new GLTFLoader();
        // Set the Meshopt decoder before loading (with fallback)
        if (MeshoptDecoder) {
          try {
            loader.setMeshoptDecoder(MeshoptDecoder);
            console.log("MeshoptDecoder set successfully");
          } catch (decoderError) {
            console.warn("Failed to set MeshoptDecoder:", decoderError);
          }
        } else {
          console.warn("MeshoptDecoder not available, proceeding without compression support");
        }
        
        // Add a timeout to the loading process
        const loadPromise = new Promise((resolve, reject) => {
          loader.load(
            url,
            (gltf) => resolve(gltf),
            (progress) => {
              console.log("Loading progress:", (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
              console.error("GLTFLoader error:", error);
              if (error && error.target && error.target.status) {
                console.error("HTTP status:", error.target.status);
              }
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
        
        // Calculate the maximum dimension to properly scale the model
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Simple scaling - only scale very large models
        if (maxDim > 10) {
          const autoScale = 5 / maxDim;
          loadedScene.scale.multiplyScalar(autoScale);
        }
        
        // Apply the user-defined scale
        loadedScene.scale.multiplyScalar(scale);
        
        // Simple camera positioning - only for very large models
        if (!hasSetCamera.current && camera instanceof THREE.PerspectiveCamera && maxDim > 10) {
          const fov = camera.fov * (Math.PI / 180);
          const cameraDistance = (maxDim / 2) / Math.tan(fov / 2) * 1.5;
          camera.position.set(center.x, center.y, center.z + cameraDistance);
          camera.lookAt(center);
          camera.updateProjectionMatrix();
          
          const controls = window.orbitControlsRef;
          if (controls && controls.target) {
            controls.target.set(center.x, center.y, center.z);
            controls.update && controls.update();
          }
          hasSetCamera.current = true;
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
        if (error instanceof ProgressEvent && error.target) {
          console.error("Network/HTTP error:", error.target.status, error.target.statusText);
        }
        if (!hasNotifiedRef.current) {
          hasNotifiedRef.current = true;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error loading model';
          onError(new Error(`Failed to load model: ${errorMessage}. Please check the URL, CORS headers, and ensure the model is accessible.`));
        }
      }
    };
    
    loadModel();
    
    // Reset camera set flag when url changes
    hasSetCamera.current = false;
    
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
              // Log material and texture info
              console.log(`Mesh: ${object.name}, Material: ${material.type}, Has Texture: ${!!material.map}`);
              // Only set color if there is NO texture map
              if (material.color && !material.map) {
                material.color.set(color);
              }
            });
          } else {
            // Log material and texture info
            console.log(`Mesh: ${object.name}, Material: ${object.material.type}, Has Texture: ${!!object.material.map}`);
            if (object.material.color && !object.material.map) {
              object.material.color.set(color);
            }
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