'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function DepthMesh({ results }) {
  const meshRef = useRef();

  // Create texture from original image
  const texture = useMemo(() => {
    if (!results?.originalImageUrl) return null;
    const loader = new THREE.TextureLoader();
    return loader.load(results.originalImageUrl);
  }, [results?.originalImageUrl]);

  // Generate 3D geometry from depth data to create a room-like structure
  const geometry = useMemo(() => {
    if (!results?.depthData) return null;

    const depthData = results.depthData;
    const width = depthData[0].length;
    const height = depthData.length;

    // Create PlaneGeometry with high resolution for smooth depth
    const geometry = new THREE.PlaneGeometry(16, 9, width - 1, height - 1);
    
    // Modify vertices based on depth data to create room depth
    const positions = geometry.attributes.position.array;
    
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const index = (i * width + j) * 3;
        // Normalize depth value (0-255 range) and scale for room depth
        const depth = depthData[i][j] / 255.0;
        // Apply depth as Z-displacement (negative to push into the scene)
        // Scale by 5 for more pronounced room depth
        positions[index + 2] = -depth * 5;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  }, [results?.depthData]);

  if (!geometry || !texture) return null;

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
      <meshStandardMaterial 
        map={texture} 
        side={THREE.FrontSide}
        metalness={0}
        roughness={1}
      />
    </mesh>
  );
}

export default DepthMesh;