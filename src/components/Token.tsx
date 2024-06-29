// src/components/Token.tsx
'use client';

import React from 'react';

interface TokenProps {
  position: [number, number, number];
  color: string;
}

const Token: React.FC<TokenProps> = ({ position, color }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Token;