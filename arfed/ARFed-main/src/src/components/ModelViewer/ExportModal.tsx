import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelUrl: string;
  modelColor: string;
  annotations: any[];
  onExport: (config: ExportConfig) => void;
  subjects: {_id: string, title: string}[];
}

interface ExportConfig {
  title: string;
  subject: string;
  description: string;
  imageUrl: string;
  iosModelUrl: string;
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
  subjects = [],
}) => {
  const [config, setConfig] = useState<ExportConfig>({
    title: '',
    subject: '',
    description: '',
    imageUrl: '',
    iosModelUrl: '',
    audioUrl: '',
    generatedCode: ''
  });

  // Generate the complete model code with configurations
  const generatedCode = useMemo(() => {
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
  }, [modelUrl, modelColor, annotations]);

  // Update config when modal opens or when generated code changes
  useEffect(() => {
    if (isOpen) {
      setConfig(prev => ({
        ...prev,
        iosModelUrl: modelUrl,
        generatedCode: generatedCode
      }));
    }
  }, [isOpen, modelUrl, generatedCode]);

  const handleSubmit = () => {
    // Include the generated code in the export
    const exportConfig = {
      ...config,
      generatedCode: generatedCode
    };
    onExport(exportConfig);
    onClose();
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Title
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
                Subject Category
              </label>
              <div className="relative">
                <select
                  value={config.subject}
                  onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none pr-8"
                >
                  <option value="" disabled>Select a Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Description
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

            {/* Model Configuration Summary */}
            <Card className="bg-gray-50 border border-gray-200 p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Model Configuration</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Annotations:</span> {annotations.length} added</p>
                <p><span className="font-medium">Color:</span> {modelColor}</p>
                <p><span className="font-medium">AR Ready:</span> Yes (with all configurations preserved)</p>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button 
            variant="outline"
            onClick={onClose}
            className="px-6 bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90 px-8"
          >
            Export to AR
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExportModal;
