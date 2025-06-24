
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Camera, CameraOff, Upload } from 'lucide-react';

interface ARMarkerProps {
  modelUrl: string;
  isModelLoaded: boolean;
}

const ARMarker: React.FC<ARMarkerProps> = ({ modelUrl, isModelLoaded }) => {
  const [markerImage, setMarkerImage] = useState<string | null>(null);
  const [isARActive, setIsARActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const arContainerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setMarkerImage(event.target?.result as string);
      toast({
        title: "Marker Uploaded",
        description: "AR marker image has been uploaded",
      });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const toggleAR = () => {
    if (!isModelLoaded) {
      toast({
        title: "No Model Loaded",
        description: "Please load a 3D model before activating AR",
        variant: "destructive",
      });
      return;
    }

    if (!markerImage) {
      toast({
        title: "No Marker Image",
        description: "Please upload a marker image before activating AR",
        variant: "destructive",
      });
      return;
    }

    setIsARActive(!isARActive);
    
    if (!isARActive) {
      toast({
        title: "AR Mode Activated",
        description: "Point your camera at the marker image",
      });
      initializeAR();
    } else {
      cleanupAR();
      toast({
        title: "AR Mode Deactivated",
        description: "Returning to normal view",
      });
    }
  };

  const initializeAR = async () => {
    try {
      console.log("Initializing AR with model:", modelUrl);
      console.log("Using marker image:", markerImage);
      
      // In a real implementation, we would initialize the AR.js or MindAR library here
      // For this demo, we're just showing a placeholder
      if (arContainerRef.current) {
        arContainerRef.current.style.display = 'flex';
      }
      
      // Placeholder for AR initialization code
      // This would typically involve setting up AR.js or MindAR with the marker image
      // and loading the 3D model
    } catch (error) {
      console.error("Error initializing AR:", error);
      setIsARActive(false);
      toast({
        title: "AR Initialization Failed",
        description: "Could not initialize AR mode",
        variant: "destructive",
      });
    }
  };

  const cleanupAR = () => {
    // Cleanup AR resources
    if (arContainerRef.current) {
      arContainerRef.current.style.display = 'none';
    }
    // In a real implementation, we would clean up AR.js or MindAR resources here
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (isARActive) {
        cleanupAR();
      }
    };
  }, [isARActive]);

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <Button 
            onClick={triggerFileInput} 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            disabled={isARActive}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Marker Image
          </Button>
          <Button
            onClick={toggleAR}
            className={`${
              isARActive 
                ? "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700" 
                : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
            } text-white`}
            disabled={!isModelLoaded || !markerImage}
          >
            {isARActive ? (
              <>
                <CameraOff className="mr-2 h-4 w-4" />
                Deactivate AR
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Activate AR
              </>
            )}
          </Button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {markerImage && !isARActive && (
          <div className="mt-4 bg-black/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-white mb-2 font-medium">AR Marker Image:</p>
            <div className="relative w-full max-w-[200px] h-[150px] overflow-hidden rounded-lg border border-gray-700">
              <img 
                src={markerImage} 
                alt="AR Marker" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {isARActive && (
          <div 
            ref={arContainerRef}
            className="mt-4 bg-black/50 backdrop-blur-md rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="text-center">
              <p className="text-white text-lg mb-2">AR Mode Active</p>
              <p className="text-gray-300 text-sm">
                Point your device's camera at the marker image to see the 3D model in augmented reality.
              </p>
              <div className="mt-4 bg-black/30 p-2 rounded-lg inline-block">
                <p className="text-yellow-400 text-xs">
                  This is a placeholder for the AR view. In a full implementation, 
                  the camera feed would be shown here with the 3D model superimposed 
                  on the marker image.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ARMarker;
