import React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/lib/gameState'

function Token({ position, color, onClick }: { position: number, color: string, onClick: () => void }) {
  const angle = (position / 52) * Math.PI * 2
  const radius = 4
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  return (
    <mesh position={[x, 0.5, z]} onClick={onClick}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function LudoBoard() {
  const { players, currentPlayer, dice, moveToken, rollDice, canMoveToken } = useGameStore()

  const boardGeometry = new THREE.BoxGeometry(10, 0.5, 10)
  const boardMaterial = new THREE.MeshStandardMaterial({ color: 'white' })

  const cellGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8)
  const cellMaterials = [
    new THREE.MeshStandardMaterial({ color: 'red' }),
    new THREE.MeshStandardMaterial({ color: 'green' }),
    new THREE.MeshStandardMaterial({ color: 'yellow' }),
    new THREE.MeshStandardMaterial({ color: 'blue' }),
    new THREE.MeshStandardMaterial({ color: 'white' }),
  ]

  return (
    <group>
      <mesh geometry={boardGeometry} material={boardMaterial} />
      {Array(52).fill(null).map((_, i) => {
        const angle = (i / 52) * Math.PI * 2
        const radius = 4
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const color = i % 13 === 0 ? cellMaterials[Math.floor(i / 13)] : cellMaterials[4]
        return (
          <mesh key={i} geometry={cellGeometry} material={color} position={[x, 0.3, z]} />
        )
      })}
      {players.map((player, playerIndex) => 
        player.tokens.map((position, tokenIndex) => (
          <Token 
            key={`${playerIndex}-${tokenIndex}`} 
            position={position} 
            color={player.color} 
            onClick={() => {
              if (playerIndex === currentPlayer && canMoveToken(player.id, tokenIndex)) {
                moveToken(player.id, tokenIndex)
              }
            }}
          />
        ))
      )}
      <Text position={[0, 2, 0]} color="black" fontSize={0.5}>
        Current Player: {players[currentPlayer]?.color}
      </Text>
      <Text position={[0, 1.5, 0]} color="black" fontSize={0.5}>
        Dice: {dice[0]}, {dice[1]}
      </Text>
    </group>
  )
}

export default function GameBoard() {
  const rollDice = useGameStore(state => state.rollDice)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <LudoBoard />
        <OrbitControls />
      </Canvas>
      <button onClick={rollDice} style={{ position: 'absolute', bottom: 20, right: 20 }}>Roll Dice</button>
    </div>
  )
}