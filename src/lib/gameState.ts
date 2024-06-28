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
  canMoveToken: (playerId: string, tokenIndex: number) => boolean
}

const BOARD_SIZE = 52
const HOME_ENTRANCE = 50

export const useGameStore = create<GameState>((set, get) => ({
  players: [],
  currentPlayer: 0,
  dice: [0, 0],
  addPlayer: (player: Player) => set((state) => ({ players: [...state.players, player] })),
  rollDice: () => set({ dice: [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1] }),
  canMoveToken: (playerId: string, tokenIndex: number) => {
    const state = get()
    const player = state.players.find(p => p.id === playerId)
    if (!player) return false

    const diceSum = state.dice[0] + state.dice[1]
    const tokenPosition = player.tokens[tokenIndex]

    console.log(`canMoveToken: playerId=${playerId}, tokenIndex=${tokenIndex}, diceSum=${diceSum}, tokenPosition=${tokenPosition}`)

    // Can't move if token is already home
    if (tokenPosition > HOME_ENTRANCE) return false

    // Can only leave base if one of the dice is a 6
    if (tokenPosition === 0 && state.dice[0] !== 6 && state.dice[1] !== 6) return false

    // Check if move would land on a block
    const newPosition = (tokenPosition === 0) ? 1 : (tokenPosition + diceSum) % BOARD_SIZE
    const isBlock = state.players.some(p => 
      p.id !== playerId && p.tokens.filter(t => t === newPosition).length >= 2
    )

    console.log(`canMoveToken result: ${!isBlock}`)
    return !isBlock
  },
  moveToken: (playerId: string, tokenIndex: number) => set((state) => {
    console.log(`moveToken called: playerId=${playerId}, tokenIndex=${tokenIndex}`)
    console.log(`Current state:`, JSON.stringify(state, null, 2))

    if (!get().canMoveToken(playerId, tokenIndex)) {
      console.log('canMoveToken returned false, not moving token')
      return state
    }

    const playerIndex = state.players.findIndex(p => p.id === playerId)
    if (playerIndex === -1) {
      console.log(`Player with id ${playerId} not found`)
      return state
    }

    const newPlayers: Player[] = JSON.parse(JSON.stringify(state.players))
    const diceSum = state.dice[0] + state.dice[1]
    let newPosition = newPlayers[playerIndex].tokens[tokenIndex]

    console.log(`Initial position: ${newPosition}, Dice sum: ${diceSum}`)

    // If token is in base and one of the dice is 6, move it out
    if (newPosition === 0 && (state.dice[0] === 6 || state.dice[1] === 6)) {
      newPosition = 1
      console.log('Moving token out of base')
    } else {
      newPosition = (newPosition + diceSum) % BOARD_SIZE
      console.log(`New position after move: ${newPosition}`)
    }

    // Check if token is entering home
    if (newPosition > HOME_ENTRANCE && newPlayers[playerIndex].tokens[tokenIndex] <= HOME_ENTRANCE) {
      newPosition = HOME_ENTRANCE + (newPosition - HOME_ENTRANCE)
      console.log(`Token entering home, adjusted position: ${newPosition}`)
    }

    newPlayers[playerIndex].tokens[tokenIndex] = newPosition

    // Check if landed on enemy token
    newPlayers.forEach((player: Player, idx: number) => {
      if (idx !== playerIndex) {
        player.tokens = player.tokens.map((token: number) => {
          if (token === newPosition) {
            console.log(`Kicking back enemy token to base: player=${idx}, token=${token}`)
            return 0
          }
          return token
        })
      }
    })

    console.log(`New state:`, JSON.stringify({ 
      players: newPlayers, 
      currentPlayer: state.dice.includes(6) ? state.currentPlayer : (state.currentPlayer + 1) % state.players.length,
      dice: [0, 0]
    }, null, 2))

    return { 
      players: newPlayers, 
      currentPlayer: state.dice.includes(6) ? state.currentPlayer : (state.currentPlayer + 1) % state.players.length,
      dice: [0, 0]  // Reset dice after move
    }
  }),
}))