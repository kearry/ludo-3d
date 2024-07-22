import { create } from 'zustand'
import { makeAIMove } from './aiPlayer'
import { log } from './logger'
import { GameState } from './gameTypes'
import { TRACK_STEPS, HOME_STEPS, TOTAL_STEPS } from './constants'

export type Player = {
  id: string
  userId: string
  color: 'red' | 'green' | 'yellow' | 'black'
  tokens: number[]
  isAI: boolean
  startPosition: number
}

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
          id: p.id,
          userId: p.userId || null,
          color: p.color,
          tokens: p.tokens.split(',').map(Number),
          startPosition: index * 12,
          isAI: !p.userId, // Set isAI to true if userId is null or undefined
        })),
        currentPlayer: game.currentPlayer,
        dice: game.dice.split(',').map(Number),
      })
      log(`Game state after creation: ${JSON.stringify(get(), null, 2)}`)
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

    if (tokenPosition >= TOTAL_STEPS - 1) {
      log('Token already at final position')
      return false
    }

    if (tokenPosition >= 0) {
      // Token is not at base
      let newPosition = tokenPosition + diceValue

      if (newPosition > TOTAL_STEPS - 1) {
        log('Move would exceed final position')
        return false
      }

      const isBlocked = state.players.some(p =>
        p.id !== playerId &&
        p.tokens.filter(t => t === newPosition && t < TRACK_STEPS).length >= 2
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

    const player = state.players.find(p => p.id === playerId)
    if (!player) {
      log(`Player with id ${playerId} not found. Available players:`)
      state.players.forEach(p => log(`Player ID: ${p.id}, Color: ${p.color}`))
      return false
    }

    log(`Moving token for player: ${player.color}`)

    let newPlayers = JSON.parse(JSON.stringify(state.players))
    let currentPosition = player.tokens[tokenIndex]
    const diceValue = state.dice[state.selectedDie]

    log(`Attempting to move token ${tokenIndex} for player ${player.color} with dice value ${diceValue}`)

    if (currentPosition === -1 && diceValue === 6) {
      currentPosition = player.startPosition
      log(`Token moved out of base to position ${currentPosition}`)
    } else if (currentPosition >= 0) {
      currentPosition += diceValue
      if (currentPosition >= TRACK_STEPS - 1 && currentPosition <= TOTAL_STEPS - 1) {
        log(`Token moved in home stretch to position ${currentPosition}`)
      } else if (currentPosition > TOTAL_STEPS - 1) {
        log(`Invalid move: would move beyond last home space`)
        return false
      }
    }

    // Update the player's token in newPlayers
    const updatedPlayerIndex = newPlayers.findIndex(p => p.id === playerId)
    newPlayers[updatedPlayerIndex].tokens[tokenIndex] = currentPosition

    newPlayers.forEach((otherPlayer: Player, idx: number) => {
      if (otherPlayer.id !== playerId) {
        const tokenCount = otherPlayer.tokens.filter(t => t === currentPosition).length
        if (tokenCount === 1 && currentPosition < TRACK_STEPS - 1) {
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

    if (!get().hasValidMove()) {
      log('No more valid moves, ending turn')
      await get().endTurn()
    }

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
    if (!currentPlayer.isAI) {
      log('Current player is not AI, skipping AI turn')
      return
    }

    log(`AI Turn: Player ${currentPlayer.color}`)

    // Roll dice
    await get().rollDice()
    let newDice = [...get().dice]
    log(`AI dice roll: ${newDice.join(', ')}`)

    let moveMade = false

    for (let i = 0; i < newDice.length; i++) {
      if (newDice[i] === 0) continue
      get().selectDie(i)
      const moveResult = makeAIMove(currentPlayer, [newDice[i]], state.players.filter(p => p.id !== currentPlayer.id))
      if (moveResult !== -1) {
        log(`AI attempting to move token: ${moveResult}`)
        const moveSuccessful = await get().moveToken(currentPlayer.id, moveResult)
        if (moveSuccessful) {
          log(`AI successfully moved token: ${moveResult}`)
          moveMade = true
          // Re-fetch dice as they may have changed after moveToken
          newDice = get().dice
        } else {
          log(`AI failed to move token: ${moveResult}`)
        }
      } else {
        log('AI has no valid moves for this die')
      }
    }

    if (!moveMade) {
      log('AI could not make any moves, ending turn')
      await get().endTurn()
    } else if (newDice.every(d => d === 0)) {
      log('AI used all dice, ending turn')
      await get().endTurn()
    }

    log('AI Turn ended')
  },



  endTurn: async () => {
    log('Entering endTurn function')
    const state = get()
    const currentPlayer = state.players[state.currentPlayer]
    
    log(`Current player: ${currentPlayer.color}, isAI: ${currentPlayer.isAI}`)
    log(`Current dice: ${state.dice.join(', ')}`)
    
    // Check if player can roll again (rolled a 6)
    if (state.dice.includes(6) && state.dice.some(d => d !== 0)) {
      log('Player rolled a 6, gets another turn')
      set({ dice: [0, 0], selectedDie: null })
      if (currentPlayer.isAI) {
        log('AI rolled 6, playing another turn')
        setTimeout(() => get().playAITurn(), 1000)
      }
      return
    }
    
    // Move to the next player
    const nextPlayer = (state.currentPlayer + 1) % state.players.length
    log(`Turn ended. Moving to next player: ${state.players[nextPlayer].color}`)
    
    set({
      currentPlayer: nextPlayer,
      dice: [0, 0],
      selectedDie: null
    })
    
    await get().updateGameState()
    
    // Check if the next player is AI
    if (state.players[nextPlayer].isAI) {
      log('Next player is AI, initiating AI turn')
      setTimeout(() => get().playAITurn(), 1000) // Delay AI turn for better UX
    }
  },

  checkWinCondition: () => {
    log('Entering checkWinCondition function')
    const state = get()
    const winner = state.players.find(player =>
      player.tokens.every(token => token === TOTAL_STEPS - 1)
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
  }

}))