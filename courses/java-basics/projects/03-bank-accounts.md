---
title: Bank Accounts with Exceptions
difficulty: medium
time: about 3-4 hours
skills: classes, inheritance, exceptions, collections
---
## What you'll build

A bank with several accounts where invalid operations throw exceptions.

```text
Alice opened account #1
Deposit 100.00 -> balance 100.00
Withdraw 500.00 -> InsufficientFundsException: balance 100.00, wanted 500.00
```

## Requirements

- An `Account` class with an id, owner and private balance
- `deposit(double)` and `withdraw(double)`; negative amounts throw `IllegalArgumentException`
- A **custom exception** `InsufficientFundsException` thrown by `withdraw`
- A `SavingsAccount` that *extends* `Account` and adds `addInterest(double rate)`
- A `Bank` that stores accounts in a `Map<Integer, Account>` and can transfer money between two accounts

---

## Steps

1. A custom exception is a tiny class:

```java
class InsufficientFundsException extends Exception {
    InsufficientFundsException(String message) {
        super(message);
    }
}
```

2. A method that can throw it declares that: `void withdraw(double amount) throws InsufficientFundsException`.
3. Callers handle it with `try { ... } catch (InsufficientFundsException e) { System.out.println(e.getMessage()); }`.
4. Inheritance: `class SavingsAccount extends Account { ... }`. Call the parent constructor with `super(...)`.
5. `transfer` should leave both accounts unchanged if the withdrawal fails.

## Stretch goals

- Keep a transaction history (`List<String>`) per account
- Add an abstract method `monthlyFee()` and different fees for different account types
- Print money with `String.format("%.2f", amount)`
- Write a few tests with JUnit
