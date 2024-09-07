# tsconfig.json

```json
{ "compilerOptions": { "target": "ES5", "forceConsistentCasingInFileNames": true, "lib": ["dom", "dom.iterable", "esnext"], "allowJs": true, "skipLibCheck": true, "strict": true, "noEmit": true, "esModuleInterop": true, "module": "esnext", "moduleResolution": "bundler", "resolveJsonModule": true, "isolatedModules": true, "jsx": "preserve", "incremental": true, "plugins": [ { "name": "next" } ], "paths": { "@/*": ["./src/*"] } }, "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], "exclude": ["node_modules"] }
```

# tailwind.config.ts

```ts
import type { Config } from "tailwindcss" const config = { darkMode: ["class"], content: [ './pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}', ], prefix: "", theme: { container: { center: true, padding: "2rem", screens: { "2xl": "1400px", }, }, extend: { colors: { border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))", background: "hsl(var(--background))", foreground: "hsl(var(--foreground))", primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))", }, secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))", }, destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))", }, muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))", }, accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))", }, popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))", }, card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))", }, }, borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)", }, keyframes: { "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" }, }, "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" }, }, }, animation: { "accordion-down": "accordion-down 0.2s ease-out", "accordion-up": "accordion-up 0.2s ease-out", }, }, }, plugins: [require("tailwindcss-animate")], } satisfies Config export default config
```

# postcss.config.mjs

```mjs
/** @type {import('postcss-load-config').Config} */ const config = { plugins: { tailwindcss: {}, }, }; export default config;
```

# package.json

```json
{ "name": "ludo-3d", "version": "0.1.0", "private": true, "scripts": { "dev": "next dev", "build": "next build", "start": "next start", "lint": "next lint", "test": "jest" }, "dependencies": { "@next-auth/prisma-adapter": "^1.0.7", "@prisma/client": "^5.16.1", "@radix-ui/react-slot": "^1.1.0", "@react-three/drei": "^9.107.2", "@react-three/fiber": "^8.16.8", "@types/next-auth": "^3.15.0", "class-variance-authority": "^0.7.0", "clsx": "^2.1.1", "jest-fail-on-console": "^3.3.0", "jsonwebtoken": "^9.0.2", "lucide-react": "^0.399.0", "next": "14.2.4", "next-auth": "^4.24.7", "playroomkit": "^0.0.77", "react": "^18", "react-dom": "^18", "shadcn-ui": "^0.8.0", "tailwind-merge": "^2.3.0", "tailwindcss-animate": "^1.0.7", "three": "^0.165.0", "ts-node": "^10.9.2", "zustand": "^4.5.4" }, "devDependencies": { "@babel/preset-env": "^7.24.7", "@babel/preset-react": "^7.24.7", "@babel/preset-typescript": "^7.24.7", "@testing-library/jest-dom": "^6.4.6", "@testing-library/react": "^16.0.0", "@types/jest": "^29.5.12", "@types/node": "^20", "@types/react": "^18", "@types/react-dom": "^18", "eslint": "^8", "eslint-config-next": "14.2.4", "jest": "^29.7.0", "jest-environment-jsdom": "^29.7.0", "postcss": "^8", "tailwindcss": "^3.4.1", "ts-jest": "^29.1.5", "typescript": "^5" } }
```

# next.config.mjs

```mjs
/** @type {import('next').NextConfig} */ const nextConfig = { reactStrictMode: true, webpack: (config) => { config.resolve.fallback = { fs: false, net: false, tls: false }; return config; }, } export default nextConfig;
```

# next-env.d.ts

```ts
/// <reference types="next" /> /// <reference types="next/image-types/global" /> // NOTE: This file should not be edited // see https://nextjs.org/docs/basic-features/typescript for more information.
```

# middleware.ts

```ts
export { default } from "next-auth/middleware"
```

# jest.setup.ts

```ts
import '@testing-library/jest-dom';
```

# jest.config.ts

```ts
module.exports = { testEnvironment: 'jsdom', setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1', }, transform: { '^.+\\.(ts|tsx)$': 'babel-jest', }, testPathIgnorePatterns: ['/node_modules/', '/.next/'], moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.json' } } }
```

# dominoes.py

```py
import random

# Define dominoes as a set of tuples (ensures uniqueness)
dominoes = set([(i, j) for i in range(7) for j in range(i, 7)])

def deal_dominoes():
    """Deals 7 unique dominoes to each of the four players."""
    players_hands = [[] for _ in range(4)]
    available_dominoes = list(dominoes)
    random.shuffle(available_dominoes)
    
    for i in range(4):
        players_hands[i] = available_dominoes[i*7:(i+1)*7]
    
    return players_hands

def display_table(table):
    """Displays the current state of the table with matching numbers end-to-end and clear end indicators."""
    print("\nTable:")
    if not table:
        print("Empty")
    else:
        output = f"[{table[0][0]}]-{table[0][1]}"
        for domino in table[1:]:
            if domino[0] == output[-1]:
                output += f":{domino[1]}"
            else:
                output += f"-{domino[0]}:{domino[1]}"
        output += f"-[{table[-1][1]}]"
        print(output)
    if table:
        print(f"Ends: {table[0][0]} and {table[-1][1]}")
    print()

def is_ai_player(player_index):
    """Checks if the given player index represents an AI opponent."""
    return player_index > 0  # Assuming human player is index 0

def validate_domino(domino_str):
    """Validates user input for a domino."""
    try:
        a, b = map(int, domino_str.split(':'))
        if 0 <= a <= 6 and 0 <= b <= 6:
            return (a, b)
    except ValueError:
        pass
    return None

def can_play_domino(domino, table):
    """Checks if a domino can be played on the current table."""
    if not table:
        return True
    left_end, right_end = table[0][0], table[-1][1]
    return domino[0] in (left_end, right_end) or domino[1] in (left_end, right_end)

def play_domino(domino, table):
    """Plays a domino on the table, handling orientation."""
    if not table:
        table.append(domino)
    elif domino[1] == table[0][0]:
        table.insert(0, domino[::-1])
    elif domino[0] == table[0][0]:
        table.insert(0, domino)
    elif domino[0] == table[-1][1]:
        table.append(domino)
    elif domino[1] == table[-1][1]:
        table.append(domino[::-1])
    else:
        raise ValueError("Invalid domino placement")

def play_turn(player_hand, table, player_index):
    """Handles a single player's turn."""
    print(f"Player {player_index + 1}'s Turn:")
    print(f"Your hand: {player_hand}")
    display_table(table)

    if is_ai_player(player_index):
        playable_dominoes = [domino for domino in player_hand if can_play_domino(domino, table)]
        if playable_dominoes:
            domino = random.choice(playable_dominoes)
            player_hand.remove(domino)
            play_domino(domino, table)
            print(f"AI Player {player_index + 1} plays {domino}")
            display_table(table)  # Display table after AI move
            return True
        else:
            print(f"AI Player {player_index + 1} cannot play")
            return False
    else:
        while True:
            domino_str = input("Enter a domino to play (e.g., 1:2) or 'pass': ")
            if domino_str.lower() == 'pass':
                if any(can_play_domino(domino, table) for domino in player_hand):
                    print("You have a valid move. You must play if possible.")
                else:
                    print("You passed your turn.")
                    return False
            domino = validate_domino(domino_str)
            if domino:
                if domino in player_hand and can_play_domino(domino, table):
                    player_hand.remove(domino)
                    play_domino(domino, table)
                    display_table(table)  # Display table after human move
                    return True
                else:
                    print("Invalid move. Try again.")
            else:
                print("Invalid input. Please enter a valid domino or 'pass'.")

def find_starting_player(player_hands):
    """Finds the index of the player who has the 6:6 domino."""
    for i, hand in enumerate(player_hands):
        if (6, 6) in hand:
            return i
    return None  # Should not happen if all dominoes are dealt

def play_first_move(player_hand, table):
    """Plays the first move of the game (always 6:6)."""
    if (6, 6) in player_hand:
        player_hand.remove((6, 6))
        table.append((6, 6))
        print("Starting the game with 6:6")
        display_table(table)
        return True
    else:
        print("Error: Starting player does not have 6:6 domino.")
        return False

def check_win(player_hand):
    """Checks if a player has won by having an empty hand."""
    return len(player_hand) == 0

def is_game_blocked(table, player_hands):
    """Checks if the game is blocked (no valid moves possible)."""
    return all(not any(can_play_domino(domino, table) for domino in hand) for hand in player_hands)

def main():
    """Main function to run the game."""
    players_hands = deal_dominoes()
    table = []

    starting_player = find_starting_player(players_hands)
    if starting_player is not None:
        print(f"Player {starting_player + 1} starts with the double-six!")
        if not play_first_move(players_hands[starting_player], table):
            print("Error: Unable to start the game. Exiting.")
            return
    else:
        print("Error: Double-six not found. Exiting.")
        return

    current_player = (starting_player + 1) % 4  # Next player after the starting player
    passes = 0

    while True:
        if play_turn(players_hands[current_player], table, current_player):
            passes = 0
            if check_win(players_hands[current_player]):
                print(f"Player {current_player + 1} wins!")
                break
        else:
            passes += 1
            if passes == 4:
                print("Game is blocked. It's a draw!")
                break

        if is_game_blocked(table, players_hands):
            print("Game is blocked. It's a draw!")
            break

        current_player = (current_player + 1) % 4

    print("Final table state:")
    display_table(table)

if __name__ == "__main__":
    main()
```

# components.json

```json
{ "$schema": "https://ui.shadcn.com/schema.json", "style": "default", "rsc": true, "tsx": true, "tailwind": { "config": "tailwind.config.ts", "css": "src/app/globals.css", "baseColor": "slate", "cssVariables": true, "prefix": "" }, "aliases": { "components": "@/components", "utils": "@/lib/utils" } }
```

# Rules.md

