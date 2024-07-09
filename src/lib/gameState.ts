import { create } from 'zustand'
import { makeAIMove } from './aiPlayer'

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
  winner: string | null
  createGame: (userId: string) => Promise<void>
  loadGame: (gameId: string) => Promise<void>
  rollDice: () => Promise<void>
  moveToken: (playerId: string, tokenIndex: number) => Promise<Boolean>
  canMoveToken: (playerId: string, tokenIndex: number) => boolean
  playAITurn: () => Promise<void>
  checkWinCondition: () => void
  updateGameState: () => Promise<void>
}

const BOARD_SIZE = 48
const HOME_ENTRANCE = 50
const HOME_STEPS = 6

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  players: [],
  currentPlayer: 0,
  dice: [0, 0],
  winner: null,

  createGame: async (userId: string) => {
    try {
      console.log('Creating new game for user:', userId)
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })
      if (!response.ok) throw new Error('Failed to create game')
      const game = await response.json()
      console.log('Game created:', game)
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
      console.error('Error creating game:', error)
      throw error
    }
  },

  loadGame: async (gameId: string) => {
    try {
      console.log('Loading game:', gameId)
      const response = await fetch(`/api/game?id=${gameId}`)
      if (!response.ok) throw new Error('Failed to load game')
      const game = await response.json()
      console.log('Game loaded:', game)
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
      console.error('Error loading game:', error)
      throw error
    }
  },

  rollDice: async () => {
    const newDice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
    console.log('Rolling dice:', newDice)
    set(state => ({ ...state, dice: newDice }))
    await get().updateGameState()
  },

  canMoveToken: (playerId: string, tokenIndex: number) => {
    const state = get()
    const player = state.players.find(p => p.id === playerId)
    if (!player) return false

    const diceSum = state.dice[0] + state.dice[1]
    const tokenPosition = player.tokens[tokenIndex]

    if (tokenPosition === -1 && state.dice.includes(6)) return true
    if (tokenPosition >= HOME_ENTRANCE + HOME_STEPS) return false

    if (tokenPosition >= 0) {
      let newPosition = (tokenPosition + diceSum) % BOARD_SIZE
      if (newPosition >= HOME_ENTRANCE) {
        newPosition = HOME_ENTRANCE + (newPosition - HOME_ENTRANCE)
        if (newPosition > HOME_ENTRANCE + HOME_STEPS) return false
      }

      const isBlocked = state.players.some(p =>
        p.id !== playerId &&
        p.tokens.filter(t => t === newPosition).length >= 2
      )
      return !isBlocked
    }

    return false
  },

  moveToken: async (playerId: string, tokenIndex: number): Promise<Boolean> => {
    const state = get()
    const playerIndex = state.players.findIndex(p => p.id === playerId)
    if (playerIndex === -1) return false;
  
    const player = state.players[playerIndex]
    let newPlayers = JSON.parse(JSON.stringify(state.players))
    let newDice = [...state.dice]
    let currentPosition = player.tokens[tokenIndex]
    let movesMade = 0
  
    const moveSingle = (diceValue: number) => {
      if (currentPosition === -1 && diceValue === 6) {
        // Move out of base
        currentPosition = player.startPosition
        movesMade++
      } else if (currentPosition >= 0) {
        // Move on the board
        currentPosition = (currentPosition + diceValue) % BOARD_SIZE
        if (currentPosition >= HOME_ENTRANCE) {
          currentPosition = HOME_ENTRANCE + (currentPosition - HOME_ENTRANCE)
          if (currentPosition > HOME_ENTRANCE + HOME_STEPS) {
            currentPosition = HOME_ENTRANCE + HOME_STEPS
          }
        }
        movesMade++
      }
    }
  
    // Attempt to move
    if (currentPosition === -1 && !newDice.includes(6)) {
      // Can't move out of base without a 6
      movesMade = 0
    } else {
      // First move
      moveSingle(newDice[0])
      newDice.shift()
  
      // Second move if first was successful and dice remain
      if (movesMade > 0 && newDice.length > 0) {
        moveSingle(newDice[0])
        newDice.shift()
      }
    }
  
    if (movesMade > 0) {
      newPlayers[playerIndex].tokens[tokenIndex] = currentPosition
  
      // Check for kicking out other players' tokens
      newPlayers.forEach((otherPlayer: Player, idx: number) => {
        if (idx !== playerIndex) {
          otherPlayer.tokens = otherPlayer.tokens.map((token: number) => {
            if (token === currentPosition && token !== -1 && token < HOME_ENTRANCE) {
              return -1 // Kick back to base
            }
            return token
          })
        }
      })
    }
  
    // Always move to the next player if no moves were made
    const nextPlayer = movesMade > 0 && newDice.includes(6) 
      ? state.currentPlayer 
      : (state.currentPlayer + 1) % state.players.length
  
    const newState = { 
      players: newPlayers, 
      currentPlayer: nextPlayer,
      dice: movesMade > 0 && newDice.length > 0 ? newDice : [0, 0]  // Reset dice if all used or no move made
    }
  
    set(newState)
    await get().updateGameState()
    get().checkWinCondition()
  
    return movesMade;
  },

  playAITurn: async () => {
    const state = get()
    const currentPlayer = state.players[state.currentPlayer]
    if (!currentPlayer.isAI) return

    await get().rollDice()
    const newDice = get().dice
    console.log(`AI Turn: Rolled dice ${newDice[0]}, ${newDice[1]}`)

    const moveResult = makeAIMove(currentPlayer, newDice)
    if (moveResult !== -1) {
      await get().moveToken(currentPlayer.id, moveResult)
    }

    console.log('AI Turn: New state', JSON.stringify(get(), null, 2))
  },

  checkWinCondition: () => {
    const state = get()
    const winner = state.players.find(player =>
      player.tokens.every(token => token >= HOME_ENTRANCE + HOME_STEPS)
    )
    if (winner) {
      set({ winner: winner.id })
    }
  },

  updateGameState: async () => {
    const state = get()
    if (!state.gameId) return

    try {
      console.log('Updating game state:', {
        gameId: state.gameId,
        currentPlayer: state.currentPlayer,
        dice: state.dice,
        players: state.players.map(player => ({
          id: player.id,
          tokens: player.tokens,
        })),
      })

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
            tokens: player.tokens,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to update game state: ${JSON.stringify(errorData)}`)
      }

      console.log('Game state updated successfully')
    } catch (error) {
      console.error('Error updating game state:', error)
    }
  },
}))