import { Player } from './gameState'

export function makeAIMove(player: Player, dice: number[]): number {
  console.log('AI Move: Starting decision process')
  console.log(`Player tokens: ${player.tokens}`)
  console.log(`Dice roll: ${dice}`)

  const diceSum = dice[0] + dice[1]
  const canMoveOutOfBase = dice.includes(6)

  console.log(`Dice sum: ${diceSum}, Can move out of base: ${canMoveOutOfBase}`)

  if (canMoveOutOfBase) {
    const baseTokenIndex = player.tokens.findIndex(token => token === 0)
    if (baseTokenIndex !== -1) {
      console.log(`AI Move: Decided to move token out of base at index ${baseTokenIndex}`)
      return baseTokenIndex
    }
  }

  // Find the token that's furthest along and can be moved
  let furthestTokenIndex = -1
  let furthestPosition = -1
  player.tokens.forEach((position, index) => {
    if (position > 0 && position < 57 && position > furthestPosition) {
      furthestPosition = position
      furthestTokenIndex = index
    }
  })

  if (furthestTokenIndex !== -1) {
    console.log(`AI Move: Decided to move furthest token at index ${furthestTokenIndex}`)
    return furthestTokenIndex
  }

  // If no valid move, return the first token index (this move will be rejected by the game logic)
  console.log(`AI Move: No valid move found, returning first token index`)
  return 0
}