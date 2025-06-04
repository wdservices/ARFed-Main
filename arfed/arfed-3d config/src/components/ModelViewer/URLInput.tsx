
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, Pencil, Palette } from 'lucide-react';

interface URLInputProps {
  inputUrl: string;
  setInputUrl: (url: string) => void;
  handleLoadModel: () => void;
  isLoading: boolean;
  handleAddAnnotation: () => void;
  handleExportToApp: () => void;
  handleChangeColor: () => void;
}

const URLInput: React.FC<URLInputProps> = ({
  inputUrl,
  setInputUrl,
  handleLoadModel,
  isLoading,
  handleAddAnnotation,
  handleExportToApp,
  handleChangeColor
}) => {
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 w-80">
      <h2 className="text-white text-lg font-bold mb-4">ARFed Controls</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="model-url" className="text-white text-sm font-medium">
            Model URL (.glb or .gltf)
          </label>
          <Input
            id="model-url"
            placeholder="https://example.com/model.glb"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white"
          />
        </div>
        
        <Button
          onClick={handleLoadModel}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Load Model
            </>
          )}
        </Button>
        
        <div className="pt-4 border-t border-gray-800">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleAddAnnotation}
              variant="outline"
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Add Annotation
            </Button>
            
            <Button
              onClick={handleChangeColor}
              variant="outline"
              className="bg-gradient-to-r from-pink-500 to-orange-600 hover:from-pink-600 hover:to-orange-700 text-white border-0"
            >
              <Palette className="mr-2 h-4 w-4" />
              Change Color
            </Button>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-800">
          <Button
            onClick={handleExportToApp}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
          >
            Deploy to App
          </Button>
        </div>
      </div>
    </div>
  );
};

export default URLInput;
