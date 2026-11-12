# Hello and Variables

C is a small, fast language close to the machine. It powers operating systems, embedded devices and many other languages. Your first program:

```c
#include <stdio.h>

int main(void) {
    printf("Hello, world!\n");
    return 0;
}
```

- `#include <stdio.h>` brings in the input/output functions
- `main` is where the program starts; `return 0;` means "success"
- `printf` prints text. `\n` is a new line
- Every statement ends with `;`

---

## Variables and printf

You write the **type** when you create a variable:

```c
int age = 30;
double price = 9.99;
char grade = 'A';        // one character, single quotes
const int MAX = 100;     // cannot change
printf("%d years, %.2f dollars, grade %c\n", age, price, grade);
```

`printf` uses **format specifiers** as placeholders:

| Specifier | Prints |
|---|---|
| `%d` | an `int` |
| `%f` | a `double` (6 decimals; `%.2f` gives 2) |
| `%c` | one `char` |
| `%s` | a string |

> **Tip:** Dividing two ints gives an int: `7 / 2` is `3`. Make one side a double (`7 / 2.0` or `(double)7 / 2`) to get `3.5`.
