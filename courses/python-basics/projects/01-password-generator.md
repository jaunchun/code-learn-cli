---
title: Password Generator
difficulty: easy
time: about 1 hour
skills: random, strings, loops, input, functions
---
## What you'll build

A program that creates random passwords of a length you choose.

```text
How long should the password be? 12
Include symbols? (y/n) y
Your password: k7#Qm2!vXw9a
```

## Requirements

- Ask for the length and whether to include symbols
- Always include a mix of lower case, upper case and digits
- Put the generator in a function `make_password(length, symbols)`
- Reject a length below 6 with a friendly message

---

## Steps

Python's standard library has everything you need:

```python
import random
import string

letters = string.ascii_letters   # a-z and A-Z
digits = string.digits           # 0-9
symbols = string.punctuation     # !"#$%&...

pool = letters + digits
password = "".join(random.choice(pool) for _ in range(12))
```

1. Read numbers with `int(input("..."))`. Handle bad input with `try / except ValueError`.
2. Add `symbols` to the pool only when the user said yes.
3. To *guarantee* one of each kind, pick one character from each group first, fill the rest from the full pool, then `random.shuffle` the list of characters.

## Stretch goals

- Generate several passwords at once
- Avoid look-alike characters (`l`, `1`, `O`, `0`)
- Show how strong the password is (length plus variety)
- Use the `secrets` module, which is the right tool for real passwords
