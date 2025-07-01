import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import * as THREE from 'three';
import { Animation } from '../AnimationControls';
import ModelCanvas, { Annotation } from './ModelCanvas';
import AnnotationForm from './AnnotationForm';
import ColorPicker from './ColorPicker';
import ExportModal from './ExportModal';

// Simplified ModelViewer component for admin modals
const SimpleModelViewer = ({ subjects = [], onModelSave }: { subjects?: any[], onModelSave?: (modelData: any) => void }) => {
  const [modelUrl, setModelUrl] = useState('');
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

  // Handle model loaded successfully
  const handleModelLoaded = () => {
    if (!hasModelLoadedRef.current) {
      setIsLoading(false);
      setIsModelLoaded(true);
      hasModelLoadedRef.current = true;
      toast({
        title: "Success",
        description: "Model loaded successfully",
      });
    }
  };

  // Handle model loading error
  const handleModelError = (error: Error) => {
    console.error("Error loading model:", error);
    setIsLoading(false);
    setIsModelLoaded(false);
    hasModelLoadedRef.current = false;
    setModelUrl('');
    toast({
      title: "Error Loading Model",
      description: error.message || "Failed to load the 3D model.",
      variant: "destructive",
    });
  };

  // Handle animation setup
  const handleAnimationSetup = (model: THREE.Object3D, mixer: THREE.AnimationMixer) => {
    setActiveModel(model);
    setAnimationMixer(mixer);
    setShowAnimationControls(true);
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

  // Handle color change
  const handleColorChange = (color: string) => {
    setModelColor(color);
    setShowColorPicker(false);
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

  // Handle export submission
  const handleExportSubmit = (config: any) => {
    console.log("Exporting model with config:", config);
    if (onModelSave) {
      onModelSave({
        modelUrl,
        modelColor,
        annotations,
        ...config
      });
    }
    toast({
      title: "Model Saved",
      description: "Model has been saved successfully",
    });
    setShowExportModal(false);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Simple header with basic controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center space-x-4">
          <input
            type="url"
            placeholder="Enter model URL (.glb or .gltf)"
            value={modelUrl}
            onChange={(e) => setModelUrl(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[300px]"
          />
          <button
            onClick={() => {
              if (modelUrl) {
                setIsLoading(true);
                setIsModelLoaded(false);
                hasModelLoadedRef.current = false;
                setAnnotations([]);
              }
            }}
            disabled={!modelUrl || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Load Model"}
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddAnnotation}
            disabled={!isModelLoaded}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Add Annotation
          </button>
          <button
            onClick={() => setShowColorPicker(true)}
            disabled={!isModelLoaded}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Change Color
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            disabled={!isModelLoaded}
            className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Save Model
          </button>
        </div>
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
      <div className="flex-1">
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
          handleCanvasClick={() => {}}
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
        onExport={handleExportSubmit}
        subjects={subjects}
      />
    </div>
  );
};

export default SimpleModelViewer; 