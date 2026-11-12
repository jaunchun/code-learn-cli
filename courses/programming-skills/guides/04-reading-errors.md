---
title: Reading error messages
summary: An error message is a free hint. Learn to read it
---
## Anatomy of an error

Almost every error message tells you three things:

1. **What kind** of error: `TypeError`, `SyntaxError`, `NullPointerException`, "cannot borrow as mutable"
2. **What happened**, in words: "can't add str and int", "x is not defined"
3. **Where**: a file name and a line number (often a whole *stack trace* of calls)

```text
Traceback (most recent call last):
  File "main.py", line 7, in <module>
    total = add(price, "5")
  File "main.py", line 3, in add
    return a + b
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

Read this one **bottom to top**: the last line names the error, the lines above show where it happened. Start with the **first line that mentions your own file**.

---

## Where to look in each language

| Language | Where the key message is |
|---|---|
| Python | The **last** line of the traceback |
| JavaScript (Node) | The first error line, then the file:line below it |
| Java | The first line (`Exception in thread ...`), then the first `at` line with your own class |
| C / C++ | The **first** error: later ones are often side effects of it |
| Go | The first `file.go:line:col:` message |
| Rust | The first `error[E....]` and the arrow `-->` pointing at your code. Rust usually also suggests a fix (`help:`) |

## Three kinds of errors

- **Syntax / compile errors:** the code is not valid. The program will not even start. The line number may be a little *after* the real mistake (a missing bracket is found later)
- **Runtime errors:** the program starts, then crashes (divide by zero, missing file, index out of range)
- **Logic errors:** no message at all, but the answer is wrong. These need print debugging or a debugger

## Common messages, translated

| Message | Usually means |
|---|---|
| `x is not defined` / `cannot find symbol` / `undefined` | Typo, or the variable is out of scope |
| `unexpected token` / `expected ';'` | A missing or extra bracket, quote or semicolon, on this or the previous line |
| `index out of range` | You asked for an item beyond the end (remember counting starts at 0) |
| `null` / `None` / `nil` pointer errors | A variable has no value where you expected one |
| `segmentation fault` (C/C++) | A bad pointer or an array index far out of range |
| `cannot assign twice` / `cannot reassign` | You tried to change a constant or immutable variable |

## Googling an error

1. Copy the error message **without your own file names and variable names**
2. Add the language name: `python TypeError unsupported operand int and str`
3. Prefer official docs and answers that explain *why*, not just a fix to paste
