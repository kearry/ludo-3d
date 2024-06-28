import { create } from 'zustand'

type Player = {
  id: string
  color: 'red' | 'green' | 'yellow' | 'blue'
  tokens: number[]
}

type GameState = {
  players: Player[]
  currentPlayer: number
  dice: number[]
  addPlayer: (player: Player) => void
  rollDice: () => void
  moveToken: (playerId: string, tokenIndex: number) => void
}

export const useGameStore = create<GameState>((set) => ({
  players: [],
  currentPlayer: 0,
  dice: [0, 0],
  addPlayer: (player: Player) => set((state) => ({ players: [...state.players, player] })),
  rollDice: () => set({ dice: [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1] }),
  moveToken: (playerId: string, tokenIndex: number) => set((state) => {
    const playerIndex = state.players.findIndex(p => p.id === playerId)
    if (playerIndex === -1) return state

    const newPlayers = [...state.players]
    const moveAmount = state.dice[0] + state.dice[1]
    newPlayers[playerIndex].tokens[tokenIndex] += moveAmount

    // Implement game rules here (e.g., sending tokens home, winning conditions)

    return { players: newPlayers, currentPlayer: (state.currentPlayer + 1) % state.players.length }
  }),
}))