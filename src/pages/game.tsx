import React, { useCallback, useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import GameBoard from '../components/GameBoard'
import { useGameStore } from '@/lib/gameState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Custom type for user session with id property
interface CustomSession {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

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
    console.log("Session:", { 
      status, 
      userId: (session as CustomSession)?.user?.id 
    });
  }, [session, status])

  const initGame = useCallback(async () => {
    if (status === 'authenticated' && (session as CustomSession)?.user?.id) {
      try {
        if (gameId) {
          await loadGame(gameId as string)
        } else {
          await createGame((session as CustomSession)?.user?.id!);
        }
        setGameStarted(true)
      } catch (err) {
        console.error('Game initialization error:', err)
        setError('Failed to initialize the game. Please try again.')
      }
    }
  }, [status, session, gameId, createGame, loadGame, setGameStarted, setError])

  useEffect(() => {
    if (status === 'authenticated' && (session as CustomSession)?.user?.id && !gameStarted) {
      initGame()
    }
  }, [status, session, gameId, gameStarted, initGame])

  useEffect(() => {
    if (gameStarted && dice.some(d => d !== 0)) {
      const currentPlayerObj = players[currentPlayer]
      const canMove = currentPlayerObj.tokens.some((token, index) => canMoveToken(currentPlayerObj.id, index))
      
      if (!canMove) {
        // If no move is possible, automatically pass the turn
        console.log("No moves available, passing turn...")
        moveToken(currentPlayerObj.id, 0)  // The tokenIndex doesn't matter here as no move will be made
      } else if (currentPlayerObj.isAI) {
        // If it's an AI's turn and they can move, trigger the AI turn
        const timer = setTimeout(() => {
          playAITurn()
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [gameStarted, dice, players, currentPlayer, canMoveToken, moveToken, playAITurn])

  useEffect(() => {
    console.log("Game state updated:", {
      currentPlayer,
      dice,
      players: players.map(p => ({ id: p.id, userId: p.userId, color: p.color, tokens: p.tokens }))
    })
  }, [currentPlayer, dice, players])

  const handleRollDice = async () => {
    console.log("Roll Dice button clicked")
    if (players[currentPlayer]?.userId === (session as CustomSession)?.user?.id) {
      await rollDice()
      console.log("Dice rolled:", useGameStore.getState().dice)
    }
  }

  const handleMoveToken = async (tokenIndex: number) => {
    console.log("Move Token button clicked:" + tokenIndex)
    if (players[currentPlayer]?.userId === (session as CustomSession)?.user?.id) {
      console.log("Attempting to move token:", tokenIndex)
      const moveMade = await moveToken((session as CustomSession).user.id!, tokenIndex)
      if (moveMade) {
        const updatedState = useGameStore.getState()
        if (updatedState.dice.some(d => d !== 0)) {
          console.log("You have additional moves available.")
        }
      } else {
        console.log("No valid move possible. Turn passed.")
      }
    }
  }

  const isYourTurn = players[currentPlayer]?.userId === (session as CustomSession)?.user?.id

  console.log("Render state:", { 
    gameStarted, 
    isYourTurn, 
    currentPlayer, 
    dice, 
    playerId: (session as CustomSession)?.user?.id, 
    currentPlayerId: players[currentPlayer]?.userId,
    players: players.map(p => ({ id: p.id, userId: p.userId, color: p.color, isAI: p.isAI }))
  })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Ludo Game</CardTitle>
          </CardHeader>
          <CardContent>
            {!gameStarted ? (
              <Button onClick={initGame}>Start New Game</Button>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-lg font-bold">
                    Current Player: <span className="text-blue-600">{players[currentPlayer]?.color}</span>
                  </p>
                  {isYourTurn ? (
                    <p className="text-green-600 font-bold">It&apos;s your turn!</p>
                  ) : (
                    <p className="text-red-600">Waiting for {players[currentPlayer]?.color} player to make a move...</p>
                  )}
                  <p className="mt-2">Dice: {dice.every(d => d === 0) ? '(Not rolled yet)' : dice.join(', ')}</p>
                </div>
                {isYourTurn && (
                  <div className="mb-4">
                    {dice.every(d => d === 0) ? (
                      <div>
                        <p className="mb-2 text-blue-600">Click the button below to roll the dice:</p>
                        <Button onClick={handleRollDice} className="bg-blue-500 hover:bg-blue-700">Roll Dice</Button>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-2 text-blue-600">Select a token to move:</p>
                        <div className="flex flex-wrap gap-2">
                          {players[currentPlayer].tokens.map((token, index) => (
                            <Button
                              key={index}
                              onClick={() => handleMoveToken(index)}
                              disabled={!canMoveToken((session as CustomSession).user.id!, index)}
                              className={`${canMoveToken((session as CustomSession).user.id!, index) ? 'bg-green-500 hover:bg-blue-700' : 'bg-gray-300'}`}
                            >
                              Move Token {index + 1}
                            </Button>
                          ))}
                        </div>
                        <p className="mt-2">Remaining dice: {dice.join(', ')}</p>
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
                <Button onClick={() => console.log(useGameStore.getState())}>
                  Log Game State
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {gameStarted && (
        <div className="w-full h-[600px] mt-4">
          <GameBoard />
        </div>
      )}
    </div>
  )
}