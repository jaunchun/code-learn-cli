---
title: Text Adventure: Escape the House
difficulty: medium
time: about 4-6 hours
skills: enums, structs, vectors, string parsing, game state
---
## What you'll build

A small text game: you wake up in a dark house and must find the key to get out.

```text
You are in the hall. Exits: north, east.
> go north
You are in the kitchen. You see a rusty key.
> take key
You picked up the rusty key.
> go south
> go east
The door is locked.
> use key
Click! The door opens. You escaped!
```

## Requirements

- At least 4 rooms connected by exits
- Commands: `go <direction>`, `take <item>`, `use <item>`, `look`, `quit`
- At least one item needed to win
- Unknown commands print a hint instead of crashing

---

## Steps

1. Model the world with a struct and put all rooms in a `vector<Room>`; exits can store the index of the next room (`-1` for no exit):

```cpp
struct Room {
    std::string name;
    std::string description;
    int north = -1, south = -1, east = -1, west = -1;
    std::string item;          // empty if there is none
};
```

2. Keep the game state together: the current room index and a `vector<string>` inventory.
3. Read a whole line with `getline(cin, line)` and split it into a verb and a noun with `istringstream`.
4. Handle each verb in its own function: `go`, `take`, `use`, `look`.

## Stretch goals

- A `Game` class that owns the rooms and has a `handle(const string& command)` method
- Load the map from a text file
- A light/dark mechanic or a monster that ends the game
- Add a turn counter and a score
