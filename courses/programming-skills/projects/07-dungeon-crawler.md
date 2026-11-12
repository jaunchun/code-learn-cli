---
title: Text Dungeon Crawler
difficulty: hard
time: about 8-12 hours
skills: structs/classes, game loop, state, randomness, file loading
---
## What you'll build

A turn-based text adventure with rooms, items and monsters.

```text
You are in the Torch Room. Exits: north, east.
You see: a rusty sword.
> take sword
> go north
A goblin attacks! (HP 10)
> attack
You hit the goblin for 4. Goblin HP: 6.
```

## Requirements

- A map of at least 6 connected rooms
- A player with health, an inventory and a current room
- At least two kinds of monsters and two kinds of items (one weapon, one healing item)
- Turn-based combat with some randomness
- Win and lose conditions
- Commands: `go`, `look`, `take`, `use`, `attack`, `inventory`, `quit`

---

## Steps

1. Design the data first: what is a Room, an Item, a Monster, a Player? Write them down as records/classes.
2. Hard-code a tiny map (3 rooms) and get walking around working.
3. Add items: take, drop, inventory.
4. Add monsters and combat, one function that resolves one round.
5. Put the **game loop** in one place: read command, handle it, update the world, check win/lose.
6. Only then grow the map and add features.

## Stretch goals

- Load the whole map from a text/JSON file so you can create new adventures without changing code
- Experience points and levels
- Locked doors and keys; items that combine
- Save and load the game
- Replace text with a simple graphical interface
