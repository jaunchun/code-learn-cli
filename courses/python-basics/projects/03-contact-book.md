---
title: Contact Book
difficulty: medium
time: about 3-4 hours
skills: dictionaries, functions, files, JSON, error handling
---
## What you'll build

A command-line contact book that remembers people between runs.

```text
> add Ana 555-1234 ana@mail.com
> add Bo 555-9876 bo@mail.com
> find an
Ana  555-1234  ana@mail.com
> list
Ana
Bo
> remove Bo
```

## Requirements

- Store contacts in a dictionary: name -> `{"phone": ..., "email": ...}`
- Commands: `add`, `find <text>`, `list`, `remove <name>`, `quit`
- Save to a JSON file after every change and load it on start
- Searching ignores upper/lower case and matches part of a name

---

## Steps

1. Load and save with the `json` module:

```python
import json
from pathlib import Path

FILE = Path("contacts.json")

def load():
    if FILE.exists():
        return json.loads(FILE.read_text())
    return {}

def save(contacts):
    FILE.write_text(json.dumps(contacts, indent=2))
```

2. Write one function per command: `add_contact`, `find_contacts`, `list_contacts`, `remove_contact`.
3. Search with a comprehension: `[name for name in contacts if text.lower() in name.lower()]`.
4. The main loop reads a line, splits it with `line.split()`, and calls the right function.

## Stretch goals

- Prevent duplicates, or ask before overwriting
- Add `edit <name>`
- Export to CSV with the `csv` module
- Sort the list alphabetically with `sorted(...)`
