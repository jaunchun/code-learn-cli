# Control Flow

## if / else

```go
age := 20
if age >= 18 {
    fmt.Println("adult")
} else if age >= 13 {
    fmt.Println("teen")
} else {
    fmt.Println("child")
}
```

- No parentheses around the condition, but the **braces are required**
- An `if` can start with a short statement: `if n := len(s); n > 3 { ... }`

---

## for is the only loop

```go
for i := 0; i < 3; i++ {      // classic
    fmt.Println(i)
}

n := 3
for n > 0 {                   // like a while loop
    fmt.Println(n)
    n--
}

for {                         // forever, until break
    break
}
```

## switch

```go
switch day {
case "sat", "sun":
    fmt.Println("weekend")
default:
    fmt.Println("weekday")
}
```

Go's `switch` does **not** fall through: no `break` needed.
