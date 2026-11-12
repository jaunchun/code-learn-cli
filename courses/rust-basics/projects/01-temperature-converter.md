---
title: Temperature Converter
difficulty: easy
time: about 1 hour
skills: functions, f64, if/else, reading input
---
# Temperature Converter

## What you'll build

A small program that asks for a temperature and converts it between Celsius and Fahrenheit.

```text
Enter a temperature: 100
Is that (C)elsius or (F)ahrenheit? c
100 C = 212 F
```

## Requirements

- Read a number and a unit letter from the user
- Convert Celsius to Fahrenheit **and** Fahrenheit to Celsius
- Put each conversion in its own function that takes an `f64` and returns an `f64`
- Show a friendly message when the user types something that is not a number

---

## Steps

1. Write `fn c_to_f(c: f64) -> f64` and `fn f_to_c(f: f64) -> f64`. Test them from `main` with fixed numbers first.
2. Read a line from the keyboard:

```rust
use std::io;

let mut input = String::new();
io::stdin().read_line(&mut input).expect("could not read");
```

3. Turn the text into a number. `parse` can fail, so use `match`:

```rust
match input.trim().parse::<f64>() {
    Ok(number) => println!("You typed {}", number),
    Err(_) => println!("That is not a number"),
}
```

4. Ask for the unit and decide which function to call.

## Stretch goals

- Add Kelvin
- Keep asking until the user types `q`
- Round the result to 1 decimal place with `println!("{:.1}", value)`
