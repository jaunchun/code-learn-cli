---
title: Go best practices
summary: Idiomatic Go: simple, explicit and formatted
---
## The Go way

- **Run `gofmt`** (or `go fmt`) on everything. All Go code looks the same, so there is nothing to argue about
- **Handle every error.** Check `if err != nil` immediately after the call and return or handle it. Do not ignore errors with `_` unless you have a reason
- **Keep it simple.** Go prefers a few clear lines over clever abstractions
- **Short names for short scopes** (`i`, `n`, `err`), descriptive names for wider ones. Exported names start with a capital letter
- **Make the zero value useful.** `var buf bytes.Buffer` works without any setup

---

## Watch out for

- `append` returns a slice: `s = append(s, x)`
- Slices share memory. Changing a sub-slice can change the original; use `copy` to get an independent one
- A `nil` map panics on write: create it with `make(map[string]int)` or a literal
- The order of `range` over a map is random
- Loop variables captured by goroutines: pass them as arguments (`go func(n int) { ... }(i)`) on Go versions before 1.22
- `defer` runs when the **function** ends, not at the end of the loop iteration

## Habits

- Run `go vet` and the race detector (`go test -race`, `go run -race`)
- Write tests next to your code in `_test.go` files with `go test`
- Return errors rather than panicking. Reserve `panic` for programmer mistakes
- Accept interfaces, return structs. Small interfaces (one or two methods) are best
- Read the standard library source: it is clear, well documented Go
