# Variables and Mutability

Create a variable with `let`:

```rust
let age = 30;
println!("Age: {}", age);
```

`{}` in `println!` is a placeholder. Rust puts the value of the variable there.

---

## Variables are immutable by default

Once a variable has a value, you can't change it:

```rust
let x = 5;
x = 6; // error: cannot assign twice to immutable variable
```

To allow changes, add the `mut` keyword (short for *mutable*):

```rust
let mut x = 5;
x = 6; // fine!
```

> **Tip:** Rust makes you opt in to change. That makes it easy to see which values can change while reading code.

---

## Shadowing

You can declare a **new** variable with the same name using `let` again. The new one *shadows* the old one:

```rust
let x = 5;
let x = x * 2;   // a brand new x, equal to 10
```

Unlike `mut`, shadowing creates a new variable, so it can even change the type:

```rust
let spaces = "   ";
let spaces = spaces.len(); // was text, now a number
```

---

## Constants

Constants are always immutable and need a type. By convention they are written in `UPPER_SNAKE_CASE`:

```rust
const MAX_POINTS: u32 = 100_000;
```

- Use `const` instead of `let`
- You can't use `mut` with a constant
- The type (here `u32`) is required
