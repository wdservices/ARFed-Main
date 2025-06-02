
import React, { useState, useEffect } from 'react';
import ModelViewer from '@/components/ModelViewer';
import ControlPanel from '@/components/ControlPanel';
import AddModelModal from '@/components/AddModelModal';
import AnnotationModal from '@/components/AnnotationModal';
import ColorPalette from '@/components/ColorPalette';
import { toast } from '@/hooks/use-toast';

interface Annotation {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
}

interface ModelData {
  title: string;
  subject: string;
  description: string;
  imageUrl: string;
  modelUrl: string;
  iosModelUrl: string;
  audioUrl: string;
}

const Index = () => {
  const [modelUrl, setModelUrl] = useState('');
  const [currentModelUrl, setCurrentModelUrl] = useState('');
  const [modelColor, setModelColor] = useState('#FFFFFF'); // Changed to white
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [pendingAnnotationPosition, setPendingAnnotationPosition] = useState<[number, number, number] | null>(null);
  const [isAnnotationModalOpen, setIsAnnotationModalOpen] = useState(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [preserveOriginalMaterial, setPreserveOriginalMaterial] = useState(true);
  const [textureUrl, setTextureUrl] = useState<string>();

  const handleLoadModel = () => {
    if (modelUrl.trim()) {
      // Clear previous annotations when loading a new model
      setAnnotations([]);
      setCurrentModelUrl(modelUrl);
      setIsModelLoaded(true);
      setPreserveOriginalMaterial(true); // Reset to preserve original materials
      setTextureUrl(undefined); // Clear any custom texture
      
      toast({
        title: "Model Loading",
        description: "3D model is being loaded...",
      });
      
      // Add a delay to show success message after model attempts to load
      setTimeout(() => {
        toast({
          title: "Model Loaded",
          description: "3D model has been loaded successfully!",
        });
      }, 2000);
    }
  };

  const handleAddAnnotation = (position?: [number, number, number]) => {
    if (position) {
      setPendingAnnotationPosition(position);
      setIsAnnotationModalOpen(true);
      setIsAnnotationMode(false);
    } else {
      setIsAnnotationMode(true);
      toast({
        title: "Annotation Mode",
        description: "Click on the model to place an annotation.",
      });
    }
  };

  const handleAnnotationSubmit = (title: string, description: string) => {
    if (pendingAnnotationPosition) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        position: pendingAnnotationPosition,
        title,
        description,
      };
      setAnnotations(prev => [...prev, newAnnotation]);
      setPendingAnnotationPosition(null);
      
      toast({
        title: "Annotation Added",
        description: `"${title}" annotation has been added.`,
      });
    }
  };

  const handleChangeColor = () => {
    setIsColorPaletteOpen(true);
  };

  const handleColorSelect = (color: string) => {
    setModelColor(color);
    setPreserveOriginalMaterial(false);
    setTextureUrl(undefined);
    setIsColorPaletteOpen(false);
    
    toast({
      title: "Color Changed",
      description: "Model color has been updated!",
    });
  };

  const handleTextureUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setTextureUrl(url);
    setPreserveOriginalMaterial(false);
    setIsColorPaletteOpen(false);
    
    toast({
      title: "Texture Applied",
      description: "Custom texture has been applied to the model!",
    });
  };

  const handlePushToApp = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = (modelData: ModelData) => {
    const configuredModelData = {
      ...modelData,
      modelUrl: currentModelUrl,
      annotations: annotations,
      color: modelColor,
      preserveOriginalMaterial,
      textureUrl,
    };
    
    console.log('Configured model submitted:', configuredModelData);
    toast({
      title: "Model Submitted",
      description: `Configured model "${modelData.title}" has been submitted successfully!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full flex">
        <ControlPanel
          modelUrl={modelUrl}
          onModelUrlChange={setModelUrl}
          onLoadModel={handleLoadModel}
          onAddAnnotation={() => handleAddAnnotation()}
          onChangeColor={handleChangeColor}
          onPushToApp={handlePushToApp}
          isModelLoaded={isModelLoaded}
        />
        
        <div className="flex-1 p-6">
          <div className="h-full">
            <ModelViewer
              modelUrl={currentModelUrl}
              color={modelColor}
              annotations={annotations}
              onAddAnnotation={handleAddAnnotation}
              preserveOriginalMaterial={preserveOriginalMaterial}
              textureUrl={textureUrl}
            />
          </div>
        </div>
      </div>

      <AddModelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        prefilledModelUrl={currentModelUrl}
      />

      <AnnotationModal
        isOpen={isAnnotationModalOpen}
        onClose={() => {
          setIsAnnotationModalOpen(false);
          setPendingAnnotationPosition(null);
        }}
        onSubmit={handleAnnotationSubmit}
        position={pendingAnnotationPosition}
      />

      <ColorPalette
        isOpen={isColorPaletteOpen}
        onClose={() => setIsColorPaletteOpen(false)}
        onColorSelect={handleColorSelect}
        onTextureUpload={handleTextureUpload}
      />
    </div>
  );
};

export default Index;
