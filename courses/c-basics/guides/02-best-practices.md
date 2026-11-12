---
title: C best practices
summary: Stay out of trouble: memory, bounds and warnings
---
## Compile with warnings

```text
gcc -Wall -Wextra -g main.c -o main
```

Read every warning. Many of them (`unused variable`, `format ... expects argument of type`, `suggest parentheses around assignment used as truth value`) point at real bugs.

## The big rules

- **Initialize variables.** An uninitialized `int x;` holds garbage
- **Never go out of bounds.** C will not stop you. Check indexes and sizes
- **Know who owns memory.** Every `malloc` needs exactly one `free`. Set the pointer to `NULL` after freeing
- **Check return values**: `malloc`, `fopen`, `scanf`
- **Strings need room for the `'\0'`.** `char s[5] = "hello";` overflows
- **Use safe functions:** `fgets` instead of `gets` (which was removed), `snprintf` instead of `sprintf`, `strncpy`/`strlcpy` with care

---

## Common traps

- `==` on strings compares addresses. Use `strcmp`
- `=` vs `==` inside `if`
- Integer division: `7 / 2` is 3
- `sizeof` on a pointer gives the pointer's size (8), not the array's. Arrays "decay" to pointers when passed to functions, so pass the length too
- Returning the address of a local variable: it is gone after the function returns
- A `switch` without `break` falls through

## Debugging tools

- **`-fsanitize=address,undefined`** while testing finds many memory bugs immediately
- **`valgrind ./main`** reports leaks and invalid reads (Linux)
- **`gdb`** or your editor's debugger lets you step through and inspect variables
- When a program crashes with "Segmentation fault", suspect a bad pointer, a `NULL`, or an index out of range
