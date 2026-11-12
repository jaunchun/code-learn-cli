---
title: To-Do List
difficulty: medium
time: about 3 hours
skills: arrays, objects, functions, readline, array methods
---
## What you'll build

A command-line to-do list.

```text
> add buy milk
> add learn JavaScript
> list
1. [ ] buy milk
2. [ ] learn JavaScript
> done 2
> list
1. [ ] buy milk
2. [x] learn JavaScript
> quit
```

## Requirements

- Store tasks as objects in an array: `{ title: "buy milk", done: false }`
- Commands: `add <text>`, `list`, `done <number>`, `remove <number>`, `quit`
- Unknown commands and bad numbers print a helpful message instead of crashing
- Put each command in its own function

---

## Steps

1. Keep the data in `const tasks = [];` and write `addTask`, `listTasks`, `markDone`, `removeTask` first. Test them by calling them directly.
2. Split a typed line into a command and the rest:

```javascript
const [command, ...rest] = line.trim().split(" ");
const text = rest.join(" ");
```

3. Use `switch (command) { case "add": ... }` to pick the function.
4. Print the list with `tasks.forEach((task, index) => { ... })`. Users count from 1, arrays from 0.
5. Use `tasks.splice(index, 1)` to remove an item.

## Stretch goals

- Save the tasks to `tasks.json` with `fs.writeFileSync(file, JSON.stringify(tasks))` and load them on start with `JSON.parse`
- Add priorities and sort by them
- Add `edit <number> <new text>`
- Show only unfinished tasks with `filter`
