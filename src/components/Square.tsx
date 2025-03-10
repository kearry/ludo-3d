import React from 'react';
import * as THREE from 'three';
import { SquareProps } from './types';
import { BOARD_DEPTH } from '../lib/constants';
import { Text } from '@react-three/drei';

const Square: React.FC<SquareProps> = ({
    position,
    color,
    borderColor,
    border,
    showDebugText = false  // Add option to show debug text, default is false
}) => {
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
            {/* Only render debug text if showDebugText is true */}
            {showDebugText && (
                <Text
                    position={[0, 0, BOARD_DEPTH + 0.1]}
                    fontSize={0.1}
                    color="black"
                    textAlign="center"
                >
                    {`${position[0] + 8.5}, ${position[1] + 8.5}`}
                </Text>
            )}
        </mesh>
    );
};

export default React.memo(Square);