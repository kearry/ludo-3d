import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { TokenModelProps } from './types';
import { BOARD_DEPTH } from '../lib/constants';
import * as THREE from 'three';

// Use React.memo to prevent unnecessary re-renders
const Token: React.FC<TokenModelProps> = React.memo(({ id, color, position, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const selectionRingRef = useRef<THREE.Group>(null);

  // Update position whenever it changes
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(position.x, position.y, BOARD_DEPTH + 0.4);
    }
  }, [position]);

  // Handle selection state changes
  useEffect(() => {
    if (!meshRef.current || !materialRef.current) return;

    // Set initial scale based on selection state
    meshRef.current.scale.set(
      isSelected ? 1.1 : 1,
      isSelected ? 1.1 : 1,
      isSelected ? 1.1 : 1
    );

    // Set initial emissive intensity
    materialRef.current.emissiveIntensity = isSelected ? 1.0 : 0.5;

    // Show/hide selection ring
    if (selectionRingRef.current) {
      selectionRingRef.current.visible = isSelected;
    }
  }, [isSelected]);

  // Animation frame for selected tokens
  useFrame((state) => {
    if (isSelected && meshRef.current && materialRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.2;
      meshRef.current.scale.set(pulse, pulse, pulse);
      materialRef.current.emissiveIntensity = 0.5 + Math.abs(Math.sin(state.clock.getElapsedTime() * 3)) * 0.5;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.0 : 0.5}
        />
      </mesh>

      {/* Selection indicator ring - only rendered when selected */}
      <group
        ref={selectionRingRef}
        position={[position.x, position.y, BOARD_DEPTH + 0.5]}
        visible={isSelected}
      >
        <mesh>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshBasicMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.5}
          />
        </mesh>
      </group>
    </group>
  );
});

Token.displayName = 'Token';

export default Token;