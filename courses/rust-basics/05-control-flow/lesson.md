# Control Flow

## if / else

```rust
let number = 7;

if number > 5 {
    println!("big");
} else if number > 2 {
    println!("medium");
} else {
    println!("small");
}
```

- No parentheses are needed around the condition
- The condition **must be a `bool`**. Rust won't turn numbers into true/false for you: `if number { }` is an error

`if` is also an **expression**, so it can give you a value. Both branches must have the same type:

```rust
let label = if number > 5 { "big" } else { "small" };
```

---

## Loops

`loop` repeats forever until you `break`. It can even hand a value back:

```rust
let mut count = 0;
let result = loop {
    count += 1;
    if count == 3 {
        break count * 10; // result is 30
    }
};
```

`while` repeats as long as a condition is true:

```rust
let mut n = 3;
while n > 0 {
    println!("{}", n);
    n -= 1;
}
```

---

## for loops and ranges

`for` walks through a range or a collection:

```rust
for i in 0..3 {
    println!("{}", i); // 0, 1, 2
}

for i in 1..=3 {
    println!("{}", i); // 1, 2, 3
}
```

- `a..b` stops **before** `b`
- `a..=b` includes `b`

> **Tip:** Rust has no `++` or `--`. Use `i += 1` and `i -= 1`.
