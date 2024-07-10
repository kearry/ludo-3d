import { create } from 'zustand'

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
}

const BOARD_SIZE = 48
const HOME_ENTRANCE = 48
const HOME_STEPS = 6
const TOTAL_STEPS = HOME_ENTRANCE + HOME_STEPS

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  players: [],
  currentPlayer: 0,
  dice: [0, 0],
  selectedDie: null,
  winner: null,

  createGame: async (userEmail: string) => {
    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create game')
      }
      const game = await response.json()
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
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' })
    }
  },

  loadGame: async (gameId: string) => {
    try {
      const response = await fetch(`/api/game?id=${gameId}`)
      if (!response.ok) throw new Error('Failed to load game')
      const game = await response.json()
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
    const newDice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
    console.log("Rolled Dice:", newDice); // Add logging to debug dice values
    set({ dice: newDice });

    if (!get().hasValidMove()) {
        if (newDice.includes(6)) {
            // Roll again
            await get().rollDice();
        } else {
            // End turn
            set(state => ({
                currentPlayer: (state.currentPlayer + 1) % state.players.length,
                dice: [0, 0]
            }));
        }
    }

    console.log("Dice After Validation Check:", get().dice); // Add logging to debug dice values

    await get().updateGameState();
},

  selectDie: (dieIndex: number) => {
    set({ selectedDie: dieIndex })
  },

  canMoveToken: (playerId: string, tokenIndex: number) => {
    const state = get()
    const player = state.players.find(p => p.id === playerId)
    if (!player || state.selectedDie === null) return false
  
    const diceValue = state.dice[state.selectedDie]
    const tokenPosition = player.tokens[tokenIndex]
  
    if (tokenPosition === -1 && diceValue === 6) return true
    if (tokenPosition >= TOTAL_STEPS) return false
  
    let newPosition = tokenPosition + diceValue
    if (tokenPosition < HOME_ENTRANCE && newPosition >= HOME_ENTRANCE) {
      newPosition = HOME_ENTRANCE + (newPosition - HOME_ENTRANCE)
    }
  
    if (newPosition > TOTAL_STEPS) return false
  
    // Check for blocks
    return !state.players.some(p => 
      p.id !== playerId && 
      p.tokens.filter(t => t === newPosition && t < HOME_ENTRANCE).length >= 2
    )
  },

  hasValidMove: () => {
    const state = get()
    const currentPlayer = state.players[state.currentPlayer]
    return state.dice.some((die, index) =>
      currentPlayer.tokens.some((_, tokenIndex) => get().canMoveToken(currentPlayer.id, tokenIndex))
    )
  },

  moveToken: async (playerId: string, tokenIndex: number): Promise<boolean> => {
    const state = get()
    if (state.selectedDie === null) return false
    
    const playerIndex = state.players.findIndex(p => p.id === playerId)
    if (playerIndex === -1) return false
  
    const player = state.players[playerIndex]
    let newPlayers = JSON.parse(JSON.stringify(state.players))
    let currentPosition = player.tokens[tokenIndex]
    const diceValue = state.dice[state.selectedDie]
  
    if (currentPosition === -1 && diceValue === 6) {
      // Move out of base
      currentPosition = player.startPosition
    } else if (currentPosition >= 0) {
      // Move on the board
      currentPosition += diceValue
      if (currentPosition >= HOME_ENTRANCE && currentPosition < TOTAL_STEPS) {
        // Entering or moving in home stretch
        currentPosition = HOME_ENTRANCE + ((currentPosition - HOME_ENTRANCE) % HOME_STEPS)
      } else if (currentPosition >= TOTAL_STEPS) {
        // Cannot move beyond last home space
        return false
      } else {
        // Normal movement on main track
        currentPosition %= BOARD_SIZE
      }
    } else {
      return false
    }
  
    newPlayers[playerIndex].tokens[tokenIndex] = currentPosition
  
    // Check for kicking out other players' single tokens
    newPlayers.forEach((otherPlayer: Player, idx: number) => {
      if (idx !== playerIndex) {
      const tokenCount = otherPlayer.tokens.filter((t: number) => t === currentPosition).length
      if (tokenCount === 1 && currentPosition < HOME_ENTRANCE) {
        otherPlayer.tokens = otherPlayer.tokens.map((t: number) => t === currentPosition ? -1 : t)
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
  
    if (newDice.every(d => d === 0)) {
      const rolledSix = state.dice.includes(6)
      if (!rolledSix) {
        set(state => ({ 
          currentPlayer: (state.currentPlayer + 1) % state.players.length,
          dice: [0, 0]  // Reset dice for next turn
        }))
      }
    }
  
    await get().updateGameState()
    get().checkWinCondition()
  
    return true
  },


  playAITurn: async () => {
    const state = get()
    const currentPlayer = state.players[state.currentPlayer]
    if (!currentPlayer.isAI) return
  
    await get().rollDice()
    let newDice = [...get().dice]
  
    while (newDice.some(d => d !== 0)) {
      const dieIndex = newDice.findIndex(d => d !== 0)
      get().selectDie(dieIndex)
  
      const validMoves = currentPlayer.tokens
        .map((_, index) => index)
        .filter(index => get().canMoveToken(currentPlayer.id, index))
  
      if (validMoves.length > 0) {
        const moveIndex = Math.floor(Math.random() * validMoves.length)
        await get().moveToken(currentPlayer.id, validMoves[moveIndex])
      } else {
        // No valid moves, end turn
        break
      }
  
      newDice = [...get().dice]
    }
  
    // If no 6 was rolled or no more moves are possible, move to next player
    if (newDice.every(d => d === 0)) {
      set(state => ({ 
        currentPlayer: (state.currentPlayer + 1) % state.players.length,
        dice: [0, 0]
      }))
    }
  
    await get().updateGameState()
  },

  checkWinCondition: () => {
    const state = get()
    const winner = state.players.find(player =>
      player.tokens.every(token => token === TOTAL_STEPS)
    )
    if (winner) {
      set({ winner: winner.id })
    }
  },

  updateGameState: async () => {
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
            id: player.id,
            tokens: player.tokens.join(','), // Always send tokens as a comma-separated string
          })),
        }),
      })
  
      if (!response.ok) {
        throw new Error('Failed to update game state')
      }
  
      const updatedGame = await response.json()
      // Optionally update local state with the response from the server
      set({
        players: updatedGame.players.map((p: any) => ({
          ...p,
          tokens: p.tokens.split(',').map(Number),
        })),
        currentPlayer: updatedGame.currentPlayer,
        dice: updatedGame.dice.split(',').map(Number),
      })
  
    } catch (error) {
      console.error('Error updating game state:', error)
    }
  },
}))
