import { Player } from './gameState'

export function makeAIMove(player: Player, dice: number[]): number {
  console.log('AI Move: Starting decision process')
  console.log(`Player tokens: ${player.tokens}`)
  console.log(`Dice roll: ${dice}`)

  const diceSum = dice[0] + dice[1]
  const canMoveOutOfBase = dice.includes(6)

  console.log(`Dice sum: ${diceSum}, Can move out of base: ${canMoveOutOfBase}`)

  // Prioritize moving out of base if possible
  if (canMoveOutOfBase) {
    const baseTokenIndex = player.tokens.findIndex(token => token === -1)
    if (baseTokenIndex !== -1) {
      console.log(`AI Move: Decided to move token out of base at index ${baseTokenIndex}`)
      return baseTokenIndex
    }
  }

  // If can't move out of base or all tokens are out, use a scoring system to decide the best move
  let bestScore = -Infinity
  let bestMoveIndex = -1

  player.tokens.forEach((position, index) => {
    if (position === -1) return // Skip tokens in base if we can't move them out

    let newPosition = (position + diceSum) % 48
    if (newPosition >= 50) {
      newPosition = 50 + (newPosition - 50)
      if (newPosition > 56) return // Can't move this token
    }

    let score = 0

    // Prefer moves that get tokens home
    if (newPosition === 56) {
      score += 1000
    } else if (newPosition > 50) {
      score += 500
    }

    // Prefer moves that advance tokens further
    score += newPosition

    // Prefer moves that create blocks (assumes we have information about other players' tokens)
    if (player.tokens.includes(newPosition)) {
      score += 200
    }

    // Avoid moves that could get kicked back (assumes we have information about other players' tokens)
    // This would need to be implemented with actual game state information

    if (score > bestScore) {
      bestScore = score
      bestMoveIndex = index
    }
  })

  if (bestMoveIndex !== -1) {
    console.log(`AI Move: Decided to move token at index ${bestMoveIndex}`)
    return bestMoveIndex
  }

  // If no valid move found, return -1
  console.log(`AI Move: No valid move found`)
  return -1
}