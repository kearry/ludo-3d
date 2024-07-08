// lib/gameTypes.ts
export interface Player {
    id: string;
    color: string;
    tokens: number[];
    isAI: boolean;
  }
  
  export interface GameState {
    players: Player[];
    dice: [number, number];
    rollDice: () => void;
    moveToken: (playerId: string, tokenIndex: number, spaces: number) => void;
  }