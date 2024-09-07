import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Board from './Board';
import { TokenModelProps } from './types';
import { playerColors, trackCoords } from '../lib/constants';
import { useGameStore } from '@/lib/gameState';
import { Vector3, Euler } from 'three';
import * as THREE from 'three';

const LudoBoard: React.FC = () => {
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
  const { currentPlayer, players, moveToken } = useGameStore();
  const groupRef = useRef<THREE.Group>(null);
  const [cameraInfo, setCameraInfo] = useState({ 
    position: new Vector3(), 
    rotation: new Euler(),
    scale: new Vector3(1, 1, 1)
  });

  const handleCameraUpdate = useCallback((info: any) => {
    setCameraInfo(info);
  }, []);

  const handleTokenClick = useCallback(async (tokenId: number) => {
    setSelectedTokenId(tokenId);
    const playerIndex = Math.floor(tokenId / 4);
    const tokenIndex = tokenId % 4;
    const player = players[playerIndex];
    
    if (player.id === players[currentPlayer].id) {
      await moveToken(player.id, tokenIndex);
    }
  }, [players, currentPlayer, moveToken]);

  const getRotationForPlayer = useCallback((): number => {
    switch (players[currentPlayer].color) {
      case 'red': return Math.PI;
      case 'black': return Math.PI / 2;
      case 'green': return 0;
      case 'yellow': return -Math.PI / 2;
      default: return Math.PI;
    }
  }, [players, currentPlayer]);

  const tokens = useMemo(() => {
    return players.flatMap((player, playerIndex) =>
      player.tokens.map((tokenPosition, tokenIndex) => {
        const id = playerIndex * 4 + tokenIndex;
        let position;
        if (tokenPosition === -1) {
          // Token is in base
          const basePositions = [
            { x: -3.5, y: -3.5 }, { x: -2.5, y: -3.5 },
            { x: -3.5, y: -2.5 }, { x: -2.5, y: -2.5 }
          ];
          position = basePositions[tokenIndex];
        } else {
          // Token is on the board
          const trackPosition = (tokenPosition + player.startPosition) % trackCoords.length;
          position = trackCoords[trackPosition];
        }
        return {
          id,
          color: playerColors[player.color as keyof typeof playerColors],
          position: { x: position.x - 8.5, y: position.y - 8.5, z: 0.4 },
          isSelected: id === selectedTokenId,
          onClick: () => handleTokenClick(id)
        };
      })
    );
  }, [players, selectedTokenId, handleTokenClick]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 90, 45], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[50, 50, 50]} intensity={0.8} />
        <group ref={groupRef} rotation={[180, 0, getRotationForPlayer()]} scale={[3, 3, 3]} position={[0, -5, 0]} >
          <Board selectedTokenId={selectedTokenId} onTokenClick={handleTokenClick} tokens={tokens} />
        </group>
        <OrbitControls minDistance={50} maxDistance={200} maxPolarAngle={Math.PI / 2.1} />
      </Canvas>
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '10px',
        fontFamily: 'monospace',
      }}>
        <div>Camera Position: {cameraInfo.position.x.toFixed(2)}, {cameraInfo.position.y.toFixed(2)}, {cameraInfo.position.z.toFixed(2)}</div>
        <div>Camera Rotation: {cameraInfo.rotation.x.toFixed(2)}, {cameraInfo.rotation.y.toFixed(2)}, {cameraInfo.rotation.z.toFixed(2)}</div>
        <div>Camera Scale: {cameraInfo.scale.x.toFixed(2)}, {cameraInfo.scale.y.toFixed(2)}, {cameraInfo.scale.z.toFixed(2)}</div>
      </div>
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '10px',
        fontFamily: 'monospace',
      }}>
        <div>Group Scale: {groupRef.current ? 
          `${groupRef.current.scale.x.toFixed(2)}, ${groupRef.current.scale.y.toFixed(2)}, ${groupRef.current.scale.z.toFixed(2)}` : 'N/A'}
        </div>
        <div>Group Position: {groupRef.current ? 
          `${groupRef.current.position.x.toFixed(2)}, ${groupRef.current.position.y.toFixed(2)}, ${groupRef.current.position.z.toFixed(2)}` : 'N/A'}
        </div>
        <div>Group Rotation: {groupRef.current ? 
          `${groupRef.current.rotation.x.toFixed(2)}, ${groupRef.current.rotation.y.toFixed(2)}, ${groupRef.current.rotation.z.toFixed(2)}` : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default LudoBoard;