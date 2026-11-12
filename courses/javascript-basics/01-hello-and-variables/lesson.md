# Hello and Variables

JavaScript runs in the browser and, with **Node.js**, in your terminal. Your first program:

```javascript
console.log("Hello, world!");
```

- `console.log(...)` prints a line of text
- Text goes in quotes: `"double"`, `'single'` or `` `backticks` ``
- Semicolons at the end of a statement are optional but common
- `// ...` starts a comment

---

## let and const

```javascript
const name = "Ana";   // cannot be reassigned
let score = 10;       // can be reassigned
score = score + 5;
```

- Prefer **`const`**, and use **`let`** only when the value must change
- Avoid the old `var`
- Names use `camelCase`: `playerScore`, `totalPrice`

## Template literals

Backticks let you put values inside text with `${...}`:

```javascript
const age = 30;
console.log(`I am ${age} years old`);   // I am 30 years old
```

> **Tip:** Only backticks interpolate. `"${age}"` in normal quotes prints the characters literally.
