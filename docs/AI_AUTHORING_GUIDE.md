# Code Learn - AI Authoring Guide

**Give this whole file to an AI** (Claude, ChatGPT, ...) together with a request like:

> "Following this guide, write lesson 9 of the Rust Basics course: *Vectors*."
> or "Following this guide, create a new course *JavaScript Basics* with 6 lessons."

The AI answers with ready-to-save files. You save them, run `node bin/clx.js validate`, and the lesson shows up in the app. No code changes are needed.

---

## 0. Instructions for the AI (read this first)

You are writing lesson content for **Code Learn**, a terminal app that teaches programming. A learner reads a short lesson, then answers questions. When an answer is wrong, the app shows an **explanation of why that specific answer is wrong**. Your job is to produce files that follow the formats below **exactly**.

Rules for your output:

1. Output every file as its own code block, with the **file path on the line before it**, e.g. `courses/rust-basics/09-vectors/lesson.md`.
2. `questions.json` and `course.json` must be **valid JSON**: double quotes, no comments, no trailing commas, `\n` for newlines inside strings, and `\\` for every backslash (so a regex `\s` is written `"\\s"`).
3. Do not invent fields. Only use the fields documented in this guide.
4. Don't add commentary inside the files. Put any notes outside the code blocks.
5. **Give every `fill`, `fix` and `write` question a `run` block** (section 5a). The app then runs the learner's code and accepts *any* solution that behaves correctly, however it is written. `answer`/`checks` stay as the fallback.
6. For challenges (section 5d) and project ideas (section 5e) follow the formats there exactly.
7. Finish by running through the checklist in section 7.

---

## 1. Folder layout

A **course** is a folder. A **lesson** is a sub-folder with exactly two files.

```text
courses/
  rust-basics/                 <- course folder (its name = course id)
    course.json                <- title, language, description
    01-hello-rust/             <- lesson folder (sorted by name, so number them)
      lesson.md                <- the learning material
      questions.json           <- the practice questions
    02-variables/
      lesson.md
      questions.json
    challenges/                <- optional: bigger coding problems (section 5d)
      01-fizzbuzz.json
    projects/                  <- optional: project ideas to build alone (section 5e)
      01-guessing-game.md
    guides/                    <- optional: cheat sheets, best practices, how-tos (section 5f)
      01-cheat-sheet.md
```

- Number lesson folders (`01-`, `02-`, ...) - the app shows them in that order. The folder names `challenges`, `projects` and `guides` are reserved (they are not lessons). A course may have only some of these parts: a course with just guides and project ideas (and no `language`) is fine.
- Use lowercase letters, digits and dashes in folder names.
- Courses are loaded from `<app>/courses/` and from `~/.clx/courses/`.
  Folders starting with `_` or `.` are ignored (handy for drafts).

---

## 2. `course.json`

```json
{
  "title": "Rust Basics",
  "language": "rust",
  "description": "From your first program to ownership, structs and enums"
}
```

| Field | Required | Meaning |
|---|---|---|
| `title` | yes | Name shown in the course list |
| `language` | no | Used for syntax colors and as the default language of code blocks. Built in: `rust`, `javascript` (`js`), `python` (`py`). Any other value works, just without colors. |
| `description` | no | One short line shown next to the title |
| `order` | no | A number. Courses are listed lowest first (default 1000, then alphabetical) |
| `editor` | no | Overrides for the code editor, see "Editor settings per language" below |

---

## 3. `lesson.md` (the learning material)

Plain Markdown. The first line must be `# Lesson Title` - that is the title in the lesson list.

**Pages:** a line containing only `---` starts a new page. The learner presses Enter to go to the next page. Aim for **2-4 pages**, each short enough to fit on one screen (about 15-25 lines).

Supported Markdown (anything else is shown as plain text):

| You write | Result |
|---|---|
| `# Title` / `## Section` | headings |
| `` `code` `` | inline code (colored) |
| `**bold**` and `*italic*` | emphasis |
| `- item` / `1. item` | bullet / numbered list |
| `> **Tip:** ...` | highlighted tip box |
| a fenced block with a language, e.g. rust | syntax-highlighted code box |
| a fenced block with `text` | plain box (shell commands, output) |

Do **not** use tables, images, links or nested lists - they don't render in a terminal.