```md
1. Game Setup: - The game is played on a board with 48 spaces arranged in a loop. - There are 4 players: red, blue, green, and yellow. - Each player has 4 tokens, starting in their respective bases. - The starting positions for each player are evenly spaced around the board (0, 12, 24, 36). 2. Turn Sequence: a. Roll Dice: - The current player rolls two dice. - If the current player has a movable token goto step b. - If the current player has no movable tokens but a 6 is rolled go back to step a. - If the current player has no movable tokens but no 6 is rolled, the turn ends. b. Select Die: - The player chooses which die to use for their move. c. Select Token: - The player selects which of their tokens to move. d. Move Token: - The selected token is moved according to the chosen die value. e. Repeat: - If there's an unused die, go back to step b. - If both dice have been used, the turn ends. 3. Movement Rules: - To move a token out of the base, a player must roll a 6. - Tokens move clockwise around the board. - A token moves the exact number of spaces shown on the die. - After completing a full loop (48 spaces), tokens enter the home stretch. - The home stretch is 6 additional spaces beyond the 48th space and divergent off the main track. 4. Special Rules: - Rolling a 6 gives the player an extra turn (they don't pass the turn to the next player). - If a token lands on a space occupied by an opponent's single token, the opponent's token is sent back to its base. - Two or more tokens of the same color on the same space form a block, which cannot be passed or landed on by other players' tokens. 5. Winning: - The first player to get all four of their tokens to the end of their home stretch(on the 54th step) wins the game. 6. AI Players: - The game can include AI players who automatically make their moves. - AI players follow the same rules but make decisions automatically. 7. Turn Passing: - If a player cannot make a valid move with either die, their turn is passed to the next player. 8. Valid Moves: - A token can only move if: a) It's in the base and a 6 is rolled (to move out, 1 step). b) It's on the board and the move doesn't land on or pass a block or overshoot the home stretch. 9. Home Stretch: - Once a token enters the home stretch, it can only move a number less than or equal to spaces remaining. - If a die would move a token beyond the last space in the home stretch, the move is not allowed. 10. Persistence: - The game state is saved after each move, allowing players to resume a game later.
```

# README.md

```md
Remember: I do not have the time read every line of code to figure out what code you have left out(I AM NOT an AI). If you keep doing this, you are not being very helpful to me. Provide the full file content. The couple lines of that it takes nanoseconds to remove, causes hours of debugging for me!
```

