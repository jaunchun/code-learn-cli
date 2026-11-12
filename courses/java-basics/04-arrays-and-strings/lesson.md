# Arrays, Strings and ArrayList

## Arrays

A fixed-size list of one type:

```java
int[] nums = {10, 20, 30};
System.out.println(nums[1]);        // 20
System.out.println(nums.length);    // 3   (a field: no parentheses)
int[] zeros = new int[5];           // five 0s
```

Reading outside the array throws `ArrayIndexOutOfBoundsException` (unlike C, Java checks).

---

## Strings

```java
String s = "Hello";
s.length();             // 5   (a method: with parentheses)
s.toUpperCase();        // "HELLO"
s.charAt(1);            // 'e'
s.substring(1, 3);      // "el"
```

- **Compare text with `.equals`**, not `==`: `a.equals(b)`. `==` compares object identity
- Strings are **immutable**: methods return a new string

## ArrayList

A resizable list (import `java.util.ArrayList`):

```java
ArrayList<Integer> list = new ArrayList<>();
list.add(10);
list.add(20);
System.out.println(list.get(0));    // 10
System.out.println(list.size());    // 2
```

> **Tip:** Arrays use `.length`, Strings use `.length()`, lists use `.size()`.
