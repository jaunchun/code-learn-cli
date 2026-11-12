---
title: Number Guessing Game
difficulty: easy
time: about 1-2 hours
skills: loops, conditions, cin, rand
---
## What you'll build

The computer thinks of a number from 1 to 100 and you guess it.

```text
Guess (1-100): 50
Too high!
Guess (1-100): 25
Too low!
Guess (1-100): 37
You got it in 3 guesses!
```

## Requirements

- Pick the secret with the C++ random generator (see below)
- Loop until the guess is right and count the guesses
- If the user types something that is not a number, say so and ask again without crashing

---

## Steps

```cpp
#include <iostream>
#include <random>
using namespace std;

int main() {
    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<int> dist(1, 100);
    int secret = dist(gen);

    int guess = 0, tries = 0;
    while (guess != secret) {
        cout << "Guess (1-100): ";
        if (!(cin >> guess)) {          // not a number
            cin.clear();                // reset the error state
            cin.ignore(1000, '\n');     // throw away the bad input
            cout << "Please type a number." << endl;
            continue;
        }
        tries++;
        // compare guess and secret here
    }
}
```

1. Print `secret` while testing, then remove that line.
2. Use `if / else if / else` to print "Too low!", "Too high!" or the win message.

## Stretch goals

- Limit the player to 7 guesses
- Let the player choose the difficulty (range)
- Ask "play again?" at the end
- Put the game into a function `playRound()` that returns the number of guesses
