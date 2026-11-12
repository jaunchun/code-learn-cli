---
title: Number Guessing Game
difficulty: easy
time: about 1-2 hours
skills: loops, input with bufio, strconv, math/rand
---
## What you'll build

The computer picks a number from 1 to 100 and you guess it.

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
- A guess that is not a number prints a message and does not count

---

## Steps

```go
package main

import (
    "bufio"
    "fmt"
    "math/rand"
    "os"
    "strconv"
    "strings"
)

func main() {
    secret := rand.Intn(100) + 1       // 1..100 (Go 1.20+ seeds automatically)
    reader := bufio.NewReader(os.Stdin)
    tries := 0

    for {
        fmt.Print("Guess (1-100): ")
        text, _ := reader.ReadString('\n')
        guess, err := strconv.Atoi(strings.TrimSpace(text))
        if err != nil {
            fmt.Println("Please type a number.")
            continue
        }
        tries++
        // compare guess with secret; break when it is right
        _ = guess
        _ = secret
        break
    }
}
```

1. Replace the placeholder with `if / else if / else` and `break` on success.
2. Print the secret while testing, then remove that line.

## Stretch goals

- Limit the player to 7 guesses
- Let the player pick a difficulty
- Ask "play again?" at the end
- Move one round into a function `playRound() int`
