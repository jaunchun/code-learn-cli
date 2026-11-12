---
title: Number Guessing Game
difficulty: easy
time: about 1-2 hours
skills: loops, scanf, rand, conditions
---
## What you'll build

The computer picks a number from 1 to 100 and you try to guess it.

```text
Guess (1-100): 50
Too high!
Guess (1-100): 25
Too low!
Guess (1-100): 37
You got it in 3 guesses!
```

## Requirements

- A random secret number each run
- Loop until the guess is right; count the guesses
- Handle input that is not a number without an endless loop

---

## Steps

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
    srand((unsigned)time(NULL));          // seed the generator once
    int secret = rand() % 100 + 1;        // 1..100
    int guess = 0, tries = 0;

    while (guess != secret) {
        printf("Guess (1-100): ");
        if (scanf("%d", &guess) != 1) {   // scanf returns how many values it read
            int ch;
            while ((ch = getchar()) != '\n' && ch != EOF) { }   // throw away the bad input
            printf("Please type a number.\n");
            continue;
        }
        tries++;
        // compare guess and secret here
    }
    printf("You got it in %d guesses!\n", tries);
    return 0;
}
```

1. Print `secret` while testing, then remove that line.
2. Fill in the comparison with `if / else if / else`.

## Stretch goals

- Limit the player to 7 guesses
- Let the player choose the range
- Ask "play again?" at the end
- Put the game round into a function that returns the number of guesses
