# Types and Operators

## The basic types

```javascript
const n = 42;          // number (whole and decimal numbers)
const s = "hello";     // string
const ok = true;       // boolean
const nothing = null;  // "no value" on purpose
let notSet;            // undefined: declared but not given a value
```

`typeof` tells you the type: `typeof "hi"` is `"string"`.

## Operators

- Arithmetic: `+  -  *  /  %` (remainder) and `**` (power)
- `+` joins strings: `"a" + "b"` is `"ab"`. With a string on one side, numbers are turned into text: `2 + "2"` is `"22"`
- Compare with **`===`** (strict equality) and `!==`. Avoid `==`, which converts types and has surprises
- Combine conditions with `&&` (and), `||` (or) and `!` (not)

```javascript
console.log(5 === 5);     // true
console.log("5" === 5);   // false  (different types)
```

---

## Strings

```javascript
const word = "rust";
console.log(word.length);        // 4  (a property, no parentheses)
console.log(word.toUpperCase()); // RUST
```
