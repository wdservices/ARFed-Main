import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelUrl: string;
  modelColor: string;
  annotations: any[];
  onExport: (config: ExportConfig) => void;
}

interface ExportConfig {
  title: string;
  subject: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  generatedCode: string;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  modelUrl,
  modelColor,
  annotations,
  onExport
}) => {
  const token = getCookie("token");
  const [config, setConfig] = useState<ExportConfig>({
    title: '',
    subject: '',
    description: '',
    imageUrl: '',
    audioUrl: '',
    generatedCode: ''
  });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch subjects when modal opens
  useEffect(() => {
    if (isOpen && token) {
      fetchSubjects();
    }
  }, [isOpen, token]);

  // Update config when modal opens
  useEffect(() => {
    if (isOpen) {
      setConfig(prev => ({
        ...prev,
        generatedCode: generateModelCode()
      }));
    }
  }, [isOpen, modelUrl]);

  const fetchSubjects = async () => {
    if (!token) {
      console.warn("No token found, skipping subject fetch.");
      toast.warn("Authentication token not found. Please log in again.");
      return;
    }
    try {
      const response = await axios.get("https://arfed-api.onrender.com/api/subject", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "auth-token": token,
        },
      });
      setSubjects(response.data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      toast.error("Failed to fetch subjects");
    }
  };

  const generateModelCode = () => {
    if (!modelUrl) {
      return `// Load a 3D model to see the generated code
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const ModelViewer = () => {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {/* Load your 3D model here */}
    </Canvas>
  );
};

export default ModelViewer;`;
    }

    const annotationsCode = annotations.length > 0 
      ? annotations.map((annotation, index) => `
  // Annotation ${index + 1}: ${annotation.title}
  <AnnotationMarker
    id="${annotation.id}"
    position={[${annotation.position.x.toFixed(2)}, ${annotation.position.y.toFixed(2)}, ${annotation.position.z.toFixed(2)}]}
    title="${annotation.title}"
    content="${annotation.content}"
  />`).join('')
      : '';

    return `import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Model component
const Model = () => {
  const { scene } = useGLTF('${modelUrl}');
  
  // Apply model color
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: '${modelColor}',
      });
    }
  });
  
  return <primitive object={scene} />;
};

// Annotation marker component
const AnnotationMarker = ({ position, title, content }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05]} />
      <meshBasicMaterial color="red" />
      {/* Add your annotation UI here */}
    </mesh>
  );
};

// Main ModelViewer component
const ModelViewer = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={100}
        />
        
        {/* Lighting setup */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} />
        <pointLight position={[10, 0, 10]} intensity={1.5} />
        <pointLight position={[-10, 0, -10]} intensity={1.5} />
        
        <Suspense fallback={null}>
          <Model />${annotationsCode}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;`;
  };

  const handleSubmit = async () => {
    // Validate required fields - only essential fields are required
    if (!config.title || !config.subject || !config.description) {
      toast.warn("Title, Subject, and Description are required");
      return;
    }

    // Check if 3D model is loaded
    if (!modelUrl) {
      toast.warn("Please load a 3D model first");
      return;
    }

    try {
      setLoading(true);
      
      // Post to the models API
      const response = await axios.post(
        "https://arfed-api.onrender.com/api/models",
        {
          title: config.title,
          description: config.description,
          audio: config.audioUrl || '', // Make audio optional
          image: config.imageUrl || '', // Make image URL optional
          model: modelUrl, // Use the loaded 3D model URL
          subjectId: config.subject,
          iosModel: modelUrl, // Use the loaded 3D model URL
          audio: config.audioUrl || '', // Make audio optional
          // Add annotations and model customizations
          annotations: annotations.map(annotation => ({
            id: annotation.id,
            title: annotation.title,
            content: annotation.content,
            position: {
              x: annotation.position.x,
              y: annotation.position.y,
              z: annotation.position.z
            }
          })),
          modelColor: modelColor,
          modelCustomizations: {
            color: modelColor,
            annotations: annotations.length,
            hasCustomizations: true
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "auth-token": token,
          },
        }
      );

      console.log("Model created successfully:", response.data);
      setLoading(false);
      
      // Call the onExport callback with the config
      onExport(config);
      
      // Close modal and reset form
      onClose();
      setConfig({
        title: '',
        subject: '',
        description: '',
        imageUrl: '',
        audioUrl: '',
        generatedCode: ''
      });
      
      toast.success("Model Created Successfully");
    } catch (error) {
      setLoading(false);
      console.error("Error creating model:", error);
      toast.error("Failed to create model. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Export Configured Model</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Information</h3>
            
            {/* 3D Model Status */}
            <Card className="bg-blue-50 border border-blue-200 p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">3D Model Status</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p><span className="font-medium">Status:</span> {modelUrl ? '✅ 3D Model Loaded and Configured' : '❌ No 3D Model Loaded'}</p>
                {modelUrl && (
                  <p><span className="font-medium">Model URL:</span> {modelUrl}</p>
                )}
                {annotations.length > 0 && (
                  <p><span className="font-medium">Annotations:</span> {annotations.length} added</p>
                )}
                <p><span className="font-medium">Color:</span> {modelColor}</p>
              </div>
            </Card>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Title *
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                placeholder="Enter Model Title"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Category *
              </label>
              <div className="relative">
                <select
                  value={config.subject}
                  onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none pr-8"
                >
                  <option value="">Select a Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
              {subjects.length === 0 && (
                <p className="text-sm text-red-500 mt-1">No subjects found. Please create subjects first.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Description *
              </label>
              <textarea
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="Enter Model Description"
                rows={4}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Image URL (Optional)
              </label>
              <input
                type="url"
                value={config.imageUrl}
                onChange={(e) => setConfig({ ...config, imageUrl: e.target.value })}
                placeholder="Enter Model Image URL"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio URL (Optional)
              </label>
              <input
                type="url"
                value={config.audioUrl}
                onChange={(e) => setConfig({ ...config, audioUrl: e.target.value })}
                placeholder="Enter Model Audio URL"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button 
            variant="outline"
            onClick={onClose}
            className="px-6"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90 px-8"
            disabled={loading}
          >
            {loading ? 'Creating Model...' : 'Create Model'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExportModal;