Teaching style:

- One main idea per lesson, plus at most one or two small related ones.
- Show a tiny working example **before** explaining it.
- Explain every new keyword/symbol the example uses.
- Every concept that a question asks about must be explained in the lesson.
- Short sentences, friendly tone, no jargon without a definition.

---

## 4. `questions.json` (the practice)

A JSON **array** of question objects. Use **5-8 questions** per lesson, ordered from easy to harder.

There are four question types:

| `type` | What the learner does |
|---|---|
| `choice` | picks one answer from 2-5 options |
| `fill` | types the missing piece of a line of code (marked with `___`) |
| `fix` | is shown broken code and types the corrected line(s) |
| `write` | writes a small piece of code from a description |

Mix the types: roughly half `choice`, the rest `fill` / `fix` / `write`. Every lesson should end with at least one `write` or `fix` question.

### Fields shared by every type

| Field | Required | Meaning |
|---|---|---|
| `type` | yes | `choice`, `fill`, `fix` or `write` |
| `prompt` | yes | The question text (supports `` `code` ``, `**bold**`) |
| `code` | see below | A code snippet shown under the prompt |
| `explanation` | **strongly recommended** | Why the right answer is right. Shown after a correct answer, and also shown when a learner skips. |
| `hint` | optional | A nudge (shown on `:h`, and automatically after 2 wrong tries) |
| `run` | **recommended** for `fill`/`fix`/`write` | A test program that is compiled and run to grade the answer (section 5a) |
| `suggest` | optional | `fill`/`fix`/`write` only: extra words for the editor's autocomplete (see section 5b) |

### 4.1 `choice`

```json
{
  "type": "choice",
  "prompt": "What happens when you compile this code?",
  "code": "let x = 5;\nx = 6;",
  "options": [
    { "text": "Compile error: cannot assign twice to an immutable variable", "correct": true },
    { "text": "`x` becomes 6", "explain": "That would only work if `x` were declared with `mut`. Rust variables are immutable by default." },
    { "text": "`x` quietly stays 5", "explain": "Rust never silently ignores an assignment. The compiler stops you with an error instead." },
    { "text": "It compiles, then crashes at runtime", "explain": "This mistake is caught at compile time, so the program never starts." }
  ],
  "explanation": "Without `mut`, a variable can't be assigned a second time."
}
```

- 3-4 options is ideal (max 5). **Exactly one** option has `"correct": true`.
- **Every wrong option MUST have `explain`** - this is the core feature of the app. It is what the learner reads right after picking that option.
- The app **shuffles the options** every time, so don't write "all of the above" / "both A and B", and don't refer to options by letter. (Add `"shuffle": false` to the question to keep the written order.)
- `code` is optional.

### 4.2 `fill`

```json
{
  "type": "fill",
  "prompt": "Make `count` changeable by filling in the missing keyword.",
  "code": "let ___ count = 0;\ncount = count + 1;",
  "answer": "mut",
  "checks": [
    { "regex": "^(var|mutable)$", "not": true, "explain": "Rust has no `var` or `mutable` keyword here. The keyword is shorter: `mut`." }
  ],
  "run": {
    "template": "fn main() {\n    let {{code}} count = 0;\n    count = count + 1;\n    println!(\"{}\", count);\n}",
    "output": "1"
  },
  "hint": "It's the three-letter short form of \"mutable\".",
  "explanation": "`let mut name = value;` declares a variable that can be changed later."
}
```

- `code` is **required** and must contain `___` (three underscores) exactly where the answer goes.
- The learner types **only what replaces `___`** (one line).
- `answer` is a string or an array of strings when several answers are fine (`["f64", "f32"]`).

### 4.3 `fix`

```json
{
  "type": "fix",
  "prompt": "This code fails to compile because `score` can't be changed. Type the corrected **first** line.",
  "code": "let score = 10;\nscore = score + 5;",
  "answer": "let mut score = 10;",
  "run": {
    "template": "fn main() {\n    {{code}}\n    score = score + 5;\n    println!(\"{}\", score);\n}",
    "output": "15"
  },
  "solution": "let mut score = 10;",
  "hint": "The second line changes `score`, so the first line must allow that.",
  "explanation": "A variable that gets a new value later must be declared with `let mut`."
}
```

