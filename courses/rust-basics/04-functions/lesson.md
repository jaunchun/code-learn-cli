# Functions

You already know one function: `main`. Here is one that adds two numbers:

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

- `fn` starts a function, followed by its name
- Parameters are written `name: Type` and **every parameter needs a type**
- `-> i32` is the **return type** (it uses an arrow, not a colon)
- The body goes between `{ }`

Call it like this:

```rust
let total = add(2, 3); // 5
```

---

## Returning values

In Rust the **last expression** of a function is its return value - and it has **no semicolon**:

```rust
fn double(x: i32) -> i32 {
    x * 2      // returned
}
```

Adding a semicolon turns the expression into a *statement*, which produces no value:

```rust
fn double(x: i32) -> i32 {
    x * 2;     // error: this returns () instead of i32
}
```

You can also leave early with the `return` keyword:

```rust
fn double(x: i32) -> i32 {
    return x * 2;
}
```

---

## Functions without a result

If a function doesn't return anything, leave out the `->` part:

```rust
fn say_hi() {
    println!("Hi!");
}
```

> **Tip:** Rust doesn't care whether you define a function above or below the place you call it.
