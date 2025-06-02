import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (modelData: ModelData) => void;
  prefilledModelUrl?: string;
}

interface ModelData {
  title: string;
  subject: string;
  description: string;
  imageUrl: string;
  modelUrl: string;
  iosModelUrl: string;
  audioUrl: string;
}

const AddModelModal: React.FC<AddModelModalProps> = ({ isOpen, onClose, onSubmit, prefilledModelUrl = '' }) => {
  const [formData, setFormData] = useState<ModelData>({
    title: '',
    subject: '',
    description: '',
    imageUrl: '',
    modelUrl: '',
    iosModelUrl: '',
    audioUrl: '',
  });

  useEffect(() => {
    if (prefilledModelUrl) {
      setFormData(prev => ({ ...prev, modelUrl: prefilledModelUrl }));
    }
  }, [prefilledModelUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      title: '',
      subject: '',
      description: '',
      imageUrl: '',
      modelUrl: '',
      iosModelUrl: '',
      audioUrl: '',
    });
  };

  const handleInputChange = (field: keyof ModelData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Add Model</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Enter Model Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <Select onValueChange={(value) => handleInputChange('subject', value)} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Textarea
                placeholder="Enter Model Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full min-h-[100px] resize-none"
                required
              />
            </div>

            <div>
              <Input
                placeholder="Enter Model Image URL"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Input
                placeholder="Enter Model URL"
                value={formData.modelUrl}
                onChange={(e) => handleInputChange('modelUrl', e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <Input
                placeholder="Enter IOS Model URL"
                value={formData.iosModelUrl}
                onChange={(e) => handleInputChange('iosModelUrl', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Input
                placeholder="Enter Model Audio URL"
                value={formData.audioUrl}
                onChange={(e) => handleInputChange('audioUrl', e.target.value)}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddModelModal;
