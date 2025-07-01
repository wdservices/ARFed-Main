import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card specific imports
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
  buttonStyle?: React.CSSProperties;
  outlineButtonStyle?: React.CSSProperties;
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
  isModelLoaded = false,
  buttonStyle = {},
  outlineButtonStyle = {},
}) => {
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
            className="w-full shadow-sm"
            style={buttonStyle}
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
                style={outlineButtonStyle}
              >
                <Plus className="mr-2" size={16} />
                Add Annotation
              </Button>
              
              <Button 
                onClick={handleChangeColor}
                variant="outline" // Changed to outline
                className="w-full justify-start shadow-sm"
                style={outlineButtonStyle}
              >
                <Palette className="mr-2" size={16} />
                Change Color
              </Button>
              
              <Button 
                onClick={handleExportToApp}
                variant="outline" // Changed to outline
                className="w-full justify-start shadow-sm"
                style={outlineButtonStyle}
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
