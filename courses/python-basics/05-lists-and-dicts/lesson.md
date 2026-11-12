# Lists and Dictionaries

## Lists

An ordered, changeable collection. Indexes start at **0**; negative indexes count from the end:

```python
nums = [10, 20, 30]
print(nums[0])      # 10
print(nums[-1])     # 30  (the last item)
nums.append(40)     # add to the end
print(len(nums))    # 4
print(nums[1:3])    # [20, 30]  (a slice)
```

A **list comprehension** builds a list in one line:

```python
squares = [n * n for n in range(1, 5)]   # [1, 4, 9, 16]
```

---

## Dictionaries

Key-value pairs:

```python
scores = {"ana": 90, "bo": 75}
print(scores["ana"])          # 90
scores["cy"] = 82             # add or change
print(scores.get("zed"))      # None (no error if the key is missing)

for name, score in scores.items():
    print(name, score)
```

- `scores["zed"]` raises a `KeyError`; `.get("zed")` returns `None` (or a default you give)
- `in` checks membership: `"ana" in scores`
