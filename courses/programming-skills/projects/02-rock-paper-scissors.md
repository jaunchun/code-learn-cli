---
title: Rock Paper Scissors
difficulty: easy
time: about 1-2 hours
skills: randomness, conditions, loops, score keeping
---
## What you'll build

Play against the computer, best of several rounds.

```text
Your move (rock/paper/scissors): rock
Computer chose scissors. You win this round!
Score: you 1, computer 0
```

## Requirements

- The computer picks randomly
- Decide the winner with the rules (rock beats scissors, scissors beats paper, paper beats rock)
- Keep a score and show it after every round
- Ask again if the player types something invalid
- Stop after the first player reaches 3 wins and announce the winner

---

## Steps

1. Store the moves in a list and pick one at random.
2. Write a function `winner(player, computer)` that returns `"player"`, `"computer"` or `"draw"`. Test all nine combinations.
3. A neat trick: store which move each move **beats** in a small table instead of writing nine `if` statements:

```text
beats = { rock: scissors, scissors: paper, paper: rock }
player wins if beats[player] == computer
```

4. Build the game loop around it: ask, decide, update score, check for a winner.

## Stretch goals

- Add "lizard" and "Spock"
- Let the player choose how many wins are needed
- Track statistics over several games (win percentage)
- Make the computer smarter: it remembers what you pick most often
