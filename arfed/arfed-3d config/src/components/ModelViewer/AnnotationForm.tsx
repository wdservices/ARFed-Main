
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Vector3 } from 'three';

interface AnnotationFormProps {
  position: Vector3;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const AnnotationForm: React.FC<AnnotationFormProps> = ({
  position,
  title,
  setTitle,
  content,
  setContent,
  onSave,
  onCancel
}) => {
  if (!position) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
    >
      <Card className="p-6 bg-black/80 backdrop-blur-md border border-gray-700 shadow-lg text-white">
        <h3 className="text-lg font-medium mb-4">Add Annotation</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Annotation title"
              className="w-full rounded-md border border-gray-700 bg-gray-800/60 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe this part of the model..."
              className="w-full rounded-md border border-gray-700 bg-gray-800/60 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={onCancel} variant="outline" className="border-gray-700 text-white hover:bg-gray-800">Cancel</Button>
            <Button onClick={onSave} className="bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90">Save Annotation</Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AnnotationForm;
