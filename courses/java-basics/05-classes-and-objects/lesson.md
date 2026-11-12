# Classes and Objects

A **class** is a blueprint; an **object** is one thing made from it.

```java
class Dog {
    private String name;          // field (data)

    Dog(String name) {            // constructor: same name as the class
        this.name = name;
    }

    String getName() {            // method
        return name;
    }

    void bark() {
        System.out.println(name + " says woof");
    }
}

Dog d = new Dog("Rex");
d.bark();                         // Rex says woof
```

- `new Dog("Rex")` creates an object and runs the constructor
- **`this`** refers to the current object. `this.name = name;` copies the parameter into the field
- `private` fields can only be used inside the class; expose them with **getter** methods
- Methods that belong to an object are **not** `static`

---

## Why private?

Hiding fields lets the class protect itself, for example refusing a negative age:

```java
void setAge(int age) {
    if (age >= 0) {
        this.age = age;
    }
}
```
