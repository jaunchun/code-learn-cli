# Data Types

Rust is **statically typed**: every value has a type known at compile time. Usually Rust figures it out, but you can write it yourself after a colon:

```rust
let age: u8 = 30;
```

---

## Numbers

**Integers** (whole numbers) come in signed (`i`) and unsigned (`u`) flavors, with a size in bits:

- `i8`, `i16`, `i32`, `i64` - can be negative
- `u8`, `u16`, `u32`, `u64` - zero or positive only
- `i32` is the default when Rust has to pick

A `u8` holds `0` to `255`. An `i8` holds `-128` to `127`.

**Floats** (numbers with a decimal point) are `f32` and `f64`. The default is `f64`:

```rust
let pi = 3.14;        // f64
let small: f32 = 2.5; // f32
```

You can convert between number types explicitly with `as`:

```rust
let x = 3.9 as i32;   // 3 - the decimals are cut off
```

---

## Booleans and characters

```rust
let is_ready: bool = true;
let letter: char = 'R';
```

- `bool` is `true` or `false`
- `char` is **one** character and uses **single quotes**
- Text in double quotes, like `"hello"`, is a string, not a `char`

---

## Tuples and arrays

A **tuple** groups values of different types. Read items with a dot and an index starting at 0:

```rust
let person = ("Ana", 31);
println!("{}", person.0); // Ana
```

An **array** holds values of the **same type** and has a fixed length. Use square brackets:

```rust
let days = [1, 2, 3];
println!("{}", days[0]); // 1
```

> **Tip:** Tuples use `.0`, `.1` ... Arrays use `[0]`, `[1]` ...
