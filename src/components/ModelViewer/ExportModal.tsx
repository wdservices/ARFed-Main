import React, { useState, useEffect, useMemo } from 'react';
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
  subjects?: {_id: string, title: string}[];
}

interface ExportConfig {
  title: string;
  subject: string;
  description: string;
  imageUrl: string;
  iosModelUrl?: string;
  audioUrl: string;
  generatedCode: string;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  modelUrl,
  modelColor,
  annotations,
  onExport,
  subjects: propSubjects = [],
}) => {
  const token = typeof window !== 'undefined' ? (require('cookies-next').getCookie?.("token") ?? null) : null;
  const [config, setConfig] = useState<ExportConfig>({
    title: '',
    subject: '',
    description: '',
    imageUrl: '',
    iosModelUrl: '',
    audioUrl: '',
    generatedCode: ''
  });
  const [subjects, setSubjects] = useState<any[]>(propSubjects);
  const [loading, setLoading] = useState(false);

  // Fetch subjects if not provided as prop
  useEffect(() => {
    if (isOpen && token && (!propSubjects || propSubjects.length === 0)) {
      fetchSubjects();
    }
  }, [isOpen, token, propSubjects]);

  // Update config when modal opens or when generated code changes
  const generatedCode = useMemo(() => {
    if (!modelUrl) {
      return `// Load a 3D model to see the generated code\nimport { Canvas } from '@react-three/fiber';\nimport { OrbitControls } from '@react-three/drei';\n\nconst ModelViewer = () => {\n  return (\n    <Canvas>\n      <OrbitControls />\n      <ambientLight intensity={0.5} />\n      <directionalLight position={[10, 10, 5]} intensity={1} />\n      {/* Load your 3D model here */}\n    </Canvas>\n  );\n};\n\nexport default ModelViewer;`;
    }
    const annotationsCode = annotations.length > 0 
      ? annotations.map((annotation, index) => `\n  // Annotation ${index + 1}: ${annotation.title}\n  <AnnotationMarker\n    id="${annotation.id}"\n    position={[${annotation.position.x.toFixed(2)}, ${annotation.position.y.toFixed(2)}, ${annotation.position.z.toFixed(2)}]}\n    title="${annotation.title}"\n    content="${annotation.content}"\n  />`).join('')
      : '';
    return `import React, { Suspense } from 'react';\nimport { Canvas } from '@react-three/fiber';\nimport { OrbitControls, useGLTF } from '@react-three/drei';\nimport * as THREE from 'three';\n\n// Model component\nconst Model = () => {\n  const { scene } = useGLTF('${modelUrl}');\n  \n  // Apply model color\n  scene.traverse((child) => {\n    if (child.isMesh) {\n      child.material = new THREE.MeshStandardMaterial({\n        color: '${modelColor}',\n      });\n    }\n  });\n  \n  return <primitive object={scene} />;\n};\n\n// Annotation marker component\nconst AnnotationMarker = ({ position, title, content }) => {\n  return (\n    <mesh position={position}>\n      <sphereGeometry args={[0.05]} />\n      <meshBasicMaterial color="red" />\n      {/* Add your annotation UI here */}\n    </mesh>\n  );\n};\n\n// Main ModelViewer component\nconst ModelViewer = () => {\n  return (\n    <div style={{ width: '100%', height: '100vh' }}>\n      <Canvas\n        camera={{ position: [0, 0, 5], fov: 50 }}\n        gl={{ antialias: true }}\n      >\n        <OrbitControls \n          enableDamping\n          dampingFactor={0.05}\n          minDistance={1}\n          maxDistance={100}\n        />\n        \n        {/* Lighting setup */}\n        <ambientLight intensity={1.2} />\n        <directionalLight position={[10, 10, 5]} intensity={2} />\n        <directionalLight position={[-10, -10, -5]} intensity={1.5} />\n        <pointLight position={[10, 0, 10]} intensity={1.5} />\n        <pointLight position={[-10, 0, -10]} intensity={1.5} />\n        \n        <Suspense fallback={null}>\n          <Model />${annotationsCode}\n        </Suspense>\n      </Canvas>\n    </div>\n  );\n};\n\nexport default ModelViewer;`;
  }, [modelUrl, modelColor, annotations]);

  useEffect(() => {
    if (isOpen) {
      setConfig(prev => ({
        ...prev,
        iosModelUrl: modelUrl,
        generatedCode: generatedCode
      }));
    }
  }, [isOpen, modelUrl, generatedCode]);

  const fetchSubjects = async () => {
    if (!token) {
      console.warn("No token found, skipping subject fetch.");
      if (typeof toast !== 'undefined') toast.warn("Authentication token not found. Please log in again.");
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
      if (typeof toast !== 'undefined') toast.error("Failed to fetch subjects");
    }
  };

  const handleSubmit = async () => {
    // Validate required fields - only essential fields are required
    if (!config.title || !config.subject || !config.description) {
      if (typeof toast !== 'undefined') toast.warn("Title, Subject, and Description are required");
      return;
    }
    if (!modelUrl) {
      if (typeof toast !== 'undefined') toast.warn("Please load a 3D model first");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        "https://arfed-api.onrender.com/api/models",
        {
          title: config.title,
          description: config.description,
          audio: config.audioUrl || '',
          image: config.imageUrl || '',
          model: modelUrl,
          subjectId: config.subject,
          iosModel: modelUrl,
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
      setLoading(false);
      onExport(config);
      onClose();
      setConfig({
        title: '',
        subject: '',
        description: '',
        imageUrl: '',
        iosModelUrl: '',
        audioUrl: '',
        generatedCode: ''
      });
    } catch (error) {
      setLoading(false);
      if (typeof toast !== 'undefined') toast.error("Failed to export model");
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
