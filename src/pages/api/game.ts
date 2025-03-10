import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Received request:', req.method, req.url);
    const session = await getServerSession(req, res, authOptions);
    console.log('Session:', session);

    if (!session) {
        console.log('Unauthorized request');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        switch (req.method) {
            case 'POST':
                return await handlePost(req, res, session);
            case 'GET':
                return await handleGet(req, res, session);
            case 'PUT':
                return await handlePut(req, res, session);
            default:
                console.log('Method not allowed:', req.method);
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, session: any) {
    console.log('Creating new game for user:', session.user);
    try {
        const game = await prisma.game.create({
            data: {
                status: 'PLAYING',
                currentPlayer: 0, // Add this line to set initial current player
                dice: '0,0', // Add this line to set initial dice values
                players: {
                    create: [
                        { userId: session.user.id, color: 'green', tokens: '-1,-1,-1,-1', isAI: false },
                        { color: 'black', tokens: '-1,-1,-1,-1', isAI: true },
                        { color: 'red', tokens: '-1,-1,-1,-1', isAI: true },
                        { color: 'yellow', tokens: '-1,-1,-1,-1', isAI: true },
                    ],
                },
            },
            include: {
                players: true,
            },
        });

        console.log('Game created:', game);
        res.status(201).json(game);
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ error: 'Error creating game', details: error.message });
    }
}
async function handleGet(req: NextApiRequest, res: NextApiResponse, session: any) {
    try {
        const gameId = req.query.id as string;
        const game = await prisma.game.findUnique({
            where: { id: gameId },
            include: { players: true },
        });
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (error) {
        console.error('Error fetching game:', error);
        res.status(500).json({ error: 'Error fetching game' });
    }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, session: any) {
    try {
        const { id } = req.query
        const { currentPlayer, dice, players } = req.body
        const game = await prisma.game.update({
            where: { id: id as string },
            data: {
                currentPlayer,
                dice: dice.join(','),
                players: {
                    updateMany: players.map((player: any) => ({
                        where: { id: player.id },
                        data: {
                            tokens: typeof player.tokens == "string" ? player.tokens : player.tokens.join(','), // Join the tokens array here
                        },
                    })),
                },
            },
            include: { players: true },
        })
        res.status(200).json(game)
    } catch (error) {
        console.error('Error updating game:', error)
        res.status(500).json({ error: 'Error updating game' })
    }
}