import React from 'react';
import * as THREE from 'three';
import { PolygonProps } from './types';
import { BOARD_DEPTH } from '../lib/constants';

const Polygon: React.FC<PolygonProps> = ({ color, coords, border, borderColor }) => {
    const shape = new THREE.Shape();
    shape.moveTo(coords[0].x, coords[0].y);
    coords.slice(1).forEach(coord => {
        shape.lineTo(coord.x, coord.y);
    });
    shape.lineTo(coords[0].x, coords[0].y);

    const geometry = new THREE.ExtrudeGeometry(shape, { depth: BOARD_DEPTH, bevelEnabled: false });

    return (
        <group position={[-8.5, -8.5, 0]}>
            <mesh geometry={geometry}>
                <meshStandardMaterial color={color} />
            </mesh>
            {border && (
                <lineSegments>
                    <edgesGeometry args={[geometry]} />
                    <lineBasicMaterial color={borderColor || 'black'} />
                </lineSegments>
            )}
        </group>
    );
};

export default Polygon;