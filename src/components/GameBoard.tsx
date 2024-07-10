import React, { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/lib/gameState'
import { PlayerColor } from '@/lib/gameTypes'

const BOARD_SIZE = 10
const TRACK_WIDTH = 1.5
const CORNER_SIZE = 2
const COLORS = {
  red: '#FF0000',
  green: '#00FF00',
  yellow: '#FFFF00',
  blue: '#0000FF',
  LIGHT_GREY: '#A0A0A0',
  DARK_GREY: '#404040',
  BLACK: '#000000',
  WHITE: '#FFFFFF'
}

function Board() {
  return (
    <group>
      <BoardBase />
      <TrackSegments />
      <CornerSquares />
      <Tokens />
      <Dice />
    </group>
  )
}

function BoardBase() {
  return (
    <mesh position={[0, -0.1, 0]}>
      <boxGeometry args={[BOARD_SIZE, 0.2, BOARD_SIZE]} />
      <meshStandardMaterial color={COLORS.BLACK} />
    </mesh>
  )
}

function TrackSegments() {
  const trackGeometry = new THREE.BoxGeometry(TRACK_WIDTH, 0.3, TRACK_WIDTH)
  const trackMaterial = new THREE.MeshStandardMaterial({ color: COLORS.LIGHT_GREY })

  const createTrackSegment = (x: number, z: number, index: number) => (
    <mesh key={index} geometry={trackGeometry} material={trackMaterial} position={[x, 0.05, z]}>
      <Text
        position={[0, 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color={COLORS.BLACK}
      >
        {index}
      </Text>
    </mesh>
  )

  const trackPositions = [
    // Top row
    [-3, -4.25], [-1.5, -4.25], [0, -4.25], [1.5, -4.25], [3, -4.25],
    // Right column
    [4.25, -3], [4.25, -1.5], [4.25, 0], [4.25, 1.5], [4.25, 3],
    // Bottom row
    [3, 4.25], [1.5, 4.25], [0, 4.25], [-1.5, 4.25], [-3, 4.25],
    // Left column
    [-4.25, 3], [-4.25, 1.5], [-4.25, 0], [-4.25, -1.5], [-4.25, -3]
  ]

  return (
    <group>
      {trackPositions.map((pos, index) => createTrackSegment(pos[0], pos[1], index))}
    </group>
  )
}

function CornerSquares() {
  const cornerGeometry = new THREE.BoxGeometry(CORNER_SIZE, 0.3, CORNER_SIZE)
  const cornerMaterials = [
    new THREE.MeshStandardMaterial({ color: COLORS.red }),
    new THREE.MeshStandardMaterial({ color: COLORS.green }),
    new THREE.MeshStandardMaterial({ color: COLORS.yellow }),
    new THREE.MeshStandardMaterial({ color: COLORS.blue })
  ]

  const createCornerSquare = (x: number, z: number, index: number) => (
    <mesh key={index} geometry={cornerGeometry} material={cornerMaterials[index]} position={[x, 0.05, z]} />
  )

  const cornerPositions = [
    [-4, -4], [4, -4], [4, 4], [-4, 4]
  ]

  return (
    <group>
      {cornerPositions.map((pos, index) => createCornerSquare(pos[0], pos[1], index))}
    </group>
  )
}

import { PlayerColor } from '@/lib/gameTypes'

function Token({ color, position }: { color: PlayerColor; position: [number, number, number] }) {
  const tokenGeometry = new THREE.SphereGeometry(0.3, 32, 32)
  const tokenMaterial = new THREE.MeshStandardMaterial({ color: COLORS[color] })

  return (
    <mesh geometry={tokenGeometry} material={tokenMaterial} position={position} />
  )
}

function Tokens() {
  const players = useGameStore(state => state.players)

  const getTokenPosition = (playerIndex: number, tokenIndex: number): [number, number, number] => {
    const player = players[playerIndex]
    const tokenPosition = player.tokens[tokenIndex]
    
    if (tokenPosition === -1) {
      // Token is in base
      const basePositions: [number, number, number][] = [
        [-3.5, 0.2, -3.5], [-2.5, 0.2, -3.5], [-3.5, 0.2, -2.5], [-2.5, 0.2, -2.5], // Red base
        [2.5, 0.2, -3.5], [3.5, 0.2, -3.5], [2.5, 0.2, -2.5], [3.5, 0.2, -2.5],    // Green base
        [2.5, 0.2, 2.5], [3.5, 0.2, 2.5], [2.5, 0.2, 3.5], [3.5, 0.2, 3.5],        // Yellow base
        [-3.5, 0.2, 2.5], [-2.5, 0.2, 2.5], [-3.5, 0.2, 3.5], [-2.5, 0.2, 3.5]     // Blue base
      ]
      return basePositions[playerIndex * 4 + tokenIndex]
    }

    // Token is on the board
    const trackPositions: [number, number][] = [
      [-3, -4.25], [-1.5, -4.25], [0, -4.25], [1.5, -4.25], [3, -4.25],
      [4.25, -3], [4.25, -1.5], [4.25, 0], [4.25, 1.5], [4.25, 3],
      [3, 4.25], [1.5, 4.25], [0, 4.25], [-1.5, 4.25], [-3, 4.25],
      [-4.25, 3], [-4.25, 1.5], [-4.25, 0], [-4.25, -1.5], [-4.25, -3]
    ]
    const adjustedPosition = (tokenPosition - player.startPosition + trackPositions.length) % trackPositions.length
    const [x, z] = trackPositions[adjustedPosition]
    return [x, 0.2, z]
  }

  return (
    <group>
      {players.map((player, playerIndex) =>
        player.tokens.map((tokenPosition, tokenIndex) => (
          <Token
            key={`${playerIndex}-${tokenIndex}`}
            color={player.color}
            position={getTokenPosition(playerIndex, tokenIndex)}
          />
        ))
      )}
    </group>
  )
}
function Dice() {
  const dice = useGameStore(state => state.dice)
  const diceRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (diceRef.current) {
      diceRef.current.rotation.x += 0.01
      diceRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={diceRef} position={[0, 2, 0]}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={COLORS.WHITE} />
      </mesh>
      <Text position={[0, 0, 0.51]} fontSize={0.5} color={COLORS.BLACK}>
        {dice}
      </Text>
    </group>
  )
}

export default function GameBoard() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 15, 15], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <Board />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
