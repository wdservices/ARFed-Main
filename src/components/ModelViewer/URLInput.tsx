import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card specific imports
import { Download, Plus, Palette } from 'lucide-react';
import CodeSnippet from './CodeSnippet';
import { toast } from '@/components/ui/use-toast';
import * as THREE from 'three';

// Define Annotation type locally since it is no longer exported from ModelCanvas
export type Annotation = {
  id: string;
  position: any; // Use any for Vector3, or import THREE if needed
  content: string;
  title: string;
};

interface URLInputProps {
  inputUrl: string;
  setInputUrl: (url: string) => void;
  handleLoadModel: () => void;
  isLoading: boolean;
  handleAddAnnotation: () => void;
  handleExportToApp: () => void;
  handleChangeColor: () => void;
  modelUrl?: string;
  modelColor?: string;
  annotations?: Annotation[];
  isModelLoaded?: boolean;
}

const URLInput: React.FC<URLInputProps> = ({
  inputUrl,
  setInputUrl,
  handleLoadModel,
  isLoading,
  handleAddAnnotation,
  handleExportToApp,
  handleChangeColor,
  modelUrl = '',
  modelColor = '#ffffff',
  annotations = [],
  isModelLoaded = false
}) => {
  // Add test annotation function
  const handleAddTestAnnotation = () => {
    if (!isModelLoaded) {
      toast({
        title: "No Model Loaded",
        description: "Please load a model before adding test annotations",
        variant: "destructive",
      });
      return;
    }
    
    // Create a test annotation at a visible position
    const testAnnotation = {
      id: `test-${Date.now()}`,
      position: new THREE.Vector3(0, 0, 0),
      title: "Test Annotation",
      content: "This is a test annotation to verify visibility. If you can see this, annotations are working correctly!"
    };
    
    // Dispatch event to add the test annotation
    window.dispatchEvent(new CustomEvent('add-test-annotation', {
      detail: { annotation: testAnnotation }
    }));
    
    toast({
      title: "Test Annotation Added",
      description: "A test annotation has been added at the center of the model",
    });
  };

  return (
    <div className="w-80 flex flex-col gap-4">
      <Card className="shadow-lg"> {/* Removed bg-white and border-gray-200, Card handles this */}
        <CardHeader>
          <CardTitle className="text-xl">3D Model Controls</CardTitle> {/* CardTitle handles text color */}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="model-url-input" className="block text-sm font-medium text-foreground mb-2"> {/* Changed text-gray-700 */}
              Model URL (.glb or .gltf)
            </label>
            <input
              id="model-url-input"
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter model URL..."
              className="w-full input-field shadow-sm" // Used input-field class, removed inline styles
            />
          </div>
          
          <Button 
            onClick={handleLoadModel} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-purple-600 text-primary-foreground hover:opacity-90 shadow-sm" // text-white is fine for primary buttons
          >
            {isLoading ? "Loading..." : "Load Model"}
          </Button>
        
          <div className="mt-6 pt-6 border-t border-border"> {/* Changed border-gray-200 */}
            <h3 className="text-lg font-medium text-foreground mb-4">Model Actions</h3> {/* Changed text-gray-900 */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddAnnotation}
                variant="outline" // Changed to outline for better distinction, can be reverted if not desired
                className="w-full justify-start shadow-sm"
              >
                <Plus className="mr-2" size={16} />
                Add Annotation
              </Button>
              
              <Button 
                onClick={handleAddTestAnnotation}
                variant="outline"
                className="w-full justify-start shadow-sm bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
              >
                <Plus className="mr-2" size={16} />
                Add Test Annotation
              </Button>
              
              <Button 
                onClick={handleChangeColor}
                variant="outline" // Changed to outline
                className="w-full justify-start shadow-sm"
              >
                <Palette className="mr-2" size={16} />
                Change Color
              </Button>
              
              <Button 
                onClick={handleExportToApp}
                variant="outline" // Changed to outline
                className="w-full justify-start shadow-sm"
              >
                <Download className="mr-2" size={16} />
                Export to App
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Snippet Section */}
      <CodeSnippet
        modelUrl={modelUrl}
        modelColor={modelColor}
        annotations={annotations}
        isModelLoaded={isModelLoaded}
      />
    </div>
  );
};

export default URLInput;
