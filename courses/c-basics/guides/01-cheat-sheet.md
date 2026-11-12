---
title: C cheat sheet
summary: Quick reference for syntax you will use every day
---
## Compile and run

```text
gcc -Wall -Wextra -g main.c -o main
./main
```

## Types and printf

```c
int i = 1; long long big = 1LL << 40; double d = 2.5; char c = 'x'; bool b = true;
printf("%d %lld %f %.2f %c %s %zu\n", i, big, d, d, c, "text", sizeof(i));
scanf("%d", &i);                 // read an int (note the &)
```

## Control flow

```c
if (a > b) { } else if (a == b) { } else { }
for (int i = 0; i < n; i++) { }
while (cond) { }
do { } while (cond);
switch (x) { case 1: break; default: break; }
```

---

## Arrays, strings, pointers

```c
int a[5] = {0};  a[0] = 1;
int n = sizeof(a) / sizeof(a[0]);

char s[20] = "hello";
strlen(s); strcmp(s, "hi") == 0; strcpy(dst, src); strcat(s, "!");
snprintf(buf, sizeof(buf), "%s-%d", name, n);    // safe formatting

int x = 5, *p = &x;   *p = 6;    // pointer to x
void f(int *out) { *out = 1; }   // "return" a value through a pointer
```

## Structs and memory

```c
struct Point { int x, y; };
struct Point p = {1, 2};   p.x;   struct Point *q = &p;   q->x;

int *arr = malloc(10 * sizeof(int));    // #include <stdlib.h>
if (arr == NULL) { /* out of memory */ }
free(arr);
```

## Files

```c
FILE *f = fopen("data.txt", "r");
if (f == NULL) { perror("fopen"); return 1; }
char line[100];
while (fgets(line, sizeof(line), f)) { }
fclose(f);
```
