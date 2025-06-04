
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import * as THREE from 'three';
import { toast } from '@/components/ui/use-toast';

export type Animation = {
  clip: THREE.AnimationClip;
  action: THREE.AnimationAction;
  name: string;
};

type AnimationControlsProps = {
  object: THREE.Object3D | null;
  mixer: THREE.AnimationMixer | null;
  onAnimationChange: (animations: Animation[]) => void;
};

const AnimationControls: React.FC<AnimationControlsProps> = ({ 
  object, 
  mixer, 
  onAnimationChange 
}) => {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [selectedAnimation, setSelectedAnimation] = useState<Animation | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [customName, setCustomName] = useState<string>('');
  
  // Initialize animations when object changes
  useEffect(() => {
    if (!object || !mixer) return;

    try {
      // Get animations from the object
      const modelAnimations = object.animations || [];
      
      if (modelAnimations.length === 0) {
        console.log("No animations found in the model");
        return;
      }
      
      const newAnimations: Animation[] = modelAnimations.map(clip => {
        const action = mixer.clipAction(clip);
        return {
          clip,
          action,
          name: clip.name || 'Unnamed Animation'
        };
      });
      
      setAnimations(newAnimations);
      onAnimationChange(newAnimations);
      
      if (newAnimations.length > 0) {
        setSelectedAnimation(newAnimations[0]);
        toast({
          title: "Animations Found",
          description: `Found ${newAnimations.length} animations in the model`
        });
      }
    } catch (error) {
      console.error("Error setting up animations:", error);
    }
  }, [object, mixer, onAnimationChange]);

  const playAnimation = (animation: Animation) => {
    if (!mixer) return;
    
    // Stop all animations first
    animations.forEach(anim => {
      anim.action.stop();
    });
    
    // Configure and play the selected animation
    animation.action.setLoop(isLooping ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    animation.action.clampWhenFinished = !isLooping;
    animation.action.timeScale = playbackSpeed;
    animation.action.play();
    
    setSelectedAnimation(animation);
    
    toast({
      title: "Animation Playing",
      description: `Playing ${animation.name}`
    });
  };

  const stopAllAnimations = () => {
    if (!mixer) return;
    
    animations.forEach(anim => {
      anim.action.stop();
    });
    
    setSelectedAnimation(null);
    
    toast({
      title: "Animations Stopped",
      description: "All animations have been stopped"
    });
  };

  const updatePlaybackSpeed = (value: number[]) => {
    const speed = value[0];
    setPlaybackSpeed(speed);
    
    if (selectedAnimation && selectedAnimation.action) {
      selectedAnimation.action.timeScale = speed;
    }
  };

  const toggleLooping = (value: boolean) => {
    setIsLooping(value);
    
    if (selectedAnimation && selectedAnimation.action) {
      selectedAnimation.action.setLoop(value ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
      selectedAnimation.action.clampWhenFinished = !value;
    }
  };

  const createCustomAnimation = () => {
    if (!customName || !selectedAnimation || !mixer) return;
    
    // Create a custom animation by cloning the selected animation
    try {
      const originalClip = selectedAnimation.clip;
      const customClip = THREE.AnimationClip.parse(THREE.AnimationClip.toJSON(originalClip));
      customClip.name = customName;
      
      const customAction = mixer.clipAction(customClip);
      
      const newAnimation: Animation = {
        clip: customClip,
        action: customAction,
        name: customName
      };
      
      const updatedAnimations = [...animations, newAnimation];
      setAnimations(updatedAnimations);
      onAnimationChange(updatedAnimations);
      setSelectedAnimation(newAnimation);
      setCustomName('');
      
      toast({
        title: "Custom Animation Created",
        description: `Created "${customName}" animation`
      });
    } catch (error) {
      console.error("Error creating custom animation:", error);
      
      toast({
        title: "Error",
        description: "Failed to create custom animation",
        variant: "destructive"
      });
    }
  };

  if (animations.length === 0) {
    return (
      <div className="p-4 border rounded-md bg-muted/30">
        <p className="text-sm text-muted-foreground">
          No animations found in this model. Try loading a model with animations.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4 border rounded-md bg-muted/30">
      <h3 className="font-medium">Animation Controls</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {animations.map((animation, index) => (
          <Button
            key={index}
            variant={selectedAnimation === animation ? "default" : "outline"}
            onClick={() => playAnimation(animation)}
            className="justify-start overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {animation.name}
          </Button>
        ))}
      </div>
      
      <div className="space-y-4 mt-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Playback Speed: {playbackSpeed.toFixed(1)}x</span>
          </div>
          <Slider
            defaultValue={[1]}
            min={0.1}
            max={2}
            step={0.1}
            value={[playbackSpeed]}
            onValueChange={updatePlaybackSpeed}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            checked={isLooping}
            onCheckedChange={toggleLooping}
            id="loop-mode"
          />
          <label htmlFor="loop-mode" className="text-sm cursor-pointer">
            Loop Animation
          </label>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Custom animation name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={createCustomAnimation}
              disabled={!customName || !selectedAnimation}
              variant="outline"
              size="sm"
            >
              Create
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Create a custom animation based on the selected one
          </p>
        </div>
      </div>
      
      <Button 
        variant="secondary" 
        onClick={stopAllAnimations}
      >
        Stop All Animations
      </Button>
    </div>
  );
};

export default AnimationControls;
