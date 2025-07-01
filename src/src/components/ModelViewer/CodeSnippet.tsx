import React, { useMemo } from 'react';
import { Copy, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Annotation } from './ModelCanvas';

interface CodeSnippetProps {
  modelUrl: string;
  modelColor: string;
  annotations: Annotation[];
  isModelLoaded: boolean;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({
  modelUrl,
  modelColor,
  annotations,
  isModelLoaded
}) => {
  const generatedCode = useMemo(() => {
    if (!isModelLoaded || !modelUrl) {
      return `// Load a 3D model to see the generated code
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const ModelViewer = () => {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {/* Load your 3D model here */}
    </Canvas>
  );
};

export default ModelViewer;`;
    }

    const annotationsCode = annotations.length > 0 
      ? annotations.map((annotation, index) => `
  // Annotation ${index + 1}: ${annotation.title}
  <AnnotationMarker
    id="${annotation.id}"
    position={[${annotation.position.x.toFixed(2)}, ${annotation.position.y.toFixed(2)}, ${annotation.position.z.toFixed(2)}]}
    title="${annotation.title}"
    content="${annotation.content}"
  />`).join('')
      : '';

    return `import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Model component
const Model = () => {
  const { scene } = useGLTF('${modelUrl}');
  
  // Apply model color
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: '${modelColor}',
      });
    }
  });
  
  return <primitive object={scene} />;
};

// Annotation marker component
const AnnotationMarker = ({ position, title, content }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05]} />
      <meshBasicMaterial color="red" />
      {/* Add your annotation UI here */}
    </mesh>
  );
};

// Main ModelViewer component
const ModelViewer = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true }}
      >
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={100}
        />
        
        {/* Lighting setup */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} />
        <pointLight position={[10, 0, 10]} intensity={1.5} />
        <pointLight position={[-10, 0, -10]} intensity={1.5} />
        
        <Suspense fallback={null}>
          <Model />${annotationsCode}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;`;
  }, [modelUrl, modelColor, annotations, isModelLoaded]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Code Copied",
        description: "The generated code has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Generated Code</h3>
        </div>
        <Button
          onClick={handleCopyCode}
          variant="outline"
          size="sm"
          className="h-8 px-3"
        >
          <Copy size={14} className="mr-1" />
          Copy
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 w-full">
          <pre className="p-4 text-xs text-foreground font-mono bg-muted/50 overflow-x-auto">
            <code>{generatedCode}</code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CodeSnippet;
