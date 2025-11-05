'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Gltf, Bounds, useGLTF } from '@react-three/drei';
import { furniture as allFurniture } from '@/app/data/furnitureData';
import Room3D from './Room3D'

// Preload models for better performance
allFurniture.forEach(item => useGLTF.preload(item.file));

// Reusable component to load and display a furniture model
function FurnitureModel({ file, position }) {
  return <Gltf src={file} position={position} castShadow receiveShadow />;
}

// Component to create the floor of the room
function Room({ aiDepth }) {
  const floorWidth = 8;
  const floorDepth = aiDepth || 8; // Use AI-driven depth or a default value

  return (
    <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[floorWidth, floorDepth]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  );
}

export default function SceneViewer({ results, furnitureInScene, roomConfig }) {
  // Default room config if not provided
  const defaultRoomConfig = {
    width: 5,
    depth: 4,
    height: 3,
    targetWall: 'front'
  };
  
  const activeRoomConfig = roomConfig || defaultRoomConfig;

  return (
    <div className="w-2/3 h-screen bg-gray-200 relative">
      {/* Display depth map if available */}
      {results?.depthMapUrl && (
        <div className="absolute top-4 right-4 z-10 bg-white p-2 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold mb-2">Depth Map</h3>
          <img 
            src={results.depthMapUrl} 
            alt="Depth Map" 
            className="w-64 h-auto rounded"
          />
          {results.colors && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">Extracted Colors:</p>
              <div className="flex gap-1">
                {results.colors.map((color, idx) => (
                  <div 
                    key={idx} 
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <Canvas shadows camera={{ position: [0, 1.6, 0], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={0.8} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <pointLight position={[0, 2, 0]} intensity={0.4} />
        <OrbitControls 
          makeDefault 
          enableDamping 
          dampingFactor={0.05}
          minDistance={0.5}
          maxDistance={8}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
          target={[0, 1.5, -1]}
        />

        {/* Show 3D room with textured walls */}
        {results && roomConfig ? (
          <Room3D roomConfig={activeRoomConfig} results={results} />
        ) : (
          <Room aiDepth={8} />
        )}
        
        <Bounds fit clip observe margin={1.2}>
          {furnitureInScene.map((item) => (
            <FurnitureModel key={item.instanceId} file={item.file} position={item.position} />
          ))}
        </Bounds>
      </Canvas>
    </div>
  );
}
