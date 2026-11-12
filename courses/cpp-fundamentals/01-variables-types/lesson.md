# Your First C++ Program

A command-line inventory tool needs to display a startup message. Every C++ program begins execution in `main`.

```text
#include <iostream>
int main() {
    std::cout << "Inventory ready\n";
    return 0;
}
```

---

## Understand the idea

`#include` makes declarations from a header available. `iostream` provides standard input and output. `main` is the program entry point.

---

## Apply it in a real project

`std::cout` writes to standard output. The `<<` operator sends data to the stream. A semicolon ends most C++ statements. `return 0` conventionally reports successful completion.

> **Tip:** Read the example, predict what it does, then try changing one value or instruction.
