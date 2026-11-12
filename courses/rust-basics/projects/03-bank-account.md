---
title: Bank Account
difficulty: medium
time: 2-3 hours
skills: structs, impl blocks, &mut self, Result, error messages
---
# Bank Account

## What you'll build

An `Account` type that can deposit and withdraw money, and refuses to do impossible things.

```text
Alice opened an account.
Deposited 100.00 -> balance 100.00
Withdrew 30.00   -> balance 70.00
Error: not enough money (balance 70.00, wanted 500.00)
```

## Requirements

- A struct `Account` with an owner (`String`) and a balance (`f64`)
- `Account::new(owner: &str) -> Account` starts at 0
- `deposit(&mut self, amount: f64)`
- `withdraw(&mut self, amount: f64) -> Result<(), String>` that returns an error message when the balance is too small
- Negative amounts are not allowed for either operation
- A `balance(&self) -> f64` method and a `println!`-friendly way to show the account

---

## Steps

1. Define the struct and `impl Account { ... }` with `new`.
2. Add `deposit`. Methods that change the account take `&mut self`; methods that only read take `&self`.
3. `Result<(), String>` means "nothing on success, or an error text":

```rust
fn withdraw(&mut self, amount: f64) -> Result<(), String> {
    if amount > self.balance {
        return Err(format!("not enough money (balance {:.2})", self.balance));
    }
    self.balance -= amount;
    Ok(())
}
```

4. In `main`, call the methods and handle the result with `match`:

```rust
match account.withdraw(500.0) {
    Ok(()) => println!("done"),
    Err(message) => println!("Error: {}", message),
}
```

## Stretch goals

- Keep a list of transactions in a `Vec` and print a statement
- Add `transfer(&mut self, other: &mut Account, amount: f64)`
- Make an `enum Transaction { Deposit(f64), Withdrawal(f64) }`
- Read commands from the keyboard (`deposit 50`, `withdraw 20`, `quit`)
