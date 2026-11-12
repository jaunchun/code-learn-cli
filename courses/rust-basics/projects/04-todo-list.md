---
title: To-Do List
difficulty: medium
time: 3-4 hours
skills: Vec, structs, enums, match, loops, reading input
---
# To-Do List

## What you'll build

A command-line to-do list you control by typing commands.

```text
> add buy milk
> add learn Rust
> list
1. [ ] buy milk
2. [ ] learn Rust
> done 2
> list
1. [ ] buy milk
2. [x] learn Rust
> quit
```

## Requirements

- A `Task` struct with a title and a `done` flag
- Keep all tasks in a `Vec<Task>`
- Commands: `add <text>`, `list`, `done <number>`, `remove <number>`, `quit`
- Unknown commands and bad numbers print a helpful message instead of crashing

---

## Steps

1. Model the commands as an enum, and turn each typed line into one:

```rust
enum Command {
    Add(String),
    List,
    Done(usize),
    Remove(usize),
    Quit,
    Unknown,
}
```

2. Write `fn parse(line: &str) -> Command`. Splitting off the first word helps:

```rust
let mut parts = line.trim().splitn(2, ' ');
let word = parts.next().unwrap_or("");
let rest = parts.next().unwrap_or("");
```

3. Write the main loop: print a prompt, read a line, `parse` it, then `match` on the command.
4. Number tasks starting from 1 for the user, but remember `Vec` indexes start at 0.
5. Use `tasks.iter().enumerate()` to list tasks together with their positions.

## Stretch goals

- Save the tasks to a file when you quit and load them on start (`std::fs`)
- Add `edit <number> <new text>`
- Add priorities with an enum `Priority { Low, Normal, High }`
- Show only unfinished tasks with `list todo`