# .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files. # dependencies /node_modules /.pnp .pnp.js .yarn/install-state.gz # testing /coverage # next.js /.next/ /out/ # production /build # misc .DS_Store *.pem # debug npm-debug.log* yarn-debug.log* yarn-error.log* # local env files .env*.local # vercel .vercel # typescript *.tsbuildinfo next-env.d.ts .aider*
```

# .eslintrc.json

```json
{ "extends": "next/core-web-vitals" }
```

# .babelrc

```
{ "presets": [ "@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript" ] }
```

# .aidigestignore

```
.babel .next prisma/dev.db .aider*
```

# public/vercel.svg

This is a file of the type: SVG Image

# public/next.svg

This is a file of the type: SVG Image

# prisma/schema.prisma

```prisma
generator client { provider = "prisma-client-js" } datasource db { provider = "sqlite" url = env("DATABASE_URL") } model User { id String @id @default(cuid()) name String? email String? @unique emailVerified DateTime? image String? accounts Account[] sessions Session[] players Player[] } model Account { id String @id @default(cuid()) userId String type String provider String providerAccountId String refresh_token String? access_token String? expires_at Int? token_type String? scope String? id_token String? session_state String? refresh_token_expires_in Int? user User @relation(fields: [userId], references: [id], onDelete: Cascade) @@unique([provider, providerAccountId]) } model Session { id String @id @default(cuid()) sessionToken String @unique userId String expires DateTime user User @relation(fields: [userId], references: [id], onDelete: Cascade) } model Game { id String @id @default(cuid()) createdAt DateTime @default(now()) updatedAt DateTime @updatedAt status String @default("WAITING") currentPlayer Int @default(0) dice String @default("0,0") // Stored as comma-separated values players Player[] } model Player { id String @id @default(cuid()) userId String? gameId String color String tokens String isAI Boolean @default(false) user User? @relation(fields: [userId], references: [id]) game Game @relation(fields: [gameId], references: [id]) @@index([userId]) }
```

# src/styles/globals.css

```css
@tailwind base; @tailwind components; @tailwind utilities; :root { --foreground-rgb: 0, 0, 0; --background-start-rgb: 214, 219, 220; --background-end-rgb: 255, 255, 255; } body { color: rgb(var(--foreground-rgb)); background: linear-gradient( to bottom, transparent, rgb(var(--background-end-rgb)) ) rgb(var(--background-start-rgb)); }
```

# src/pages/login.tsx

```tsx
import { signIn, useSession } from "next-auth/react" import { useRouter } from 'next/router' import { useEffect } from 'react' import { Button } from '@/components/ui/button' import React from "react" export default function Login() { const { data: session } = useSession() const router = useRouter() useEffect(() => { if (session) { router.push('/game') } }, [session, router]) return ( <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100"> <h1 className="text-4xl font-bold mb-8">Sign In</h1> <div className="space-y-4"> <Button onClick={() => signIn("google")}>Sign in with Google</Button> <Button onClick={() => signIn("github")}>Sign in with GitHub</Button> <Button onClick={() => signIn("credentials", { callbackUrl: '/game' })}>Sign in with Credentials</Button> </div> </div> ) }
```

# src/pages/layout.tsx

```tsx
// app/layout.tsx import { Inter } from 'next/font/google' //import { Providers } from './providers' const inter = Inter({ subsets: ['latin'] }) export default function RootLayout({ children, }: { children: React.ReactNode }) { return ( <html lang="en"> <body className={inter.className}> <main className="flex min-h-screen flex-col items-center justify-between p-24"> {children} </main> </body> </html> ) }
```

# src/pages/index.tsx

```tsx
import { useSession } from 'next-auth/react' import Link from 'next/link' import { Button } from '@/components/ui/button' import React from 'react' export default function Home() { const { data: session } = useSession() return ( <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100"> <h1 className="text-4xl font-bold mb-8">Welcome to Ludo 3D</h1> {session ? ( <Link href="/game"> <Button>Start New Game</Button> </Link> ) : ( <Link href="/login"> <Button>Sign In to Play</Button> </Link> )} </div> ) }
```

# src/pages/game.tsx

```tsx
import React, { useEffect, useState, useCallback } from 'react' import { useSession } from 'next-auth/react' import { useRouter } from 'next/router' //import GameBoard from '../components/GameBoard' import { useGameStore } from '@/lib/gameState' import { Button } from '@/components/ui/button' import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card' import { Alert, AlertDescription } from '@/components/ui/alert' import { log, setLogging } from '@/lib/logger' import LudoBoard from '@/components/LudoBoard' export default function GamePage() { const { data: session, status } = useSession() const router = useRouter() const { gameId } = router.query const [gameStarted, setGameStarted] = useState(false) const [setCurrentPlayer] = useState<'green' | 'yellow' | 'red' | 'black'>('green'); const [error, setError] = useState<string | null>(null) const { players, currentPlayer, dice, selectedDie, winner, createGame, loadGame, rollDice, selectDie, endTurn, moveToken, canMoveToken, hasValidMove, playAITurn } = useGameStore() useEffect(() => { log('Entering first useEffect in GamePage') if (status === 'unauthenticated') { router.push('/login') } }, [status, router]) useEffect(() => { log('Entering session logging useEffect in GamePage') log(`Session: ${JSON.stringify({ status, userId: session?.user?.id })}`) }, [session, status]) const initGame = useCallback(async () => { log('Entering initGame function') if (status === 'authenticated' && session?.user) { try { if (gameId) { await loadGame(gameId as string) } else { await createGame(session.user?.id) } setGameStarted(true) } catch (err) { console.error('Game initialization error:', err) setError('Failed to initialize the game. Please try again.') } } }, [status, session, gameId, loadGame, createGame]) useEffect(() => { log('Entering game initialization useEffect in GamePage') if (status === 'authenticated' && session?.user && !gameStarted) { initGame() } }, [status, session, gameId, gameStarted, initGame]) useEffect(() => { log('Entering AI turn useEffect in GamePage') if (gameStarted && players[currentPlayer]?.isAI) { const timer = setTimeout(() => { playAITurn() }, 1000) return () => clearTimeout(timer) } }, [gameStarted, currentPlayer,dice, players, playAITurn]) useEffect(() => { log('Entering game state update logging useEffect in GamePage') log(`Game state updated: ${JSON.stringify({ currentPlayer, dice, players: players.map(p => ({ id: p.id, userId: p.userId, color: p.color, tokens: p.tokens })) })}`) }, [currentPlayer, dice, players]) const handleRollDice = async () => { log('Entering handleRollDice function') if (players[currentPlayer]?.userId === session?.user?.id) { await rollDice() log(`Dice rolled: ${useGameStore.getState().dice}`) // Check if there are any valid moves after rolling if (!hasValidMove()) { log('No valid moves after rolling, ending turn') await useGameStore.getState().endTurn() } } } const handleSelectDie = (dieIndex: number) => { log(`Entering handleSelectDie function for die ${dieIndex}`) if (players[currentPlayer]?.userId === session?.user?.id) { selectDie(dieIndex) } } const handleMoveToken = async (tokenIndex: number) => { log(`Entering handleMoveToken function for token ${tokenIndex}`) if (players[currentPlayer]?.userId === session?.user?.id && selectedDie !== null) { const moveMade = await moveToken(players[currentPlayer].id, tokenIndex) if (moveMade) { log("Token moved successfully") } else { log("Invalid move") } } else { log("Cannot move token: either not your turn or no die selected") } } const isYourTurn = players[currentPlayer]?.userId === session?.user?.id const canUseDie = (dieValue: number, dieIndex: number) => { log(`Entering canUseDie function for die ${dieIndex} with value ${dieValue}`) const canUse = dieValue === 6 || players[currentPlayer].tokens.some((token) => token !== -1); log(`Can use die ${dieIndex} (value ${dieValue}): ${canUse}`); return canUse; } log(`Render state: ${JSON.stringify({ gameStarted, isYourTurn, currentPlayer, dice, playerId: session?.user?.id, currentPlayerId: players[currentPlayer]?.userId, players: players.map(p => ({ id: p.id, userId: p.userId, color: p.color, isAI: p.isAI })) })}`) if (status === 'loading') { return <div>Loading...</div> } if (error) { return ( <Alert variant="destructive"> <AlertDescription>{error}</AlertDescription> </Alert> ) } return ( <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100"> <div className="max-w-4xl p-4"> <Card className="bg-white flex right-0"> <CardHeader> <CardTitle>Ludo Game</CardTitle> </CardHeader> <CardContent> {!gameStarted ? ( <Button onClick={initGame}>Start New Game</Button> ) : ( <> <div className="h-50"> <p className="text-lg font-bold"> Current Player: <span className="text-blue-600">{players[currentPlayer]?.color}</span> </p> {isYourTurn ? ( <p className="text-green-600 font-bold">It&apos;s your turn!</p> ) : ( <p className="text-red-600">Waiting for {players[currentPlayer]?.color} player to make a move...</p> )} <p className="mt-2">Dice: {dice.join(', ')}</p> </div> {isYourTurn && ( <div className="mb-4"> {dice.every(d => d === 0) ? ( <div> <p className="mb-2 text-blue-600">Click the button below to roll the dice:</p> <Button onClick={handleRollDice} className="bg-blue-500 hover:bg-blue-700">Roll Dice</Button> </div> ) : hasValidMove() ? ( selectedDie === null ? ( <div> <p className="mb-2 text-blue-600">Select which die to use:</p> {dice.map((value, index) => ( <Button key={index} onClick={() => handleSelectDie(index)} className="mr-2 bg-blue-500 hover:bg-blue-700" disabled={value === 0 || !canUseDie(value, index)} > Use {value} </Button> ))} </div> ) : ( <div> <p className="mb-2 text-blue-600">Select a token to move:</p> <div className="flex flex-wrap gap-2"> {players[currentPlayer].tokens.map((token, index) => ( <Button key={index} onClick={() => handleMoveToken(index)} disabled={!canMoveToken(players[currentPlayer].id, index)} className={`${canMoveToken(players[currentPlayer].id, index) ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-300'}`} > Move Token {index + 1} </Button> ))} </div> </div> ) ) : ( <div> <p className="mb-2 text-red-600">No valid moves available. Your turn will be skipped.</p> <Button onClick={handleRollDice} className="bg-blue-500 hover:bg-blue-700">End Turn</Button> </div> )} </div> )} {winner && ( <Alert> <AlertDescription> Player {winner} has won the game! </AlertDescription> </Alert> )} <Button onClick={() => console.log(useGameStore.getState())}> Log Game State </Button> </> )} </CardContent> </Card> </div> {gameStarted && ( <div> <LudoBoard /> </div> )} </div> ) }
```

# src/pages/_app.tsx

```tsx
import { SessionProvider } from "next-auth/react" import type { AppProps } from "next/app" import '@/styles/globals.css' import React from 'react' export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) { return ( <SessionProvider session={session}> <Component {...pageProps} /> </SessionProvider> ) }
```

# src/lib/utils.ts

```ts
import { type ClassValue, clsx } from "clsx" import { twMerge } from "tailwind-merge" export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
```

# src/lib/prisma.ts

```ts
import { PrismaClient } from '@prisma/client' let prisma: PrismaClient if (process.env.NODE_ENV === 'production') { prisma = new PrismaClient() } else { if (!(global as any).prisma) { (global as any).prisma = new PrismaClient() } prisma = (global as any).prisma } export default prisma
```

# src/lib/logger.ts

```ts
let isLoggingEnabled = process.env.DEBUG||true; export const setLogging = (enabled: boolean) => { isLoggingEnabled = enabled; }; export const log = (message: string) => { if (isLoggingEnabled) { console.log(message); } };
```

# src/lib/jwt.ts

```ts
// /app/lib/jwt.ts const jwt = require('jsonwebtoken'); export const generateJwtToken = async (user: any): Promise<string> => { // Use optional chaining to safely access nested properties const secretKey = process.env.JWT_SECRET; if (!secretKey) { throw new Error('JWT_SECRET environment variable not set'); } try { // Create a JWT token with the user's information const token = jwt.sign( { sub: user.id, // subject (user ID) name: user.name, email: user.email, // Add any other relevant claims here }, secretKey, { expiresIn: '1h', // token expires in 1 hour } ); return token; } catch (error) { // Handle other potential errors here console.error("Error generating JWT token:", error); throw new Error("Failed to generate JWT token"); } };
```

# src/lib/gameTypes.ts

```ts
export type PlayerColor = 'red' | 'green' | 'yellow' | 'black'; export interface Player { id: string; userId: string | null; color: PlayerColor; tokens: number[]; isAI: boolean; startPosition: number; } export interface GameState { gameId: string | null; players: Player[]; currentPlayer: number; dice: number[]; selectedDie: number | null; winner: string | null; createGame: (userId: string) => Promise<void>; loadGame: (gameId: string) => Promise<void>; rollDice: () => Promise<void>; selectDie: (dieIndex: number) => void; moveToken: (playerId: string, tokenIndex: number) => Promise<boolean>; canMoveToken: (playerId: string, tokenIndex: number) => boolean; hasValidMove: () => boolean; playAITurn: () => Promise<void>; checkWinCondition: () => void; updateGameState: () => Promise<void>; isBlocked: (position: number) => boolean; endTurn: () => Promise<void>; }
```

# src/lib/gameState.ts

```ts
import { create } from 'zustand' import { makeAIMove } from './aiPlayer' import { log } from './logger' import { GameState } from './gameTypes' import { TRACK_STEPS, HOME_STEPS, TOTAL_STEPS } from './constants' export type Player = { id: string userId: string color: 'red' | 'green' | 'yellow' | 'black' tokens: number[] isAI: boolean startPosition: number } const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); export const useGameStore = create<GameState>((set, get) => ({ gameId: null, players: [], currentPlayer: 0, dice: [0, 0], selectedDie: null, winner: null, createGame: async (userId: string) => { log('Entering createGame function') try { const response = await fetch('/api/game', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ userId }), }) if (!response.ok) throw new Error('Failed to create game') const game = await response.json() log(`Game created: ${JSON.stringify(game)}`) set({ gameId: game.id, players: game.players.map((p: any, index: number) => ({ id: p.id, userId: p.userId, // This can now be null color: p.color, tokens: p.tokens.split(',').map(Number), startPosition: index * 12, isAI: !p.userId, // Set isAI to true if userId is null })), currentPlayer: game.currentPlayer, dice: game.dice.split(',').map(Number), }) log(`Game state after creation: ${JSON.stringify(get(), null, 2)}`) } catch (error) { log(`Error creating game: ${error}`) throw error } }, loadGame: async (gameId: string) => { log('Entering loadGame function') try { const response = await fetch(`/api/game?id=${gameId}`) if (!response.ok) throw new Error('Failed to load game') const game = await response.json() log(`Game loaded: ${JSON.stringify(game)}`) set({ gameId: game.id, players: game.players.map((p: any, index: number) => ({ ...p, tokens: p.tokens.split(',').map(Number), startPosition: index * 12, })), currentPlayer: game.currentPlayer, dice: game.dice.split(',').map(Number), }) } catch (error) { log(`Error loading game: ${error}`) throw error } }, rollDice: async () => { log('Entering rollDice function') const newDice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1] log(`Rolled dice: ${newDice.join(', ')}`) set({ dice: newDice, selectedDie: null }) await get().updateGameState() }, selectDie: (dieIndex: number) => { log(`Entering selectDie function with index ${dieIndex}`) set({ selectedDie: dieIndex }) }, canMoveToken: (playerId: string, tokenIndex: number): boolean => { log(`Entering canMoveToken function for player ${playerId}, token ${tokenIndex}`) const state = get() const player = state.players.find(p => p.id === playerId) if (!player || state.selectedDie === null) { log(`Player not found or no die selected`) return false } const diceValue = state.dice[state.selectedDie] const tokenPosition = player.tokens[tokenIndex] log(`Checking move for player ${player.color}, token ${tokenIndex}, position ${tokenPosition}, dice ${diceValue}`) // Moving out of base if (tokenPosition === -1 && diceValue === 6) { const startPosition = player.startPosition if (state.isBlocked(startPosition)) { log(`Cannot move out of base: start position ${startPosition} is blocked`) return false } log('Can move out of base with a 6') return true } if (tokenPosition === -1) { log('Cannot move token in base without rolling a 6') return false } // Calculate new position const newPosition = (tokenPosition + diceValue) % TRACK_STEPS log(`Calculated new position: ${newPosition}`) // Check if the path is blocked for (let step = 1; step <= diceValue; step++) { const checkPosition = (tokenPosition + step) % TRACK_STEPS if (state.isBlocked(checkPosition)) { log(`Path is blocked at position ${checkPosition}`) return false } } // Check if the move would exceed the home stretch const distanceFromStart = (newPosition - player.startPosition + TRACK_STEPS) % TRACK_STEPS if (distanceFromStart > TRACK_STEPS - HOME_STEPS - 1) { log(`Move would exceed home stretch. Distance from start: ${distanceFromStart}`) return false } // Check if the final position is occupied by two or more of the player's own tokens const tokensAtNewPosition = player.tokens.filter(t => t === newPosition).length if (tokensAtNewPosition >= 2) { log(`Final position ${newPosition} is occupied by ${tokensAtNewPosition} of player's own tokens`) return false } log('Move is valid') return true }, isBlocked: (position: number): boolean => { const state = get(); const tokensAtPosition = state.players.flatMap(player => player.tokens.filter(token => token === position) ); if (tokensAtPosition.length >= 2) { const playerWithTokens = state.players.find(player => player.tokens.filter(token => token === position).length >= 2 ); return !!playerWithTokens; // Returns true if a player has 2 or more tokens at this position } return false; }, endTurn: async () => { log('Entering endTurn function') const state = get() const currentPlayer = state.players[state.currentPlayer] log(`Current player: ${currentPlayer.color}, isAI: ${currentPlayer.isAI}`) log(`Current dice: ${state.dice.join(', ')}`) // 2 second pause between player turns await new Promise(resolve => setTimeout(resolve, 2000)); // Move to the next player const nextPlayer = (state.currentPlayer + 1) % state.players.length log(`Turn ended. Moving to next player: ${state.players[nextPlayer].color}`) set({ currentPlayer: nextPlayer, dice: [0, 0], selectedDie: null }) await get().updateGameState() // Check if the next player is AI if (state.players[nextPlayer].isAI) { log('Next player is AI, initiating AI turn') setTimeout(() => get().playAITurn(), 1000) // Delay AI turn for better UX } }, moveToken: async (playerId: string, tokenIndex: number): Promise<boolean> => { log(`Entering moveToken function for player ${playerId}, token ${tokenIndex}`) const state = get() if (state.selectedDie === null) { log('No die selected. Cannot move token.') return false } const player = state.players.find(p => p.id === playerId) if (!player) { log(`Player with id ${playerId} not found.`) return false } if (!state.canMoveToken(playerId, tokenIndex)) { log('Invalid move. Token cannot be moved.') return false } log(`Moving token for player: ${player.color}`) let newPlayers = JSON.parse(JSON.stringify(state.players)) let currentPosition = player.tokens[tokenIndex] const diceValue = state.dice[state.selectedDie] const moveOneStep = async () => { const totalSteps = currentPosition === -1 ? 1 : diceValue for (let step = 0; step < totalSteps; step++) { await pause(1000) // 1 second delay between steps if (currentPosition === -1) { currentPosition = player.startPosition } else { currentPosition = (currentPosition + 1) % TRACK_STEPS } const updatedPlayerIndex = newPlayers.findIndex((p: Player) => p.id === playerId) newPlayers[updatedPlayerIndex].tokens[tokenIndex] = currentPosition set({ players: newPlayers }) log(`Token moved to position: ${currentPosition}`) } } try { await moveOneStep() } catch (error) { log(`Error during token movement: ${error}`) return false } // Check for capture only after the final step const updatedPlayerIndex = newPlayers.findIndex((p: Player) => p.id === playerId) const finalPosition = newPlayers[updatedPlayerIndex].tokens[tokenIndex] let captureOccurred = false if (!state.isBlocked(finalPosition)) { for (const otherPlayer of newPlayers) { if (otherPlayer.id !== playerId) { const capturedTokenIndex = otherPlayer.tokens.findIndex((t: number) => t === finalPosition) if (capturedTokenIndex !== -1 && finalPosition < TRACK_STEPS - 1) { otherPlayer.tokens[capturedTokenIndex] = -1 log(`Kicked out ${otherPlayer.color} token back to base`) captureOccurred = true } } } } if (captureOccurred) { set({ players: newPlayers }) await pause(4000) // 4 second pause after a capture } const newDice = [...state.dice] newDice[state.selectedDie] = 0 set({ players: newPlayers, dice: newDice, selectedDie: null }) log(`After move - Dice: ${newDice}, Current player: ${state.currentPlayer}`) await get().updateGameState() get().checkWinCondition() // Check if player gets another turn (rolled a 6) if (diceValue === 6 && newDice.some(d => d !== 0)) { log('Player rolled a 6, gets another turn') return true } if (!get().hasValidMove()) { log('No more valid moves, ending turn') await get().endTurn() } return true }, hasValidMove: () => { log('Entering hasValidMove function') const state = get() const currentPlayer = state.players[state.currentPlayer] log(`Checking for valid moves for ${currentPlayer.color}`) log(`Dice: ${state.dice}`) return state.dice.some((dieValue, dieIndex) => { if (dieValue === 0) return false state.selectedDie = dieIndex const hasMove = currentPlayer.tokens.some((_, tokenIndex) => state.canMoveToken(currentPlayer.id, tokenIndex) ) log(`Die ${dieIndex} (value ${dieValue}): ${hasMove ? 'Has valid move' : 'No valid move'}`) return hasMove }) }, playAITurn: async () => { log('Entering playAITurn function') const state = get() const currentPlayer = state.players[state.currentPlayer] if (!currentPlayer.isAI) { log('Current player is not AI, skipping AI turn') return } log(`AI Turn: Player ${currentPlayer.color}`) // Roll dice await get().rollDice() let newDice = [...get().dice] log(`AI dice roll: ${newDice.join(', ')}`) let moveMade = false for (let i = 0; i < newDice.length; i++) { if (newDice[i] === 0) continue get().selectDie(i) const moveResult = makeAIMove(currentPlayer, [newDice[i]], state.players.filter(p => p.id !== currentPlayer.id)) if (moveResult !== -1) { log(`AI attempting to move token: ${moveResult}`) const moveSuccessful = await get().moveToken(currentPlayer.id, moveResult) if (moveSuccessful) { log(`AI successfully moved token: ${moveResult}`) moveMade = true // Re-fetch dice as they may have changed after moveToken newDice = get().dice } else { log(`AI failed to move token: ${moveResult}`) } } else { log('AI has no valid moves for this die') } } if (!moveMade) { log('AI could not make any moves, ending turn') await get().endTurn() } else if (newDice.every(d => d === 0)) { log('AI used all dice, ending turn') await get().endTurn() } log('AI Turn ended') }, checkWinCondition: () => { log('Entering checkWinCondition function') const state = get() const winner = state.players.find(player => player.tokens.every(token => token === TOTAL_STEPS - 1) ) if (winner) { log(`Player ${winner.color} has won the game!`) set({ winner: winner.id }) } }, updateGameState: async () => { log('Entering updateGameState function') const state = get() if (!state.gameId) return try { const response = await fetch(`/api/game?id=${state.gameId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ currentPlayer: state.currentPlayer, dice: state.dice, players: state.players.map(player => ({ ...player, tokens: player.tokens.join(','), })), }), }) if (!response.ok) { throw new Error('Failed to update game state') } log('Game state updated successfully') } catch (error) { log(`Error updating game state: ${error}`) } } }))
```

# src/lib/gameState.test.txt

```txt
import { useGameStore } from './gameState' describe('Game State', () => { beforeEach(() => { useGameStore.setState({ players: [], currentPlayer: 0, dice: [0, 0] }) }) test('addPlayer adds a player to the game', () => { const addPlayer = useGameStore.getState().addPlayer addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: false }) expect(useGameStore.getState().players).toHaveLength(1) expect(useGameStore.getState().players[0].color).toBe('red') }) test('rollDice generates two numbers between 1 and 6', () => { const rollDice = useGameStore.getState().rollDice rollDice() const dice = useGameStore.getState().dice expect(dice).toHaveLength(2) expect(dice[0]).toBeGreaterThanOrEqual(1) expect(dice[0]).toBeLessThanOrEqual(6) expect(dice[1]).toBeGreaterThanOrEqual(1) expect(dice[1]).toBeLessThanOrEqual(6) }) test('canMoveToken returns false for token in base without a 6', () => { const addPlayer = useGameStore.getState().addPlayer addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: false }) useGameStore.setState({ dice: [3, 2] }) expect(useGameStore.getState().canMoveToken('1', 0)).toBe(false) }) test('canMoveToken returns true for token in base with a 6', () => { const addPlayer = useGameStore.getState().addPlayer addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: false }) useGameStore.setState({ dice: [6, 1] }) expect(useGameStore.getState().canMoveToken('1', 0)).toBe(true) }) test('moveToken moves a token out of base and does not change the current player', () => { const addPlayer = useGameStore.getState().addPlayer const moveToken = useGameStore.getState().moveToken addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: false }) addPlayer({ id: '2', color: 'blue', tokens: [0, 0, 0, 0], isAI: false }) useGameStore.setState({ dice: [6, 1] }) const newState = moveToken('1', 0) expect(newState.players[0].tokens[0]).toBe(1) expect(newState.currentPlayer).toBe(0) expect(newState.dice).toEqual([0, 0]) }) test('moveToken kicks back enemy token', () => { const addPlayer = useGameStore.getState().addPlayer const moveToken = useGameStore.getState().moveToken addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: false }) addPlayer({ id: '2', color: 'blue', tokens: [7, 0, 0, 0], isAI: false }) useGameStore.setState({ dice: [6, 1] }) const newState = moveToken('1', 0) expect(newState.players[0].tokens[0]).toBe(1) expect(newState.players[1].tokens[0]).toBe(7) // Enemy token should not be kicked back in this case expect(newState.currentPlayer).toBe(0) expect(newState.dice).toEqual([0, 0]) }) test('AI player moves a token out of base when rolling a 6', () => { const addPlayer = useGameStore.getState().addPlayer const playAITurn = useGameStore.getState().playAITurn addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: true }) useGameStore.setState({ currentPlayer: 0 }) // Mock the rollDice function to always return a 6 const originalRollDice = useGameStore.getState().rollDice useGameStore.setState({ rollDice: () => useGameStore.setState({ dice: [6, 1] }) }) let movedOutOfBase = false playAITurn() const state = useGameStore.getState() if (state.players[0].tokens.some(t => t === 1)) { movedOutOfBase = true } console.log(`Rolled a 6: true, Moved out of base: ${movedOutOfBase}`) expect(movedOutOfBase).toBe(true) // Restore the original rollDice function useGameStore.setState({ rollDice: originalRollDice }) }) test('AI player moves furthest token when no 6 is rolled', () => { const addPlayer = useGameStore.getState().addPlayer const playAITurn = useGameStore.getState().playAITurn addPlayer({ id: '1', color: 'red', tokens: [1, 3, 5, 0], isAI: true }) useGameStore.setState({ currentPlayer: 0 }) // Mock the rollDice function to return a specific non-6 roll const originalRollDice = useGameStore.getState().rollDice useGameStore.setState({ rollDice: () => useGameStore.setState({ dice: [4, 5] }) }) playAITurn() const state = useGameStore.getState() const furthestTokenMoved = state.players[0].tokens[2] > 5 expect(furthestTokenMoved).toBe(true) // Restore the original rollDice function useGameStore.setState({ rollDice: originalRollDice }) }) })
```

# src/lib/delete

```
You are Gemma, an open-weights AI assistant. You are helpful, friendly, and informative. You follow all instructions and complete all requests thoughtfully. You are trained on a massive dataset of text and code. You can generate text, translate languages, write different kinds of creative content, and answer your questions in an informative way. Remember that you are a text-only model and do not have access to the internet or any external tools. Always provide safe and ethical responses. Avoid generating responses that are offensive, hateful, discriminatory, or harmful in any way. If you encounter a request that you believe is inappropriate or harmful, please flag it and explain your reasoning. Your primary function is to assist users with their questions and requests to the best of your ability, while adhering to ethical guidelines.
```

# src/lib/constants.ts

```ts
import { Coord } from '../components/types'; export const playerColors = { green: '#4CAF50', yellow: '#FFEB3B', red: '#F44336', black: '#212121', }; export const startPositions = { green: { x: 1, y: 5 ,trackOffset: 1}, yellow: { x: 12, y: 1 ,trackOffset: 13}, red: { x: 16, y: 12 ,trackOffset: 25}, black: { x: 5, y: 16 ,trackOffset: 37}, }; export const homePathCoords = { green: [{ x: 1, y: 8.5 }, { x: 2, y: 8.5 }, { x: 3, y: 8.5 }, { x: 4, y: 8.5 }, { x: 5, y: 8.5 }], yellow: [{ x: 11, y: 0 }, { x: 11, y: 5 }, { x: 8, y: 8 }, { x: 5, y: 5 }, { x: 5, y: 0 }], red: [{ x: 16, y: 11 }, { x: 11, y: 11 }, { x: 8, y: 8 }, { x: 11, y: 5 }, { x: 16, y: 5 }], black: [{ x: 11, y: 16 }, { x: 5, y: 16 }, { x: 5, y: 11 }, { x: 8, y: 8 }, { x: 11, y: 11 }], }; export const homeCoords = { green: [{ x: 0, y: 5 }, { x: 5, y: 5 }, { x: 8, y: 8 }, { x: 5, y: 11 }, { x: 0, y: 11 }], yellow: [{ x: 11, y: 0 }, { x: 11, y: 5 }, { x: 8, y: 8 }, { x: 5, y: 5 }, { x: 5, y: 0 }], red: [{ x: 16, y: 11 }, { x: 11, y: 11 }, { x: 8, y: 8 }, { x: 11, y: 5 }, { x: 16, y: 5 }], black: [{ x: 11, y: 16 }, { x: 5, y: 16 }, { x: 5, y: 11 }, { x: 8, y: 8 }, { x: 11, y: 11 }], }; export const homeDestCoords = { green: [{ x: 6, y: 9.5 }, { x: 6, y: 7.5 }, { x: 6, y: 8.5 }, { x: 7, y: 8.5 }], yellow: [{ x: 11, y: 0 }, { x: 11, y: 5 }, { x: 8, y: 8 }, { x: 5, y: 5 }], red: [{ x: 16, y: 11 }, { x: 11, y: 11 }, { x: 8, y: 8 }, { x: 11, y: 5 }], black: [{ x: 11, y: 16 }, { x: 5, y: 16 }, { x: 5, y: 11 }, { x: 8, y: 8 }], }; // Coordinates for the penultimate track steps(verified) export const finalStepCoords = { green: [{ x: -1, y: 5 }, { x: 0, y: 5 }, { x: 0, y: 11 }, { x: -1, y: 11 }], yellow: [{ x: 5, y: -1 }, { x: 5, y: 0 }, { x: 11, y: 0 },{ x: 11, y: -1}], red: [{ x: 16, y: 5 }, { x: 17, y: 5 }, { x: 17, y: 11 }, { x: 16, y: 11 }], black: [{ x: 5, y: 16 }, { x: 5, y: 17 }, { x: 11, y: 17 }, { x: 11, y: 16 }], }; //Coordinates for the bases export const baseCoords = { green: [{ x: -1, y: -1 }, { x: -1, y: 4 }, { x: 4, y: 4 }, { x: 4, y: -1 }], yellow: [{ x: 17, y: -1 }, { x: 12, y: -1 }, { x: 12, y: 4 }, { x: 17, y: 4 }], red: [{ x: 12, y: 12 }, { x: 12, y: 17 }, { x: 17, y: 17 }, { x: 17, y: 12 }], black: [{ x: -1, y: 17 }, { x: -1, y: 12 }, { x: 4, y: 12 }, { x: 4, y: 17 }], }; //Coordinates for the track export const trackCoords: Coord[] = [ { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 2 }, { x: 5, y: 1 }, { x: 5, y: 0 }, { x: 8.5, y: 0 }, { x: 12, y: 0 }, { x: 12, y: 1 }, { x: 12, y: 2 }, { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 13, y: 5 }, { x: 14, y: 5 }, { x: 15, y: 5 }, { x: 16, y: 5 }, { x: 17, y: 5 }, { x: 17, y: 8.5 }, { x: 17, y: 12 }, { x: 16, y: 12 }, { x: 15, y: 12 }, { x: 14, y: 12 }, { x: 13, y: 12 }, { x: 12, y: 12 }, { x: 12, y: 13 }, { x: 12, y: 14 }, { x: 12, y: 15 }, { x: 12, y: 16 }, { x: 12, y: 17 }, { x: 8.5, y: 17 }, { x: 5, y: 17 }, { x: 5, y: 16 }, { x: 5, y: 15 }, { x: 5, y: 14 }, { x: 5, y: 13 }, { x: 5, y: 12 }, { x: 4, y: 12 }, { x: 3, y: 12 }, { x: 2, y: 12 }, { x: 1, y: 12 }, { x: 0, y: 12 }, { x: 0, y: 8.5 } ]; // Coordinates for the quadrants of the bases and the base positions of the player's tokens. export const quadrants = [ { start: [0, 0], color: playerColors.green, base: [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 1, y: 3 },{ x: 3, y: 3 }] }, { start: [13, 0], color: playerColors.yellow, base: [{ x: 14, y: 1 }, { x: 16, y: 1 }, { x: 14, y: 3 },{ x: 16, y: 3 }], }, { start: [13, 13], color: playerColors.red, base: [{ x: 14, y: 14 }, { x: 16, y: 14 }, { x: 14, y: 16 },{ x: 16, y: 16 }], }, { start: [0, 13], color: playerColors.black, base: [{ x: 1, y: 14 }, { x: 3, y: 14 }, { x: 1, y: 16 },{ x: 3, y: 16 }], }, ]; //export const rect = return (quadrants.forEach(quadrant => { rect.push(quadrant.base.forEach(coord => { return { x: coord.x, y: coord.y } }) }); export const GRID_SIZE = 18; export const BOARD_DEPTH = 0.75; export const TRACK_STEPS = 48; export const HOME_STEPS = 6; export const TOTAL_STEPS = (TRACK_STEPS - 1) + HOME_STEPS;
```

# src/lib/aiPlayer.ts

```ts
import { Player } from './gameState' import { TRACK_STEPS, HOME_STEPS, TOTAL_STEPS } from './constants' export function makeAIMove(player: Player, dice: number[], otherPlayers: Player[]): number { const diceSum = dice[0] + dice[1]; const canMoveOutOfBase = dice.includes(6); const HOME_ENTRANCE = TRACK_STEPS - 1; // --- Priority: Move out of Base if Possible --- if (canMoveOutOfBase) { const baseTokenIndex = player.tokens.findIndex(token => token === -1); if (baseTokenIndex !== -1) return baseTokenIndex; // Immediately return if possible } // --- Scoring-Based Decision Logic --- let bestMoveIndex = -1; let bestMoveScore = -Infinity; for (let i = 0; i < player.tokens.length; i++) { // More efficient loop const currentPos = player.tokens[i]; if (currentPos === -1) continue; // Skip base tokens if can't move out const newPos = (currentPos + diceSum) % TOTAL_STEPS; // Handle loop around the track const isHomeStretch = newPos > HOME_ENTRANCE; // Check if move is valid (within home stretch limits) if (isHomeStretch && newPos > HOME_ENTRANCE + HOME_STEPS) continue; let moveScore = 0; // --- Scoring Factors --- // Prioritize reaching home if (newPos === HOME_ENTRANCE + HOME_STEPS) moveScore += 1000; else if (isHomeStretch) moveScore += 500; moveScore += newPos; // Favor moving forward moveScore += player.tokens.includes(newPos) ? 200 : 0; // Forming blocks // Capture opponent tokens for (const opponent of otherPlayers) { if (opponent.tokens.includes(newPos)) moveScore += 300; } // Avoid immediate danger for (const opponent of otherPlayers) { for (const opponentToken of opponent.tokens) { if (opponentToken >= 0 && opponentToken < newPos && opponentToken + 6 >= newPos) { moveScore -= 100; } } } // --- Update Best Move --- if (moveScore > bestMoveScore) { bestMoveIndex = i; bestMoveScore = moveScore; } } return bestMoveIndex; // Return the index of the token to move (-1 if no valid move) }
```

# src/components/types.ts

```ts
import * as THREE from 'three'; export interface Coord { x: number; y: number; } export interface SquareProps { position: [number, number, number]; color: string; borderColor: string; border: boolean; } export interface BoardProps { selectedTokenId: number | null; onTokenClick: (tokenId: number) => void; tokens?: TokenModelProps[]; // Make tokens optional } export interface TokenModelProps { id: number; color: string; position: { x: number; y: number; z: number }; isSelected: boolean; onClick: () => void; } export interface PolygonProps { color: string; coords: Coord[]; border: boolean | null; borderColor: string | null; } export interface HomePathProps { color: string; startPosition: [number, number, number]; rotation?: number; }
```

# src/components/test-utils.txt

```txt
// test-utils.tsx import React from 'react' import { render, RenderOptions } from '@testing-library/react' import { Canvas } from '@react-three/fiber' const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => { return <Canvas>{children}</Canvas> } const customRender = ( ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'> ) => render(ui, { wrapper: AllTheProviders, ...options }) export * from '@testing-library/react' export { customRender as render }
```

# src/components/Token.tsx

```tsx
import React, { useRef, useEffect } from 'react'; import { useFrame } from '@react-three/fiber'; import { TokenModelProps } from './types'; import { BOARD_DEPTH } from '../lib/constants'; import * as THREE from 'three'; const Token: React.FC<TokenModelProps> = ({ id, color, position, isSelected, onClick }) => { const meshRef = useRef<THREE.Mesh>(null); useEffect(() => { if (meshRef.current) { meshRef.current.position.set(position.x, position.y, BOARD_DEPTH + 0.4); } }, [position]); useFrame((state) => { if (isSelected && meshRef.current) { const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.3; meshRef.current.scale.set(pulse, pulse, pulse); (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0; } else if (meshRef.current) { meshRef.current.scale.set(1, 1, 1); (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5; } }); return ( <group> <mesh ref={meshRef} onClick={onClick}> <sphereGeometry args={[0.4, 32, 32]} /> <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 1.0 : 0.5} /> </mesh> {isSelected && ( <mesh position={[position.x, position.y, BOARD_DEPTH + 0.5]}> <ringGeometry args={[0.5, 0.6, 32]} /> <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent={true} opacity={0.5} /> </mesh> )} </group> ); }; export default Token;
```

# src/components/Square.tsx

```tsx
import React from 'react'; import * as THREE from 'three'; import { SquareProps } from './types'; import { BOARD_DEPTH } from '../lib/constants'; const Square: React.FC<SquareProps> = ({ position, color, borderColor, border }) => { return ( <mesh position={position}> <boxGeometry args={[1, 1, BOARD_DEPTH]} /> <meshStandardMaterial color={color} /> {border && ( <lineSegments> <edgesGeometry args={[new THREE.BoxGeometry(1, 1, BOARD_DEPTH)]} /> <lineBasicMaterial color={borderColor} /> </lineSegments> )} </mesh> ); }; export default Square;
```

# src/components/Polygon.tsx

```tsx
import React from 'react'; import * as THREE from 'three'; import { PolygonProps } from './types'; import { BOARD_DEPTH } from '../lib/constants'; const Polygon: React.FC<PolygonProps> = ({ color, coords, border, borderColor }) => { const shape = new THREE.Shape(); shape.moveTo(coords[0].x, coords[0].y); coords.slice(1).forEach(coord => { shape.lineTo(coord.x, coord.y); }); shape.lineTo(coords[0].x, coords[0].y); const geometry = new THREE.ExtrudeGeometry(shape, { depth: BOARD_DEPTH, bevelEnabled: false }); return ( <group position={[-8.5, -8.5, 0]}> <mesh geometry={geometry}> <meshStandardMaterial color={color} /> </mesh> {border && ( <lineSegments> <edgesGeometry args={[geometry]} /> <lineBasicMaterial color={borderColor || 'black'} /> </lineSegments> )} </group> ); }; export default Polygon;
```

# src/components/LudoBoard.tsx

```tsx
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'; import { Canvas, useThree, useFrame } from '@react-three/fiber'; import { OrbitControls } from '@react-three/drei'; import Board from './Board'; import { TokenModelProps } from './types'; import { playerColors, trackCoords } from '../lib/constants'; import { useGameStore } from '@/lib/gameState'; import { Vector3, Euler } from 'three'; import * as THREE from 'three'; const LudoBoard: React.FC = () => { const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null); const { currentPlayer, players, moveToken } = useGameStore(); const groupRef = useRef<THREE.Group>(null); const [cameraInfo, setCameraInfo] = useState({ position: new Vector3(), rotation: new Euler(), scale: new Vector3(1, 1, 1) }); const handleCameraUpdate = useCallback((info: any) => { setCameraInfo(info); }, []); const handleTokenClick = useCallback(async (tokenId: number) => { setSelectedTokenId(tokenId); const playerIndex = Math.floor(tokenId / 4); const tokenIndex = tokenId % 4; const player = players[playerIndex]; if (player.id === players[currentPlayer].id) { await moveToken(player.id, tokenIndex); } }, [players, currentPlayer, moveToken]); const getRotationForPlayer = useCallback((): number => { switch (players[currentPlayer].color) { case 'red': return Math.PI; case 'black': return Math.PI / 2; case 'green': return 0; case 'yellow': return -Math.PI / 2; default: return Math.PI; } }, [players, currentPlayer]); const tokens = useMemo(() => { return players.flatMap((player, playerIndex) => player.tokens.map((tokenPosition, tokenIndex) => { const id = playerIndex * 4 + tokenIndex; let position; if (tokenPosition === -1) { // Token is in base const basePositions = [ { x: -3.5, y: -3.5 }, { x: -2.5, y: -3.5 }, { x: -3.5, y: -2.5 }, { x: -2.5, y: -2.5 } ]; position = basePositions[tokenIndex]; } else { // Token is on the board const trackPosition = (tokenPosition + player.startPosition) % trackCoords.length; position = trackCoords[trackPosition]; } return { id, color: playerColors[player.color as keyof typeof playerColors], position: { x: position.x - 8.5, y: position.y - 8.5, z: 0.4 }, isSelected: id === selectedTokenId, onClick: () => handleTokenClick(id) }; }) ); }, [players, selectedTokenId, handleTokenClick]); return ( <div style={{ width: '100vw', height: '100vh', position: 'relative' }}> <Canvas camera={{ position: [0, 90, 45], fov: 60 }}> <ambientLight intensity={0.7} /> <pointLight position={[50, 50, 50]} intensity={0.8} /> <group ref={groupRef} rotation={[180, 0, getRotationForPlayer()]} scale={[3, 3, 3]} position={[0, -5, 0]} > <Board selectedTokenId={selectedTokenId} onTokenClick={handleTokenClick} tokens={tokens} /> </group> <OrbitControls minDistance={50} maxDistance={200} maxPolarAngle={Math.PI / 2.1} /> </Canvas> <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '10px', fontFamily: 'monospace', }}> <div>Camera Position: {cameraInfo.position.x.toFixed(2)}, {cameraInfo.position.y.toFixed(2)}, {cameraInfo.position.z.toFixed(2)}</div> <div>Camera Rotation: {cameraInfo.rotation.x.toFixed(2)}, {cameraInfo.rotation.y.toFixed(2)}, {cameraInfo.rotation.z.toFixed(2)}</div> <div>Camera Scale: {cameraInfo.scale.x.toFixed(2)}, {cameraInfo.scale.y.toFixed(2)}, {cameraInfo.scale.z.toFixed(2)}</div> </div> <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '10px', fontFamily: 'monospace', }}> <div>Group Scale: {groupRef.current ? `${groupRef.current.scale.x.toFixed(2)}, ${groupRef.current.scale.y.toFixed(2)}, ${groupRef.current.scale.z.toFixed(2)}` : 'N/A'} </div> <div>Group Position: {groupRef.current ? `${groupRef.current.position.x.toFixed(2)}, ${groupRef.current.position.y.toFixed(2)}, ${groupRef.current.position.z.toFixed(2)}` : 'N/A'} </div> <div>Group Rotation: {groupRef.current ? `${groupRef.current.rotation.x.toFixed(2)}, ${groupRef.current.rotation.y.toFixed(2)}, ${groupRef.current.rotation.z.toFixed(2)}` : 'N/A'} </div> </div> </div> ); }; export default LudoBoard;
```

# src/components/HomePath.tsx

```tsx
import React from 'react'; import * as THREE from 'three'; import { HomePathProps } from './types'; const HomePath: React.FC<HomePathProps> = ({ color, startPosition, rotation = 0 }) => { const steps = Array(5).fill(null).map((_, index) => ( <mesh key={`step-${index}`} position={[index * 1.5, 0, 0]}> <boxGeometry args={[1.4, 1.4, 0.04]} /> <meshStandardMaterial color={color} /> <lineSegments> <edgesGeometry args={[new THREE.BoxGeometry(1.4, 1.4, 0.04)]} /> <lineBasicMaterial color="black" /> </lineSegments> </mesh> )); const finalStep = ( <mesh position={[7.5, 0, 0]}> <cylinderGeometry args={[1, 1, 0.04, 3]} /> <meshStandardMaterial color={color} /> <lineSegments> <edgesGeometry args={[new THREE.CylinderGeometry(1, 1, 0.04, 3)]} /> <lineBasicMaterial visible={true} color="black" /> </lineSegments> </mesh> ); return ( <group position={startPosition} rotation={[0, 0, rotation]}> {steps} {finalStep} </group> ); }; export default HomePath;
```

# src/components/GameBoard.tsx.old

```old
import React from 'react' import { Canvas } from '@react-three/fiber' import { OrbitControls, Text } from '@react-three/drei' import * as THREE from 'three' import { useGameStore } from '@/lib/gameState' import { trackCoords } from './constants' const BOARD_SIZE = 10 const TRACK_WIDTH = 1.5 const CORNER_SIZE = 2 const COLORS = { RED: '#FF0000', GREEN: '#00FF00', YELLOW: '#FFFF00', BLUE: '#0000FF', LIGHT_GREY: '#A0A0A0', DARK_GREY: '#404040', BLACK: '#000000' } function Board() { return ( <group> <BoardBase /> <TrackSegments /> <CornerSquares /> <Tokens /> </group> ) } function BoardBase() { return ( <mesh position={[0, -0.1, 0]}> <boxGeometry args={[BOARD_SIZE, 0.2, BOARD_SIZE]} /> <meshStandardMaterial color={COLORS.BLACK} /> </mesh> ) } function TrackSegments() { const trackGeometry = new THREE.BoxGeometry(TRACK_WIDTH, 0.3, TRACK_WIDTH) const trackMaterial = new THREE.MeshStandardMaterial({ color: COLORS.LIGHT_GREY }) const createTrackSegment = (x: number, z: number, index: number) => ( <mesh key={index} geometry={trackGeometry} material={trackMaterial} position={[x, 0.05, z]}> <Text position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.3} color={COLORS.BLACK} > {index} </Text> </mesh> ) const trackPositions = [ // Top row [-3, -4.25], [-1.5, -4.25], [0, -4.25], [1.5, -4.25], [3, -4.25], // Right column [4.25, -3], [4.25, -1.5], [4.25, 0], [4.25, 1.5], [4.25, 3], // Bottom row [3, 4.25], [1.5, 4.25], [0, 4.25], [-1.5, 4.25], [-3, 4.25], // Left column [-4.25, 3], [-4.25, 1.5], [-4.25, 0], [-4.25, -1.5], [-4.25, -3] ] return ( <group> {trackPositions.map((pos, index) => createTrackSegment(pos[0], pos[1], index))} </group> ) } function CornerSquares() { const cornerGeometry = new THREE.BoxGeometry(CORNER_SIZE, 0.3, CORNER_SIZE) const cornerMaterials = [ new THREE.MeshStandardMaterial({ color: COLORS.RED }), new THREE.MeshStandardMaterial({ color: COLORS.GREEN }), new THREE.MeshStandardMaterial({ color: COLORS.YELLOW }), new THREE.MeshStandardMaterial({ color: COLORS.BLUE }) ] const createCornerSquare = (x: number, z: number, index: number) => ( <mesh key={index} geometry={cornerGeometry} material={cornerMaterials[index]} position={[x, 0.05, z]} /> ) const cornerPositions = [ [-4, -4], [4, -4], [4, 4], [-4, 4] ] return ( <group> {cornerPositions.map((pos, index) => createCornerSquare(pos[0], pos[1], index))} </group> ) } function Token({ color, position }: { color: string; position: [number, number, number] }) { const tokenGeometry = new THREE.SphereGeometry(0.3, 32, 32) const tokenMaterial = new THREE.MeshStandardMaterial({ color }) return ( <mesh geometry={tokenGeometry} material={tokenMaterial} position={position} /> ) } function Tokens() { const players = useGameStore(state => state.players) const getTokenPosition = (playerIndex: number, tokenPosition: number): [number, number, number] => { if (tokenPosition === -1) { // Token is in base const basePositions = [ [-3.5, 0.2, -3.5], [-2.5, 0.2, -3.5], [-3.5, 0.2, -2.5], [-2.5, 0.2, -2.5], // Red base [2.5, 0.2, -3.5], [3.5, 0.2, -3.5], [2.5, 0.2, -2.5], [3.5, 0.2, -2.5], // Green base [2.5, 0.2, 2.5], [3.5, 0.2, 2.5], [2.5, 0.2, 3.5], [3.5, 0.2, 3.5], // Yellow base [-3.5, 0.2, 2.5], [-2.5, 0.2, 2.5], [-3.5, 0.2, 3.5], [-2.5, 0.2, 3.5] // Blue base ] return basePositions[playerIndex * 4 + tokenPosition] as [number, 0.2, number] } // Token is on the board const adjustedPosition = (tokenPosition - players[playerIndex].startPosition + 48) % 48 return [trackCoords[adjustedPosition].x, 0.2, trackCoords[adjustedPosition].y] } console.log("Rendering tokens..") return ( <group> {players.map((player, playerIndex) => player.tokens.map((tokenPosition, tokenIndex) => ( <Token key={`${playerIndex}-${tokenIndex}`} color={player.color} position={getTokenPosition(playerIndex, tokenPosition)} /> )) )} </group> ) } export default function GameBoard() { return ( <div style={{ width: '100%', height: '100%' }}> <Canvas camera={{ position: [0, 15, 15], fov: 50 }}> <ambientLight intensity={0.7} /> <pointLight position={[10, 10, 10]} intensity={0.5} /> <Board /> <OrbitControls /> </Canvas> </div> ) }
```

# src/components/Board.tsx

```tsx
import React, { useState, useEffect } from 'react'; import { useThree } from '@react-three/fiber'; import { BoardProps } from './types'; import Square from './Square'; import Polygon from './Polygon'; import Token from './Token'; import { TRACK_STEPS, HOME_STEPS, TOTAL_STEPS } from '../lib/constants'; import { playerColors, startPositions, homeCoords, homePathCoords, homeDestCoords, finalStepCoords, baseCoords, trackCoords, quadrants, GRID_SIZE, BOARD_DEPTH } from '../lib/constants'; import { useGameStore } from '@/lib/gameState'; const Board: React.FC<BoardProps> = ({ selectedTokenId, onTokenClick }) => { const { viewport } = useThree(); const [isMobile, setIsMobile] = useState(false); const responsiveRatio = viewport.width / 12; const officeScaleRatio = Math.max(0.5, Math.min(0.9 * responsiveRatio, 0.9)); useEffect(() => { const handleResize = () => setIsMobile(window.innerWidth < 768); handleResize(); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []); const squares = []; for (let x = 0; x < GRID_SIZE; x++) { for (let y = 0; y < GRID_SIZE; y++) { let color = 'white'; const isTrackSquare = trackCoords.some(coord => coord.x === x && coord.y === y); const isblack = startPositions.black.x === x && startPositions.black.y === y || homeCoords.black.some(coord => coord.x === x && coord.y === y); const isgreen = startPositions.green.x === x && startPositions.green.y === y || homeCoords.green.some(coord => coord.x === x && coord.y === y); const isred = startPositions.red.x === x && startPositions.red.y === y || homeCoords.red.some(coord => coord.x === x && coord.y === y); const isyellow = startPositions.yellow.x === x && startPositions.yellow.y === y || homeCoords.yellow.some(coord => coord.x === x && coord.y === y); Object.entries(startPositions).forEach(([playerColor, pos]) => { if (x === pos.x && y === pos.y) { color = playerColors[playerColor as keyof typeof playerColors]; } }); for (const quadrant of quadrants) { const [qx, qy] = quadrant.start; if (x >= qx && x < qx + 5 && y >= qy && y < qy + 5) { color = quadrant.color; break; } } if (isTrackSquare ) { squares.push( <Square key={`${x}-${y}`} position={[x - GRID_SIZE / 2, y - GRID_SIZE / 2, 0.375]} border={isTrackSquare} color={color} borderColor="black" /> ); } } } const gs = useGameStore(); const tokenTrackOffset = () => { switch (gs.players[gs.currentPlayer].color) { case 'green': return startPositions.green.trackOffset; case 'yellow': return startPositions.yellow.trackOffset; case 'red': return startPositions.red.trackOffset; case 'black': return startPositions.black.trackOffset; default: return 0; } } const zero_indexed_track = TOTAL_STEPS - HOME_STEPS - 1; const playerTokens = Object.entries(playerColors).flatMap(([color, colorValue], playerIndex) => { return gs.players[playerIndex].tokens.map((token, tokenIndex) => { let tokenCoords; if (token < 0) { // Token is in base (position of -1) tokenCoords = quadrants[playerIndex].base[tokenIndex]; console.log("TS:",TOTAL_STEPS) } else if (token >= 0 && token <= zero_indexed_track) { // Token is on the track (position of 0-46) console.log("Token is on the track", token); tokenCoords = trackCoords[(token + tokenTrackOffset())%48]; } else if ((token > zero_indexed_track) && token != (TOTAL_STEPS-1)) { // Token is on the final steps (position of 47-51) tokenCoords = homePathCoords[gs.players[playerIndex].color][token - zero_indexed_track-1]; console.log("Token is on the final steps", tokenCoords); } else if (token == (TOTAL_STEPS-1)) { // Token is on the home (position of 52?) tokenCoords = homeDestCoords[gs.players[playerIndex].color][tokenIndex]; } else { console.error(`Invalid token index: ${token}`); return null; } return ( <Token key={`${color}-${tokenIndex}`} id={playerIndex * 4 + tokenIndex} color={colorValue} position={{ x: tokenCoords.x - GRID_SIZE / 2, y: tokenCoords.y - GRID_SIZE / 2, z: BOARD_DEPTH }} isSelected={selectedTokenId === playerIndex * 4 + tokenIndex} onClick={() => onTokenClick(playerIndex * 4 + tokenIndex)} /> ); }); }).filter(Boolean); // Filter out null values return ( <group scale={officeScaleRatio}> <mesh position={[-0.5, -0.5, 0]}> <boxGeometry args={[GRID_SIZE + 0.5, GRID_SIZE + 0.5, 0.5]} /> <meshStandardMaterial color="gray" /> </mesh> {squares} <Polygon color="white" coords={finalStepCoords.green} border={true} borderColor="black" /> <Polygon color="white" coords={finalStepCoords.yellow} border={true} borderColor="black" /> <Polygon color="white" coords={finalStepCoords.red} border={true} borderColor="black" /> <Polygon color="white" coords={finalStepCoords.black} border={true} borderColor="black" /> <Polygon color={playerColors.green} coords={homeCoords.green} border={null} borderColor={null} /> <Polygon color={playerColors.green} coords={baseCoords.green} border={null} borderColor={null} /> <Polygon color={playerColors.yellow} coords={homeCoords.yellow} border={null} borderColor={null} /> <Polygon color={playerColors.yellow} coords={baseCoords.yellow} border={null} borderColor={null} /> <Polygon color={playerColors.red} coords={homeCoords.red} border={null} borderColor={null} /> <Polygon color={playerColors.red} coords={baseCoords.red} border={null} borderColor={null} /> <Polygon color={playerColors.black} coords={homeCoords.black} border={null} borderColor={null} /> <Polygon color={playerColors.black} coords={baseCoords.black} border={null} borderColor={null} /> {playerTokens} </group> ); }; export default Board;
```

# src/__mocks__/three.ts

```ts
// __mocks__/three.ts import * as THREE from 'three' const mockThree = { Mesh: function Mesh({ children, 'data-testid': testid, position, material }: THREE.MeshProps & { 'data-testid'?: string }) { return ( <div data-testid={testid} data-position={JSON.stringify(position)} data-material={JSON.stringify(material)}> {children} </div> ) }, BoxGeometry: function BoxGeometry(width: number, height: number, depth: number) { return { width, height, depth } }, SphereGeometry: function SphereGeometry(radius: number, widthSegments: number, heightSegments: number) { return { radius, widthSegments, heightSegments } }, MeshStandardMaterial: function MeshStandardMaterial(parameters: THREE.MeshStandardMaterialParameters) { return parameters }, Vector3: function Vector3(x: number, y: number, z: number) { return { x, y, z, set: jest.fn(), add: jest.fn() } }, Quaternion: function Quaternion() { return { setFromEuler: jest.fn() } }, Euler: function Euler(x: number, y: number, z: number) { return { x, y, z } }, } export default { ...jest.requireActual('three'), ...mockThree, }
```

# src/components/ui/card.tsx

```tsx
import * as React from "react" import { cn } from "@/lib/utils" const Card = React.forwardRef< HTMLDivElement, React.HTMLAttributes<HTMLDivElement> >(({ className, ...props }, ref) => ( <div ref={ref} className={cn( "rounded-lg border bg-card text-card-foreground shadow-sm", className )} {...props} /> )) Card.displayName = "Card" const CardHeader = React.forwardRef< HTMLDivElement, React.HTMLAttributes<HTMLDivElement> >(({ className, ...props }, ref) => ( <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} /> )) CardHeader.displayName = "CardHeader" const CardTitle = React.forwardRef< HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement> >(({ className, ...props }, ref) => ( <h3 ref={ref} className={cn( "text-2xl font-semibold leading-none tracking-tight", className )} {...props} /> )) CardTitle.displayName = "CardTitle" const CardDescription = React.forwardRef< HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> >(({ className, ...props }, ref) => ( <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} /> )) CardDescription.displayName = "CardDescription" const CardContent = React.forwardRef< HTMLDivElement, React.HTMLAttributes<HTMLDivElement> >(({ className, ...props }, ref) => ( <div ref={ref} className={cn("p-6 pt-0", className)} {...props} /> )) CardContent.displayName = "CardContent" const CardFooter = React.forwardRef< HTMLDivElement, React.HTMLAttributes<HTMLDivElement> >(({ className, ...props }, ref) => ( <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} /> )) CardFooter.displayName = "CardFooter" export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

# src/components/ui/button.tsx

```tsx
import * as React from "react" import { Slot } from "@radix-ui/react-slot" import { cva, type VariantProps } from "class-variance-authority" import { cn } from "@/lib/utils" const buttonVariants = cva( "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "bg-primary text-primary-foreground hover:bg-primary/90", destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90", outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground", secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80", ghost: "hover:bg-accent hover:text-accent-foreground", link: "text-primary underline-offset-4 hover:underline", }, size: { default: "h-10 px-4 py-2", sm: "h-9 rounded-md px-3", lg: "h-11 rounded-md px-8", icon: "h-10 w-10", }, }, defaultVariants: { variant: "default", size: "default", }, } ) export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean } const Button = React.forwardRef<HTMLButtonElement, ButtonProps>( ({ className, variant, size, asChild = false, ...props }, ref) => { const Comp = asChild ? Slot : "button" return ( <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} /> ) } ) Button.displayName = "Button" export { Button, buttonVariants }
```

# src/components/ui/alert.tsx

```tsx
import * as React from "react" import { cva, type VariantProps } from "class-variance-authority" import { cn } from "@/lib/utils" const alertVariants = cva( "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground", { variants: { variant: { default: "bg-background text-foreground", destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive", }, }, defaultVariants: { variant: "default", }, } ) const Alert = React.forwardRef< HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> >(({ className, variant, ...props }, ref) => ( <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} /> )) Alert.displayName = "Alert" const AlertTitle = React.forwardRef< HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement> >(({ className, ...props }, ref) => ( <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} /> )) AlertTitle.displayName = "AlertTitle" const AlertDescription = React.forwardRef< HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> >(({ className, ...props }, ref) => ( <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} /> )) AlertDescription.displayName = "AlertDescription" export { Alert, AlertTitle, AlertDescription }
```

# src/pages/api/game.ts

```ts
import { NextApiRequest, NextApiResponse } from 'next'; import { getServerSession } from 'next-auth/next'; import prisma from '@/lib/prisma'; import { authOptions } from './auth/[...nextauth]'; export default async function handler(req: NextApiRequest, res: NextApiResponse) { console.log('Received request:', req.method, req.url); const session = await getServerSession(req, res, authOptions); console.log('Session:', session); if (!session) { console.log('Unauthorized request'); return res.status(401).json({ error: 'Unauthorized' }); } try { switch (req.method) { case 'POST': return await handlePost(req, res, session); case 'GET': return await handleGet(req, res, session); case 'PUT': return await handlePut(req, res, session); default: console.log('Method not allowed:', req.method); return res.status(405).json({ error: 'Method not allowed' }); } } catch (error) { console.error('API error:', error); return res.status(500).json({ error: 'Internal server error', details: error.message }); } } async function handlePost(req: NextApiRequest, res: NextApiResponse, session: any) { console.log('Creating new game for user:', session.user); try { const game = await prisma.game.create({ data: { status: 'PLAYING', currentPlayer: 0, // Add this line to set initial current player dice: '0,0', // Add this line to set initial dice values players: { create: [ { userId: session.user.id, color: 'green', tokens: '-1,-1,-1,-1', isAI: false }, { color: 'black', tokens: '-1,-1,-1,-1', isAI: true }, { color: 'red', tokens: '-1,-1,-1,-1', isAI: true }, { color: 'yellow', tokens: '-1,-1,-1,-1', isAI: true }, ], }, }, include: { players: true, }, }); console.log('Game created:', game); res.status(201).json(game); } catch (error) { console.error('Error creating game:', error); res.status(500).json({ error: 'Error creating game', details: error.message }); } } async function handleGet(req: NextApiRequest, res: NextApiResponse, session: any) { try { const gameId = req.query.id as string; const game = await prisma.game.findUnique({ where: { id: gameId }, include: { players: true }, }); if (!game) { return res.status(404).json({ error: 'Game not found' }); } res.status(200).json(game); } catch (error) { console.error('Error fetching game:', error); res.status(500).json({ error: 'Error fetching game' }); } } async function handlePut(req: NextApiRequest, res: NextApiResponse, session: any) { try { const { id } = req.query const { currentPlayer, dice, players } = req.body const game = await prisma.game.update({ where: { id: id as string }, data: { currentPlayer, dice: dice.join(','), players: { updateMany: players.map((player: any) => ({ where: { id: player.id }, data: { tokens: typeof player.tokens == "string" ? player.tokens : player.tokens.join(','), // Join the tokens array here }, })), }, }, include: { players: true }, }) res.status(200).json(game) } catch (error) { console.error('Error updating game:', error) res.status(500).json({ error: 'Error updating game' }) } }
```

# src/pages/api/auth/[...nextauth].ts

```ts
//src/pages/api/auth/[...nextauth].ts import NextAuth, { AuthOptions, getServerSession } from "next-auth"; import GoogleProvider from "next-auth/providers/google"; import GithubProvider from "next-auth/providers/github"; import CredentialsProvider from "next-auth/providers/credentials"; import { PrismaAdapter } from "@next-auth/prisma-adapter"; import prisma from "@/lib/prisma"; import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"; export const authOptions: AuthOptions = { adapter: PrismaAdapter(prisma), providers: [ GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID as string, clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, }), GithubProvider({ clientId: process.env.GITHUB_ID as string, clientSecret: process.env.GITHUB_SECRET as string, }), CredentialsProvider({ name: "Credentials", credentials: { username: { label: "Username", type: "text", placeholder: "jsmith" }, password: { label: "Password", type: "password" } }, async authorize(credentials) { if (credentials?.username === "admin" && credentials?.password === "password") { return { id: "1", name: "Admin", email: "admin@example.com" }; } return null; } }) ], session: { strategy: "jwt", }, jwt: { secret: process.env.NEXTAUTH_SECRET, }, secret: process.env.NEXTAUTH_SECRET, pages: { signIn: '/login', }, callbacks: { async jwt({ token, user }) { if (user) { token.id = user.id; const dbUser = await prisma.user.findUnique({ where: { id: user.id } }); token.image = dbUser?.image || user.image; } return token; }, async session({ session, token }) { if (session.user) { (session.user as any).id = token.id as string; session.user.image = token.image as string | null | undefined; } return session; }, } }; export function auth( ...args: | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | [] ) { return getServerSession(...args, authOptions) } export default NextAuth(authOptions);
```

