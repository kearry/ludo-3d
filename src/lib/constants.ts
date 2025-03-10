import { Coord } from '../components/types';

export const playerColors = {
    green: '#4CAF50',
    yellow: '#FFEB3B',
    red: '#F44336',
    black: '#212121',
};

export const startPositions = {
    green: { x: 1, y: 5 ,trackOffset: 1},
    yellow: { x: 12, y: 1 ,trackOffset: 13},
    red: { x: 16, y: 12 ,trackOffset: 25},
    black: { x: 5, y: 16 ,trackOffset: 37},
};

export const homePathCoords = {
    green: [{ x: 1, y: 8.5 }, { x: 2, y: 8.5 }, { x: 3, y: 8.5 }, { x: 4, y: 8.5 }, { x: 5, y: 8.5 }],
    yellow: [{ x: 11, y: 0 }, { x: 11, y: 5 }, { x: 8, y: 8 }, { x: 5, y: 5 }, { x: 5, y: 0 }],
    red: [{ x: 16, y: 11 }, { x: 11, y: 11 }, { x: 8, y: 8 }, { x: 11, y: 5 }, { x: 16, y: 5 }],
    black: [{ x: 11, y: 16 }, { x: 5, y: 16 }, { x: 5, y: 11 }, { x: 8, y: 8 }, { x: 11, y: 11 }],
};

export const homeCoords = {
    green: [{ x: 0, y: 5 }, { x: 5, y: 5 }, { x: 8, y: 8 }, { x: 5, y: 11 }, { x: 0, y: 11 }],
    yellow: [{ x: 11, y: 0 }, { x: 11, y: 5 }, { x: 8, y: 8 }, { x: 5, y: 5 }, { x: 5, y: 0 }],
    red: [{ x: 16, y: 11 }, { x: 11, y: 11 }, { x: 8, y: 8 }, { x: 11, y: 5 }, { x: 16, y: 5 }],
    black: [{ x: 11, y: 16 }, { x: 5, y: 16 }, { x: 5, y: 11 }, { x: 8, y: 8 }, { x: 11, y: 11 }],
};

export const homeDestCoords = {
    green: [{ x: 6, y: 9.5 }, { x: 6, y: 7.5 }, { x: 6, y: 8.5 }, { x: 7, y: 8.5 }],
    yellow: [{ x: 11, y: 0 }, { x: 11, y: 5 }, { x: 8, y: 8 }, { x: 5, y: 5 }],
    red: [{ x: 16, y: 11 }, { x: 11, y: 11 }, { x: 8, y: 8 }, { x: 11, y: 5 }],
    black: [{ x: 11, y: 16 }, { x: 5, y: 16 }, { x: 5, y: 11 }, { x: 8, y: 8 }],
};

// Coordinates for the penultimate track steps(verified)
export const finalStepCoords = {
    green: [{ x: -1, y: 5 }, { x: 0, y: 5 }, { x: 0, y: 11 }, { x: -1, y: 11 }],
    yellow: [{ x: 5, y: -1 }, { x: 5, y: 0 }, { x: 11, y: 0 },{ x: 11, y: -1}],
    red: [{ x: 16, y: 5 }, { x: 17, y: 5 }, { x: 17, y: 11 }, { x: 16, y: 11 }],
    black: [{ x: 5, y: 16 }, { x: 5, y: 17 }, { x: 11, y: 17 }, { x: 11, y: 16 }],
};

//Coordinates for the bases
export const baseCoords = {
    green: [{ x: -1, y: -1 }, { x: -1, y: 4 }, { x: 4, y: 4 }, { x: 4, y: -1 }],
    yellow: [{ x: 17, y: -1 }, { x: 12, y: -1 }, { x: 12, y: 4 }, { x: 17, y: 4 }],
    red: [{ x: 12, y: 12 }, { x: 12, y: 17 }, { x: 17, y: 17 }, { x: 17, y: 12 }],
    black: [{ x: -1, y: 17 }, { x: -1, y: 12 }, { x: 4, y: 12 }, { x: 4, y: 17 }],
};

//Coordinates for the track
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

// Coordinates for the quadrants of the bases and the base positions of the player's tokens.
export const quadrants = [
    { start: [0, 0], color: playerColors.green, base: [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 1, y: 3 },{ x: 3, y: 3 }] },
    { start: [13, 0], color: playerColors.yellow, base: [{ x: 14, y: 1 }, { x: 16, y: 1 }, { x: 14, y: 3 },{ x: 16, y: 3 }], },
    { start: [13, 13], color: playerColors.red, base: [{ x: 14, y: 14 }, { x: 16, y: 14 }, { x: 14, y: 16 },{ x: 16, y: 16 }], },
    { start: [0, 13], color: playerColors.black, base: [{ x: 1, y: 14 }, { x: 3, y: 14 }, { x: 1, y: 16 },{ x: 3, y: 16 }], },
];

//export const rect = return (quadrants.forEach(quadrant => {  rect.push(quadrant.base.forEach(coord => { return { x: coord.x, y: coord.y } }) });

export const GRID_SIZE = 18;

export const BOARD_DEPTH = 0.75;

export const TRACK_STEPS = 48;
export const HOME_STEPS = 6;
export const TOTAL_STEPS = (TRACK_STEPS - 1) + HOME_STEPS;