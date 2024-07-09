1. Game Setup:
   - The game is played on a board with 48 spaces arranged in a loop.
   - There are 4 players: red, blue, green, and yellow.
   - Each player has 4 tokens, starting in their respective bases.
   - The starting positions for each player are evenly spaced around the board (0, 12, 24, 36).

2. Turn Sequence:
   a. Roll Dice:
      - The current player rolls two dice.
      - If the current player has a movable token goto step b.
      - If the current player has no movable tokens but a 6 is rolled go back to step a.
      - If the current player has no movable tokens but no 6 is rolled, the turn ends.
   b. Select Die:
      - The player chooses which die to use for their move.
   c. Select Token:
      - The player selects which of their tokens to move.
   d. Move Token:
      - The selected token is moved according to the chosen die value.
   e. Repeat:
      - If there's an unused die, go back to step b.
      - If both dice have been used, the turn ends.

3. Movement Rules:
   - To move a token out of the base, a player must roll a 6.
   - Tokens move clockwise around the board.
   - A token moves the exact number of spaces shown on the die.
   - After completing a full loop (48 spaces), tokens enter the home stretch.
   - The home stretch is 6 additional spaces beyond the 48th space and divergent off the main track.

4. Special Rules:
   - Rolling a 6 gives the player an extra turn (they don't pass the turn to the next player).
   - If a token lands on a space occupied by an opponent's single token, the opponent's token is sent back to its base.
   - Two or more tokens of the same color on the same space form a block, which cannot be passed or landed on by other players' tokens.

5. Winning:
   - The first player to get all four of their tokens to the end of their home stretch(on the 54th step) wins the game.

6. AI Players:
   - The game can include AI players who automatically make their moves.
   - AI players follow the same rules but make decisions automatically.

7. Turn Passing:
   - If a player cannot make a valid move with either die, their turn is passed to the next player.

8. Valid Moves:
   - A token can only move if:
     a) It's in the base and a 6 is rolled (to move out, 1 step).
     b) It's on the board and the move doesn't land on or pass a block or overshoot the home stretch.

9. Home Stretch:
   - Once a token enters the home stretch, it can only move a number less than or equal to spaces remaining.
   - If a die would move a token beyond the last space in the home stretch, the move is not allowed.

10. Persistence:
    - The game state is saved after each move, allowing players to resume a game later.