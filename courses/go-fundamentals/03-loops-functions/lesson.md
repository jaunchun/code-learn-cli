# Functions

A monitoring service needs a reusable function to decide whether a server is healthy.

```text
func isHealthy(statusCode int) bool {
    return statusCode == 200
}
```

---

## Understand the idea

Declare a function with `func`. Parameters have names followed by types. A return type appears after the parameter list.

---

## Apply it in a real project

A function can return multiple values, which is common for returning a result and an error. Call a function by writing its name followed by arguments in parentheses.

> **Tip:** Read the example, predict what it does, then try changing one value or instruction.
