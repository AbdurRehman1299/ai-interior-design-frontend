'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Shape } from 'three';
import { useTexture } from '@react-three/drei';

function Room3D({ roomConfig, results, ...props }) {
  const { width, depth, height, targetWall } = roomConfig;

  const originalTexture = useTexture(results?.originalImageUrl || '');
  const wallTexture = useMemo(() => {
    if (!originalTexture) return null;

    const clonedTexture = originalTexture.clone();
    clonedTexture.wrapS = THREE.ClampToEdgeWrapping;
    clonedTexture.wrapT = THREE.ClampToEdgeWrapping;
    clonedTexture.needsUpdate = true; 
    return clonedTexture;

  }, [originalTexture]);

  const createWallWithOpenings = (wallWidth, wallHeight, openings) => {
    if (!openings || openings.length === 0) {
      return new THREE.PlaneGeometry(wallWidth, wallHeight);
    }

    const shape = new Shape();
    shape.moveTo(-wallWidth / 2, -wallHeight / 2);
    shape.lineTo(wallWidth / 2, -wallHeight / 2);
    shape.lineTo(wallWidth / 2, wallHeight / 2);
    shape.lineTo(-wallWidth / 2, wallHeight / 2);
    shape.lineTo(-wallWidth / 2, -wallHeight / 2);

    openings.forEach((opening) => {
      const holeWidth = opening.width * wallWidth;
      const holeHeight = opening.height * wallHeight;
      const holeX = (opening.x - 0.5) * wallWidth + holeWidth / 2;
      const holeY = (0.5 - opening.y) * wallHeight - holeHeight / 2;

      const hole = new THREE.Path();
      hole.moveTo(holeX - holeWidth / 2, holeY - holeHeight / 2);
      hole.lineTo(holeX + holeWidth / 2, holeY - holeHeight / 2);
      hole.lineTo(holeX + holeWidth / 2, holeY + holeHeight / 2);
      hole.lineTo(holeX - holeWidth / 2, holeY + holeHeight / 2);
      hole.lineTo(holeX - holeWidth / 2, holeY - holeHeight / 2);
      shape.holes.push(hole);
    });

    return new THREE.ShapeGeometry(shape);
  };

  const materials = useMemo(() => {
    const wallColor = results?.colors?.[0] || '#e8e8e8';
    const floorColor = results?.colors?.[1] || '#8b7355';
    const ceilingColor = '#ffffff';

    const defaultWallMaterial = new THREE.MeshStandardMaterial({ 
      color: wallColor,
      roughness: 0.9,
      metalness: 0
    });
    
    const texturedWallMaterial = wallTexture
      ? new THREE.MeshStandardMaterial({ 
          map: wallTexture,
          roughness: 0.8,
          metalness: 0
        })
      : defaultWallMaterial;

    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: floorColor,
      roughness: 0.95,
      metalness: 0
    });

    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
      color: ceilingColor,
      roughness: 0.9,
      metalness: 0
    });

    return {
      front: targetWall === 'front' ? texturedWallMaterial : defaultWallMaterial,
      back: targetWall === 'back' ? texturedWallMaterial : defaultWallMaterial,
      left: targetWall === 'left' ? texturedWallMaterial : defaultWallMaterial,
      right: targetWall === 'right' ? texturedWallMaterial : defaultWallMaterial,
      floor: floorMaterial,
      ceiling: ceilingMaterial
    };
  }, [wallTexture, targetWall, results?.colors]);

  const openings = results?.openings || [];
  
  const frontGeometry = useMemo(() => 
    targetWall === 'front' ? createWallWithOpenings(width, height, openings) : new THREE.PlaneGeometry(width, height),
    [targetWall, width, height, openings]
  );
  
  const backGeometry = useMemo(() => 
    targetWall === 'back' ? createWallWithOpenings(width, height, openings) : new THREE.PlaneGeometry(width, height),
    [targetWall, width, height, openings]
  );
  
  const leftGeometry = useMemo(() => 
    targetWall === 'left' ? createWallWithOpenings(depth, height, openings) : new THREE.PlaneGeometry(depth, height),
    [targetWall, depth, height, openings]
  );
  
  const rightGeometry = useMemo(() => 
    targetWall === 'right' ? createWallWithOpenings(depth, height, openings) : new THREE.PlaneGeometry(depth, height),
    [targetWall, depth, height, openings]
  );

  return (
    <group {...props}>

      <mesh 
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <primitive object={materials.floor} />
      </mesh>

      <mesh 
        position={[0, height, 0]} 
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <primitive object={materials.ceiling} />
      </mesh>

      <mesh 
        position={[0, height / 2, depth / 2]} 
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
        geometry={frontGeometry}
      >
        <primitive object={materials.front} />
      </mesh>

      <mesh 
        position={[0, height / 2, -depth / 2]} 
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
        geometry={backGeometry}
      >
        <primitive object={materials.back} />
      </mesh>

 
      <mesh 
        position={[-width / 2, height / 2, 0]} 
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
        geometry={leftGeometry}
      >
        <primitive object={materials.left} />
      </mesh>

      <mesh 
        position={[width / 2, height / 2, 0]} 
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
        receiveShadow
        geometry={rightGeometry}
      >
        <primitive object={materials.right} />
      </mesh>
    </group>
  );
}

export default Room3D;