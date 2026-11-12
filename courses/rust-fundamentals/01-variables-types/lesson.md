# Variables and Mutability

A monitoring tool stores a sensor reading. Rust makes mutability explicit so accidental changes are easier to spot.

```text
fn main() {
    let mut temperature = 20;
    temperature = 21;
    println!("{}", temperature);
}
```

---

## Understand the idea

`let` creates a variable and variables are immutable by default. Add `mut` when a value must change. Rust infers types when it can.

---

## Apply it in a real project

Common types include `i32` for signed integers, `u32` for unsigned integers, `f64` for decimal numbers and `bool` for true/false. `println!` is a macro; the exclamation mark is part of its syntax.

> **Tip:** Read the example, predict what it does, then try changing one value or instruction.
