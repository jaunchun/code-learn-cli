---
title: Rust best practices
summary: Idiomatic Rust: let the compiler help you
---
## Let the tools help

- **`cargo fmt`** formats your code. Run it before every commit
- **`cargo clippy`** gives friendly suggestions that teach idiomatic Rust. Treat its advice as a free code review
- **Read compiler errors fully.** Rust's messages explain what went wrong and often show the fix (`help:`)

## Write idiomatic code

- **Borrow instead of cloning.** Take `&str` rather than `String` and `&[T]` rather than `Vec<T>` in function parameters when you only need to read
- **Use `match` and `if let`** to handle `Option` and `Result` instead of `unwrap()` everywhere
- **Return `Result`** from functions that can fail, and use `?` to pass errors up. Reserve `panic!` for programmer mistakes
- **Prefer iterators** (`.iter().map(...).collect()`) over index loops when it reads better
- **Names:** `snake_case` for functions and variables, `PascalCase` for types, `SCREAMING_SNAKE_CASE` for constants

---

## Common pitfalls

- `unwrap()` and `expect()` crash the program on `None`/`Err`. Fine for quick tests, risky in real code
- Cloning to silence the borrow checker works, but it hides a design question: who should own this data?
- Fighting the borrow checker? Try to shorten borrows, restructure so one function owns and the others borrow, or split a struct
- Integer overflow panics in debug builds and wraps in release builds. Use `checked_add`, `wrapping_add` or `saturating_add` when it matters
- Indexing `v[i]` panics when out of range. Use `v.get(i)` to get an `Option`

## Habits

- Write small functions with clear types; the type signature is documentation
- Add `#[derive(Debug)]` to your types and use `println!("{:?}", value)` to inspect them (`{:#?}` pretty prints)
- Write unit tests next to the code with `#[cfg(test)]` and run `cargo test`
- Use `cargo check` while editing: it is much faster than a full build
