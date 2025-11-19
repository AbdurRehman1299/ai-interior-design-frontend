'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function DepthMesh({ results }) {
  const meshRef = useRef();

  const texture = useMemo(() => {
    if (!results?.originalImageUrl) return null;
    const loader = new THREE.TextureLoader();
    return loader.load(results.originalImageUrl);
  }, [results]);

  const geometry = useMemo(() => {
    if (!results?.depthData) return null;

    const depthData = results.depthData;
    const width = depthData[0].length;
    const height = depthData.length;
    const geometry = new THREE.PlaneGeometry(16, 9, width - 1, height - 1);
    const positions = geometry.attributes.position.array;
    
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const depth = depthData[i][j]; 
        const index = (i * width + j) * 3;
        positions[index + 2] = -depth * 5; 
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  }, [results]);

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