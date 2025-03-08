import * as THREE from 'three';

export interface Coord {
    x: number;
    y: number;
}

export interface SquareProps {
    position: [number, number, number];
    color: string;
    borderColor: string;
    border: boolean;
    showDebugText?: boolean; // Added optional parameter
}

export interface TokenModelProps {
    id: number;
    color: string;
    position: { x: number; y: number; z: number };
    isSelected: boolean;
    onClick: () => void;
}

export interface BoardProps {
    selectedTokenId: number | null;
    onTokenClick: (tokenId: number) => void;
    tokens?: TokenModelProps[]; // Make tokens optional
}

export interface PolygonProps {
    color: string;
    coords: Coord[];
    border: boolean | null;
    borderColor: string | null;
}

export interface HomePathProps {
    color: string;
    startPosition: [number, number, number];
    rotation?: number;
}