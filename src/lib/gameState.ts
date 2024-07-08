import { create } from 'zustand'
import { makeAIMove } from './aiPlayer'

export type Player = {
  id: string
  color: 'red' | 'green' | 'yellow' | 'blue'
  tokens: number[]
  isAI: boolean
  startPosition: number
}

type GameState = {
  players: Player[]
  currentPlayer: number
  dice: number[]
  winner: string | null
  addPlayer: (player: Player) => void
  rollDice: () => void
  moveToken: (playerId: string, tokenIndex: number) => GameState
  canMoveToken: (playerId: string, tokenIndex: number) => boolean
  playAITurn: () => void
  checkWinCondition: () => void
}

const BOARD_SIZE = 48
const HOME_ENTRANCE = 50
const HOME_STEPS = 6

export const useGameStore = create<GameState>((set, get) => ({
  players: [],
  currentPlayer: 0,
  dice: [0, 0],
  winner: null,

  createGame: async () => {
    try {
      console.log('Creating new game...')
      const response = await fetch('/api/game', {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to create game')
      }
      const game = await response.json()
      console.log('Game created:', game)
      set({
        gameId: game.id,
        players: game.players.map((p: any) => ({
          ...p,
          tokens: p.tokens.split(',').map(Number),
          startPosition: game.players.findIndex((player: any) => player.id === p.id) * 12,
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
      if (!response.ok) {
        throw new Error('Failed to load game')
      }
      const game = await response.json()
      console.log('Game loaded:', game)
      set({
        gameId: game.id,
        players: game.players.map((p: any) => ({
          ...p,
          tokens: p.tokens.split(',').map(Number),
          startPosition: game.players.findIndex((player: any) => player.id === p.id) * 12,
        })),
        currentPlayer: game.currentPlayer,
        dice: game.dice.split(',').map(Number),
      })
    } catch (error) {
      console.error('Error loading game:', error)
      throw error
    }
  },

  addPlayer: (player: Player) => set((state) => ({
    players: [...state.players, {
      ...player,
      startPosition: state.players.length * 12
    }]
  })),

  rollDice: () => set({
    dice: [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
  }),

  canMoveToken: (playerId: string, tokenIndex: number) => {
    const state = get()
    const player = state.players.find(p => p.id === playerId)
    if (!player) return false

    const diceSum = state.dice[0] + state.dice[1]
    const tokenPosition = player.tokens[tokenIndex]

    // Can move out of base if any dice is 6
    if (tokenPosition === -1 && state.dice.includes(6)) return true

    // Can't move if token is already home
    if (tokenPosition >= HOME_ENTRANCE + HOME_STEPS) return false

    // For tokens not in base, check if the move is valid
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

  moveToken: (playerId: string, tokenIndex: number): GameState => {
    const state = get()
    if (!get().canMoveToken(playerId, tokenIndex)) {
      return state
    }

    const playerIndex = state.players.findIndex(p => p.id === playerId)
    if (playerIndex === -1) {
      return state
    }

    const newPlayers: Player[] = JSON.parse(JSON.stringify(state.players))
    const diceSum = state.dice[0] + state.dice[1]
    let newPosition = newPlayers[playerIndex].tokens[tokenIndex]

    // If token is in base and one of the dice is 6, move it out
    if (newPosition === -1 && state.dice.includes(6)) {
      newPosition = newPlayers[playerIndex].startPosition
    } else if (newPosition >= 0) {
      newPosition = (newPosition + diceSum) % BOARD_SIZE
      if (newPosition >= HOME_ENTRANCE) {
        newPosition = HOME_ENTRANCE + (newPosition - HOME_ENTRANCE)
        if (newPosition > HOME_ENTRANCE + HOME_STEPS) {
          newPosition = HOME_ENTRANCE + HOME_STEPS
        }
      }
    }

    newPlayers[playerIndex].tokens[tokenIndex] = newPosition

    // Check if landed on enemy token
    newPlayers.forEach((player: Player, idx: number) => {
      if (idx !== playerIndex) {
        player.tokens = player.tokens.map((token: number) => {
          if (token === newPosition && token !== -1 && token < HOME_ENTRANCE) {
            return -1 // Kick back to base
          }
          return token
        })
      }
    })

    const newState = {
      ...state,
      players: newPlayers,
      currentPlayer: state.dice.includes(6) ? state.currentPlayer : (state.currentPlayer + 1) % state.players.length,
      dice: [0, 0]  // Reset dice after move
    }

    get().checkWinCondition()

    return newState
  },

  playAITurn: () => {
    set((state) => {
      const currentPlayer = state.players[state.currentPlayer];
      if (!currentPlayer.isAI) return state;

      get().rollDice();
      const newDice = get().dice;
      console.log(`AI Turn: Rolled dice ${newDice[0]}, ${newDice[1]}`);

      let newState = { ...state, dice: newDice };

      const moveResult = makeAIMove(currentPlayer, newDice);
      if (moveResult !== -1) {
        newState = get().moveToken(currentPlayer.id, moveResult);
      }

      console.log('AI Turn: New state', JSON.stringify(newState, null, 2));
      return newState;
    });
  },

  checkWinCondition: () => {
    set((state) => {
      const winner = state.players.find(player =>
        player.tokens.every(token => token >= HOME_ENTRANCE + HOME_STEPS)
      );
      if (winner) {
        return { ...state, winner: winner.id };
      }
      return state;
    });
  }
}))