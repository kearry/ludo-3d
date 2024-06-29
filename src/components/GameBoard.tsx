import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '@/lib/gameState'
import Token from './Token'  // Assume Token is defined in a separate file

function LudoBoard() {
  const { players, currentPlayer, dice, moveToken, rollDice, playAITurn, canMoveToken } = useGameStore()
  const [selectedToken, setSelectedToken] = useState<number | null>(null)

  useEffect(() => {
    if (players[currentPlayer]?.isAI) {
      const aiTurnTimeout = setTimeout(() => {
        playAITurn()
      }, 1000) // Delay AI move by 1 second for better visibility

      return () => clearTimeout(aiTurnTimeout)
    }
  }, [currentPlayer, players, playAITurn])

  const handleTokenClick = (playerIndex: number, tokenIndex: number) => {
    if (playerIndex === currentPlayer && !players[currentPlayer].isAI) {
      if (canMoveToken(players[currentPlayer].id, tokenIndex)) {
        moveToken(players[currentPlayer].id, tokenIndex)
        setSelectedToken(null)
      } else {
        setSelectedToken(tokenIndex)
      }
    }
  }

  return (
    <group>
      <mesh>
        <boxGeometry args={[10, 0.5, 10]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {Array(52).fill(null).map((_, i) => {
        const angle = (i / 52) * Math.PI * 2
        const radius = 4
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const color = i % 13 === 0 ? ['red', 'green', 'yellow', 'blue'][Math.floor(i / 13)] : 'white'
        return (
          <mesh key={i} position={[x, 0.3, z]}>
            <boxGeometry args={[0.8, 0.1, 0.8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )
      })}
      {players.map((player, playerIndex) => 
        player.tokens.map((position, tokenIndex) => (
          <Token 
            key={`${playerIndex}-${tokenIndex}`} 
            position={position} 
            color={player.color} 
            onClick={() => handleTokenClick(playerIndex, tokenIndex)}
          />
        ))
      )}
      <Text position={[0, 2, 0]} color="black" fontSize={0.5}>
        Current Player: {players[currentPlayer]?.color} ({players[currentPlayer]?.isAI ? 'AI' : 'Human'})
      </Text>
      <Text position={[0, 1.5, 0]} color="black" fontSize={0.5}>
        Dice: {dice[0]}, {dice[1]}
      </Text>
      {selectedToken !== null && (
        <Text position={[0, 1, 0]} color="black" fontSize={0.5}>
          Selected Token: {selectedToken}
        </Text>
      )}
    </group>
  )
}

export default function GameBoard() {
  const rollDice = useGameStore(state => state.rollDice)
  const currentPlayer = useGameStore(state => state.currentPlayer)
  const players = useGameStore(state => state.players)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <LudoBoard />
        <OrbitControls />
      </Canvas>
      <button 
        onClick={rollDice} 
        style={{ position: 'absolute', bottom: 20, right: 20 }}
        disabled={players[currentPlayer]?.isAI}
      >
        Roll Dice
      </button>
    </div>
  )
}