# Types and Operators

## The basic types

```python
n = 42          # int   (whole number)
pi = 3.14       # float (decimal number)
s = "hello"     # str   (text)
ok = True       # bool  (True or False, with capital letters)
nothing = None  # "no value"
```

`type(x)` tells you the type: `type("hi")` is `str`.

## Operators

| Operator | Meaning | Example |
|---|---|---|
| `+ - *` | add, subtract, multiply | `2 * 3` is `6` |
| `/` | division, always a float | `7 / 2` is `3.5` |
| `//` | floor division | `7 // 2` is `3` |
| `%` | remainder | `7 % 2` is `1` |
| `**` | power | `2 ** 10` is `1024` |

---

## Comparing and combining

- Compare with `==`, `!=`, `<`, `>`, `<=`, `>=`
- Combine conditions with the words `and`, `or`, `not`
- Python does **not** mix text and numbers: `"5" + 5` is an error. Convert with `int("5")` or `str(5)`

```python
text = "hello"
print(len(text))        # 5
print(text.upper())     # HELLO
```
