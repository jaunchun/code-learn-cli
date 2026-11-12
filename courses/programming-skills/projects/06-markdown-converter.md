---
title: Markdown to HTML Converter
difficulty: hard
time: about 6-8 hours
skills: string processing, parsing, state, tests
---
## What you'll build

A converter from a small subset of Markdown to HTML.

```text
# Hello          ->   <h1>Hello</h1>
Some **bold**    ->   <p>Some <strong>bold</strong></p>
- one            ->   <ul>
- two                   <li>one</li>
                        <li>two</li>
                      </ul>
```

## Requirements

- Headings (`#`, `##`, `###`), paragraphs, bullet lists
- Inline `**bold**`, `*italic*` and `` `code` ``
- Read a `.md` file and write a `.html` file
- Escape `<`, `>` and `&` in the text
- At least 10 test cases with expected output

---

## Steps

1. Work **line by line**. Decide what each line is: heading, list item, blank, or paragraph text.
2. Keep a little **state**: "am I inside a list right now?" so you know when to open and close `<ul>`.
3. Handle inline formatting as a second pass on the text of each block. Start with replacing `**x**` using a simple search, then think about nesting.
4. Write the tests as a list of `(input, expected_output)` pairs and run them all after every change. This project is where tests really pay off.
5. Finish with the file reading and writing.

## Stretch goals

- Numbered lists, links `[text](url)` and images
- Fenced code blocks
- Block quotes and horizontal rules
- A command-line flag for a full HTML page with a stylesheet
