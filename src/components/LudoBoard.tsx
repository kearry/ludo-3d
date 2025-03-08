import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
// Import Board specifically from the file
import { Board } from './Board';
import { BoardProps } from './types';
import { playerColors, trackCoords } from '../lib/constants';
import { useGameStore } from '@/lib/gameState';
import * as THREE from 'three';

// Component to set the output encoding of the renderer
const EncodingSetter: React.FC = () => {
  const { gl } = useThree();
  useEffect(() => {
    gl.outputColorSpace = 'srgb';
  }, [gl]);
  return null;
};

// Camera indicator component to show where the camera is located
const CameraIndicator: React.FC = () => {
  const { camera } = useThree();
  const indicatorRef = useRef<THREE.Group>(new THREE.Group());

  useFrame(() => {
    if (indicatorRef.current) {
      // Position the indicator at a fixed distance in front of the camera
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(camera.quaternion);
      direction.multiplyScalar(20); // Distance in front of camera

      indicatorRef.current.position.copy(camera.position);
      indicatorRef.current.lookAt(
        camera.position.x + direction.x,
        camera.position.y + direction.y,
        camera.position.z + direction.z
      );
    }
  });

  return (
    <group ref={indicatorRef}>
      {/* Camera body representation */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5, 3, 2]} />
        <meshStandardMaterial color="gray" opacity={0.7} transparent={true} />
      </mesh>

      {/* Camera lens */}
      <mesh position={[0, 0, -1.5]}>
        <cylinderGeometry args={[1.5, 1.5, 1, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Direction indicator */}
      <mesh position={[0, 0, -3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1, 2, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Text label */}
      <Text position={[0, 4, 0]} fontSize={2} color="white" material-toneMapped={false}>
        Camera
      </Text>
    </group>
  );
};

// Component to display world axes
const WorldAxes: React.FC = () => {
  return (
    <group>
      {/* X-axis (red) */}
      <group>
        <mesh position={[25, 0, 0]}>
          <boxGeometry args={[50, 0.5, 0.5]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <Text position={[55, 0, 0]} color="red" fontSize={5}>
          X
        </Text>
      </group>

      {/* Y-axis (green) */}
      <group>
        <mesh position={[0, 25, 0]}>
          <boxGeometry args={[0.5, 50, 0.5]} />
          <meshStandardMaterial color="green" />
        </mesh>
        <Text position={[0, 55, 0]} color="green" fontSize={5}>
          Y
        </Text>
      </group>

      {/* Z-axis (blue) */}
      <group>
        <mesh position={[0, 0, 25]}>
          <boxGeometry args={[0.5, 0.5, 50]} />
          <meshStandardMaterial color="blue" />
        </mesh>
        <Text position={[0, 0, 55]} color="blue" fontSize={5}>
          Z
        </Text>
      </group>
    </group>
  );
};

// Camera info overlay component - This is NOT a R3F component
const CameraInfoOverlay = ({
  cameraPos,
  showCameraInfo,
  setShowCameraInfo
}: {
  cameraPos: { x: number, y: number, z: number };
  showCameraInfo: boolean;
  setShowCameraInfo: (value: boolean) => void;
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace'
    }}>
      <div>Camera Position:</div>
      <div>X: {cameraPos.x}</div>
      <div>Y: {cameraPos.y}</div>
      <div>Z: {cameraPos.z}</div>
      <button
        onClick={() => setShowCameraInfo(!showCameraInfo)}
        style={{
          marginTop: '10px',
          padding: '5px',
          background: '#4285f4',
          border: 'none',
          borderRadius: '3px',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        {showCameraInfo ? 'Hide 3D Indicator' : 'Show 3D Indicator'}
      </button>
    </div>
  );
};

// Camera position tracker component
const CameraTracker = ({
  setCameraPosition
}: {
  setCameraPosition: (pos: { x: number, y: number, z: number }) => void
}) => {
  const { camera } = useThree();

  useFrame(() => {
    setCameraPosition({
      x: Math.round(camera.position.x * 10) / 10,
      y: Math.round(camera.position.y * 10) / 10,
      z: Math.round(camera.position.z * 10) / 10
    });
  });

  return null;
};

const LudoBoard: React.FC = () => {
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);
  const [showCameraInfo, setShowCameraInfo] = useState<boolean>(true);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: -90, z: 45 });
  const { currentPlayer, players, moveToken } = useGameStore();
  const groupRef = useRef<THREE.Group>(null);

  const handleTokenClick = useCallback(async (tokenId: number) => {
    setSelectedTokenId(tokenId);
    const playerIndex = Math.floor(tokenId / 4);
    const tokenIndex = tokenId % 4;
    const player = players[playerIndex];
    if (player && players[currentPlayer] && player.id === players[currentPlayer].id) {
      await moveToken(player.id, tokenIndex);
    }
  }, [players, currentPlayer, moveToken]);

  // Convert 300 degrees to radians (300 * Math.PI / 180)
  const rotationAngle = 300 * (Math.PI / 180);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Regular DOM element for the camera info overlay */}
      <CameraInfoOverlay
        cameraPos={cameraPosition}
        showCameraInfo={showCameraInfo}
        setShowCameraInfo={setShowCameraInfo}
      />

      <Canvas
        camera={{ position: [0, -90, 45], fov: 60 }}
        gl={{ precision: 'highp', antialias: true }}
      >
        <EncodingSetter />
        <ambientLight intensity={0.7} />
        <pointLight position={[50, 50, 50]} intensity={0.8} />

        {/* Track camera position */}
        <CameraTracker setCameraPosition={setCameraPosition} />

        {/* World coordinate axes */}
        <WorldAxes />

        {/* Camera indicator */}
        {showCameraInfo && <CameraIndicator />}

        {/* Rotated board */}
        <group
          ref={groupRef}
          rotation={[rotationAngle, 0, 0]}
          scale={[3, 3, 3]}
          position={[0, 5, 0]}
        >
          {/* Now Board is properly typed */}
          <Board
            selectedTokenId={selectedTokenId}
            onTokenClick={handleTokenClick}
          />
        </group>

        <OrbitControls minDistance={50} maxDistance={200} maxPolarAngle={Math.PI / 2.1} />
      </Canvas>
    </div>
  );
};

export default LudoBoard;