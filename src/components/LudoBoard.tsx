import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Board from './Board';

const LudoBoard: React.FC = () => {
    const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);

    const handleTokenClick = (tokenId: number) => {
        setSelectedTokenId(tokenId);
        // Add your token selection logic here
    };

    return (
        <Canvas camera={{ position: [0, 20, 20], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <Board
                selectedTokenId={selectedTokenId}
                onTokenClick={handleTokenClick}
                tokens={[]} // Pass an empty array to satisfy the prop type
            />
            <OrbitControls />
        </Canvas>
    );
};

export default LudoBoard;