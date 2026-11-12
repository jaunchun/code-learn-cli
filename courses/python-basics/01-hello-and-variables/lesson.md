# Hello and Variables

Python is known for readable code. Your first program:

```python
print("Hello, world!")
```

- `print(...)` shows text in the terminal
- Text goes in quotes, single or double
- `# ...` starts a comment
- There are no semicolons and no curly braces: **indentation** is part of the language

---

## Variables

You create a variable by assigning to it. No keyword needed:

```python
name = "Ana"
age = 30
age = age + 1      # change it any time
```

Use `snake_case` names: `player_score`, `total_price`.

## f-strings

Put an `f` before the quote to put values inside text:

```python
print(f"{name} is {age} years old")   # Ana is 31 years old
```

> **Tip:** Without the `f`, the braces are printed as normal characters.
