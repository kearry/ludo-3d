import React from 'react';
import { TokenModelProps } from './types';

const Token: React.FC<TokenModelProps> = ({ color, position, isSelected, onClick }) => {
    return (
        <mesh position={[position.x, position.y, position.z]} onClick={onClick}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial color={color} emissive={isSelected ? color : "black"} emissiveIntensity={isSelected ? 0.5 : 0} />
        </mesh>
    );
};

export default Token;