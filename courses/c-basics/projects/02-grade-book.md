---
title: Grade Book
difficulty: easy
time: about 2 hours
skills: arrays, loops, functions, floating point
---
## What you'll build

A program that reads student scores and prints statistics.

```text
How many students? 4
Score 1: 72
Score 2: 90
Score 3: 85
Score 4: 61
Average: 77.00
Highest: 90 (student 2)
Lowest:  61 (student 4)
Above average: 2 students
```

## Requirements

- Read up to 100 scores into an array
- Separate functions: `average`, `highest`, `lowest`, `count_above`
- Reject scores outside 0-100 and ask again
- Print the average with two decimals

---

## Steps

1. Declare `int scores[100]; int n;`, read `n` first, and check `1 <= n && n <= 100`.
2. Write functions that take the array and its length:

```c
double average(const int scores[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) total += scores[i];
    return (double)total / n;       // cast, or the division is integer division
}
```

3. `highest` returns the **index** of the best score so you can print "student 2".
4. Print with `printf("%.2f\n", avg);`.

## Stretch goals

- Convert scores to letter grades with a `switch` or `if` chain
- Sort the scores (try bubble sort) and print them in order
- Add a histogram made of `*` characters
- Read the scores from a file with `fopen` / `fscanf`
