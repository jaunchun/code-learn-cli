---
title: Tic-Tac-Toe
difficulty: medium
time: about 3-4 hours
skills: arrays/vectors, functions, loops, game logic
---
## What you'll build

Two players take turns on a 3x3 board in the terminal.

```text
 X | O | X
---+---+---
 4 | O | 6
---+---+---
 7 | O | X
Player O wins!
```

## Requirements

- Show the board with the numbers 1-9 on empty squares
- Players alternate and choose a square by number
- Reject taken squares and invalid input
- Detect wins (8 lines) and a draw

---

## Steps

1. Store the board as `char board[9]` (or a `vector<char>`), filled with `'1'`..`'9'`.
2. Write one function per job, and pass the board by reference or `const` reference:

```cpp
void drawBoard(const char board[9]);
bool hasWon(const char board[9], char player);
bool isFull(const char board[9]);
```

3. Keep the winning lines as data:

```cpp
const int LINES[8][3] = {
    {0, 1, 2}, {3, 4, 5}, {6, 7, 8},   // rows
    {0, 3, 6}, {1, 4, 7}, {2, 5, 8},   // columns
    {0, 4, 8}, {2, 4, 6}               // diagonals
};
```

4. Game loop: draw, ask the current player, validate, place, check win/draw, switch player.

## Stretch goals

- A computer opponent that picks a random free square
- A smarter computer that wins/blocks when it can
- Keep score over several rounds
- Support a 4x4 board
