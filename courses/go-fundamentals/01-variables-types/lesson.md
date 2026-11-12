# Go Program Structure

A tiny monitoring service needs to start and print a status message. Go programs organize executable code in packages.

```text
package main
import "fmt"
func main() {
    fmt.Println("service started")
}
```

---

## Understand the idea

`package main` declares an executable program. The `main` function is its entry point. The `fmt` package provides formatted input and output.

---

## Apply it in a real project

Go uses `:=` for short variable declarations inside functions. `var` is also available. Go requires imported packages to be used; unused imports are compile errors.

> **Tip:** Read the example, predict what it does, then try changing one value or instruction.
