# Pointers and Structs

## Pointers

A **pointer** stores the *address* of another variable.

```c
int x = 5;
int *p = &x;     // p holds the address of x   (& = "address of")
*p = 10;         // * = "follow the pointer": changes x
printf("%d\n", x);   // 10
```

Pointers let a function change the caller's variable:

```c
void inc(int *p) {
    (*p)++;
}

int n = 5;
inc(&n);         // pass the address
// n is now 6
```

---

## Structs

Group related values into one type:

```c
struct Point {
    int x;
    int y;
};            // <- the semicolon is required

struct Point p = {3, 4};
printf("%d\n", p.x + p.y);   // 7
```

- Access members with `.`; with a pointer to a struct use `->`: `ptr->x`
- A pointer that points nowhere is `NULL`. Never follow a `NULL` pointer
- Memory from `malloc` must be released with `free`