- `code` (the broken code) is **required**. `solution` is **required**.
- **Ask for one line (or a few) - never for the whole program.** Say exactly which line to retype in the prompt ("Type the corrected first line").
- The learner types their lines, then an empty line to finish.

### 4.4 `write`

```json
{
  "type": "write",
  "prompt": "Write a function `triple` that takes an `i32` called `n` and returns it multiplied by 3.",
  "checks": [
    { "regex": "fn\\s+triple\\s*\\(\\s*n\\s*:\\s*i32\\s*\\)\\s*->\\s*i32\\s*\\{", "explain": "The signature should be `fn triple(n: i32) -> i32 {`." },
    { "regex": "n\\s*\\*\\s*3|3\\s*\\*\\s*n", "explain": "The body should multiply `n` by 3, for example `n * 3`." }
  ],
  "run": {
    "template": "{{code}}\n\nfn main() {\n    println!(\"{} {} {}\", triple(4), triple(0), triple(-2));\n}",
    "output": "12 0 -6"
  },
  "solution": "fn triple(n: i32) -> i32 {\n    n * 3\n}",
  "hint": "Signature: `fn name(param: Type) -> Type`. The last expression has no semicolon.",
  "explanation": "The last expression, `n * 3`, becomes the return value."
}
```

- `solution` is **required**. `code` is optional (starter code to show).
- Grade with `checks` (see next section). Keep the task small: **1-5 lines of code**.

---

## 5. How answers are graded (`fill`, `fix`, `write`)

The app can't run the learner's code, so it compares the typed text. You describe what a correct answer looks like using `answer` and `checks`.

**An answer is correct when ALL of these are true:**

1. none of the `"not": true` checks match (known mistakes),
2. every normal check matches (required pieces),
3. it equals one of the `answer` values (only if `answer` is given).

### `answer`

Exact match, but **whitespace-insensitive**: `let mut x=5 ;` equals `let mut x = 5;`. Spaces around punctuation like `( ) { } ; , : = + - * / & ! . < >` don't matter. Use it for short, single-form answers.

### `checks`

A list of rules. Each rule has **one matcher** and an **`explain`**:

| Field | Meaning |
|---|---|
| `has` | text that must appear (whitespace-insensitive substring) |
| `regex` | a regular expression tested against the answer. Newlines are turned into single spaces first, so write the code on "one line" in your head, and use `\\s*` for optional spaces. |
| `flags` | optional regex flags, e.g. `"i"` for case-insensitive |
| `not` | if `true`, the rule is a **known mistake**: the answer is wrong when it matches |
| `explain` | **required.** What the learner sees when the rule fails (normal rule) or fires (`not` rule) |

How feedback is chosen: if any `not` rule fires, only those explanations are shown (they are the most specific). Otherwise the `explain` of each failed normal rule is shown. If there are neither (e.g. only `answer` was wrong), the question's `explanation` is shown.

### Writing good checks

- **Anticipate real mistakes** and add a `not` check for each: forgotten semicolon, wrong keyword from another language (`elif`, `function`, `++`), wrong order, `;` where a `,` belongs, etc. Their `explain` should say what is wrong *and* what to do instead.
- For `write` questions, prefer several small normal checks over one giant regex. Each failing check tells the learner exactly which piece is missing.
- Accept **all reasonable correct answers** (`i += 1;` and `i = i + 1;`, `1..=5` and `1..6`, `f32` and `f64`). Wrongly rejecting a right answer is the worst thing that can happen.
- Don't require the learner to use the same variable names as your solution unless the prompt names them. Say names explicitly in the prompt ("a variable called `lives`").
- Regex in JSON needs **double backslashes**: `\s` -> `"\\s"`, `\(` -> `"\\("`, `\.` -> `"\\."`.

### `solution`

What a correct learner would type, written exactly as they would type it. It is shown when a learner skips, **and the validator automatically grades it** to prove your checks accept it. If `validate` says "self-test failed", your checks and solution disagree - fix one of them.

---

## 5a. Smart grading: run the learner's code (`run`)

Comparing text is fragile: `i += 1;`, `i = i + 1;` and `i = 1 + i;` all do the same thing, and `n + n + n` is as good as `n * 3`. So when a question has a **`run`** block, the app puts the learner's code into your test program, compiles and runs it, and compares the **output**. Any solution that behaves correctly passes - however it is written.

```json
"run": {
  "template": "{{code}}\n\nfn main() {\n    println!(\"{} {} {}\", triple(4), triple(0), triple(-2));\n}",
  "output": "12 0 -6"
}
```

| Field | Meaning |
|---|---|
| `template` | A **complete program** in the course language. `{{code}}` is replaced by exactly what the learner typed. |
| `output` | What the program must print. Trailing spaces and blank lines at the end are ignored. Omit it to only require "compiles and runs without crashing" (useful when the learner may print anything). |
| `exact` | `true` = also compare trailing newlines exactly. Only needed when the difference is the point (e.g. `print!` vs `println!`). |

How to write a good `run`:

- **`fill`**: put `{{code}}` where the blank is: `let {{code}} count = 0;`.
- **`fix` / `write`**: the learner types only the lines the prompt asks for, so build the rest of the program around `{{code}}` (`fn main() {\n    {{code}}\n    println!(...);\n}`). For function tasks, call the function from `main` with **several inputs**, including edge cases like `0` and negatives, so a hard-coded answer can't pass.
- **Print what you want to check**, so the output proves the behavior: print the variable that was changed, the returned value, the loop's numbers.
- Output must be **deterministic**: no randomness, time, input from the user, or hash-map order.
- Keep the program **small and fast** (it is compiled each time the learner submits). Endless loops are stopped after a few seconds.
- If the learner's code doesn't compile, the app shows the **compiler's own message**; if the output differs, it shows expected vs. actual. Your `not` checks still add their specific explanations on top.

**When to keep a text rule on top of `run`:** if the lesson is about *how* something is written ("use a `for` loop", "use an array, not a `Vec`"), add `"enforce": true` to that check. Normal checks are ignored when the code runs correctly; `enforce` checks must still pass.

```json
{ "regex": "\\bfor\\b", "enforce": true, "explain": "The task asks for a `for` loop." }
```

Run mode needs the language's tools on the learner's computer: `rustc` (Rust), `node` (JavaScript), `python3` (Python). Without them the app says so once and falls back to `answer`/`checks`, so **keep writing good `checks` too** - they also give the specific "why is this wrong" explanations. The validator (`validate`) compiles and runs every `solution` against its `run` block, so wrong expected outputs are caught before learners see them.

> Running code executes it on the learner's computer. Only use courses you trust, like any program you download.

---

## 5b. Autocomplete in the code editor (`suggest`)

While typing code, the learner sees a grey "ghost" completion and presses **Tab** to accept it - like an IDE. For example, in the question *"print `Rust is fun`"*, typing `R` inside the quotes of `println!("` shows `ust is fun` as ghost text.

What gets suggested, with **no extra work from you**: every piece of `` `inline code` `` in the question's `prompt`. So write the names/values the learner must type as inline code:

> Write a function `triple` that takes an `i32` called `n` ... prints `Rust is fun`

-> offers `triple`, `i32`, `n`, `Rust is fun`.

Rules the editor applies:

- A suggestion containing a **space** (a phrase such as `Rust is fun`) is only offered **inside a string literal** (between quotes).
- Single words (`triple`, `println!`) are offered while the learner types a word that starts the same way.
- Matching ignores upper/lower case.

Use `"suggest"` to add more entries that are *not* in the prompt:

```json
{ "type": "write", "prompt": "Print a greeting.", "suggest": ["println!", "Hello, world!"], "...": "..." }
```

Don't put the full answer into `suggest` for questions that are meant to be hard - the suggestion shows up as soon as the learner types the first letters.

---

## 5c. Editor settings per language

The code box closes brackets and quotes for the learner (`(` becomes `()`), keeps indentation on Enter, expands `{` + Enter into a block, and lets `)`, `}` and `"` be typed over. Defaults per language live in `src/languages.js`.

A course can override them in `course.json`:

```json
{
  "title": "Python Basics",
  "language": "python",
  "editor": {
    "pairs": { "(": ")", "[": "]", "\"": "\"" },
    "quotes": ["\"", "'"],
    "indent": "    ",
    "indentAfter": "([:",
    "dedent": ")]"
  }
}
```

| Setting | Meaning |
|---|---|
| `pairs` | typing the key inserts both characters. `{}` turns auto-closing off. |
| `quotes` | characters that start/end a string (so the editor knows when you are "inside a string") |
| `indent` | one level of indentation |
| `indentAfter` | pressing Enter after one of these characters indents the next line |
| `dedent` | typing one of these on an indent-only line moves it one level back |

Learners can change the same settings for themselves in `~/.clx/config.json` (see the README); their settings win over the course's.

---

## 5d. Challenges (`challenges/*.json`)

Lessons teach; **challenges** make the learner solve a bigger problem alone. One JSON file per challenge in `<course>/challenges/`, numbered (`01-even-or-odd.json`) - the app lists them in that order with their difficulty. A challenge is graded **only by running the code**, so it needs the language's tools on the learner's computer (the app says so if they are missing).

```json
{
  "title": "FizzBuzz",
  "difficulty": "easy",
  "prompt": "Write `fizzbuzz(n: u32) -> String`:\n\n- a multiple of 3 **and** 5 -> `FizzBuzz`\n- a multiple of 3 -> `Fizz`\n- a multiple of 5 -> `Buzz`\n- anything else -> the number as text\n\n```text\nfizzbuzz(3)  -> Fizz\nfizzbuzz(7)  -> 7\n```",
  "starter": "fn fizzbuzz(n: u32) -> String {\n    $0\n}",
  "run": {
    "template": "{{code}}\n\nfn main() {\n    for n in [1, 3, 5, 15, 7] {\n        println!(\"{}\", fizzbuzz(n));\n    }\n}",
    "output": "1\nFizz\nBuzz\nFizzBuzz\n7"
  },
  "hints": [
    "`n % 3 == 0` is true when `n` is a multiple of 3.",
    "Check the \"both\" case first.",
    "Chain `if ... else if ... else`. `n.to_string()` turns a number into text."
  ],
  "solution": "fn fizzbuzz(n: u32) -> String {\n    if n % 15 == 0 {\n        String::from(\"FizzBuzz\")\n    } else if n % 3 == 0 {\n        String::from(\"Fizz\")\n    } else if n % 5 == 0 {\n        String::from(\"Buzz\")\n    } else {\n        n.to_string()\n    }\n}",
  "explanation": "The order of the branches matters: the most specific case has to come first."
}
```

| Field | Required | Meaning |
|---|---|---|
| `title` | yes | Name in the challenge list |
| `difficulty` | yes | `easy`, `medium` or `hard` |
| `prompt` | yes | The task, written in the lesson Markdown subset. Always include 2-3 example calls with their results in a `text` block. |
| `starter` | recommended | Code pre-filled in the editor: the function signature (or struct skeleton) with an empty body. Write `$0` where the cursor should start. |
| `run` | **yes** | `template` + `output`, exactly as in section 5a. The learner's whole editor content replaces `{{code}}`. |
| `hints` | recommended | 2-3 hints, **from gentle to specific**. The learner reveals them one at a time. Hint 1 names the tool/idea, the last one nearly gives the approach (never the full code). |
| `solution` | **yes** | A complete working solution (shown when the learner gives up or after solving). It is compiled and checked by `validate`. |
| `explanation` | recommended | Why the solution works, or a common trap. |
| `checks`, `answer`, `suggest` | optional | Same meaning as in questions. `checks` with `not` add specific "you made this mistake" explanations on top of the test results. |

Writing good challenges:

- **Test thoroughly.** The template's `main` should call the learner's function with 5-10 inputs: typical values **and** edge cases (`0`, empty text, negatives, the largest case). Print one result per line.
- Ask for **a function with a fixed signature**, so the template can call it. Put the signature in the `starter` and in the prompt.
- **Difficulty ladder:** `easy` = one concept from the lessons (a loop or an `if`), `medium` = combines two or uses one small new tool (hinted), `hard` = needs a plan (a loop with state, several branches). Aim for about 3 easy, 4 medium, 1-2 hard per course, ordered easy to hard.
- Only require what the lessons taught, plus at most one new method that the **hints** introduce.
- Avoid inputs that would make a wrong solution loop forever or take long - keep tests small.
- The prompt must make the exact output format unambiguous (spelling, capitalisation).

---

## 5e. Project ideas (`projects/*.md`)

Things to build **alone** once the learner knows the basics: no grading, no tests. One Markdown file per idea in `<course>/projects/`, numbered (`01-guessing-game.md`). It starts with a front matter block:

```text
---
title: Guessing Game
difficulty: easy
time: 1-2 hours
skills: loops, if/else, parse, reading input
---
# Guessing Game

## What you'll build
...
```

| Front matter | Required | Meaning |
|---|---|---|
| `title` | yes | Name in the list |
| `difficulty` | yes | `easy`, `medium` or `hard` |
| `time` | recommended | A rough estimate: `about 1 hour`, `3-5 hours` |
| `skills` | recommended | Comma-separated concepts the project practices |

The body uses the same Markdown subset as lessons, and a line with only `---` starts a new page. Use this structure:

1. **`## What you'll build`** - 1-2 sentences plus an example session in a `text` block showing exactly how the finished program behaves.
2. **`## Requirements`** - 4-6 bullets, concrete and checkable.
3. *(page break `---`)*
4. **`## Steps`** - a numbered plan that grows the project in small steps (get one thing working, then the next). Include **short code snippets** for the parts that are new or awkward (reading input, parsing, sorting) but **never the full solution**.
5. **`## Stretch goals`** - 3-4 optional extensions, getting harder.

Rules: only use what the course taught, and when a project needs one new thing (like `HashMap` or reading a file) say so and show how. Every code snippet must **compile**. Order the files easy -> hard and aim for 5-8 ideas per course covering different lessons.

---

## 5f. Guides (`guides/*.md`)

Reference reading the learner can come back to any time: a cheat sheet, best practices, a debugging method, "how to read error messages". One Markdown file per guide in `<course>/guides/`, numbered (`01-cheat-sheet.md`). Same front matter idea as project ideas:

```text
---
title: Python cheat sheet
summary: Quick reference for syntax you will use every day
---
## Variables
...
```

| Front matter | Required | Meaning |
|---|---|---|
| `title` | yes | Name in the list |
| `summary` | recommended | One short line shown next to the title |

The body uses the lesson Markdown subset; a line with only `---` starts a new page (keep pages to one screen, about 20-25 lines). Good guides:

- **Cheat sheet:** the syntax a beginner needs, grouped (variables, strings, control flow, collections, functions, errors, files), as short code blocks with the result in a comment. Every example must be correct.
- **Best practices:** a short "Do this" list, a "Watch out for" list of the classic traps (with the *why*), and a few habits (tools, testing, reading errors).
- Prefer concrete code over long explanations. No tables with more than 3 columns.

Course-independent guides (learning habits, planning projects, Git, debugging) live in the `programming-skills` course, which has no `language`.

---

## 6. Writing great questions

**Wrong-answer explanations are the product.** For each wrong option or `not` check:

- Address the *specific misconception* that makes that answer tempting.
  Bad: "Wrong." / "That is incorrect." / "No."
  Good: "`char` holds a single character such as `'A'`, not a number to calculate with."
- Say what the thing actually *does* or *means*, so the explanation teaches something.
- Never make the learner feel dumb. No "obviously", "simply", "just".
- 1-2 sentences. Use `code` formatting for code.

**Good distractors** are plausible: things learners really confuse (syntax from other languages, off-by-one, neighbouring concepts). Avoid jokes and obviously absurd options.

**Variety and difficulty.** Start with recognition (`choice`), move to completion (`fill`), then to producing code (`fix`, `write`). Test *understanding* ("what does this print?", "why does this fail?") and not just memorized names.

**Fairness.** Everything asked must have been taught in this lesson or an earlier one. Code samples must be **correct and compile/run** in the real language (check outputs carefully!).

**Length.** Prompts: 1-2 sentences. Code in `code`: under ~10 lines. Options: under ~100 characters.

---

## 7. Checklist before you answer

- [ ] Each lesson folder has `lesson.md` (starting with `# Title`) **and** `questions.json`
- [ ] 2-4 pages, separated by `---` lines
- [ ] 5-8 questions, mixed types, easy -> hard, at least one `fix`/`write`
- [ ] `choice`: exactly one `correct`, **every wrong option has an `explain`**
- [ ] `fill`: `code` contains `___`; `answer` given
- [ ] `fix`/`write`: `solution` present; `checks` (or `answer`) accept every reasonable correct answer and catch likely mistakes with `not` checks
- [ ] Every `fill`/`fix`/`write` question has a `run` block with a complete program, a deterministic `output`, and (for functions) several test inputs
- [ ] Every question has an `explanation`
- [ ] Anything the learner must type exactly (names, text) is written as `` `inline code` `` in the prompt, so autocomplete can offer it
- [ ] JSON is valid: no comments, no trailing commas, backslashes doubled
- [ ] All code samples are correct
- [ ] Nothing is asked that the lessons haven't taught
- [ ] Challenges: signature in `starter` (with `$0`), tests with edge cases, 2-3 progressive hints, a `solution` that passes
- [ ] Project ideas: front matter present, example session, steps with compilable snippets, no full solution

Then the human runs:

```text
node bin/clx.js validate
```

and pastes any errors back to the AI to fix. The validator checks the structure, compiles every regex, and grades each `solution` against its own checks.

---

## 7b. Languages that can run code, and their templates

`run` blocks work for every language with a runner (`src/runner.js`). Each needs its tools on the learner's computer.

| `language` | Needs | Template conventions |
|---|---|---|
| `rust` | `rustc` | A complete program with `fn main()` |
| `javascript` | `node` | Plain script, print with `console.log` |
| `python` | `python3` | Plain script. Learner code is placed at the left margin, so use top-level statements |
| `c` | `gcc` | `#include <stdio.h>` etc., `int main(void)`. Compiled with `-std=c11` |
| `cpp` | `g++` | `#include <iostream>`, `using namespace std;` if you like. Compiled with `-std=c++17` |
| `go` | `go` | `package main`, import only what the program uses, but add `var _ = fmt.Sprint` so an import that the learner's code does not use is not an error |
| `java` | `javac` + `java` | One file with `public class Main` and `public static void main`. Put extra classes **before** it (not `public`). Imports go at the very top |

Tips that apply to all of them:

- Print booleans in a form that is identical across languages, or print `true`/`false` yourself.
- Keep every expected output exact, including capitalisation and spacing. The validator runs your `solution` and shows the real output when it differs.
- Put whatever the learner should **not** have to write (imports, `main`, test calls) in the `template`.

## 8. Copy-paste prompt templates

**New lesson in an existing course**

```text
Using the attached Code Learn AI Authoring Guide, write lesson <NUMBER> for the course
"<COURSE TITLE>" (folder: courses/<course-id>/).

Topic: <TOPIC>
The learner already knows: <PREVIOUS LESSONS>
Must cover: <KEY IDEAS>
Questions: <N> (mix of choice, fill, fix and write)

Output lesson.md and questions.json as separate code blocks with the file path above each.
```

**Brand-new course**

```text
Using the attached Code Learn AI Authoring Guide, create a new course "<TITLE>" for
<language> beginners with <N> lessons: <LIST OF LESSON TOPICS>.

Output course.json plus lesson.md and questions.json for each lesson, as separate
code blocks with the file path above each. Continue in several messages if needed.
```

**New course for another language**

```text
Using the attached Code Learn AI Authoring Guide, create a course "<LANGUAGE> Basics"
(folder courses/<language>-basics/, "language": "<language>") with 5 lessons (hello and
variables, control flow, functions, collections, classes or structs), 5 challenges
(FizzBuzz, factorial, palindrome, Fibonacci, count vowels), 3 project ideas and 2 guides
(cheat sheet, best practices). Every code question needs a "run" block. Output every file
as a separate code block with its path above it.
```

**New guide**

```text
Using the attached Code Learn AI Authoring Guide, write a guide "<TITLE>" for the course
"<COURSE TITLE>" (folder: courses/<course-id>/guides/). Output it as one .md file with
front matter (title, summary), path above the code block.
```

**New challenge**

```text
Using the attached Code Learn AI Authoring Guide, write <N> challenges for the course
"<COURSE TITLE>" (folder: courses/<course-id>/challenges/). Difficulty: <easy/medium/hard>.
Topic ideas: <TOPICS>. The learner has finished lessons: <LESSONS>.
Output each as its own JSON file with the path above the code block.
```

**New project ideas**

```text
Using the attached Code Learn AI Authoring Guide, write <N> project ideas for the course
"<COURSE TITLE>" (folder: courses/<course-id>/projects/), easy to hard. The learner knows:
<LESSONS>. Output each as a .md file with front matter, path above each code block.
```

**Review an existing lesson**

```text
Using the attached Code Learn AI Authoring Guide, review this lesson. Check that every
wrong answer is explained specifically, that the checks accept all valid answers, and
that every code sample is correct. Output the corrected files.
```

---

## 9. Reference: a complete tiny lesson

`courses/rust-basics/00-example/lesson.md`

````text
# Printing Numbers

You can print a number by putting `{}` in the text:

```rust
let n = 7;
println!("n is {}", n);
```

---

## More than one value

Each `{}` takes the next value:

```rust
println!("{} + {} = {}", 1, 2, 3);
```

> **Tip:** `{}` works for numbers, text and more.
````

`courses/rust-basics/00-example/questions.json`

```json
[
  {
    "type": "choice",
    "prompt": "What does this print?",
    "code": "println!(\"{} + {}\", 1, 2);",
    "options": [
      { "text": "1 + 2", "correct": true },
      { "text": "3", "explain": "`{}` only inserts the values; it doesn't calculate anything. The `+` here is just text." },
      { "text": "`{} + {}`", "explain": "`{}` is a placeholder, so it is replaced by the values 1 and 2 instead of being printed literally." }
    ],
    "explanation": "Each `{}` is replaced by the next value, in order."
  },
  {
    "type": "fill",
    "prompt": "Fill in the placeholder so the program prints the value of `n`.",
    "code": "println!(\"n is ___\", n);",
    "answer": "{}",
    "run": {
      "template": "fn main() {\n    let n = 7;\n    println!(\"n is {{code}}\", n);\n}",
      "output": "n is 7"
    },
    "hint": "It's a pair of curly braces.",
    "explanation": "`{}` marks where a value goes."
  },
  {
    "type": "write",
    "prompt": "Write one `println!` that prints `Total: 10` using the value 10 as an argument (not typed inside the quotes).",
    "checks": [
      { "regex": "println!\\(\\s*\"Total: \\{\\}\"\\s*,\\s*10\\s*\\)\\s*;", "explain": "Use `println!(\"Total: {}\", 10);` - a `{}` in the text and the value after a comma." }
    ],
    "run": {
      "template": "fn main() {\n    {{code}}\n}",
      "output": "Total: 10"
    },
    "solution": "println!(\"Total: {}\", 10);",
    "explanation": "The `{}` is replaced by the argument that follows the text."
  }
]
```

---

## 10. Adding syntax colors for a new language (optional, one-time)

Open `src/ui.js`, find the `LANGS` object and add an entry:

```js
go: {
  comment: '//',
  keywords: 'break case chan const continue default defer else for func go if import interface map package range return select struct switch type var',
  types: 'bool byte int int64 float64 string error nil true false',
},
```

Add the editor behavior in the same entry (optional):

```js
  editor: { pairs: { '(': ')', '[': ']', '{': '}', '"': '"', '`': '`' }, quotes: ['"', '`'], indent: '\t' },
```

Then use `"language": "go"` in that course's `course.json`. Nothing else needs to change.

---

## 11. Adding a new language (code change, once)

To let courses in a new language run code, add the language in two places (about 15 lines in total):

1. `src/languages.js`: syntax colors and editor behavior (see section 10), plus an alias if needed (`py` -> `python`).
2. `src/runner.js`, the `RUNNERS` table: how to detect the tool and how to compile/run:

```js
ruby: {
  name: 'Ruby',
  install: 'https://www.ruby-lang.org',
  ext: '.rb',
  tool: ['ruby', ['--version']],
  exec: ({ src }) => ['ruby', [src]],
},
```

Compiled languages also give a `compile: ({ src, out, dir }) => [command, args]` and `exe: true`; when the language needs a fixed file name (like Java's `Main.java`) add `file: 'Main.java'`. Then optionally add a branch in `summarizeError` to pull a readable one-line message out of the tool's error output. Courses for that language can use `run` blocks right away, and `clx validate` will test them.
