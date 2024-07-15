import { Coord } from './types';

export const playerColors = {
    green: '#4CAF50',
    yellow: '#FFEB3B',
    red: '#F44336',
    black: '#212121',
};

export const startPositions = {
    green: { x: 1, y: 5 },
    yellow: { x: 12, y: 1 },
    red: { x: 16, y: 12 },
    black: { x: 5, y: 16 },
};

export const homeCoords = {
    green: [{ x: 0, y: 5 }, { x: 5, y: 5 }, { x: 8, y: 8 }, { x: 5, y: 11 }, { x: 0, y: 11 }],
    yellow: [{ x: 11, y: 0 }, { x: 11, y: 5 }, { x: 8, y: 8 }, { x: 5, y: 5 }, { x: 5, y: 0 }],
    red: [{ x: 16, y: 11 }, { x: 11, y: 11 }, { x: 8, y: 8 }, { x: 11, y: 5 }, { x: 16, y: 5 }],
    black: [{ x: 11, y: 16 }, { x: 5, y: 16 }, { x: 5, y: 11 }, { x: 8, y: 8 }, { x: 11, y: 11 }],
};

export const trackCoords: Coord[] = [
    { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 },
    { x: 5, y: 5 }, { x: 5, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 },
    { x: 5, y: 0 }, { x: 8.5, y: 0 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 12, y: 2 },
    { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 13, y: 5 }, { x: 14, y: 5 },
    { x: 15, y: 5 }, { x: 16, y: 5 }, { x: 17, y: 5 }, { x: 17, y: 8.5 }, { x: 17, y: 12 },
    { x: 16, y: 12 }, { x: 15, y: 12 }, { x: 14, y: 12 }, { x: 13, y: 12 }, { x: 12, y: 12 },
    { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 },
    { x: 8.5, y: 17 }, { x: 5, y: 17 }, { x: 5, y: 16 }, { x: 5, y: 15 }, { x: 5, y: 14 },
    { x: 5, y: 13 }, { x: 5, y: 12 }, { x: 4, y: 12 }, { x: 3, y: 12 }, { x: 2, y: 12 },
    { x: 1, y: 12 }, { x: 0, y: 12 }, { x: 0, y: 8.5 }
];

export const quadrants = [
    { start: [0, 0], color: playerColors.green, base: [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 1, y: 3 },{ x: 3, y: 3 }] },
    { start: [13, 0], color: playerColors.yellow, base: [{ x: 14, y: 1 }, { x: 16, y: 1 }, { x: 14, y: 3 },{ x: 16, y: 3 }], },
    { start: [13, 13], color: playerColors.red, base: [{ x: 14, y: 14 }, { x: 16, y: 14 }, { x: 14, y: 16 },{ x: 16, y: 16 }], },
    { start: [0, 13], color: playerColors.black, base: [{ x: 1, y: 14 }, { x: 3, y: 14 }, { x: 1, y: 16 },{ x: 3, y: 16 }], },
];

export const GRID_SIZE = 18;