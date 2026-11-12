# Functions

```go
func add(a int, b int) int {
    return a + b
}

func main() {
    fmt.Println(add(2, 3))   // 5
}
```

- `func`, the name, parameters as **name then type**, then the return type
- Parameters of the same type can share it: `func add(a, b int) int`
- A function with no result has no return type

---

## Multiple return values

A very Go thing. Functions often return a result **and an error**:

```go
func divmod(a, b int) (int, int) {
    return a / b, a % b
}

q, r := divmod(7, 2)     // 3 and 1
_, r2 := divmod(9, 4)    // _ ignores a value you do not need
```

```go
n, err := strconv.Atoi("42")
if err != nil {
    fmt.Println("not a number:", err)
}
```

> **Tip:** Checking `if err != nil` right after a call is the standard way to handle errors in Go.
