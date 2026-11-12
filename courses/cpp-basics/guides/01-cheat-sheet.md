---
title: C++ cheat sheet
summary: Quick reference for syntax you will use every day
---
## Program skeleton

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    cout << "Hello" << endl;
    return 0;
}
```

Compile and run:

```text
g++ -std=c++17 -Wall -Wextra main.cpp -o main
./main
```

## Types and input

```cpp
int i = 1; double d = 2.5; bool b = true; char c = 'x'; string s = "hi";
auto x = 42;
cin >> i;                  // read a value
getline(cin, s);           // read a whole line
```

## Control flow

```cpp
if (a > b) { } else if (a == b) { } else { }
for (int i = 0; i < n; i++) { }
for (auto& item : items) { }
while (cond) { }
switch (x) { case 1: break; default: break; }
```

---

## Containers and strings

```cpp
vector<int> v = {1, 2, 3};
v.push_back(4); v.size(); v[0]; v.at(0); v.pop_back(); v.clear();
sort(v.begin(), v.end());          // #include <algorithm>

string s = "Hello";
s.size(); s + "!"; s.substr(1, 3); s.find("ll"); to_string(5);

map<string, int> ages;             // #include <map>
ages["Ana"] = 30;
```

## Functions, references, classes

```cpp
int add(int a, int b) { return a + b; }
void change(int& x) { x = 5; }                 // reference
void show(const string& s) { cout << s; }      // no copy, no change

class Dog {
public:
    Dog(string n) : name(n) {}
    void bark() const { cout << name << ": woof\n"; }
private:
    string name;
};
```
