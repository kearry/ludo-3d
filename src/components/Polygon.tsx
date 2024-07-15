import React from 'react';
import * as THREE from 'three';
import { PolygonProps } from './types';

const Polygon: React.FC<PolygonProps> = ({ color, coords }) => {
    const shape = new THREE.Shape();
    shape.moveTo(coords[0].x, coords[0].y);
    coords.slice(1).forEach(coord => {
        shape.lineTo(coord.x, coord.y);
    });
    shape.lineTo(coords[0].x, coords[0].y);

    return (
        <mesh position={[-9, -9, 0.37]}> 
            <extrudeGeometry args={[shape, { depth: 0.05, bevelEnabled: false }]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

export default Polygon;