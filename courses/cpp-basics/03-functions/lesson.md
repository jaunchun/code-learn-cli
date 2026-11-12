# Functions

```cpp
int add(int a, int b) {
    return a + b;
}

int main() {
    cout << add(2, 3) << endl;   // 5
    return 0;
}
```

- A function starts with its **return type** (`int`), then the name and the parameters **with types**
- `void` means "returns nothing"
- A function must be declared **before** it is used (or announced with a prototype like `int add(int a, int b);`)

---

## Pass by value and by reference

By default C++ **copies** arguments, so the function cannot change the caller's variable:

```cpp
void inc(int x) { x++; }        // changes only the copy

void incRef(int& x) { x++; }    // & = reference: works on the original

int n = 5;
inc(n);        // n is still 5
incRef(n);     // n is now 6
```

Use `const std::string&` to pass big values (like strings) without copying and without allowing changes.

## Default arguments

```cpp
int power(int base, int exp = 2) { /* ... */ }
```
