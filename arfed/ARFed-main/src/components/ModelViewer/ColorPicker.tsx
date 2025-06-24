
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ColorPickerProps {
  currentColor: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onColorSelect, onClose }) => {
  // Predefined color palette
  const colorPalette = [
    '#ffffff', // White
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ff8000', // Orange
    '#8000ff', // Purple
    '#0080ff', // Light Blue
    '#ff0080', // Pink
    '#008000', // Dark Green
    '#800000', // Brown
    '#000000', // Black
    '#808080', // Gray
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute z-20 top-20 left-96 bg-white border border-gray-300 p-4 rounded-lg shadow-xl"
      style={{ backgroundColor: '#ffffff', color: '#111827' }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-gray-900 font-medium">Select Color</h3>
        <button 
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 max-w-xs">
        {colorPalette.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
              color === currentColor ? 'ring-2 ring-offset-2 ring-primary' : ''
            }`}
            style={{ backgroundColor: color, border: color === '#ffffff' ? '1px solid #ccc' : 'none' }}
            aria-label={`Color ${color}`}
          />
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-300">
        <label className="block text-gray-900 text-sm mb-1">Custom Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => onColorSelect(e.target.value)}
            className="w-8 h-8 rounded overflow-hidden cursor-pointer border border-gray-300"
          />
          <input
            type="text"
            value={currentColor}
            onChange={(e) => onColorSelect(e.target.value)}
            className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-sm text-gray-900"
            placeholder="#RRGGBB"
            style={{ backgroundColor: '#ffffff', color: '#111827' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ColorPicker;
