import { create } from 'zustand'
import { makeAIMove } from './aiPlayer'
import { log } from './logger'

export type Player = {
  id: string
  userId: string
  color: 'red' | 'green' | 'yellow' | 'blue'
  tokens: number[]
  isAI: boolean
  startPosition: number
}

type GameState = {
  gameId: string | null
  players: Player[]
  currentPlayer: number
  dice: number[]
  selectedDie: number | null
  winner: string | null
  createGame: (userId: string) => Promise<void>
  loadGame: (gameId: string) => Promise<void>
  rollDice: () => Promise<void>
  selectDie: (dieIndex: number) => void
  moveToken: (playerId: string, tokenIndex: number) => Promise<boolean>
  canMoveToken: (playerId: string, tokenIndex: number) => boolean
  hasValidMove: () => boolean
  playAITurn: () => Promise<void>
  checkWinCondition: () => void
  updateGameState: () => Promise<void>
  endTurn: () => Promise<void>
}

const BOARD_SIZE = 48
const HOME_ENTRANCE = 50
const HOME_STEPS = 6
const TOTAL_STEPS = HOME_ENTRANCE + HOME_STEPS

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  players: [],
  currentPlayer: 0,
  dice: [0, 0],
  selectedDie: null,
  winner: null,

  createGame: async (userId: string) => {
    log('Entering createGame function')
    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })
      if (!response.ok) throw new Error('Failed to create game')
      const game = await response.json()
      log(`Game created: ${JSON.stringify(game)}`)
      set({
        gameId: game.id,
        players: game.players.map((p: any, index: number) => ({
          ...p,
          tokens: p.tokens.split(',').map(Number),
          startPosition: index * 12,
        })),
        currentPlayer: game.currentPlayer,
        dice: game.dice.split(',').map(Number),
      })
    } catch (error) {
      log(`Error creating game: ${error}`)
      throw error
    }
  },

  loadGame: async (gameId: string) => {
    log('Entering loadGame function')
    try {
      const response = await fetch(`/api/game?id=${gameId}`)
      if (!response.ok) throw new Error('Failed to load game')
      const game = await response.json()
      log(`Game loaded: ${JSON.stringify(game)}`)
      set({
        gameId: game.id,
        players: game.players.map((p: any, index: number) => ({
          ...p,
          tokens: p.tokens.split(',').map(Number),
          startPosition: index * 12,
        })),
        currentPlayer: game.currentPlayer,
        dice: game.dice.split(',').map(Number),
      })
    } catch (error) {
      log(`Error loading game: ${error}`)
      throw error
    }
  },

  rollDice: async () => {
    log('Entering rollDice function')
    const newDice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
    log(`Rolled dice: ${newDice.join(', ')}`)
    set({ dice: newDice, selectedDie: null })
    await get().updateGameState()
  },

  selectDie: (dieIndex: number) => {
    log(`Entering selectDie function with index ${dieIndex}`)
    set({ selectedDie: dieIndex })
  },

  canMoveToken: (playerId: string, tokenIndex: number) => {
    log(`Entering canMoveToken function for player ${playerId}, token ${tokenIndex}`)
    const state = get()
    const player = state.players.find(p => p.id === playerId)
    if (!player || state.selectedDie === null) {
      log(`Player not found or no die selected`)
      return false
    }

    const diceValue = state.dice[state.selectedDie]
    const tokenPosition = player.tokens[tokenIndex]

    log(`Checking move for player ${player.color}, token ${tokenIndex}, position ${tokenPosition}, dice ${diceValue}`)

    if (tokenPosition === -1 && diceValue === 6) {
      log('Can move out of base with a 6')
      return true
    }

    if (tokenPosition >= TOTAL_STEPS) {
      log('Token already at final position')
      return false
    }

    if (tokenPosition >= 0) {
      let newPosition = tokenPosition + diceValue
      if (tokenPosition < HOME_ENTRANCE && newPosition >= HOME_ENTRANCE) {
        newPosition = HOME_ENTRANCE + (newPosition - HOME_ENTRANCE)
      }

      if (newPosition > TOTAL_STEPS) {
        log('Move would exceed final position')
        return false
      }

      const isBlocked = state.players.some(p => 
        p.id !== playerId && 
        p.tokens.filter(t => t === newPosition && t < HOME_ENTRANCE).length >= 2
      )

      if (isBlocked) {
        log('Move blocked by other player tokens')
        return false
      }

      log('Move is valid')
      return true
    }

    log('Move is not valid')
    return false
  },

  moveToken: async (playerId: string, tokenIndex: number): Promise<boolean> => {
    log(`Entering moveToken function for player ${playerId}, token ${tokenIndex}`)
    const state = get()
    if (state.selectedDie === null) {
      log('No die selected. Cannot move token.')
      return false
    }
    
    const playerIndex = state.players.findIndex(p => p.userId === playerId)
    if (playerIndex === -1) {
      log(`Player with userId ${playerId} not found`)
      return false
    }

    const player = state.players[playerIndex]
    let newPlayers = JSON.parse(JSON.stringify(state.players))
    let currentPosition = player.tokens[tokenIndex]
    const diceValue = state.dice[state.selectedDie]

    log(`Attempting to move token ${tokenIndex} for player ${player.color} with dice value ${diceValue}`)

    if (currentPosition === -1 && diceValue === 6) {
      currentPosition = player.startPosition
      log(`Token moved out of base to position ${currentPosition}`)
    } else if (currentPosition >= 0) {
      currentPosition += diceValue
      if (currentPosition >= HOME_ENTRANCE && currentPosition < TOTAL_STEPS) {
        currentPosition = HOME_ENTRANCE + ((currentPosition - HOME_ENTRANCE) % HOME_STEPS)
        log(`Token moved in home stretch to position ${currentPosition}`)
      } else if (currentPosition >= TOTAL_STEPS) {
        log(`Invalid move: would move beyond last home space`)
        return false
      } else {
        currentPosition %= BOARD_SIZE
        log(`Token moved on main track to position ${currentPosition}`)
      }
    } else {
      log(`Invalid move: token in base and dice value is not 6`)
      return false
    }

    newPlayers[playerIndex].tokens[tokenIndex] = currentPosition

    newPlayers.forEach((otherPlayer, idx) => {
      if (idx !== playerIndex) {
        const tokenCount = otherPlayer.tokens.filter(t => t === currentPosition).length
        if (tokenCount === 1 && currentPosition < HOME_ENTRANCE) {
          otherPlayer.tokens = otherPlayer.tokens.map(t => t === currentPosition ? -1 : t)
          log(`Kicked out ${otherPlayer.color} token back to base`)
        }
      }
    })

    const newDice = [...state.dice]
    newDice[state.selectedDie] = 0

    set({ 
      players: newPlayers,
      dice: newDice,
      selectedDie: null
    })

    log(`After move - Dice: ${newDice}, Current player: ${state.currentPlayer}`)

    await get().updateGameState()
    get().checkWinCondition()

    return true
  },

  hasValidMove: () => {
    log('Entering hasValidMove function')
    const state = get()
    const currentPlayer = state.players[state.currentPlayer]
    
    log(`Checking for valid moves for ${currentPlayer.color}`)
    log(`Dice: ${state.dice}`)

    return state.dice.some((dieValue, dieIndex) => {
      if (dieValue === 0) return false
      state.selectedDie = dieIndex
      const hasMove = currentPlayer.tokens.some((_, tokenIndex) => 
        state.canMoveToken(currentPlayer.id, tokenIndex)
      )
      log(`Die ${dieIndex} (value ${dieValue}): ${hasMove ? 'Has valid move' : 'No valid move'}`)
      return hasMove
    })
  },

  playAITurn: async () => {
    log('Entering playAITurn function')
    const state = get()
    const currentPlayer = state.players[state.currentPlayer]
    if (!currentPlayer.isAI) return

    log(`AI Turn: Player ${currentPlayer.color}`)

    await get().rollDice()
    let newDice = [...get().dice]
    log(`AI dice roll: ${newDice}`)

    for (let i = 0; i < newDice.length; i++) {
      if (newDice[i] === 0) continue
      get().selectDie(i)
      const moveResult = makeAIMove(currentPlayer, [newDice[i]])
      if (moveResult !== -1) {
        log(`AI moving token: ${moveResult}`)
        await get().moveToken(currentPlayer.id, moveResult)
      } else {
        log('AI has no valid moves for this die')
      }
      newDice = get().dice
    }

    if (newDice.every(d => d === 0)) {
      await get().endTurn()
    }

    log('AI Turn ended')
  },

  checkWinCondition: () => {
    log('Entering checkWinCondition function')
    const state = get()
    const winner = state.players.find(player => 
      player.tokens.every(token => token === TOTAL_STEPS)
    )
    if (winner) {
      log(`Player ${winner.color} has won the game!`)
      set({ winner: winner.id })
    }
  },

  updateGameState: async () => {
    log('Entering updateGameState function')
    const state = get()
    if (!state.gameId) return

    try {
      const response = await fetch(`/api/game?id=${state.gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPlayer: state.currentPlayer,
          dice: state.dice,
          players: state.players.map(player => ({
            ...player,
            tokens: player.tokens.join(','),
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update game state')
      }
      log('Game state updated successfully')
    } catch (error) {
      log(`Error updating game state: ${error}`)
    }
  },

  endTurn: async () => {
    log('Entering endTurn function')
    const state = get()
    const nextPlayer = (state.currentPlayer + 1) % state.players.length
    log(`Turn ended. Moving to next player: ${state.players[nextPlayer].color}`)
    set({ 
      currentPlayer: nextPlayer,
      dice: [0, 0],
      selectedDie: null
    })
    await get().updateGameState()
  }
}))