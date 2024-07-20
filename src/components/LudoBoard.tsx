import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Board from './Board';
import { TokenModelProps,  } from './types';
import { playerColors } from '../lib/constants';
import { useGameStore } from '@/lib/gameState';
import { Player } from '@/lib/gameTypes';

const LudoBoard: React.FC = () => {
    const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
    const { currentPlayer,players } = useGameStore()
    const [tokens, setTokens] = useState<TokenModelProps[]>([
        // ... (keep your existing token initialization)
    ]);

    const handleTokenClick = (tokenId: number) => {
        setSelectedTokenId(tokenId);
        setTokens(prevTokens => prevTokens.map(token => ({
            ...token,
            isSelected: token.id === tokenId
        })));
        // Add your token selection logic here
    };

    const getRotationForPlayer = (): number => {
        switch (players[currentPlayer].color) {
            case 'red' :return Math.PI;
            case 'black': return Math.PI / 2;
            case 'green': return 0;
            case 'yellow': return -Math.PI / 2;
            default: return Math.PI;
        }
    };


    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas camera={{ position: [0, 90, 45], fov: 60 }}>
                <ambientLight intensity={0.7} />
                <pointLight position={[50, 50, 50]} intensity={0.8} />
                <group 
                    rotation={[180, 0, getRotationForPlayer()]} 
                    scale={[3, 3, 3]}
                    position={[0, -5, 0]}
                >
                    <Board
                        selectedTokenId={selectedTokenId}
                        onTokenClick={handleTokenClick}
                        tokens={tokens}
                    />
                </group>
                <OrbitControls 
                    minDistance={50} 
                    maxDistance={200}
                    maxPolarAngle={Math.PI / 2.1} 
                />
 
             </Canvas>
             {/*
            <div style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>
                <h2>Ludo Game</h2>
                <p>Current Player: {currentPlayer}</p>
                <button onClick={rotateToNextPlayer}>Next Player</button>
            </div>
            */}
        </div>
    );
};

export default LudoBoard;