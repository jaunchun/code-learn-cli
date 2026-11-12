# Control Flow

## if / elif / else

```python
age = 20
if age >= 18:
    print("adult")
elif age >= 13:
    print("teen")
else:
    print("child")
```

- A colon `:` ends the line, and the block below is **indented** (4 spaces)
- It is `elif`, not `else if`
- No parentheses are needed around the condition

---

## Loops

```python
for i in range(3):        # 0, 1, 2
    print(i)

for i in range(1, 4):     # 1, 2, 3  (the end is not included)
    print(i)

n = 3
while n > 0:
    print(n)
    n -= 1
```

- `range(a, b)` goes from `a` up to, but not including, `b`
- `break` leaves a loop, `continue` skips to the next round
- Loop directly over a list: `for item in items:`
