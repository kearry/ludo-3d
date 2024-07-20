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