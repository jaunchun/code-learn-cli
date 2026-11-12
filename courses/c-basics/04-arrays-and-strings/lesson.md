# Arrays and Strings

## Arrays

A fixed-size list of values of one type. Indexes start at **0**:

```c
int nums[3] = {10, 20, 30};
printf("%d\n", nums[1]);          // 20
int count = sizeof(nums) / sizeof(nums[0]);   // 3 (number of elements)
```

- C does **not** check indexes. Reading `nums[3]` is *undefined behavior*: it may print garbage or crash
- The size is fixed when you create the array

---

## Strings

A C string is an array of `char` that ends with a special **`'\0'`** byte:

```c
char name[] = "Ana";        // 4 bytes: 'A' 'n' 'a' '\0'
printf("%s\n", name);
printf("%zu\n", strlen(name));   // 3 (does not count the '\0')
```

Use `<string.h>`:

- `strlen(s)` - length
- `strcmp(a, b)` - returns `0` when the strings are equal
- `strcpy(dest, src)` - copy (make sure `dest` is big enough!)

> **Tip:** `a == b` on two strings compares their **addresses**, not their text. Use `strcmp(a, b) == 0`.
