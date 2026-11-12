# Control Flow

## if / else

```java
int age = 20;
if (age >= 18) {
    System.out.println("adult");
} else if (age >= 13) {
    System.out.println("teen");
} else {
    System.out.println("child");
}
```

- The condition goes in parentheses and must be a `boolean`. Unlike C, `if (x = 5)` is a compile error
- Combine with `&&`, `||`, `!`

---

## Loops

```java
for (int i = 0; i < 3; i++) {
    System.out.println(i);          // 0, 1, 2
}

int n = 3;
while (n > 0) {
    System.out.println(n);
    n--;
}

int[] nums = {1, 2, 3};
for (int x : nums) {                // enhanced for: each item
    System.out.println(x);
}
```

## switch

```java
switch (day) {
    case 6:
    case 7:
        System.out.println("weekend");
        break;
    default:
        System.out.println("weekday");
}
```

**Without `break`, execution falls through** into the next case (newer Java also has arrow cases: `case 6, 7 -> ...`).
