# Hello and Variables

Go is a simple, fast language made at Google, popular for servers, tools and cloud software. Your first program:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}
```

- Every file belongs to a `package`. A program starts in `package main`, function `main`
- `import "fmt"` loads the formatting package; `fmt.Println` prints a line
- There are no semicolons at the end of lines
- Go is strict: **unused variables and unused imports are compile errors**

---

## Variables

```go
var age int = 30       // full form
var name = "Ana"       // type is inferred
count := 10            // short form: declare + assign (only inside functions)
count = 11             // later changes use plain =

const Pi = 3.14159     // constant
```

- `:=` creates a **new** variable; `=` changes an existing one
- Basic types: `int`, `float64`, `string`, `bool`
- Variables you do not initialize get a **zero value**: `0`, `""`, `false`
- Names that start with a capital letter are visible to other packages (`Println`)
