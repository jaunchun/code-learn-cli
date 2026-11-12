---
title: Text Adventure
difficulty: medium
time: 3-5 hours
skills: enums, match, loops, state, strings
---
# Text Adventure

## What you'll build

A tiny game where the player walks between rooms by typing commands.

```text
You are in the Hall. Doors lead north and east.
> go north
You are in the Kitchen. There is a rusty key on the table.
> take key
You picked up the key.
> go south
You are in the Hall. Doors lead north and east.
> go east
You unlock the cellar door with the key. You win!
```

## Requirements

- An `enum Room` with at least 4 rooms
- A `fn describe(room: &Room) -> String` that returns the room's text
- Commands `go <direction>`, `take <item>`, `look`, and `quit`
- At least one item that is needed to win
- Moving in a direction with no door prints a message and stays in the same room

---

## Steps

1. Start small: three rooms, `go` only. Hold the current room in a mutable variable.
2. Use `match` on a pair to describe the map. Matching a pair of values is very handy here:

```rust
let next = match (&room, direction) {
    (Room::Hall, "north") => Some(Room::Kitchen),
    (Room::Kitchen, "south") => Some(Room::Hall),
    _ => None,
};
```

3. Add a `has_key: bool` (or a `Vec<String>` for an inventory) to remember what the player holds.
4. Make winning depend on the item: entering the cellar without the key should be refused.
5. Keep the game loop short: read a line, split into words, `match` on the words.

## Stretch goals

- Items lying in rooms that disappear after `take`
- A turn limit, or a monster room that ends the game
- A `Game` struct holding the room, inventory and turn count, with a `handle(&mut self, line: &str)` method
- Read the map from a text file instead of hard-coding it
