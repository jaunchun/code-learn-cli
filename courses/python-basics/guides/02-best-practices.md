---
title: Python best practices
summary: Write clear, "Pythonic" code (PEP 8 in a nutshell)
---
## Style (PEP 8)

- **4 spaces** per indentation level, never tabs mixed with spaces
- `snake_case` for variables and functions, `CamelCase` for classes, `UPPER_CASE` for constants
- Keep lines under about 88 characters
- Two blank lines between top-level functions
- Use a formatter (`black`) and a linter (`ruff`): they enforce this for you

## Write Pythonic code

```python
# Loop over items, not indexes
for name in names: ...             # not: for i in range(len(names))

# Use enumerate when you need the index too
for i, name in enumerate(names, start=1): ...

# Use `with` for files
with open("data.txt") as f: ...

# Compare to None with `is`
if value is None: ...
```

---

## Common traps

- **Mutable default arguments:** `def add(item, items=[])` shares one list between all calls. Use `items=None` and create the list inside
- `==` compares values, `is` compares identity. Use `is` only for `None`, `True`, `False`
- Dividing integers gives a float: use `//` for whole numbers
- Modifying a list while looping over it skips items. Loop over a copy or build a new list
- A bare `except:` hides real bugs. Catch the specific error: `except ValueError:`

## Habits

- Read the **last line** of a traceback first: it names the error. Then look at the line numbers above it
- Use `print()` or the `breakpoint()` debugger to inspect values
- Prefer small functions with one job and a clear name
- Use virtual environments (`python -m venv .venv`) for every project
