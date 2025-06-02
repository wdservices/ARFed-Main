
import React from 'react';
import { X } from 'lucide-react';

interface AnnotationDisplayProps {
  annotation: {
    id: string;
    title: string;
    description: string;
    position: [number, number, number];
  } | null;
  onClose: () => void;
}

const AnnotationDisplay: React.FC<AnnotationDisplayProps> = ({ annotation, onClose }) => {
  if (!annotation) return null;

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{annotation.title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>
      <p className="text-gray-700 text-sm">{annotation.description}</p>
    </div>
  );
};

export default AnnotationDisplay;
