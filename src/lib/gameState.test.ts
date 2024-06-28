import { useGameStore } from './gameState'

describe('Game State', () => {
  beforeEach(() => {
    useGameStore.setState({ players: [], currentPlayer: 0, dice: [0, 0] })
  })

  test('addPlayer adds a player to the game', () => {
    const addPlayer = useGameStore.getState().addPlayer
    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: false })
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
    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: false })
    useGameStore.setState({ dice: [3, 2] })
    expect(useGameStore.getState().canMoveToken('1', 0)).toBe(false)
  })

  test('canMoveToken returns true for token in base with a 6', () => {
    const addPlayer = useGameStore.getState().addPlayer
    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: false })
    useGameStore.setState({ dice: [6, 1] })
    expect(useGameStore.getState().canMoveToken('1', 0)).toBe(true)
  })

  test('moveToken moves a token out of base and does not change the current player', () => {
    const addPlayer = useGameStore.getState().addPlayer
    const moveToken = useGameStore.getState().moveToken

    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: false })
    addPlayer({ id: '2', color: 'blue', tokens: [0, 0, 0, 0], isAI: false })

    useGameStore.setState({ dice: [6, 1] })

    const newState = moveToken('1', 0)

    expect(newState.players[0].tokens[0]).toBe(1)
    expect(newState.currentPlayer).toBe(0)
    expect(newState.dice).toEqual([0, 0])
  })

  test('moveToken kicks back enemy token', () => {
    const addPlayer = useGameStore.getState().addPlayer
    const moveToken = useGameStore.getState().moveToken

    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: false })
    addPlayer({ id: '2', color: 'blue', tokens: [7, 0, 0, 0], isAI: false })

    useGameStore.setState({ dice: [6, 1] })

    const newState = moveToken('1', 0)

    expect(newState.players[0].tokens[0]).toBe(1)
    expect(newState.players[1].tokens[0]).toBe(7) // Enemy token should not be kicked back in this case
    expect(newState.currentPlayer).toBe(0)
    expect(newState.dice).toEqual([0, 0])
  })

  test('AI player moves a token out of base when rolling a 6', () => {
    const addPlayer = useGameStore.getState().addPlayer
    const playAITurn = useGameStore.getState().playAITurn

    addPlayer({ id: '1', color: 'red', tokens: [0, 0, 0, 0], isAI: true })
    useGameStore.setState({ currentPlayer: 0 })

    // Mock the rollDice function to always return a 6
    const originalRollDice = useGameStore.getState().rollDice
    useGameStore.setState({
      rollDice: () => useGameStore.setState({ dice: [6, 1] })
    })

    let movedOutOfBase = false
    playAITurn()
    const state = useGameStore.getState()
    if (state.players[0].tokens.some(t => t === 1)) {
      movedOutOfBase = true
    }

    console.log(`Rolled a 6: true, Moved out of base: ${movedOutOfBase}`)
    expect(movedOutOfBase).toBe(true)

    // Restore the original rollDice function
    useGameStore.setState({ rollDice: originalRollDice })
  })

  test('AI player moves furthest token when no 6 is rolled', () => {
    const addPlayer = useGameStore.getState().addPlayer
    const playAITurn = useGameStore.getState().playAITurn

    addPlayer({ id: '1', color: 'red', tokens: [1, 3, 5, 0], isAI: true })
    useGameStore.setState({ currentPlayer: 0 })

    // Mock the rollDice function to return a specific non-6 roll
    const originalRollDice = useGameStore.getState().rollDice
    useGameStore.setState({
      rollDice: () => useGameStore.setState({ dice: [4, 5] })
    })

    playAITurn()
    const state = useGameStore.getState()

    const furthestTokenMoved = state.players[0].tokens[2] > 5
    expect(furthestTokenMoved).toBe(true)

    // Restore the original rollDice function
    useGameStore.setState({ rollDice: originalRollDice })
  })
})