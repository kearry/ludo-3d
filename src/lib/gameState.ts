import { create } from 'zustand'
import { makeAIMove } from './aiPlayer'

export type Player = {
  id: string
  color: 'red' | 'green' | 'yellow' | 'blue'
  tokens: number[]
  isAI: boolean
}

type GameState = {
  players: Player[]
  currentPlayer: number
  dice: number[]
  addPlayer: (player: Player) => void
  rollDice: () => void
  moveToken: (playerId: string, tokenIndex: number) => GameState
  canMoveToken: (playerId: string, tokenIndex: number) => boolean
  playAITurn: () => void
}

const BOARD_SIZE = 52
const HOME_ENTRANCE = 50

export const useGameStore = create<GameState>((set, get) => ({
  players: [],
  currentPlayer: 0,
  dice: [0, 0],
  
  addPlayer: (player: Player) => set((state) => ({ 
    players: [...state.players, player] 
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
    if (tokenPosition === 0 && state.dice.includes(6)) return true

    // Can't move if token is already home
    if (tokenPosition > HOME_ENTRANCE) return false

    // For tokens not in base, check if the move is valid
    if (tokenPosition > 0) {
      const newPosition = (tokenPosition + diceSum - 1) % BOARD_SIZE + 1
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
    if (newPosition === 0 && state.dice.includes(6)) {
      newPosition = 1
    } else if (newPosition > 0) {
      newPosition = (newPosition + diceSum - 1) % BOARD_SIZE + 1
      if (newPosition === 0) newPosition = BOARD_SIZE  // Ensure we don't go back to 0
    }

    // Check if token is entering home
    if (newPosition > HOME_ENTRANCE && newPlayers[playerIndex].tokens[tokenIndex] <= HOME_ENTRANCE) {
      newPosition = HOME_ENTRANCE + (newPosition - HOME_ENTRANCE)
    }

    newPlayers[playerIndex].tokens[tokenIndex] = newPosition

    // Check if landed on enemy token
    newPlayers.forEach((player: Player, idx: number) => {
      if (idx !== playerIndex) {
        player.tokens = player.tokens.map((token: number) => {
          if (token === newPosition && token !== 0 && token !== 1) {
            return 0
          }
          return token
        })
      }
    })

    return { 
      ...state,
      players: newPlayers, 
      currentPlayer: state.dice.includes(6) ? state.currentPlayer : (state.currentPlayer + 1) % state.players.length,
      dice: [0, 0]  // Reset dice after move
    }
  },
  
  playAITurn: () => {
    set((state) => {
      const currentPlayer = state.players[state.currentPlayer];
      if (!currentPlayer.isAI) return state;

      get().rollDice();
      const newDice = get().dice;
      console.log(`AI Turn: Rolled dice ${newDice[0]}, ${newDice[1]}`);

      let newState = {...state, dice: newDice};

      // If a 6 is rolled and there's a token in base, always move it out
      if (newDice.includes(6) && currentPlayer.tokens.includes(0)) {
        const baseTokenIndex = currentPlayer.tokens.findIndex(t => t === 0);
        console.log(`AI Turn: Moving token ${baseTokenIndex} out of base`);
        newState = get().moveToken(currentPlayer.id, baseTokenIndex);
      } else {
        // Find the furthest token that can be moved
        const movableTokens = currentPlayer.tokens
          .map((pos, index) => ({ pos, index }))
          .filter(({ pos }) => pos > 0 && pos <= HOME_ENTRANCE)
          .sort((a, b) => b.pos - a.pos);

        for (const { index } of movableTokens) {
          if (get().canMoveToken(currentPlayer.id, index)) {
            console.log(`AI Turn: Moving token ${index}`);
            newState = get().moveToken(currentPlayer.id, index);
            break;
          }
        }
      }

      console.log('AI Turn: New state', JSON.stringify(newState, null, 2));
      return newState;
    });
  }
}))