
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Plus, Palette } from 'lucide-react';
import CodeSnippet from './CodeSnippet';
import { Annotation } from './ModelCanvas';

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
  return (
    <div className="w-80 flex flex-col gap-4">
      <Card className="p-6 bg-white border border-gray-200 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">3D Model Controls</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model URL (.glb or .gltf)
            </label>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter model URL..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              style={{ backgroundColor: '#ffffff', color: '#111827' }}
            />
          </div>
          
          <Button 
            onClick={handleLoadModel} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90 shadow-sm"
          >
            {isLoading ? "Loading..." : "Load Model"}
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Model Actions</h3>
          <div className="space-y-3">
            <Button 
              onClick={handleAddAnnotation}
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90 justify-start shadow-sm"
            >
              <Plus className="mr-2" size={16} />
              Add Annotation
            </Button>
            
            <Button 
              onClick={handleChangeColor}
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90 justify-start shadow-sm"
            >
              <Palette className="mr-2" size={16} />
              Change Color
            </Button>
            
            <Button 
              onClick={handleExportToApp}
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90 justify-start shadow-sm"
            >
              <Download className="mr-2" size={16} />
              Export to App
            </Button>
          </div>
        </div>
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
