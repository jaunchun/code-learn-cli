# Arrays and Objects

## Arrays

An ordered list. Indexes start at **0**:

```javascript
const nums = [10, 20, 30];
console.log(nums[1]);       // 20
nums.push(40);              // add to the end
console.log(nums.length);   // 4
```

Handy methods: `push`, `pop`, `includes`, `join`, and the "big three":

```javascript
const doubled = nums.map((n) => n * 2);       // transform every item
const big = nums.filter((n) => n > 15);       // keep some items
const total = nums.reduce((sum, n) => sum + n, 0);  // combine into one value
```

---

## Objects

A bundle of named values:

```javascript
const person = { name: "Ana", age: 30 };
console.log(person.name);       // Ana
person.age = 31;                // change a value
person.city = "Lima";           // add a new one
```

- `const` stops you from **reassigning** the variable, but you can still change what is inside the array or object
- Loop over an array with `for (const x of arr) { ... }`
- Pull values out with destructuring: `const { name, age } = person;`
