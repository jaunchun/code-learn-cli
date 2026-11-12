---
title: Library Manager
difficulty: medium
time: about 4 hours
skills: classes, objects, ArrayList, encapsulation, menus
---
## What you'll build

A console program that manages a small library.

```text
1) Add book  2) List books  3) Borrow  4) Return  5) Quit
> 1
Title: Dune
Author: Frank Herbert
Added.
> 3
Title to borrow: Dune
You borrowed "Dune".
```

## Requirements

- A `Book` class with `title`, `author`, `borrowed` (private fields, a constructor, getters)
- A `Library` class that owns an `ArrayList<Book>` and has `addBook`, `findByTitle`, `borrow`, `giveBack`
- A menu loop in `main` that only talks to `Library`
- Borrowing an unknown or already-borrowed book prints a clear message

---

## Steps

1. Start with `Book` and give it a `toString()` so printing a book is easy:

```java
class Book {
    private final String title;
    private final String author;
    private boolean borrowed;

    Book(String title, String author) {
        this.title = title;
        this.author = author;
    }

    String getTitle() { return title; }
    boolean isBorrowed() { return borrowed; }
    void setBorrowed(boolean borrowed) { this.borrowed = borrowed; }

    @Override
    public String toString() {
        return title + " by " + author + (borrowed ? " (borrowed)" : "");
    }
}
```

2. In `Library`, find a book by comparing titles with `equalsIgnoreCase`.
3. Return `null` (or better, a `boolean`) from `borrow` to say whether it worked.
4. Read menu choices with `Scanner`; use a `switch` on the choice.

## Stretch goals

- Track *who* borrowed each book with a `Member` class
- Save and load the library from a text file
- Search by author or part of a title
- Replace the `ArrayList` search with a `HashMap<String, Book>`
