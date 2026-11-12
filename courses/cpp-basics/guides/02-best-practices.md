---
title: C++ best practices
summary: Write safer, modern C++ and avoid the classic traps
---
## Compile with warnings

Always build with warnings on and read them:

```text
g++ -std=c++17 -Wall -Wextra -g main.cpp -o main
```

Treat a warning like `unused variable`, `comparison between signed and unsigned` or `using the result of an assignment as a condition` as a probable bug.

## Prefer modern, safe tools

- **`std::vector`** instead of raw arrays; **`std::string`** instead of `char*`
- **Range-based for** (`for (const auto& x : items)`) instead of index loops when you do not need the index
- **References** to avoid copies: pass big objects as `const T&`
- **`const`** everywhere you can: it documents intent and the compiler enforces it
- Avoid raw `new` / `delete`. Use values, containers, or smart pointers (`std::unique_ptr`)
- Initialize every variable. An uninitialized `int x;` holds garbage

---

## Classic traps

- `v[i]` is not bounds-checked. Use `v.at(i)` while debugging
- `if (x = 5)` assigns. Write `==` (the `-Wall` warning will catch it)
- Integer division: `7 / 2` is `3`. Use `7.0 / 2`
- `size()` returns an **unsigned** number. `for (int i = 0; i < v.size() - 1; ...)` breaks on an empty vector
- Returning a reference to a local variable is undefined behavior
- A missing `;` after a `class` or `struct` definition gives confusing errors on the *next* line

## Habits

- Read compiler errors from the **first** one; later ones are often side effects
- One class or one responsibility per file as projects grow (`.h` header + `.cpp` source)
- Use `-fsanitize=address,undefined` while testing to catch memory bugs early
- Name things clearly: `playerHealth`, `isGameOver`
