'use client';

import { Suspense, useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  TransformControls,
} from '@react-three/drei';

import { furniture as allFurniture } from '@/app/data/furnitureData';
import Room3D from './Room3D'

allFurniture.forEach(item => {
  useGLTF.preload(item.file); 
});

function InteractiveFurniture({ 
  item, 
  isSelected, 
  onSelect, 
  onUpdatePosition,
  roomConfig,
  transformMode,
  onUpdateFurnitureScale
}) {
  const transformControlsRef = useRef();
  const meshRef = useRef();

  const { scene } = useGLTF(item.file);
  const { controls: orbitControls } = useThree();

  const scaleAndOffset = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene.clone());
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = 1.0 / (maxDim + 1e-6);
    const floorOffset = -box.min.y;
    return { scale: scaleFactor, offset: floorOffset };
  }, [scene]);

  useEffect(() => {
    const controls = transformControlsRef.current;
    if (!controls) return;

    const onMouseUp = (event) => {
      if (event.mode === 'translate') {
        const newPos = event.target.object.position;
        
        if (newPos.y < 0) newPos.y = 0;

        if (roomConfig) {
          const halfWidth = roomConfig.width / 2;
          const halfDepth = roomConfig.depth / 2;
          if (newPos.x > halfWidth) newPos.x = halfWidth;
          if (newPos.x < -halfWidth) newPos.x = -halfWidth;
          if (newPos.z > halfDepth) newPos.z = halfDepth;
          if (newPos.z < -halfDepth) newPos.z = -halfDepth;
        }
        
        onUpdatePosition(item.instanceId, newPos);
      } 
      else if (event.mode === 'scale') {
        const newTotalScale = event.target.object.scale.x;
        const newUserScale = newTotalScale / scaleAndOffset.scale;
        onUpdateFurnitureScale(item.instanceId, newUserScale);
      }
    };

    const onDraggingChanged = (event) => {
      if (orbitControls) {
        orbitControls.enabled = !event.value;
      }
    };

    controls.addEventListener('mouseUp', onMouseUp);
    controls.addEventListener('dragging-changed', onDraggingChanged);

    return () => {
      controls.removeEventListener('mouseUp', onMouseUp);
      controls.removeEventListener('dragging-changed', onDraggingChanged);
    };
  }, [
    onUpdatePosition, 
    onUpdateFurnitureScale, 
    item.instanceId, 
    orbitControls, 
    roomConfig, 
    scaleAndOffset.scale
  ]);

  return (
    <TransformControls
      ref={transformControlsRef}
      enabled={isSelected}
      showY={transformMode === 'translate'}
      mode={transformMode}
      position={item.position}
    >
      <group
        ref={meshRef}

        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.instanceId);
        }}

        scale={[
          scaleAndOffset.scale * item.scale, 
          scaleAndOffset.scale * item.scale, 
          scaleAndOffset.scale * item.scale
        ]}
      >

        <primitive
          object={scene.clone()}
          position={[0, scaleAndOffset.offset, 0]} 
          receiveShadow
        />
      </group>
    </TransformControls>
  );
}


function Room({ aiDepth, ...props }) {
  const floorWidth = 8;
  const floorDepth = aiDepth || 8;

  return (
    <mesh 
      {...props}
      receiveShadow 
      position={[0, 0, 0]} 
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[floorWidth, floorDepth]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  );
}

function SceneViewer({ 
  results, 
  furnitureInScene, 
  roomConfig,
  selectedFurnitureInstanceId,
  onSelectFurniture,
  onUpdateFurniturePosition,
  transformMode,
  onUpdateFurnitureScale
}) {
  
  const defaultRoomConfig = { width: 5, depth: 4, height: 3, targetWall: 'front' };
  const activeRoomConfig = roomConfig || defaultRoomConfig;
  
  const orbitControlsRef = useRef();

  const handleDeselect = () => {
    onSelectFurniture(null);
  };

  return (
    <div className="w-full aspect-video lg:w-2/3 lg:h-screen lg:aspect-auto bg-gray-200 relative">
      
      {results?.depthMapUrl && (
        <div className="absolute top-2 right-2 lg:top-4 lg:right-4 z-10 bg-white p-2 rounded-lg shadow-lg">
          <h3 className="text-sm font-semibold mb-2">Depth Map</h3>
          <img 
            src={results.depthMapUrl} 
            alt="Depth Map" 
            className="w-32 sm:w-48 lg:w-64 h-auto rounded"
            onError={(e) => e.target.style.display = 'none'}
          />
          {results.colors && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">Extracted Colors:</p>
              <div className="flex flex-wrap gap-1">
                {results.colors.map((color, idx) => (
                  <div 
                    key={idx} 
                    className="w-6 h-6 lg:w-8 lg:h-8 rounded border border-gray-300"
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
          ref={orbitControlsRef}
          makeDefault 
          enableDamping 
          dampingFactor={0.05}
          minDistance={0.5}
          maxDistance={8}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
          target={[0, 1.5, -1]}
        />

        <Suspense fallback={<Room aiDepth={8} onClick={handleDeselect} />}>
          {results && roomConfig ? (
            <Room3D 
              roomConfig={activeRoomConfig} 
              results={results} 
              onClick={handleDeselect}
            />
          ) : (
            <Room aiDepth={8} onClick={handleDeselect} />
          )}
        </Suspense>

        <Suspense fallback={null}>
          {furnitureInScene.map((item) => (
            <InteractiveFurniture
              key={item.instanceId}
              item={item}
              isSelected={item.instanceId === selectedFurnitureInstanceId}
              onSelect={onSelectFurniture}
              onUpdateFurniturePosition={onUpdateFurniturePosition}
              roomConfig={activeRoomConfig}
              transformMode={transformMode}
              onUpdateFurnitureScale={onUpdateFurnitureScale}
            />
          ))}
        </Suspense>
        
      </Canvas>
    </div>
  );
}

export default SceneViewer;