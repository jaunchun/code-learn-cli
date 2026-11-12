# Structs and Methods

## Structs

```go
type Person struct {
    Name string
    Age  int
}

p := Person{Name: "Ana", Age: 30}
fmt.Println(p.Name)       // Ana
p.Age = 31
```

Go has no classes. You define a struct and attach **methods** to it.

---

## Methods

A method is a function with a **receiver** written before its name:

```go
func (p Person) Greet() string {
    return "Hi, I am " + p.Name
}
```

A **value receiver** gets a *copy*. To change the original, use a **pointer receiver** (`*`):

```go
type Counter struct{ n int }

func (c *Counter) Inc() {
    c.n++               // changes the real counter
}

c := Counter{}
c.Inc()
c.Inc()
fmt.Println(c.n)        // 2
```

- Use a pointer receiver when the method must modify the struct (or the struct is large)
- Fields and methods that start with a capital letter are exported (visible to other packages)
