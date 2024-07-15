import React, { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import GameBoard from '../components/GameBoard'
import { useGameStore } from '@/lib/gameState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { log, setLogging } from '@/lib/logger'
import LudoBoard from '@/components/LudoBoard'

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
    selectedDie,
    winner,
    createGame,
    loadGame,
    rollDice,
    selectDie,
    moveToken,
    canMoveToken,
    hasValidMove,
    playAITurn
  } = useGameStore()

  useEffect(() => {
    log('Entering first useEffect in GamePage')
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    log('Entering session logging useEffect in GamePage')
    log(`Session: ${JSON.stringify({ status, userId: session?.user?.id })}`)
  }, [session, status])

  const initGame = useCallback(async () => {
    log('Entering initGame function')
    if (status === 'authenticated' && session?.user) {
      try {
        if (gameId) {
          await loadGame(gameId as string)
        } else {
          await createGame(session.user.id)
        }
        setGameStarted(true)
      } catch (err) {
        console.error('Game initialization error:', err)
        setError('Failed to initialize the game. Please try again.')
      }
    }
  }, [status, session, gameId, loadGame, createGame])

  useEffect(() => {
    log('Entering game initialization useEffect in GamePage')
    if (status === 'authenticated' && session?.user && !gameStarted) {
      initGame()
    }
  }, [status, session, gameId, gameStarted, initGame])

  useEffect(() => {
    log('Entering AI turn useEffect in GamePage')
    if (gameStarted && players[currentPlayer]?.isAI && dice.some(d => d !== 0)) {
      const timer = setTimeout(() => {
        playAITurn()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [gameStarted, currentPlayer, players, dice, playAITurn])

  useEffect(() => {
    log('Entering game state update logging useEffect in GamePage')
    log(`Game state updated: ${JSON.stringify({
      currentPlayer,
      dice,
      players: players.map(p => ({ id: p.id, userId: p.userId, color: p.color, tokens: p.tokens }))
    })}`)
  }, [currentPlayer, dice, players])

  const handleRollDice = async () => {
    log('Entering handleRollDice function')
    if (players[currentPlayer]?.userId === session?.user?.id) {
      await rollDice()
      log(`Dice rolled: ${useGameStore.getState().dice}`)
    }
  }

  const handleSelectDie = (dieIndex: number) => {
    log(`Entering handleSelectDie function for die ${dieIndex}`)
    if (players[currentPlayer]?.userId === session?.user?.id) {
      selectDie(dieIndex)
    }
  }

  const handleMoveToken = async (tokenIndex: number) => {
    log(`Entering handleMoveToken function for token ${tokenIndex}`)
    if (players[currentPlayer]?.userId === session?.user?.id && selectedDie !== null) {
      const moveMade = await moveToken(session.user.id, tokenIndex)
      if (moveMade) {
        log("Token moved successfully")
      } else {
        log("Invalid move")
      }
    } else {
      log("Cannot move token: either not your turn or no die selected")
    }
  }

  const isYourTurn = players[currentPlayer]?.userId === session?.user?.id

  const canUseDie = (dieValue: number, dieIndex: number) => {
    log(`Entering canUseDie function for die ${dieIndex} with value ${dieValue}`)
    const canUse = dieValue === 6 || players[currentPlayer].tokens.some((token) => token !== -1);
    log(`Can use die ${dieIndex} (value ${dieValue}): ${canUse}`);
    return canUse;
  }

  log(`Render state: ${JSON.stringify({ 
    gameStarted, 
    isYourTurn, 
    currentPlayer, 
    dice, 
    playerId: session?.user?.id, 
    currentPlayerId: players[currentPlayer]?.userId,
    players: players.map(p => ({ id: p.id, userId: p.userId, color: p.color, isAI: p.isAI }))
  })}`)

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
                    <p className="text-green-600 font-bold">It's your turn!</p>
                  ) : (
                    <p className="text-red-600">Waiting for {players[currentPlayer]?.color} player to make a move...</p>
                  )}
                  <p className="mt-2">Dice: {dice.join(', ')}</p>
                </div>
                {isYourTurn && (
                  <div className="mb-4">
                    {dice.every(d => d === 0) ? (
                      <div>
                        <p className="mb-2 text-blue-600">Click the button below to roll the dice:</p>
                        <Button onClick={handleRollDice} className="bg-blue-500 hover:bg-blue-700">Roll Dice</Button>
                      </div>
                    ) : hasValidMove() ? (
                      selectedDie === null ? (
                        <div>
                          <p className="mb-2 text-blue-600">Select which die to use:</p>
                          {dice.map((value, index) => (
                            <Button
                              key={index}
                              onClick={() => handleSelectDie(index)}
                              className="mr-2 bg-blue-500 hover:bg-blue-700"
                              disabled={value === 0 || !canUseDie(value, index)}
                            >
                              Use {value}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <p className="mb-2 text-blue-600">Select a token to move:</p>
                          <div className="flex flex-wrap gap-2">
                            {players[currentPlayer].tokens.map((token, index) => (
                              <Button
                                key={index}
                                onClick={() => handleMoveToken(index)}
                                disabled={!canMoveToken(players[currentPlayer].id, index)}
                                className={`${canMoveToken(players[currentPlayer].id, index) ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-300'}`}
                              >
                                Move Token {index + 1}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )
                    ) : (
                      <div>
                        <p className="mb-2 text-red-600">No valid moves available. Your turn will be skipped.</p>
                        <Button onClick={handleRollDice} className="bg-blue-500 hover:bg-blue-700">End Turn</Button>
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
          <LudoBoard />
        </div>
      )}
    </div>
  )
}