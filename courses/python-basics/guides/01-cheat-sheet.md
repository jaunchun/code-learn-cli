---
title: Python cheat sheet
summary: Quick reference for syntax you will use every day
---
## Basics

```python
x = 5                     # variables need no keyword
print(f"x is {x}")        # f-string
type(x)                   # <class 'int'>
int("5"); str(5); float("1.5")
# a comment
```

## Strings

```python
s = "Hello"
len(s); s.upper(); s.lower(); s.strip()
s[0]; s[-1]; s[1:3]        # "H", "o", "el"
s.split(","); ",".join(["a", "b"])
"ell" in s                 # True
```

## Control flow

```python
if a > b: ...
elif a == b: ...
else: ...

for i in range(5): ...            # 0..4
for item in items: ...
for i, item in enumerate(items): ...
while cond: ...
x = "yes" if cond else "no"       # conditional expression
```

---

## Lists, dicts, sets, tuples

```python
nums = [3, 1, 2]
nums.append(4); nums.sort(); sorted(nums); sum(nums); max(nums)
[n * 2 for n in nums if n > 1]    # comprehension

d = {"a": 1}
d["b"] = 2; d.get("z", 0); d.keys(); d.values(); d.items()

unique = {1, 2, 2, 3}             # set: no duplicates
point = (3, 4)                    # tuple: cannot change
x, y = point                      # unpacking
```

## Functions, files, errors

```python
def f(a, b=1, *args, **kwargs):
    return a + b

with open("file.txt") as fh:      # closes the file for you
    text = fh.read()

try:
    int("x")
except ValueError as err:
    print(err)

import random, math, json, datetime
```
