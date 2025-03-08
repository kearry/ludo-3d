// src/types/TokenData.ts
export interface TokenData {
    id: number;
    color: string;
    position: { x: number; y: number; z: number };
    isSelected: boolean;
}