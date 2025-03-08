import React, { useState, useEffect, useMemo } from 'react';
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

// Explicitly defining props for the Board component
const Board = ({ selectedTokenId, onTokenClick }: BoardProps) => {
    const { viewport } = useThree();
    const [isMobile, setIsMobile] = useState(false);
    const responsiveRatio = viewport.width / 12;
    const officeScaleRatio = Math.max(0.5, Math.min(0.9 * responsiveRatio, 0.9));
    const gs = useGameStore();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Memoize track squares to prevent unnecessary re-renders
    const squares = useMemo(() => {
        const result: JSX.Element[] = [];

        // Generate squares that are part of the track
        trackCoords.forEach((coord) => {
            const { x, y } = coord;
            let color = 'white';

            // Check if it's a starting position
            Object.entries(startPositions).forEach(([playerColor, pos]) => {
                if (x === pos.x && y === pos.y) {
                    color = playerColors[playerColor as keyof typeof playerColors];
                }
            });

            result.push(
                <Square
                    key={`${x}-${y}`}
                    position={[x - GRID_SIZE / 2, y - GRID_SIZE / 2, 0.375]}
                    border={true}
                    color={color}
                    borderColor="black"
                    showDebugText={false}
                />
            );
        });

        return result;
    }, []);

    // Compute token track offset based on current player
    const tokenTrackOffset = (): number => {
        if (!gs.players[gs.currentPlayer]) return 0;

        const playerColor = gs.players[gs.currentPlayer].color;
        return startPositions[playerColor]?.trackOffset || 0;
    };

    // Memoize tokens to prevent unnecessary re-renders
    const playerTokens = useMemo(() => {
        if (!gs.players || gs.players.length === 0) return [];

        const zero_indexed_track = TOTAL_STEPS - HOME_STEPS - 1;

        return Object.entries(playerColors).flatMap(([color, colorValue], playerIndex) => {
            if (!gs.players[playerIndex]) return [];

            return gs.players[playerIndex].tokens.map((token, tokenIndex) => {
                let tokenCoords;

                if (token < 0) {
                    // Token is in base (position of -1)
                    tokenCoords = quadrants[playerIndex].base[tokenIndex];
                } else if (token >= 0 && token <= zero_indexed_track) {
                    // Token is on the track (position of 0-46)
                    const trackOffset = gs.players[playerIndex].startPosition;
                    tokenCoords = trackCoords[(token + trackOffset) % 48];
                } else if ((token > zero_indexed_track) && token !== (TOTAL_STEPS - 1)) {
                    // Token is on the final steps (position of 47-51)
                    const homePathIndex = token - zero_indexed_track - 1;
                    const playerColor = gs.players[playerIndex].color;
                    tokenCoords = homePathCoords[playerColor][homePathIndex];
                } else if (token === (TOTAL_STEPS - 1)) {
                    // Token is on the home (position of 52)
                    const playerColor = gs.players[playerIndex].color;
                    tokenCoords = homeDestCoords[playerColor][tokenIndex];
                } else {
                    console.error(`Invalid token index: ${token}`);
                    return null;
                }

                if (!tokenCoords) return null;

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
        }).filter(Boolean) as JSX.Element[]; // Filter out null values
    }, [gs.players, selectedTokenId, onTokenClick]);

    return (
        <group scale={officeScaleRatio}>
            {/* Base board */}
            <mesh position={[-0.5, -0.5, 0]}>
                <boxGeometry args={[GRID_SIZE + 0.5, GRID_SIZE + 0.5, 0.5]} />
                <meshStandardMaterial color="gray" />
            </mesh>

            {/* Track squares */}
            {squares}

            {/* Game areas */}
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

            {/* Player tokens */}
            {playerTokens}
        </group>
    );
};

// Export as a named export to avoid confusion
export { Board };

// Also provide a default export for backward compatibility
export default Board;