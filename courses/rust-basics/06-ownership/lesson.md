# Ownership

Ownership is Rust's most unique idea. It lets Rust manage memory safely **without** a garbage collector. There are three rules:

1. Every value has exactly one **owner** (a variable)
2. There can only be one owner at a time
3. When the owner goes out of scope, the value is dropped (cleaned up)

---

## Moving

Simple values like numbers are copied when you assign them:

```rust
let a = 5;
let b = a;   // a is copied
println!("{} {}", a, b); // fine
```

But a `String` owns text stored on the heap. Assigning it **moves** ownership:

```rust
let s1 = String::from("hi");
let s2 = s1;          // ownership moves to s2
println!("{}", s1);   // error: s1 was moved
```

After the move, `s1` is no longer valid. This prevents two variables from cleaning up the same memory.

---

## Cloning

If you really want two independent copies, ask for one with `.clone()`:

```rust
let s1 = String::from("hi");
let s2 = s1.clone();
println!("{} {}", s1, s2); // both work
```

---

## Copy types

Small, simple types are copied automatically instead of moved: integers, floats, `bool`, `char`. Types that own heap data (`String`, `Vec`) are moved.

---

## Functions take ownership too

Passing a value to a function moves it, just like an assignment:

```rust
fn consume(s: String) {
    println!("{}", s);
}   // s is dropped here

let name = String::from("Ana");
consume(name);
// name can't be used anymore
```

> **Tip:** The next lesson shows **borrowing**, a way to let functions use a value without taking it.
