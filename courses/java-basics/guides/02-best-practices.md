---
title: Java best practices
summary: Clean, safe, conventional Java
---
## Conventions

- Classes `PascalCase`, methods and variables `camelCase`, constants `UPPER_SNAKE_CASE`
- One public class per file, and the file name matches the class name
- Always use braces `{ }` for `if` and loops, even for one line
- Keep methods short and focused; prefer descriptive names (`calculateTotal`, `isEmpty`)

## Write safe code

- **Compare strings with `.equals`**, never `==`. For literals first, `"yes".equals(input)` avoids a `NullPointerException`
- **Make fields `private`** and expose only what is needed. Use `final` for fields and variables that should not change
- **Program to interfaces:** declare `List<String> names = new ArrayList<>();`, not `ArrayList<String> names = ...`
- **Use enhanced `for`** (`for (String s : list)`) when you do not need the index
- **Handle exceptions where you can do something useful**; never leave an empty `catch` block
- Use **try-with-resources** for anything that must be closed (files, scanners)

---

## Watch out for

- `NullPointerException`: calling a method on `null`. Initialize fields; check for `null`, or use `Optional`
- Integer division: `7 / 2` is `3`. Use `7 / 2.0`
- `==` on objects compares references, not contents
- Modifying a list while looping over it throws `ConcurrentModificationException`
- Floating point is inexact (`0.1 + 0.2`). For money use `BigDecimal` or whole cents
- `static` things belong to the class, not to objects. A static method cannot use non-static fields

## Habits

- Read the **first line** of a stack trace and the first line that mentions your own class and line number
- Use your IDE's debugger and its quick-fixes; they teach a lot
- Write small tests with **JUnit** as soon as a project has more than a few methods
- Format code consistently (your IDE can do it automatically)
