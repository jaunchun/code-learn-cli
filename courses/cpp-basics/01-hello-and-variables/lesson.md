# Hello and Variables

C++ is a fast, compiled language used for games, engines and systems. Your first program:

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, world!" << std::endl;
    return 0;
}
```

- `#include <iostream>` brings in input/output tools
- `main` is where the program starts. It returns `0` when everything went well
- `std::cout << ...` prints. The `<<` arrows point **into** `cout`. `std::endl` ends the line
- Every statement ends with a semicolon `;`

---

## Variables and types

C++ is **statically typed**: you write the type when you create a variable.

```cpp
int age = 30;            // whole number
double price = 9.99;    // decimal number
bool ready = true;       // true or false
char grade = 'A';       // one character (single quotes)
std::string name = "Ana";  // text (needs #include <string>)
const int MAX = 100;     // cannot change
```

- `auto x = 5;` lets the compiler pick the type
- Writing `using namespace std;` at the top lets you write `cout` instead of `std::cout`
- Dividing two `int`s gives an `int`: `7 / 2` is `3`. Use a `double` for `3.5`
