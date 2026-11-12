# Code Learn

Learn to code in your terminal. Pick a lesson, read a short piece of learning material, then practice with questions and small coding tasks. When you answer wrong, Code Learn explains **why that answer is wrong**.

Zero dependencies - just Node.js 18+.

```text
  ◆ Code Learn   Rust Basics › Variables and Mutability
  ────────────────────────────────────────────────────

  Question 1 of 6  ·  Multiple choice

  What happens when you compile this code?

  ╭─ rust ────────
  │ let x = 5;
  │ x = 6;
  ╰──────────

  A) Compile error: cannot assign twice to an immutable variable
  B) `x` becomes 6
  ...
  › b

  ✘ Not quite.
    That would only work if `x` were declared with `mut`.
    Rust variables are immutable by default.
```

## Run it

```text
node bin/clx.js
```
Also on npm
```
npm install code-learn-cli
```
Or install the `clx` command globally from this folder:

```text
npm link
clx
```

## What it feels like

- **Arrow-key menus.** Move with `↑`/`↓` (or `j`/`k`), press `Enter` to select. In quizzes, `A`-`E` jump to an option.
- **A real code editor** for fix/write questions: move around with the arrow keys, go back up and edit earlier lines, line numbers and syntax colors while you type.
- **Auto-closing brackets and quotes:** typing `(` gives `()`, `"` gives `""`, `{` + Enter gives an indented block with the `}` already there. Typing the closing character just steps over it. Backspace removes an empty pair.
- **Autocomplete:** type the first letter of a name or text from the question (like `R` inside `"..."` for `Rust is fun`) and a grey suggestion appears. Press `Tab` to accept it.

Editor keys: `Tab` accept suggestion / indent · `Enter` new line (on an empty last line it submits) · `Ctrl+D` submit · `Ctrl+A`/`Ctrl+E` line start/end · `Ctrl+U`/`Ctrl+K` delete to start/end · `Ctrl+W` delete word · `Ctrl+C` quit.

## How it works

1. Pick a **course**, then a **lesson**.
2. Read the lesson pages (Enter = next page).
3. Answer the questions. Four kinds:
   - **Multiple choice** - type a letter
   - **Fill in the blank** - type what goes in the `___`
   - **Fix the code** - retype the broken line correctly
   - **Write code** - write a small snippet (finish with an empty line)
4. Wrong answer? You get a specific explanation and can try again.
5. Your first-try score is saved per lesson.

While answering: quiz questions use the keys `h` hint, `s` skip (shows the answer), `q` leave the lesson. In the code editor type `:h`, `:s` or `:q` on an otherwise empty box and press Enter.

## Commands

| Command | What it does |
|---|---|
| `clx` | start learning |
| `clx validate [path]` | check courses for mistakes (run this after writing or generating a lesson) |
| `clx reset` | delete saved progress |
| `clx help` | show help |

Progress is stored in `~/.clx/progress.json` (set `CLX_HOME` to change the folder).

## Challenges and project ideas

Every course can have extra sections next to its lessons. Pick the course and a small menu appears (challenges, project ideas and guides):

- **Challenges:** bigger problems with no step-by-step help, like "write `is_prime`" or "build a `Counter` struct". The editor opens with starter code, you press `Ctrl+D` to run your code against tests, and `Esc` opens a menu with **progressive hints** (one at a time), "give up and show the solution", and "leave". Each challenge has a difficulty (easy / medium / hard) and remembers how many tries and hints you needed. Challenges are graded by running your code, so they need the language's tools installed (see below).
- **Project ideas:** things to build on your own, each with a description, an example session, a step-by-step plan with code snippets for the tricky parts, and stretch goals. Mark each as "working on this" or "built it".

To add your own, see [`docs/AI_AUTHORING_GUIDE.md`](docs/AI_AUTHORING_GUIDE.md) (sections 5d-5f): challenges are JSON files in `challenges/`, project ideas and guides are Markdown files in `projects/` and `guides/`.

## Smart answer checking

Code questions are graded by **running your code**, not by comparing text. If your solution prints the right result it passes - `i += 1` and `i = i + 1` are both fine, and so is any other way of getting the same output. When your code is wrong you see the compiler's real error message, or the expected output next to yours.

This needs the language's tools installed:

