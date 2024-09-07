export type PlayerColor = 'red' | 'green' | 'yellow' | 'black';

export interface Player {
  id: string;
  userId: string | null;
  color: PlayerColor;
  tokens: number[];
  isAI: boolean;
  startPosition: number;
}

export interface GameState {
  gameId: string | null;
  players: Player[];
  currentPlayer: number;
  dice: number[];
  selectedDie: number | null;
  winner: string | null;
  createGame: (userId: string) => Promise<void>;
  loadGame: (gameId: string) => Promise<void>;
  rollDice: () => Promise<void>;
  selectDie: (dieIndex: number) => void;
  moveToken: (playerId: string, tokenIndex: number) => Promise<boolean>;
  canMoveToken: (playerId: string, tokenIndex: number) => boolean;
  hasValidMove: () => boolean;
  playAITurn: () => Promise<void>;
  checkWinCondition: () => void;
  updateGameState: () => Promise<void>;
  isBlocked: (position: number) => boolean;
  endTurn: () => Promise<void>;
}