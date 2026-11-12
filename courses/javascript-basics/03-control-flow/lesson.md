# Control Flow

## if / else

```javascript
const age = 20;
if (age >= 18) {
  console.log("adult");
} else if (age >= 13) {
  console.log("teen");
} else {
  console.log("child");
}
```

Conditions are *truthy* or *falsy*. The falsy values are `false`, `0`, `""`, `null`, `undefined` and `NaN`. Everything else (including `"0"`, `[]` and `{}`) is truthy.

---

## Loops

```javascript
for (let i = 0; i < 3; i++) {
  console.log(i);          // 0, 1, 2
}

let n = 3;
while (n > 0) {
  console.log(n);
  n--;                     // same as n = n - 1
}
```

- A `for` loop has three parts: start, condition, step
- `break` leaves a loop, `continue` skips to the next round
- Loop over an array with `for (const item of list) { ... }`
