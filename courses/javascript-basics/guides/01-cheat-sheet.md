---
title: JavaScript cheat sheet
summary: Quick reference for syntax you will use every day
---
## Variables and types

```javascript
const x = 1;            // constant
let y = 2;              // can change
typeof "a";             // "string"  (also number, boolean, undefined, object, function)
```

## Strings

```javascript
const s = "Hello";
s.length                // 5
s.toUpperCase()         // "HELLO"
s.slice(1, 3)           // "el"
s.includes("ell")       // true
s.split("l")            // ["He", "", "o"]
`Hi ${s}!`              // template literal
```

## Control flow

```javascript
if (a > b) { } else if (a === b) { } else { }
for (let i = 0; i < 5; i++) { }
for (const item of list) { }
while (cond) { }
switch (x) { case 1: break; default: }
const result = cond ? "yes" : "no";    // ternary
```

---

## Arrays and objects

```javascript
const arr = [1, 2, 3];
arr.push(4); arr.pop(); arr.includes(2); arr.indexOf(3);
arr.map((n) => n * 2);
arr.filter((n) => n > 1);
arr.reduce((sum, n) => sum + n, 0);
arr.sort((a, b) => a - b);            // numbers need a compare function!
const [first, ...rest] = arr;         // destructuring

const obj = { a: 1, b: 2 };
Object.keys(obj); Object.values(obj); Object.entries(obj);
const copy = { ...obj, c: 3 };        // spread
```

## Functions and errors

```javascript
function f(a, b = 1) { return a + b; }
const g = (a) => a * 2;
try { JSON.parse("oops"); } catch (err) { console.log(err.message); }
```

## Node.js basics

```javascript
const fs = require("fs");
fs.readFileSync("file.txt", "utf8");
process.argv            // command line arguments
process.exit(1);
```
