# Functions

A function packages code you can reuse:

```javascript
function add(a, b) {
  return a + b;
}
console.log(add(2, 3));   // 5
```

- `return` sends a value back. A function without `return` gives back `undefined`
- Parameters are the names in the definition; arguments are the values you pass in

---

## Arrow functions

A shorter way to write a function, very common in modern JavaScript:

```javascript
const add = (a, b) => a + b;        // the value is returned automatically
const square = (n) => {             // with { } you must write return
  return n * n;
};
```

## Default parameters

```javascript
function greet(name = "friend") {
  return "Hi " + name;
}
greet();        // "Hi friend"
greet("Ana");   // "Hi Ana"
```
