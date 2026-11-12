# Structs and Enums

## Structs

A **struct** groups related values under named fields:

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

let rect = Rectangle { width: 30, height: 50 };
println!("{}", rect.width); // 30
```

- Fields are written `name: Type` and separated by **commas**
- Create one by giving every field a value
- Read a field with a dot: `rect.width`

---

## Methods

Add behavior to a struct with an `impl` block:

```rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn square(size: u32) -> Rectangle {
        Rectangle { width: size, height: size }
    }
}

let r = Rectangle::square(4); // associated function: Type::name
println!("{}", r.area());     // method: value.name()
```

- `&self` means the method **borrows** the value it is called on
- A function without `self` (like `square`) is an **associated function**. It is called with `::`

---

## Enums and match

An **enum** is a type that can be exactly one of several **variants**:

```rust
enum Light {
    Red,
    Yellow,
    Green,
}
```

Use `match` to handle each variant. Rust forces you to cover **every** possibility:

```rust
fn act(l: Light) {
    match l {
        Light::Red => println!("stop"),
        Light::Yellow => println!("slow down"),
        Light::Green => println!("go"),
    }
}
```

- Each arm is `pattern => result`
- Arms are separated by commas

> **Tip:** Forgetting a variant is a compile error, so adding a new variant later shows you everywhere you have to update your code.
