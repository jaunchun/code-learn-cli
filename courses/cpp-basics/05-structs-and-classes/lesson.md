# Structs and Classes

## struct

Group related values into your own type:

```cpp
struct Point {
    int x;
    int y;
};

Point p;
p.x = 3;
p.y = 4;
```

---

## class

A `class` adds behavior (methods) and lets you hide data:

```cpp
class Counter {
public:
    Counter() : value(0) {}        // constructor: runs when an object is created
    void increment() { value++; }
    int get() const { return value; }
private:
    int value;
};

Counter c;
c.increment();
cout << c.get() << endl;   // 1
```

- A **constructor** has the same name as the class and no return type
- `public:` members can be used from outside; `private:` members only inside the class
- In a `struct` members are public by default; in a `class` they are **private** by default
- `const` after a method promises it does not change the object
