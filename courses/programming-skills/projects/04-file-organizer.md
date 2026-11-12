---
title: File Organizer
difficulty: medium
time: about 3 hours
skills: files and folders, strings, loops, safety
---
## What you'll build

A script that tidies a messy folder by moving files into sub-folders by type.

```text
Organizing /home/me/Downloads ...
photo.jpg      -> Images/
report.pdf     -> Documents/
song.mp3       -> Audio/
Moved 3 files.
```

## Requirements

- Take a folder path from the command line (or ask for it)
- Decide the target folder from the file extension (a lookup table)
- Create missing target folders; put unknown types in `Other/`
- Never overwrite an existing file: rename the new one (`photo (1).jpg`)
- A `--dry-run` mode that only prints what would happen

---

## Steps

1. List the files in the folder (skip sub-folders and hidden files).
2. Build the extension table:

```text
Images:    jpg, jpeg, png, gif
Documents: pdf, docx, txt, md
Audio:     mp3, wav, flac
Video:     mp4, mkv, mov
```

3. Print the plan first. Run the whole program in dry-run mode until it looks right.
4. Then do the move, handling the "file already exists" case.
5. Test on a **copy** of a folder, never your real one, until you trust it.

## Stretch goals

- Undo: write a log of moves and add an `--undo` command
- Organize by date instead (`2024/05/`)
- Watch the folder and organize new files automatically
- Detect duplicates by comparing file sizes and hashes