| Language | Tool |
|---|---|
| Python | `python3` |
| JavaScript | `node` (already there, since you run Code Learn with it) |
| Rust | `rustc` ([rustup.rs](https://rustup.rs)) |
| C, C++ | `gcc`, `g++` (Windows: MSYS2 or MinGW-w64) |
| Go | `go` ([go.dev/dl](https://go.dev/dl)) |
| Java | a JDK: `javac` and `java` ([adoptium.net](https://adoptium.net)) |

You only need the tools for the languages you study. Without them Code Learn says so once and checks your answer against written patterns instead (stricter about wording). Your code runs on your computer, in a temporary folder, with a time limit.

## Settings

Optional file `~/.clx/config.json` (the folder follows `CLX_HOME`):

```json
{
  "autoPairs": true,
  "autoIndent": true,
  "suggestions": true,
  "classicInput": false,
  "languages": {
    "rust": { "indent": "  ", "pairs": { "(": ")", "{": "}" } }
  }
}
```

| Setting | Meaning |
|---|---|
| `autoPairs` | auto-close brackets and quotes |
| `autoIndent` | keep/increase indentation on Enter |
| `suggestions` | grey autocomplete hints |
| `classicInput` | plain typed input instead of arrow menus and the live editor (same as `CLX_CLASSIC=1`) |
| `languages.<name>` | per-language editor overrides: `pairs`, `quotes`, `indent`, `indentAfter`, `dedent` |

Built-in defaults for `rust`, `javascript` and `python` are in `src/languages.js`; adding a language there gives it colors and editor behavior. A course can also set an `"editor"` block in its `course.json`; your own config wins over the course.

## Adding courses

Courses are plain folders - no code changes needed:

```text
courses/
  my-course/
    course.json
    01-first-lesson/
      lesson.md          <- learning material (Markdown, pages split by ---)
      questions.json     <- the questions
    challenges/          <- optional: 01-name.json, ...
    projects/            <- optional: 01-name.md, ...
    guides/              <- optional: 01-name.md, ...
```

Code Learn loads courses from `courses/` next to the app and from `~/.clx/courses/` (and from every folder listed in the `CLX_COURSES` environment variable).

**Let an AI write them:** give [`docs/AI_AUTHORING_GUIDE.md`](docs/AI_AUTHORING_GUIDE.md) to any AI and ask for a lesson or a whole course. Then run `node bin/clx.js validate` to check the result.

## Included courses

| Course | Lessons | Challenges | Project ideas | Guides |
|---|---|---|---|---|
| **Python Basics** | 5 (25 questions) | 5 | 3 | cheat sheet, best practices |
| **JavaScript Basics** (Node.js) | 5 (25) | 5 | 3 | cheat sheet, best practices |
| **Rust Basics** | 8 (48) | 8 | 7 | cheat sheet, best practices |
| **C++ Basics** | 5 (25) | 5 | 4 | cheat sheet, best practices |
| **C Basics** | 5 (25) | 5 | 3 | cheat sheet, best practices |
| **Go Basics** | 5 (25) | 5 | 3 | cheat sheet, best practices |
| **Java Basics** | 5 (25) | 5 | 3 | cheat sheet, best practices |
| **Programming Skills** (any language) | - | - | 7 | learning, planning, debugging, errors, Git, clean code, choosing a language |

The five challenges in each language are the same problems (FizzBuzz, factorial, palindrome, Fibonacci, count the vowels), so you can solve them in a second language to compare. The project ideas range from "Number Guessing Game" to a text dungeon crawler. Every example solution in every course is compiled and run by `clx validate`.

**Guides** are reference pages you can open any time from a course: a cheat sheet for the syntax, and best practices with the classic traps. **Programming Skills** collects the general ones: how to learn effectively, how to plan a project, a step-by-step debugging method, how to read error messages, Git in 10 minutes, clean code, and how to choose a language.

## Project layout

```text
bin/clx.js          entry point
src/app.js           screens: menus, lesson flow, questions
src/loader.js        finds courses, validates them
src/grader.js        grades answers: runs your code, or falls back to pattern checks
src/runner.js        compiles and runs code (rustc, node, python3, gcc, g++, go, javac)
src/ui.js            colors, markdown, syntax highlighting
src/languages.js     per-language colors and editor behavior
src/config.js        user settings (~/.clx/config.json)
src/prompts.js       input door: interactive widgets or plain lines
src/terminal.js      arrow-key menus and the live code editor
src/editor.js        editing logic: cursor, auto-pairs, indent, autocomplete
src/progress.js      saves your progress
courses/             the lessons
docs/                AI authoring guide
```

Environment variables: `NO_COLOR` (disable colors), `CLX_HOME`, `CLX_COURSES`, `CLX_CLASSIC` (plain input).
