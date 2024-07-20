import React from 'react';
import * as THREE from 'three';
import { HomePathProps } from './types';

const HomePath: React.FC<HomePathProps> = ({ color, startPosition, rotation = 0 }) => {
    const steps = Array(5).fill(null).map((_, index) => (
        <mesh key={`step-${index}`} position={[index * 1.5, 0, 0]}>
            <boxGeometry args={[1.4, 1.4, 0.04]} />
            <meshStandardMaterial color={color} />
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(1.4, 1.4, 0.04)]} />
                <lineBasicMaterial color="black" />
            </lineSegments>
        </mesh>
    ));

    const finalStep = (
        <mesh position={[7.5, 0, 0]}>
            <cylinderGeometry args={[1, 1, 0.04, 3]} />
            <meshStandardMaterial color={color} />
            <lineSegments>
                <edgesGeometry args={[new THREE.CylinderGeometry(1, 1, 0.04, 3)]} />
                <lineBasicMaterial visible={true} color="black" />
            </lineSegments>
        </mesh>
    );

    return (
        <group position={startPosition} rotation={[0, 0, rotation]}>
            {steps}
            {finalStep}
        </group>
    );
};

export default HomePath;