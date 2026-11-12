# Hello and Variables

Java powers Android apps, enterprise software and big back-end systems. It is **statically typed** and **object-oriented**. Your first program:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```

- All code lives inside a **class** (here `Main`)
- `public static void main(String[] args)` is where the program starts
- `System.out.println(...)` prints a line (`print` prints without a new line)
- Statements end with `;`, blocks use `{ }`

---

## Variables and types

```java
int age = 30;              // whole number
double price = 9.99;       // decimal number
boolean ready = true;      // true or false
char grade = 'A';          // one character, single quotes
String name = "Ana";       // text, capital S, double quotes
final int MAX = 100;       // cannot change
var count = 5;             // the compiler infers int
```

- Java will not silently lose data: `int x = 3.5;` is a compile error. You must cast: `int x = (int) 3.5;`
- Dividing two ints gives an int: `7 / 2` is `3`
- Join text with `+`: `"Hi " + name`
