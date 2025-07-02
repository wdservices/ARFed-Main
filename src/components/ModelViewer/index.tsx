import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import * as THREE from 'three';
import { Animation } from '../AnimationControls';
import URLInput from './URLInput';
import ModelCanvas from './ModelCanvas';
import AnnotationForm from './AnnotationForm';
import ColorPicker from './ColorPicker';
import ExportModal from './ExportModal';

// Define Annotation type locally since it is no longer exported from ModelCanvas
export type Annotation = {
  id: string;
  position: any; // Use any for Vector3, or import THREE if needed
  content: string;
  title: string;
};

// Main ModelViewer component
const ModelViewer = ({ subjects = [] }) => {
  const [modelUrl, setModelUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [modelScale, setModelScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [newAnnotationPosition, setNewAnnotationPosition] = useState<THREE.Vector3 | null>(null);
  const [newAnnotationContent, setNewAnnotationContent] = useState('');
  const [newAnnotationTitle, setNewAnnotationTitle] = useState('');
  const [activeModel, setActiveModel] = useState<THREE.Object3D | null>(null);
  const [animationMixer, setAnimationMixer] = useState<THREE.AnimationMixer | null>(null);
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [showAnimationControls, setShowAnimationControls] = useState<boolean>(false);
  const [modelColor, setModelColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasModelLoadedRef = useRef<boolean>(false);

  // Setup event listeners for annotation positioning
  useEffect(() => {
    const handleAnnotationPosition = (event: CustomEvent) => {
      setNewAnnotationPosition(event.detail.position);
    };
    
    const handleAnnotationSet = () => {
      setIsAddingAnnotation(false);
    };
    
    window.addEventListener('annotation-position-selected', handleAnnotationPosition as EventListener);
    window.addEventListener('annotation-position-set', handleAnnotationSet);
    
    return () => {
      window.removeEventListener('annotation-position-selected', handleAnnotationPosition as EventListener);
      window.removeEventListener('annotation-position-set', handleAnnotationSet);
    };
  }, []);

  // Handle URL input and load model
  const handleLoadModel = () => {
    if (!inputUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a valid model URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIsModelLoaded(false);
    hasModelLoadedRef.current = false;
    setAnnotations([]);
    setModelUrl(inputUrl);
    
    // Log the URL for debugging
    console.log("Loading model from URL:", inputUrl);
  };

  // Handle model loaded successfully
  const handleModelLoaded = () => {
    // Only show toast and update state if this is the first time loading
    if (!hasModelLoadedRef.current) {
      setIsLoading(false);
      setIsModelLoaded(true);
      hasModelLoadedRef.current = true;
      toast({
        title: "Success",
        description: "Model loaded successfully",
      });
      console.log("Model loaded successfully");
    }
  };

  // Handle model loading error
  const handleModelError = (error: Error) => {
    console.error("Error loading model:", error);
    setIsLoading(false);
    setIsModelLoaded(false);
    hasModelLoadedRef.current = false;
    setModelUrl(''); // Reset model URL on error
    toast({
      title: "Error Loading Model",
      description: error.message || "Failed to load the 3D model. Make sure the URL is correct and the model is in a supported format (.glb or .gltf).",
      variant: "destructive",
    });
  };

  // Handle animation setup
  const handleAnimationSetup = (model: THREE.Object3D, mixer: THREE.AnimationMixer) => {
    setActiveModel(model);
    setAnimationMixer(mixer);
    setShowAnimationControls(true);
  };
  
  // Handle animation change
  const handleAnimationChange = (newAnimations: Animation[]) => {
    setAnimations(newAnimations);
  };

  // Handle adding a new annotation
  const handleAddAnnotation = () => {
    if (!isModelLoaded) {
      toast({
        title: "No Model Loaded",
        description: "Please load a model before adding annotations",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddingAnnotation(true);
    toast({
      title: "Add Annotation",
      description: "Click on the model to place an annotation",
    });
  };

  // Toggle color picker
  const handleToggleColorPicker = () => {
    if (!isModelLoaded) {
      toast({
        title: "No Model Loaded",
        description: "Please load a model before changing colors",
        variant: "destructive",
      });
      return;
    }
    
    setShowColorPicker(!showColorPicker);
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    setModelColor(color);
    setShowColorPicker(false);
  };

  // Handle canvas click when adding annotation
  const handleCanvasClick = (event: React.MouseEvent) => {
    if (!isAddingAnnotation || !canvasRef.current) return;

    // Calculate mouse position in normalized device coordinates
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    const y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

    // Raycasting is handled inside the Scene component
    console.log("Canvas clicked at:", { x, y });
  };

  // Finish adding an annotation
  const handleSaveAnnotation = () => {
    if (!newAnnotationPosition) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      position: newAnnotationPosition,
      content: newAnnotationContent || "No description added",
      title: newAnnotationTitle || "Annotation",
    };

    setAnnotations([...annotations, newAnnotation]);
    setNewAnnotationPosition(null);
    setNewAnnotationContent("");
    setNewAnnotationTitle("");
    setIsAddingAnnotation(false);

    toast({
      title: "Annotation Added",
      description: "Your annotation has been added to the model",
    });
  };

  // Cancel adding an annotation
  const handleCancelAnnotation = () => {
    setIsAddingAnnotation(false);
    setNewAnnotationPosition(null);
    setNewAnnotationContent("");
    setNewAnnotationTitle("");
  };

  // Delete an annotation
  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter((ann) => ann.id !== id));
    toast({
      title: "Annotation Deleted",
      description: "The annotation has been removed",
    });
  };

  // Change model color
  const handleChangeColor = () => {
    // Generate a random color for demonstration
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    setModelColor(randomColor);
    
    toast({
      title: "Color Changed",
      description: "Model color has been updated",
    });
  };

  // Export to app
  const handleExportToApp = () => {
    if (!isModelLoaded) {
      toast({
        title: "No Model Loaded",
        description: "Please load a model before exporting",
        variant: "destructive",
      });
      return;
    }

    setShowExportModal(true);
  };

  // Handle export submission
  const handleExportSubmit = (config) => {
    console.log("Exporting model with config:", config);
    toast({
      title: "Model Exported",
      description: "Model and annotations have been exported to your app",
    });
    setShowExportModal(false);
  };

  return (
    <div
      className="flex flex-row h-full w-full gap-4"
      style={{ background: '#0f172a', minHeight: '100vh', padding: 24 }}
    >
      {/* Left sidebar with controls */}
      <div
        style={{
          background: '#111827',
          borderRadius: 12,
          boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
          border: '1px solid #1e293b',
          padding: 16,
          minWidth: 320,
          maxWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          color: '#fff',
        }}
      >
        <URLInput 
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
          handleLoadModel={handleLoadModel}
          isLoading={isLoading}
          handleAddAnnotation={handleAddAnnotation}
          handleExportToApp={handleExportToApp}
          handleChangeColor={handleToggleColorPicker}
          modelUrl={modelUrl}
          modelColor={modelColor}
          annotations={annotations}
          isModelLoaded={isModelLoaded}
        />
      </div>
      {/* Color Picker */}
      {showColorPicker && (
        <ColorPicker 
          currentColor={modelColor}
          onColorSelect={handleColorChange}
          onClose={() => setShowColorPicker(false)}
        />
      )}
      {/* Model Canvas */}
      <div className="flex-1 flex flex-col" style={{ background: '#f1f5f9', borderRadius: 12, minHeight: 600 }}>
        <ModelCanvas
          canvasRef={canvasRef}
          modelUrl={modelUrl}
          modelScale={modelScale}
          isLoading={isLoading}
          isModelLoaded={isModelLoaded}
          annotations={annotations}
          isAddingAnnotation={isAddingAnnotation}
          handleModelLoaded={handleModelLoaded}
          handleModelError={handleModelError}
          handleAnimationSetup={handleAnimationSetup}
          handleCanvasClick={handleCanvasClick}
          handleDeleteAnnotation={handleDeleteAnnotation}
          modelColor={modelColor}
        />
      </div>
      {/* Annotation Form */}
      <AnnotationForm
        position={newAnnotationPosition as THREE.Vector3}
        title={newAnnotationTitle}
        setTitle={setNewAnnotationTitle}
        content={newAnnotationContent}
        setContent={setNewAnnotationContent}
        onSave={handleSaveAnnotation}
        onCancel={handleCancelAnnotation}
      />
      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        modelUrl={modelUrl}
        modelColor={modelColor}
        annotations={annotations}
        subjects={subjects}
        onExport={(config) => {
          toast({ title: 'Model Exported', description: 'Model and annotations have been exported to your app' });
        }}
      />
    </div>
  );
};

export default ModelViewer;
