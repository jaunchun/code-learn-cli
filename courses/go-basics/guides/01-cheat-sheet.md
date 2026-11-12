---
title: Go cheat sheet
summary: Quick reference for syntax you will use every day
---
## Run and build

```text
go run main.go        # compile and run
go build              # make an executable
go fmt ./...          # format all code
go vet ./...          # find suspicious code
go mod init myapp     # start a module
```

## Variables and types

```go
var a int = 1
b := 2                // short form (inside functions)
const Pi = 3.14
var f float64 = 1.5; var s string = "hi"; var ok bool = true
x, y := 1, "two"      // several at once
```

## Control flow

```go
if x > 0 { } else if x == 0 { } else { }
for i := 0; i < 5; i++ { }
for cond { }
for i, v := range items { }
switch x { case 1: ...; case 2, 3: ...; default: ... }
```

---

## Slices, maps, strings

```go
s := []int{1, 2, 3}
s = append(s, 4); len(s); s[1:3]
m := map[string]int{"a": 1}
m["b"] = 2; v, ok := m["z"]; delete(m, "a")

strings.ToUpper("a"); strings.Split("a,b", ","); strings.Contains("abc", "b")
strconv.Itoa(5); n, err := strconv.Atoi("5")
fmt.Sprintf("%d %s %v", 1, "x", s)
```

## Functions, errors, structs

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("divide by zero")
    }
    return a / b, nil
}

type User struct { Name string; Age int }
func (u User) Hello() string { return "hi " + u.Name }
func (u *User) Birthday()    { u.Age++ }
```

## Concurrency

```go
go doWork()                       // run in a new goroutine
ch := make(chan int)
go func() { ch <- 42 }()
v := <-ch
var wg sync.WaitGroup; wg.Add(1); go func() { defer wg.Done() }(); wg.Wait()
defer file.Close()                // runs when the function returns
```
