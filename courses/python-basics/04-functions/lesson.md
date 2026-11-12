# Functions

```python
def add(a, b):
    return a + b

print(add(2, 3))    # 5
```

- `def`, then the name, the parameters in parentheses and a colon
- The indented block is the body
- `return` sends a value back. Without it a function returns `None`

---

## Default and keyword arguments

```python
def power(base, exp=2):
    return base ** exp

print(power(3))            # 9   (uses the default)
print(power(3, 3))         # 27
print(power(exp=2, base=5))  # 25  (named arguments, any order)
```

## Functions calling functions

Small functions that each do one thing are easier to read and test:

```python
def is_even(n):
    return n % 2 == 0

def describe(n):
    return "even" if is_even(n) else "odd"
```

> **Tip:** Put a one-line description right under `def` in triple quotes (a *docstring*) to document what the function does.
