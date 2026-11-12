---
title: Rust cheat sheet
summary: Quick reference for syntax you will use every day
---
## Cargo

```text
cargo new myapp       # new project
cargo run             # build and run
cargo build --release # optimized build
cargo check           # type-check quickly, no executable
cargo test            # run tests
cargo fmt             # format code
cargo clippy          # lints and suggestions
cargo add serde       # add a dependency
```

## Variables and types

```rust
let x = 5;              // immutable
let mut y = 6;          // mutable
const MAX: u32 = 100;
let z: f64 = 2.5;       // i8..i128, u8..u128, f32, f64, bool, char, usize
let s = String::from("hi");   // owned text; &str is a borrowed slice
let t = (1, "a");  t.0; let a = [1, 2, 3];
```

## Control flow

```rust
if a > b { } else if a == b { } else { }
let v = if cond { 1 } else { 2 };
for i in 0..5 { }  for i in 0..=5 { }  for x in &items { }
while cond { }     loop { break; }
match n { 1 => "one", 2 | 3 => "few", 4..=9 => "some", _ => "many" }
```

---

## Ownership and borrowing

```rust
let a = String::from("x");
let b = a;              // moved: a is no longer usable
let c = b.clone();      // explicit copy
fn len(s: &String) -> usize { s.len() }   // borrow, read-only
fn add(s: &mut String) { s.push('!'); }   // mutable borrow (only one at a time)
```

## Structs, enums, Option, Result

```rust
struct User { name: String, age: u32 }
impl User {
    fn new(name: &str, age: u32) -> User { User { name: name.to_string(), age } }
    fn greet(&self) -> String { format!("Hi {}", self.name) }
}

enum Shape { Circle(f64), Rect { w: f64, h: f64 } }

let maybe: Option<i32> = Some(5);
if let Some(n) = maybe { println!("{}", n); }
let n = maybe.unwrap_or(0);

fn parse(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n: i32 = s.parse()?;     // ? returns early on error
    Ok(n)
}
```

## Collections and iterators

```rust
let mut v = vec![1, 2, 3];  v.push(4);  v.len();  v[0];
let doubled: Vec<i32> = v.iter().map(|x| x * 2).collect();
let sum: i32 = v.iter().sum();
let evens: Vec<&i32> = v.iter().filter(|x| *x % 2 == 0).collect();

use std::collections::HashMap;
let mut m = HashMap::new();
m.insert("a", 1);  m.get("a");  *m.entry("b").or_insert(0) += 1;
```
