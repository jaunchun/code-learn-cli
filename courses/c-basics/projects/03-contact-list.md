---
title: Contact List
difficulty: medium
time: about 4 hours
skills: structs, arrays of structs, strings, files
---
## What you'll build

A small phone book that remembers contacts between runs.

```text
1) Add  2) List  3) Search  4) Quit
> 1
Name: Ana
Phone: 555-1234
Saved.
```

## Requirements

- A `struct Contact` with `name` and `phone` (fixed-size `char` arrays)
- Keep up to 100 contacts in an array and track how many there are
- Add, list and search (by part of the name, any case)
- Save to a text file on exit and load it on start

---

## Steps

1. Define the struct:

```c
#define MAX 100

struct Contact {
    char name[50];
    char phone[20];
};

struct Contact contacts[MAX];
int count = 0;
```

2. Read a line safely with `fgets` (never use `gets`):

```c
fgets(contacts[count].name, sizeof(contacts[count].name), stdin);
contacts[count].name[strcspn(contacts[count].name, "\n")] = '\0';   // remove the newline
```

3. Search with `strstr(name, text)`. For case-insensitive search, lower-case copies of both first.
4. Save with `fopen("contacts.txt", "w")` and `fprintf`; load with `fgets`. Always check that `fopen` did not return `NULL`.

## Stretch goals

- Delete a contact (shift the rest of the array down)
- Keep the list sorted with `qsort`
- Store contacts in dynamic memory with `malloc` / `realloc`
- Add `email` and an `edit` command
