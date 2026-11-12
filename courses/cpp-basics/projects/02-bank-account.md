---
title: Bank Account
difficulty: medium
time: about 3 hours
skills: classes, constructors, private data, methods, vectors
---
## What you'll build

A `BankAccount` class that protects its balance and a small menu to use it.

```text
Alice opened an account.
Deposit 100.00 -> balance 100.00
Withdraw 30.00 -> balance 70.00
Error: not enough money (balance 70.00, wanted 500.00)
```

## Requirements

- A class with a **private** `double balance` and `string owner`
- A constructor that takes the owner's name
- Methods `deposit(double)`, `withdraw(double)` (returns `bool`) and `getBalance() const`
- Negative or zero amounts are rejected
- Keep several accounts in a `vector<BankAccount>`

---

## Steps

1. Start with the class skeleton:

```cpp
class BankAccount {
public:
    BankAccount(const std::string& owner) : owner(owner), balance(0) {}
    bool withdraw(double amount);
    // ...
private:
    std::string owner;
    double balance;
};
```

2. `withdraw` returns `false` (and changes nothing) when the amount is invalid or too big.
3. Print money with two decimals: `cout << fixed << setprecision(2) << balance;` (include `<iomanip>`).
4. Read menu choices in a loop with `cin >> choice`.

## Stretch goals

- Record every transaction in a `vector<string>` and print a statement
- Add `transfer(BankAccount& to, double amount)`
- Add interest with an `addInterest(double rate)` method
- Save and load accounts from a text file with `ofstream` / `ifstream`
