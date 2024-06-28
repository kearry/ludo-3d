import { useGameStore } from './gameState'

describe('Game State', () => {
  beforeEach(() => {
    useGameStore.setState({ players: [], currentPlayer: 0, dice: [0, 0] })
  })

  test('addPlayer adds a player to the game', () => {
    const addPlayer = useGameStore.getState().addPlayer
    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0] })
    expect(useGameStore.getState().players).toHaveLength(1)
    expect(useGameStore.getState().players[0].color).toBe('red')
  })

  test('rollDice generates two numbers between 1 and 6', () => {
    const rollDice = useGameStore.getState().rollDice
    rollDice()
    const dice = useGameStore.getState().dice
    expect(dice).toHaveLength(2)
    expect(dice[0]).toBeGreaterThanOrEqual(1)
    expect(dice[0]).toBeLessThanOrEqual(6)
    expect(dice[1]).toBeGreaterThanOrEqual(1)
    expect(dice[1]).toBeLessThanOrEqual(6)
  })

  test('moveToken moves a token and changes the current player', () => {
    const addPlayer = useGameStore.getState().addPlayer
    const rollDice = useGameStore.getState().rollDice
    const moveToken = useGameStore.getState().moveToken

    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0] })
    addPlayer({ id: '2', color: 'blue', tokens: [0, 0, 0, 0] })

    rollDice()
    const initialDiceSum = useGameStore.getState().dice[0] + useGameStore.getState().dice[1]

    moveToken('1', 0)

    expect(useGameStore.getState().players[0].tokens[0]).toBe(initialDiceSum)
    expect(useGameStore.getState().currentPlayer).toBe(1)
  })
})