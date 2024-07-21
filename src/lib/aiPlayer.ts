import { Player } from './gameState'
import { TRACK_STEPS, HOME_STEPS, TOTAL_STEPS } from './constants'

export function makeAIMove(player: Player, dice: number[], otherPlayers: Player[]): number {
  const diceSum = dice[0] + dice[1];
  const canMoveOutOfBase = dice.includes(6);
  const HOME_ENTRANCE = TRACK_STEPS - 1;

  // --- Priority: Move out of Base if Possible ---
  if (canMoveOutOfBase) {
    const baseTokenIndex = player.tokens.findIndex(token => token === -1);
    if (baseTokenIndex !== -1) return baseTokenIndex; // Immediately return if possible
  }

  // --- Scoring-Based Decision Logic ---

  let bestMoveIndex = -1;
  let bestMoveScore = -Infinity;

  for (let i = 0; i < player.tokens.length; i++) { // More efficient loop
    const currentPos = player.tokens[i];

    if (currentPos === -1) continue; // Skip base tokens if can't move out

    const newPos = (currentPos + diceSum) % TOTAL_STEPS; // Handle loop around the track
    const isHomeStretch = newPos > HOME_ENTRANCE;

    // Check if move is valid (within home stretch limits)
    if (isHomeStretch && newPos > HOME_ENTRANCE + HOME_STEPS) continue;

    let moveScore = 0;

    // --- Scoring Factors ---

    // Prioritize reaching home
    if (newPos === HOME_ENTRANCE + HOME_STEPS) moveScore += 1000;
    else if (isHomeStretch) moveScore += 500;

    moveScore += newPos; // Favor moving forward
    moveScore += player.tokens.includes(newPos) ? 200 : 0; // Forming blocks

    // Capture opponent tokens
    for (const opponent of otherPlayers) {
      if (opponent.tokens.includes(newPos)) moveScore += 300; 
    }

    // Avoid immediate danger
    for (const opponent of otherPlayers) {
      for (const opponentToken of opponent.tokens) {
        if (opponentToken >= 0 && opponentToken < newPos && opponentToken + 6 >= newPos) {
          moveScore -= 100;
        }
      }
    }

    // --- Update Best Move ---
    if (moveScore > bestMoveScore) {
      bestMoveIndex = i;
      bestMoveScore = moveScore;
    }
  }

  return bestMoveIndex; // Return the index of the token to move (-1 if no valid move)
}
