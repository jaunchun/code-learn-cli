---
title: JavaScript best practices
summary: Habits that keep your code clean and bug-free
---
## Do this

- **`const` by default**, `let` when you must reassign, never `var`
- **`===` and `!==`** instead of `==` and `!=`
- **Name things clearly**: `userAge` beats `x`; functions are verbs (`calculateTotal`), booleans read like questions (`isReady`, `hasItems`)
- **Keep functions small**: one job per function, ideally under 20 lines
- **Return early** to avoid deep nesting:

```javascript
function area(w, h) {
  if (w <= 0 || h <= 0) return 0;   // handle the odd case first
  return w * h;
}
```

---

## Watch out for

- `0.1 + 0.2` is `0.30000000000000004`. Floating point numbers are not exact; round money with `toFixed(2)` or work in cents
- `[10, 9, 1].sort()` sorts as **text**: `[1, 10, 9]`. Use `.sort((a, b) => a - b)`
- `typeof null` is `"object"` (an old bug). Check with `value === null`
- Mutating arrays/objects you receive can surprise callers. Copy first: `[...arr]`, `{ ...obj }`
- Forgetting `return` in a function (or in an arrow function with `{ }`) gives `undefined`

## Habits

- Read the **whole** error message: it names the file, line and problem
- Log intermediate values with `console.log` or `console.table`
- Write a tiny test (a few `console.log` calls with known answers) before you trust a function
- Format code the same way everywhere. A formatter like Prettier does it for you
