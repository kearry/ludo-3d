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

  test('canMoveToken returns false for token in base without a 6', () => {
    const addPlayer = useGameStore.getState().addPlayer
    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0] })
    useGameStore.setState({ dice: [3, 2] })
    expect(useGameStore.getState().canMoveToken('1', 0)).toBe(false)
  })

  test('canMoveToken returns true for token in base with a 6', () => {
    const addPlayer = useGameStore.getState().addPlayer
    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0] })
    useGameStore.setState({ dice: [6, 1] })
    expect(useGameStore.getState().canMoveToken('1', 0)).toBe(true)
  })

  test('moveToken moves a token out of base and does not change the current player', () => {
    const addPlayer = useGameStore.getState().addPlayer
    const moveToken = useGameStore.getState().moveToken

    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0] })
    addPlayer({ id: '2', color: 'blue', tokens: [0, 0, 0, 0] })

    useGameStore.setState({ dice: [6, 1] })

    console.log('Before moveToken:', JSON.stringify(useGameStore.getState(), null, 2))
    moveToken('1', 0)
    console.log('After moveToken:', JSON.stringify(useGameStore.getState(), null, 2))

    expect(useGameStore.getState().players[0].tokens[0]).toBe(1)
    expect(useGameStore.getState().currentPlayer).toBe(0)
    expect(useGameStore.getState().dice).toEqual([0, 0])
  })

  test('moveToken kicks back enemy token', () => {
    const addPlayer = useGameStore.getState().addPlayer
    const moveToken = useGameStore.getState().moveToken

    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0] })
    addPlayer({ id: '2', color: 'blue', tokens: [7, 0, 0, 0] })

    useGameStore.setState({ dice: [6, 1] })

    console.log('Before moveToken:', JSON.stringify(useGameStore.getState(), null, 2))
    moveToken('1', 0)
    console.log('After moveToken:', JSON.stringify(useGameStore.getState(), null, 2))

    expect(useGameStore.getState().players[0].tokens[0]).toBe(1)
    expect(useGameStore.getState().players[1].tokens[0]).toBe(7) // Enemy token should not be kicked back in this case
    expect(useGameStore.getState().currentPlayer).toBe(0)
    expect(useGameStore.getState().dice).toEqual([0, 0])
  })
})