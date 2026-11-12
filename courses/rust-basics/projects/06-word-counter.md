---
title: Word Counter
difficulty: medium
time: 2-3 hours
skills: strings, HashMap, borrowing, sorting, files
---
# Word Counter

## What you'll build

A program that reads some text and prints the most common words.

```text
Top words:
  the     12
  rust     7
  and      5
```

## Requirements

- Read the text from a file given on the command line (`cargo run -- notes.txt`), or from the keyboard if no file is given
- Ignore upper/lower case and punctuation (`Rust,` and `rust` are the same word)
- Count how often each word occurs
- Print the top 10, most common first (ties in alphabetical order)

---

## Steps

This project needs a type you have not met yet, `HashMap`: a collection that maps a key (the word) to a value (the count).

1. Get the file name and read the file:

```rust
use std::env;
use std::fs;

let args: Vec<String> = env::args().collect();
let text = fs::read_to_string(&args[1]).expect("could not read the file");
```

2. Clean up each word and count it:

```rust
use std::collections::HashMap;

let mut counts: HashMap<String, usize> = HashMap::new();
for word in text.split_whitespace() {
    let word = word.trim_matches(|c: char| !c.is_alphanumeric()).to_lowercase();
    if word.is_empty() {
        continue;
    }
    *counts.entry(word).or_insert(0) += 1;
}
```

3. A `HashMap` has no order. Move the entries into a `Vec` and sort it:

```rust
let mut list: Vec<(String, usize)> = counts.into_iter().collect();
list.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(&b.0)));
```

4. Print the first ten with `list.iter().take(10)`. Use `{:<10}` in `println!` to line the columns up.

## Stretch goals

- Add a `--min-length 4` option to skip short words
- Count characters and lines as well
- Print a small bar chart with `"#".repeat(count)`
- Read several files and merge the counts
