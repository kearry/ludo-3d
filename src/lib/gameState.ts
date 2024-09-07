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

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
          userId: p.userId,  // This can now be null
          color: p.color,
          tokens: p.tokens.split(',').map(Number),
          startPosition: index * 12,
          isAI: !p.userId,  // Set isAI to true if userId is null
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

  canMoveToken: (playerId: string, tokenIndex: number): boolean => {
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

    // Moving out of base
    if (tokenPosition === -1 && diceValue === 6) {
      const startPosition = player.startPosition
      if (state.isBlocked(startPosition)) {
        log(`Cannot move out of base: start position ${startPosition} is blocked`)
        return false
      }
      log('Can move out of base with a 6')
      return true
    }

    if (tokenPosition === -1) {
      log('Cannot move token in base without rolling a 6')
      return false
    }

    // Calculate new position
    const newPosition = (tokenPosition + diceValue) % TRACK_STEPS
    log(`Calculated new position: ${newPosition}`)

    // Check if the path is blocked
    for (let step = 1; step <= diceValue; step++) {
      const checkPosition = (tokenPosition + step) % TRACK_STEPS
      if (state.isBlocked(checkPosition)) {
        log(`Path is blocked at position ${checkPosition}`)
        return false
      }
    }

    // Check if the move would exceed the home stretch
    const distanceFromStart = (newPosition - player.startPosition + TRACK_STEPS) % TRACK_STEPS
    if (distanceFromStart > TRACK_STEPS - HOME_STEPS - 1) {
      log(`Move would exceed home stretch. Distance from start: ${distanceFromStart}`)
      return false
    }

    // Check if the final position is occupied by two or more of the player's own tokens
    const tokensAtNewPosition = player.tokens.filter(t => t === newPosition).length
    if (tokensAtNewPosition >= 2) {
      log(`Final position ${newPosition} is occupied by ${tokensAtNewPosition} of player's own tokens`)
      return false
    }

    log('Move is valid')
    return true
  },

  isBlocked: (position: number): boolean => {
    const state = get();
    const tokensAtPosition = state.players.flatMap(player => 
      player.tokens.filter(token => token === position)
    );
    
    if (tokensAtPosition.length >= 2) {
      const playerWithTokens = state.players.find(player => 
        player.tokens.filter(token => token === position).length >= 2
      );
      return !!playerWithTokens; // Returns true if a player has 2 or more tokens at this position
    }
    return false;
  },

  endTurn: async () => {
    log('Entering endTurn function')
    const state = get()
    const currentPlayer = state.players[state.currentPlayer]
    log(`Current player: ${currentPlayer.color}, isAI: ${currentPlayer.isAI}`)
    log(`Current dice: ${state.dice.join(', ')}`)

    // 2 second pause between player turns
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Move to the next player
    const nextPlayer = (state.currentPlayer + 1) % state.players.length
    log(`Turn ended. Moving to next player: ${state.players[nextPlayer].color}`)
    set({ currentPlayer: nextPlayer, dice: [0, 0], selectedDie: null })
    await get().updateGameState()

    // Check if the next player is AI
    if (state.players[nextPlayer].isAI) {
      log('Next player is AI, initiating AI turn')
      setTimeout(() => get().playAITurn(), 1000) // Delay AI turn for better UX
    }
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
      log(`Player with id ${playerId} not found.`)
      return false
    }

    if (!state.canMoveToken(playerId, tokenIndex)) {
      log('Invalid move. Token cannot be moved.')
      return false
    }

    log(`Moving token for player: ${player.color}`)
    let newPlayers = JSON.parse(JSON.stringify(state.players))
    let currentPosition = player.tokens[tokenIndex]
    const diceValue = state.dice[state.selectedDie]

    const moveOneStep = async () => {
      const totalSteps = currentPosition === -1 ? 1 : diceValue
      for (let step = 0; step < totalSteps; step++) {
        await pause(1000) // 1 second delay between steps
        if (currentPosition === -1) {
          currentPosition = player.startPosition
        } else {
          currentPosition = (currentPosition + 1) % TRACK_STEPS
        }

        const updatedPlayerIndex = newPlayers.findIndex((p: Player) => p.id === playerId)
        newPlayers[updatedPlayerIndex].tokens[tokenIndex] = currentPosition

        set({ players: newPlayers })
        log(`Token moved to position: ${currentPosition}`)
      }
    }

    try {
      await moveOneStep()
    } catch (error) {
      log(`Error during token movement: ${error}`)
      return false
    }

    // Check for capture only after the final step
    const updatedPlayerIndex = newPlayers.findIndex((p: Player) => p.id === playerId)
    const finalPosition = newPlayers[updatedPlayerIndex].tokens[tokenIndex]

    let captureOccurred = false
    if (!state.isBlocked(finalPosition)) {
      for (const otherPlayer of newPlayers) {
        if (otherPlayer.id !== playerId) {
          const capturedTokenIndex = otherPlayer.tokens.findIndex((t: number) => t === finalPosition)
          if (capturedTokenIndex !== -1 && finalPosition < TRACK_STEPS - 1) {
            otherPlayer.tokens[capturedTokenIndex] = -1
            log(`Kicked out ${otherPlayer.color} token back to base`)
            captureOccurred = true
          }
        }
      }
    }

    if (captureOccurred) {
      set({ players: newPlayers })
      await pause(4000) // 4 second pause after a capture
    }

    const newDice = [...state.dice]
    newDice[state.selectedDie] = 0
    set({ players: newPlayers, dice: newDice, selectedDie: null })

    log(`After move - Dice: ${newDice}, Current player: ${state.currentPlayer}`)
    await get().updateGameState()
    get().checkWinCondition()

    // Check if player gets another turn (rolled a 6)
    if (diceValue === 6 && newDice.some(d => d !== 0)) {
      log('Player rolled a 6, gets another turn')
      return true
    }

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