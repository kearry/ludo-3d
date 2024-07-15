import React from 'react';
import * as THREE from 'three';
import { SquareProps } from './types';

const Square: React.FC<SquareProps> = ({ position, color, borderColor, border }) => {
    return (
        <mesh position={position}>
            <boxGeometry args={[1, 1, 0.75]} /> 
            <meshStandardMaterial color={color} />
            {border && (
                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 0.76)]} />
                    <lineBasicMaterial color={borderColor} />
                </lineSegments>
            )}
        </mesh>
    );
};

export default Square;