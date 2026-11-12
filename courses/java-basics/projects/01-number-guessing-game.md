---
title: Number Guessing Game
difficulty: easy
time: about 1-2 hours
skills: loops, Scanner, Random, exceptions
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
- Loop until the guess is right and count the guesses
- Text that is not a number prints a message and does not count as a guess

---

## Steps

```java
import java.util.Random;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int secret = new Random().nextInt(100) + 1;   // 1..100
        int tries = 0;

        while (true) {
            System.out.print("Guess (1-100): ");
            String line = in.nextLine().trim();
            int guess;
            try {
                guess = Integer.parseInt(line);
            } catch (NumberFormatException e) {
                System.out.println("Please type a number.");
                continue;
            }
            tries++;
            // compare guess with secret; break when it is right
            break;
        }
        System.out.println("Done after " + tries + " tries");
    }
}
```

1. Replace the placeholder with `if / else if / else` and `break` on success.
2. Print the secret while testing, then remove that line.

## Stretch goals

- Limit the player to 7 guesses
- Let the player choose the difficulty
- Ask "play again?" at the end
- Move the game into a `GuessingGame` class with a `play()` method
