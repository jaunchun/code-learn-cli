# Hello, Rust

Rust is a fast, safe programming language. Every journey starts with a program that prints something:

```rust
fn main() {
    println!("Hello, world!");
}
```

Let's read it piece by piece:

- `fn` declares a **function**.
- `main` is a special name: every Rust program starts running in `main`.
- Code inside a function lives between curly braces `{ }`.
- `println!` prints a line of text. The `!` means it is a **macro**, not a normal function.
- Text goes in **double quotes**, and each statement ends with a semicolon `;`.

---

## Compiling and running

Rust is a *compiled* language. You can compile a single file with `rustc`:

```text
rustc main.rs
./main
```

Most people use **Cargo**, Rust's build tool and package manager:

- `cargo new hello` creates a new project called `hello`
- `cargo run` builds and runs it
- `cargo build` only builds it

> **Tip:** `cargo new` also sets up a `src/main.rs` file that already contains a Hello World program.

---

## Comments

Anything after `//` is ignored by the compiler. Use comments to explain your code to humans:

```rust
// This is a comment
fn main() {
    println!("Hi!"); // this one is at the end of a line
}
```

There is also `print!`, which prints **without** moving to a new line, while `println!` adds the new line for you.
