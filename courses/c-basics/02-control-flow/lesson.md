# Control Flow

## if / else

```c
int age = 20;
if (age >= 18) {
    printf("adult\n");
} else if (age >= 13) {
    printf("teen\n");
} else {
    printf("child\n");
}
```

- In C, **0 is false and every other value is true**
- `==` compares, `=` assigns. `if (x = 5)` compiles but assigns, a classic bug
- Combine with `&&`, `||`, `!`
- For `bool`, `true` and `false`, add `#include <stdbool.h>`

---

## Loops and switch

```c
for (int i = 0; i < 3; i++) {
    printf("%d\n", i);          // 0, 1, 2
}

int n = 3;
while (n > 0) {
    printf("%d\n", n);
    n--;
}

switch (x) {
    case 1: printf("one\n"); break;
    case 2: printf("two\n"); break;
    default: printf("other\n");
}
```

- `break` leaves a loop or a `case`. **Without `break`, a `switch` falls through into the next case**
- `continue` skips to the next loop round
