import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import GameBoard from '../components/GameBoard'
import { useGameStore } from '@/lib/gameState'
import { Button} from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function GamePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { gameId } = router.query
  const [gameStarted, setGameStarted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    players,
    currentPlayer,
    dice,
    winner,
    createGame,
    loadGame,
    rollDice,
    moveToken,
    playAITurn,
    canMoveToken
  } = useGameStore()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const initGame = async () => {
      if (status === 'authenticated' && !gameStarted) {
        try {
          if (gameId) {
            console.log('Loading game:', gameId)
            await loadGame(gameId as string)
          } else {
            console.log('Creating new game')
            await createGame()
          }
          console.log('Game initialized successfully')
          setGameStarted(true)
        } catch (err) {
          console.error('Game initialization error:', err)
          setError('Failed to initialize the game. Please try again.')
        }
      }
    }

    initGame()
  }, [status, gameId, gameStarted, createGame, loadGame])
  
  useEffect(() => {
    console.log('Current game state:', { players, currentPlayer, dice, winner })
  }, [players, currentPlayer, dice, winner])

  const handleRollDice = () => {
    if (players.length > currentPlayer && players[currentPlayer]?.id === session?.user?.id) {
      rollDice().catch(err => {
        setError('Failed to roll the dice. Please try again.')
        console.error('Dice roll error:', err)
      })
    }
  }

  const handleMoveToken = (tokenIndex: number) => {
    if (players.length > currentPlayer && players[currentPlayer]?.id === session?.user?.id) {
      moveToken(session.user.id, tokenIndex).catch(err => {
        setError('Failed to move the token. Please try again.')
        console.error('Token move error:', err)
      })
    }
  }

  if (status === 'loading') {
    return <div>Loading session...</div>
  }

  if (status === 'unauthenticated') {
    return <div>Redirecting to login...</div>
  }

  if (!gameStarted) {
    return <div>Loading game... Please wait.</div>
  }

  if (error) {
    return (
      <Alert>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }
  
  const currentPlayerColor = players.length > currentPlayer ? players[currentPlayer]?.color : 'Unknown'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Ludo Game</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p>Current Player: {currentPlayerColor}</p>
              <p>Dice: {dice[0]}, {dice[1]}</p>
            </div>
            {players.length > currentPlayer && players[currentPlayer]?.id === session?.user?.id && (
              <div className="mb-4">
                <Button onClick={handleRollDice} disabled={dice[0] !== 0}>Roll Dice</Button>
                {dice[0] !== 0 && (
                  <div className="mt-2">
                    {players[currentPlayer].tokens.map((token, index) => (
                      <Button
                        key={index}
                        onClick={() => handleMoveToken(index)}
                        disabled={!canMoveToken(session.user.id, index)}
                        className="mr-2"
                      >
                        Move Token {index + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {winner && (
              <Alert>
                <AlertDescription>
                  Player {winner} has won the game!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="w-full h-[600px]">
        <GameBoard />
      </div>
    </div>
  )
}