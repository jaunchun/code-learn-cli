# Variables and Types

A service tracks active connections and a server name. Go supports inferred and explicit variable declarations.

```text
var serverName string = "api-1"
connections := 4
healthy := true
```

---

## Understand the idea

`var name Type = value` declares a variable explicitly. Inside a function, `:=` can infer the type. Common types include `string`, `int`, `float64` and `bool`.

---

## Apply it in a real project

A variable declared with `:=` is local to its function block. Go is statically typed: after declaration, a variable has a specific type.

> **Tip:** Read the example, predict what it does, then try changing one value or instruction.
