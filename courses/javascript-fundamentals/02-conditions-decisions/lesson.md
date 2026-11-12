# Functions

A checkout page calculates the total price in several places. A function keeps that calculation reusable.

```text
function total(price, quantity) {
  return price * quantity;
}
console.log(total(12, 3));
```

---

## Understand the idea

A function groups reusable instructions. Parameters receive input values, and `return` sends a result back to the caller.

---

## Apply it in a real project

Function expressions can be assigned to variables, and arrow functions provide a compact syntax. Keep a function focused on one clear task.

> **Tip:** Read the example, predict what it does, then try changing one value or instruction.
