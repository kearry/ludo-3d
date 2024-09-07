import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { TokenModelProps } from './types';
import { BOARD_DEPTH } from '../lib/constants';
import * as THREE from 'three';

const Token: React.FC<TokenModelProps> = ({ id, color, position, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(position.x, position.y, BOARD_DEPTH + 0.4);
    }
  }, [position]);

  useFrame((state) => {
    if (isSelected && meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.3;
      meshRef.current.scale.set(pulse, pulse, pulse);
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0;
    } else if (meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 1.0 : 0.5} />
      </mesh>
      {isSelected && (
        <mesh position={[position.x, position.y, BOARD_DEPTH + 0.5]}>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent={true} opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};

export default Token;