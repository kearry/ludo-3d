import React from 'react';
import * as THREE from 'three';
import { SquareProps } from './types';
import { BOARD_DEPTH } from '../lib/constants';

const Square: React.FC<SquareProps> = ({ position, color, borderColor, border }) => {
    return (
        <mesh position={position}>
            <boxGeometry args={[1, 1, BOARD_DEPTH]} /> 
            <meshStandardMaterial color={color} />
            {border && (
                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(1, 1, BOARD_DEPTH)]} />
                    <lineBasicMaterial color={borderColor} />
                </lineSegments>
            )}
        </mesh>
    );
};

export default Square;