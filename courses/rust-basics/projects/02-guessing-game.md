---
title: Guessing Game
difficulty: easy
time: 1-2 hours
skills: loops, if/else, comparing numbers, parse, reading input
---
# Guessing Game

## What you'll build

The computer picks a secret number from 1 to 100. You keep guessing, and it tells you "too low" or "too high" until you get it.

```text
Guess the number (1-100): 50
Too high!
Guess the number (1-100): 25
Too low!
Guess the number (1-100): 37
You got it in 3 guesses!
```

## Requirements

- Pick a secret number (see below for a trick that needs no extra libraries)
- Loop until the guess is right
- Count the guesses
- If the user types something that is not a number, say so and ask again (do not crash, and do not count it)

---

## Steps

**Getting a "random" number** without installing anything: use the clock.

```rust
use std::time::{SystemTime, UNIX_EPOCH};

let nanos = SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .unwrap()
    .subsec_nanos();
let secret = nanos % 100 + 1; // 1 to 100
```

1. Print the secret first while you build the game, so you can test it. Remove that line at the end.
2. Use `loop { ... }` and `break` when the guess matches.
3. Compare with `if guess < secret { ... } else if guess > secret { ... } else { ... }`.
4. Parse the input. For a bad number, `continue` skips to the next round:

```rust
let guess: u32 = match input.trim().parse() {
    Ok(n) => n,
    Err(_) => {
        println!("Please type a number");
        continue;
    }
};
```

## Stretch goals

- Limit the player to 7 guesses
- Ask "play again?" at the end
- Let the player choose the range (easy 1-10, hard 1-1000)
- Use `match guess.cmp(&secret)` with `std::cmp::Ordering` instead of `if`
