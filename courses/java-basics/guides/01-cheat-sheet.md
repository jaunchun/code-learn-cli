---
title: Java cheat sheet
summary: Quick reference for syntax you will use every day
---
## Compile and run

```text
javac Main.java        # compile
java Main              # run
java Main.java         # compile and run in one step (Java 11+)
```

## Variables and types

```java
int i = 1; long big = 1L << 40; double d = 2.5; boolean b = true; char c = 'x';
String s = "hi";
final int MAX = 10;
var x = 42;                           // inferred
int n = (int) 3.9;                    // cast: 3
```

## Control flow

```java
if (a > b) { } else if (a == b) { } else { }
for (int i = 0; i < n; i++) { }
for (String item : items) { }
while (cond) { }
switch (x) { case 1: break; default: break; }
String r = cond ? "yes" : "no";
```

---

## Strings, arrays, collections

```java
s.length(); s.charAt(0); s.substring(1, 3); s.indexOf("l"); s.toUpperCase();
s.equals(t); s.contains("el"); String.join(",", list); String.valueOf(5);

int[] a = {1, 2, 3};  a.length;  Arrays.sort(a);  Arrays.toString(a);

List<String> list = new ArrayList<>();
list.add("x"); list.get(0); list.size(); list.remove(0); list.contains("x");

Map<String, Integer> m = new HashMap<>();
m.put("a", 1); m.get("a"); m.getOrDefault("z", 0); m.containsKey("a");
for (var e : m.entrySet()) { e.getKey(); e.getValue(); }
```

## Classes and exceptions

```java
class Dog {
    private String name;
    Dog(String name) { this.name = name; }
    String getName() { return name; }
}

try {
    Integer.parseInt("x");
} catch (NumberFormatException e) {
    System.out.println(e.getMessage());
} finally {
    // always runs
}
throw new IllegalArgumentException("bad value");
```

## Input

```java
Scanner in = new Scanner(System.in);    // import java.util.Scanner;
String line = in.nextLine();
int n = in.nextInt();
```
