import React, { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { BoardProps } from './types';
import Square from './Square';
import Polygon from './Polygon';
import Token from './Token';
import { playerColors, startPositions, homeCoords, trackCoords, quadrants, GRID_SIZE } from './constants';

const Board: React.FC<BoardProps> = ({ selectedTokenId, onTokenClick }) => {
    const { viewport } = useThree();
    const [isMobile, setIsMobile] = useState(false);
    const responsiveRatio = viewport.width / 12;
    const officeScaleRatio = Math.max(0.5, Math.min(0.9 * responsiveRatio, 0.9));

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const squares = [];

    for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
            let color = 'white';
            const isTrackSquare = trackCoords.some(coord => coord.x === x && coord.y === y);
            const isblack = startPositions.black.x === x && startPositions.black.y === y
                || homeCoords.black.some(coord => coord.x === x && coord.y === y);
            const isgreen = startPositions.green.x === x && startPositions.green.y === y
                || homeCoords.green.some(coord => coord.x === x && coord.y === y);
            const isred = startPositions.red.x === x && startPositions.red.y === y
                || homeCoords.red.some(coord => coord.x === x && coord.y === y);
            const isyellow = startPositions.yellow.x === x && startPositions.yellow.y === y
                || homeCoords.yellow.some(coord => coord.x === x && coord.y === y);

            Object.entries(startPositions).forEach(([playerColor, pos]) => {
                if (x === pos.x && y === pos.y) {
                    color = playerColors[playerColor as keyof typeof playerColors];
                }
            });

            for (const quadrant of quadrants) {
                const [qx, qy] = quadrant.start;
                if (x >= qx && x < qx + 5 && y >= qy && y < qy + 5) {
                    color = quadrant.color;
                    break;
                }
            }
            squares.push(
                <Square
                    key={`${x}-${y}`}
                    position={[x - GRID_SIZE / 2, y - GRID_SIZE / 2, 0]}  // Set z to 0
                    border={isTrackSquare}
                    color={color}
                    borderColor="black"
                />
            );
        }
    }

    const playerTokens = Object.entries(playerColors).flatMap(([color, colorValue], playerIndex) =>
        Array(4).fill(null).map((_, tokenIndex) => (
            <Token
                key={`${color}-${tokenIndex}`}
                id={playerIndex * 4 + tokenIndex}
                color={colorValue}
                position={{
                    x: quadrants[playerIndex].base[tokenIndex].x - GRID_SIZE / 2,
                    y: quadrants[playerIndex].base[tokenIndex].y - GRID_SIZE / 2,
                    z: 0.8  // Keep this value to raise tokens above the board surface
                }}
                isSelected={selectedTokenId === playerIndex * 4 + tokenIndex}
                onClick={() => onTokenClick(playerIndex * 4 + tokenIndex)}
            />
        ))
    );

    return (
        <group rotation={[0, 0, Math.PI]}>
            <group rotation-x={Math.PI * 1.5}>
                {squares}
                <Polygon color={playerColors.green} coords={homeCoords.green} />
                <Polygon color={playerColors.yellow} coords={homeCoords.yellow} />
                <Polygon color={playerColors.red} coords={homeCoords.red} />
                <Polygon color={playerColors.black} coords={homeCoords.black} />
                {playerTokens}
            </group>
        </group>
    );
};

export default Board;