# Control Flow

## if / else

```cpp
int age = 20;
if (age >= 18) {
    cout << "adult" << endl;
} else if (age >= 13) {
    cout << "teen" << endl;
} else {
    cout << "child" << endl;
}
```

- The condition goes in **parentheses**
- `==` compares, `=` assigns. Writing `if (x = 5)` is a classic bug: it assigns 5 and is always true
- Combine with `&&` (and), `||` (or), `!` (not)

---

## Loops

```cpp
for (int i = 0; i < 3; i++) {
    cout << i << endl;        // 0, 1, 2
}

int n = 3;
while (n > 0) {
    cout << n << endl;
    n--;                      // n = n - 1
}
```

- A `for` has three parts: start, condition, step
- `break` leaves a loop, `continue` skips to the next round
- `do { ... } while (cond);` always runs at least once
- `switch (x) { case 1: ...; break; default: ...; }` picks between many values
