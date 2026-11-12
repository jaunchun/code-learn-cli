# References and Borrowing

Moving a value into every function would be annoying. Instead, you can **borrow** a value using a **reference**, written with `&`:

```rust
fn length(s: &String) -> usize {
    s.len()
}

fn main() {
    let name = String::from("Ana");
    let n = length(&name);   // borrow, don't move
    println!("{} has {} letters", name, n); // name still works!
}
```

- `&name` creates a reference to `name` without taking ownership
- `s: &String` means "a reference to a String"

---

## Mutable references

A normal `&` reference is **read-only**. To change the borrowed value, use `&mut`, and the original must be `mut` too:

```rust
fn shout(s: &mut String) {
    s.push_str("!");
}

fn main() {
    let mut word = String::from("hey");
    shout(&mut word);
    println!("{}", word); // hey!
}
```

---

## The borrowing rules

At any moment you can have **either**:

- any number of shared references (`&`), **or**
- exactly one mutable reference (`&mut`)

but never both at the same time.

```rust
let mut s = String::from("hi");
let r1 = &s;
let r2 = &s;           // fine: many readers
// let w = &mut s;     // error if r1 or r2 are still used afterwards
```

These rules stop data races and "someone changed it while I was reading it" bugs, all checked at compile time.

> **Tip:** Think of it like a library book: many people can read the same page at once, but only one person can edit it, and not while others are reading.
