---
title: Tic-Tac-Toe
difficulty: hard
time: 4-6 hours
skills: arrays, enums, functions, loops, borrowing, game logic
---
# Tic-Tac-Toe

## What you'll build

Two players take turns on a 3x3 board in the terminal. The program detects wins and draws.

```text
 X | O | X
---+---+---
 4 | O | 6
---+---+---
 7 | O | X
Player O wins!
```

## Requirements

- Draw the board, using the numbers 1-9 for empty squares so players know what to type
- Players alternate between X and O and choose a square by number
- Reject squares that are taken or not in 1-9, and ask again
- Detect all 8 winning lines and the draw (board full)
- Offer to play again

---

## Steps

1. Store the board as an array of 9 characters:

```rust
let mut board = [' '; 9];
```

2. Write small functions, each with one job. Testing them one at a time is much easier than one giant `main`:

```rust
fn draw(board: &[char; 9]) { /* print the grid */ }
fn winner(board: &[char; 9]) -> Option<char> { /* ... */ }
fn is_full(board: &[char; 9]) -> bool { /* ... */ }
```

3. Write the winning lines as data instead of 8 `if` statements:

```rust
const LINES: [[usize; 3]; 8] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
];
```

4. `winner` loops over `LINES` and checks if the three squares hold the same non-empty character.
5. The game loop: draw, ask the current player for a square, validate, place it, check `winner` and `is_full`, switch player.

Notice that `draw` and `winner` only *read* the board, so they take `&[char; 9]`, while placing a mark needs `&mut`.

## Stretch goals

- Replace the `char`s with an `enum Cell { Empty, X, O }`
- Add a computer opponent that picks a random free square
- Make the computer smart: win if it can, block if it must, otherwise take the centre
- Support a 4x4 board
