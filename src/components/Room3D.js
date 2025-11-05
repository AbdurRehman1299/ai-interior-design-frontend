'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { Shape } from 'three';

export default function Room3D({ roomConfig, results }) {
  const { width, depth, height, targetWall } = roomConfig;

  // Load texture from uploaded image
  const wallTexture = useMemo(() => {
    if (!results?.originalImageUrl) return null;
    const loader = new THREE.TextureLoader();
    const texture = loader.load(results.originalImageUrl);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [results?.originalImageUrl]);

  // Create geometry with holes for windows/doors
  const createWallWithOpenings = (wallWidth, wallHeight, openings) => {
    if (!openings || openings.length === 0) {
      return new THREE.PlaneGeometry(wallWidth, wallHeight);
    }

    // Create outer shape
    const shape = new Shape();
    shape.moveTo(-wallWidth / 2, -wallHeight / 2);
    shape.lineTo(wallWidth / 2, -wallHeight / 2);
    shape.lineTo(wallWidth / 2, wallHeight / 2);
    shape.lineTo(-wallWidth / 2, wallHeight / 2);
    shape.lineTo(-wallWidth / 2, -wallHeight / 2);

    // Create holes for each opening
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

  // Create materials for different surfaces
  const materials = useMemo(() => {
    const defaultWallMaterial = new THREE.MeshStandardMaterial({ 
      color: '#e8e8e8',
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
      color: '#8b7355',
      roughness: 0.95,
      metalness: 0
    });

    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
      color: '#ffffff',
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
  }, [wallTexture, targetWall]);

  // Get openings for the textured wall
  const openings = results?.openings || [];
  
  // Create geometries with openings for textured wall
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
    <group>
      {/* Floor */}
      <mesh 
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <primitive object={materials.floor} />
      </mesh>

      {/* Ceiling */}
      <mesh 
        position={[0, height, 0]} 
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <primitive object={materials.ceiling} />
      </mesh>

      {/* Front Wall (towards camera) */}
      <mesh 
        position={[0, height / 2, depth / 2]} 
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
        geometry={frontGeometry}
      >
        <primitive object={materials.front} />
      </mesh>

      {/* Back Wall */}
      <mesh 
        position={[0, height / 2, -depth / 2]} 
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
        geometry={backGeometry}
      >
        <primitive object={materials.back} />
      </mesh>

      {/* Left Wall */}
      <mesh 
        position={[-width / 2, height / 2, 0]} 
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
        geometry={leftGeometry}
      >
        <primitive object={materials.left} />
      </mesh>

      {/* Right Wall */}
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
