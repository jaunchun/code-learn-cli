# Functions

```c
int add(int a, int b) {
    return a + b;
}

int main(void) {
    printf("%d\n", add(2, 3));   // 5
    return 0;
}
```

- A function starts with its **return type**, then the name and the typed parameters
- `void` means "returns nothing" (or, for parameters, "takes nothing")
- A function must be defined (or declared with a *prototype* like `int add(int a, int b);`) **before** it is used

---

## Pass by value

C always **copies** arguments. A function cannot change the caller's variable:

```c
void inc(int x) { x++; }     // changes only the copy

int n = 5;
inc(n);
printf("%d\n", n);           // still 5
```

To change the caller's variable you pass its address (a pointer, see lesson 5).

## Scope

A variable declared inside a function exists only inside it. Variables declared outside every function are **global**: use them sparingly.
