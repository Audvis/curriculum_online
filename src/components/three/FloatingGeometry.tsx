import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import * as THREE from 'three';

interface FloatingGeometryProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  wireframe?: boolean;
}

export function FloatingGeometry({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = 1,
  color = '#8b5cf6',
  wireframe = true
}: FloatingGeometryProps) {
  const meshRef = useRef<Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 1);
    return geo;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation[0] + state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = rotation[1] + state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.z = rotation[2] + Math.sin(state.clock.getElapsedTime()) * 0.1;
      
      // Floating effect
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      scale={scale}
    >
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        emissive={color}
        emissiveIntensity={0.2}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

interface TorusKnotProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
}

export function TorusKnot({ 
  position = [0, 0, 0], 
  scale = 1,
  color = '#ec4899'
}: TorusKnotProps) {
  const meshRef = useRef<Mesh>(null);

  const geometry = useMemo(() => {
    return new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      scale={scale}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

interface CrystalProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
}

export function Crystal({ 
  position = [0, 0, 0], 
  scale = 1,
  color = '#06b6d4'
}: CrystalProps) {
  const meshRef = useRef<Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(1, 0);
    return geo;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
      
      // Pulsing effect
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      meshRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      scale={scale}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        metalness={0.95}
        roughness={0.05}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}