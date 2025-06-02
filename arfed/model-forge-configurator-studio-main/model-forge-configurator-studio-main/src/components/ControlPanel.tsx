
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload } from 'lucide-react';

interface ControlPanelProps {
  modelUrl: string;
  onModelUrlChange: (url: string) => void;
  onLoadModel: () => void;
  onAddAnnotation: () => void;
  onChangeColor: () => void;
  onPushToApp: () => void;
  isModelLoaded: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  modelUrl,
  onModelUrlChange,
  onLoadModel,
  onAddAnnotation,
  onChangeColor,
  onPushToApp,
  isModelLoaded,
}) => {
  return (
    <div className="w-64 bg-navy-900 backdrop-blur-md p-6 space-y-4 border-r border-white/20 shadow-lg" style={{ backgroundColor: '#1e3a8a' }}>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">AR</span>
          </div>
          <span className="text-white font-semibold">ARFed 3D Editor</span>
        </div>
        <div className="flex items-center justify-center space-x-4 text-sm text-white/70">
          <span>Load Model</span>
          <span>•</span>
          <span>Add Annotations</span>
          <span>•</span>
          <span>Deploy to App</span>
        </div>
      </div>

      <div className="space-y-3">
        <Input
          placeholder="Enter 3D model URL"
          value={modelUrl}
          onChange={(e) => onModelUrlChange(e.target.value)}
          className="bg-white border-2 border-white/30 text-gray-800 placeholder-gray-500 shadow-lg focus:border-white focus:ring-2 focus:ring-white/50"
        />
        
        <Button
          onClick={onLoadModel}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white shadow-lg border-0"
          disabled={!modelUrl.trim()}
          style={{ backgroundColor: '#1e3a8a' }}
        >
          Load Model
        </Button>
      </div>

      <div className="space-y-3">
        <Button
          onClick={onAddAnnotation}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white flex items-center justify-center space-x-2 shadow-lg border-0"
          disabled={!isModelLoaded}
          style={{ backgroundColor: '#1e3a8a' }}
        >
          <Plus size={16} />
          <span>Add Annotation</span>
        </Button>

        <Button
          onClick={onChangeColor}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white shadow-lg border-0"
          disabled={!isModelLoaded}
          style={{ backgroundColor: '#1e3a8a' }}
        >
          Change Color
        </Button>

        <Button
          onClick={onPushToApp}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white flex items-center justify-center space-x-2 shadow-lg border-0"
          disabled={!isModelLoaded}
          style={{ backgroundColor: '#1e3a8a' }}
        >
          <Upload size={16} />
          <span>Push to App</span>
        </Button>
      </div>

      <div className="mt-8 pt-8 border-t border-white/30">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg mx-auto flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-white/30 rounded shadow-inner"></div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
