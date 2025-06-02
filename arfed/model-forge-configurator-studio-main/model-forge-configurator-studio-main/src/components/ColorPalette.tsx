
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ColorPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  onTextureUpload: (file: File) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ 
  isOpen, 
  onClose, 
  onColorSelect, 
  onTextureUpload 
}) => {
  const colors = [
    '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', 
    '#3B82F6', '#EC4899', '#6366F1', '#F97316',
    '#84CC16', '#06B6D4', '#8B5A2B', '#64748B'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onTextureUpload(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 w-80 border border-white/30 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Choose Color</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          {colors.map((color) => (
            <button
              key={color}
              className="w-12 h-12 rounded border-2 border-white/50 hover:border-gray-400 shadow-lg transition-all hover:scale-105"
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
            />
          ))}
        </div>

        <div className="border-t border-white/30 pt-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">Upload Texture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full text-sm bg-white/70 p-2 rounded border border-white/30"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
