import React from 'react'
import GameBoard from '../components/GameBoard'
import { useGameStore } from '@/lib/gameState'

export default function GamePage() {
  const addPlayer = useGameStore(state => state.addPlayer)

  React.useEffect(() => {
    // Initialize the game with two players
    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: false })
    addPlayer({ id: '2', color: 'blue', tokens: [0, 0, 0, 0], isAI: true })
  }, [addPlayer])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameBoard />
    </div>
  )
}