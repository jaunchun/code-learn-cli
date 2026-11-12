---
title: Number Guessing Game
difficulty: easy
time: about 1-2 hours
skills: loops, conditions, readline, Math.random
---
## What you'll build

The computer picks a secret number from 1 to 100 and you keep guessing, with "too low" / "too high" hints.

```text
Guess (1-100): 50
Too high!
Guess (1-100): 25
Too low!
Guess (1-100): 37
You got it in 3 guesses!
```

## Requirements

- Pick the secret with `Math.floor(Math.random() * 100) + 1`
- Keep asking until the guess is right, and count the guesses
- Say so if the input is not a number, and do not count that guess
- Print the number of guesses at the end

---

## Steps

Node reads keyboard input with the `readline` module. It is asynchronous: you give it a function that runs when the user presses Enter.

```javascript
const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask() {
  rl.question("Guess (1-100): ", (answer) => {
    const guess = Number(answer);
    // compare guess with the secret here
    ask(); // ask again, or rl.close() when the player wins
  });
}
ask();
```

1. Print the secret while you test, then remove that line.
2. `Number("abc")` is `NaN`; check it with `Number.isNaN(guess)`.
3. When the guess is correct, call `rl.close()` instead of `ask()`.

## Stretch goals

- Limit the player to 7 guesses
- Let the player choose the range
- Ask "play again?" at the end
- Keep a high score in a JSON file with `fs.writeFileSync`
