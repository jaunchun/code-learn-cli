# Methods

In Java, functions are called **methods** and live inside classes.

```java
public class Main {
    static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(add(2, 3));   // 5
    }
}
```

- A method header: **modifiers** (`static`), **return type**, name, typed parameters
- `void` means "returns nothing"
- `static` methods belong to the class itself, so `main` can call them directly (you will see non-static methods in lesson 5)

---

## Pass by value

Java copies primitive arguments (`int`, `double`, `boolean`, ...). A method cannot change the caller's variable:

```java
static void change(int x) { x = 10; }

int n = 5;
change(n);
System.out.println(n);      // still 5
```

## Overloading

Several methods can share a name if their parameters differ:

```java
static int max(int a, int b) { return a > b ? a : b; }
static double max(double a, double b) { return a > b ? a : b; }
```
