import { Player } from './gameState'

const HOME_ENTRANCE = 50
const HOME_STEPS = 6

export function makeAIMove(player: Player, dice: number[], otherPlayers: Player[]): number {
  console.log('AI Move: Starting decision process')
  console.log(`Player tokens: ${player.tokens}`)
  console.log(`Dice roll: ${dice}`)

  const diceSum = dice[0] + dice[1]
  const canMoveOutOfBase = dice.includes(6)

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

    let newPosition = position + diceSum
    if (newPosition > HOME_ENTRANCE) {
      newPosition = HOME_ENTRANCE + (newPosition - HOME_ENTRANCE)
      if (newPosition > HOME_ENTRANCE + HOME_STEPS) return // Can't move this token
    }

    let score = 0

    // Prefer moves that get tokens home
    if (newPosition === HOME_ENTRANCE + HOME_STEPS) {
      score += 1000
    } else if (newPosition > HOME_ENTRANCE) {
      score += 500
    }

    // Prefer moves that advance tokens further
    score += newPosition

    // Prefer moves that create blocks
    if (player.tokens.includes(newPosition)) {
      score += 200
    }

    // Prefer moves that capture opponent tokens
    otherPlayers.forEach(opponent => {
      if (opponent.tokens.includes(newPosition)) {
        score += 300
      }
    })

    // Avoid moves that put tokens in danger
    otherPlayers.forEach(opponent => {
      opponent.tokens.forEach(opponentToken => {
        if (opponentToken >= 0 && opponentToken < newPosition && opponentToken + 6 >= newPosition) {
          score -= 100
        }
      })
    })

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
