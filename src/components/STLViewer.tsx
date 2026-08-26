import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { X } from 'lucide-react';

function Model({ url, materialColor }: { url: string, materialColor: string }) {
  const geometry = useLoader(STLLoader, url);
  
  useMemo(() => {
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();
    geometry.center();
  }, [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial 
        color={materialColor} 
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

export default function STLViewer({ file, onClose }: { file: File, onClose: () => void }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200">
      <div className="bg-surface-dark border border-white/10 rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden shadow-premium relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-card absolute top-0 w-full z-10">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">3D Preview</h3>
            <span className="text-xs font-medium bg-primary-500/20 text-primary-400 px-2 py-1 rounded-md border border-primary-500/20">
              {file.name}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative bg-gradient-to-b from-surface-dark to-black mt-[68px]">
          <Canvas shadows camera={{ position: [0, 0, 100], fov: 45 }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.5} adjustCamera>
                <Model url={url} materialColor="#e2e8f0" />
              </Stage>
            </Suspense>
            <OrbitControls 
              makeDefault 
              enableDamping={false}
              rotateSpeed={0.8}
              zoomSpeed={0.8}
              panSpeed={0.8}
            />
          </Canvas>

          {/* Performance Status */}
          <div className="absolute bottom-4 left-4 text-xs text-gray-500 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/5">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
            60 FPS Mode • Interactive Viewer
          </div>
        </div>
      </div>
    </div>
  );
}
