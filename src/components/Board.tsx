import React, { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { BoardProps } from './types';
import Square from './Square';
import Polygon from './Polygon';
import Token from './Token';
import { TRACK_STEPS, HOME_STEPS, TOTAL_STEPS } from '../lib/constants';
import {
    playerColors,
    startPositions,
    homeCoords,
    homePathCoords,
    homeDestCoords,
    finalStepCoords,
    baseCoords,
    trackCoords,
    quadrants,
    GRID_SIZE,
    BOARD_DEPTH
} from '../lib/constants';
import { useGameStore } from '@/lib/gameState';

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
            if (isTrackSquare ) {
                squares.push(
                    <Square
                        key={`${x}-${y}`}
                        position={[x - GRID_SIZE / 2, y - GRID_SIZE / 2, 0.375]}
                        border={isTrackSquare}
                        color={color}
                        borderColor="black"
                    />
                );
            }
        }
    }

    const gs = useGameStore();
    const tokenTrackOffset = () => {
       switch (gs.players[gs.currentPlayer].color) {
            case 'green':
                return startPositions.green.trackOffset;
            case 'yellow':
                return startPositions.yellow.trackOffset;
            case 'red':
                return startPositions.red.trackOffset;
            case 'black':
                return startPositions.black.trackOffset;
            default:
                return 0;
        } 
    } 
    const zero_indexed_track = TOTAL_STEPS - HOME_STEPS - 1;
    const playerTokens = Object.entries(playerColors).flatMap(([color, colorValue], playerIndex) => {
        return gs.players[playerIndex].tokens.map((token, tokenIndex) => {
            let tokenCoords;
            if (token < 0) {
                // Token is in base (position of -1)
                tokenCoords = quadrants[playerIndex].base[tokenIndex];
            } else if (token >= 0 && token <= zero_indexed_track) {
                // Token is on the track (position of 0-46)
                console.log("Token is on the track", token);
                tokenCoords = trackCoords[(token + tokenTrackOffset())%48];
            } else if ((token > zero_indexed_track) && token != (TOTAL_STEPS-1)) {
                // Token is on the final steps (position of 47-51)
                tokenCoords = homePathCoords[gs.players[playerIndex].color][token - zero_indexed_track-1];
                console.log("Token is on the final steps", tokenCoords);
            } 
            else if (token == (TOTAL_STEPS-1)) {
                // Token is on the home (position of 52?)
                tokenCoords = homeDestCoords[gs.players[playerIndex].color][tokenIndex];
            }
            else {
                console.error(`Invalid token index: ${token}`);
                return null;
            }

            return (
                <Token
                    key={`${color}-${tokenIndex}`}
                    id={playerIndex * 4 + tokenIndex}
                    color={colorValue}
                    position={{
                        x: tokenCoords.x - GRID_SIZE / 2,
                        y: tokenCoords.y - GRID_SIZE / 2,
                        z: BOARD_DEPTH
                    }}
                    isSelected={selectedTokenId === playerIndex * 4 + tokenIndex}
                    onClick={() => onTokenClick(playerIndex * 4 + tokenIndex)}
                />
            );
        });
    }).filter(Boolean); // Filter out null values

    return (
        <group scale={officeScaleRatio}>
            <mesh position={[-0.5, -0.5, 0]}>
                <boxGeometry args={[GRID_SIZE + 0.5, GRID_SIZE + 0.5, 0.5]} />
                <meshStandardMaterial color="gray" />
            </mesh>
            {squares}

            <Polygon color="white" coords={finalStepCoords.green} border={true} borderColor="black" />
            <Polygon color="white" coords={finalStepCoords.yellow} border={true} borderColor="black" />
            <Polygon color="white" coords={finalStepCoords.red} border={true} borderColor="black" />
            <Polygon color="white" coords={finalStepCoords.black} border={true} borderColor="black" />

            <Polygon color={playerColors.green} coords={homeCoords.green} border={null} borderColor={null} />
            <Polygon color={playerColors.green} coords={baseCoords.green} border={null} borderColor={null} />

            <Polygon color={playerColors.yellow} coords={homeCoords.yellow} border={null} borderColor={null} />
            <Polygon color={playerColors.yellow} coords={baseCoords.yellow} border={null} borderColor={null} />

            <Polygon color={playerColors.red} coords={homeCoords.red} border={null} borderColor={null} />
            <Polygon color={playerColors.red} coords={baseCoords.red} border={null} borderColor={null} />

            <Polygon color={playerColors.black} coords={homeCoords.black} border={null} borderColor={null} />
            <Polygon color={playerColors.black} coords={baseCoords.black} border={null} borderColor={null} />
            {playerTokens}
        </group>
    );
};

export default Board;