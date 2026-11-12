---
title: Quiz Game
difficulty: easy
time: about 2 hours
skills: lists, dictionaries, loops, input, scoring
---
## What you'll build

A multiple-choice quiz that keeps score.

```text
Q1: What is the capital of France?
  1) Berlin  2) Paris  3) Rome
Your answer: 2
Correct!
...
You scored 4 out of 5
```

## Requirements

- Store the questions as a list of dictionaries
- Ask each question, accept 1-3, and say if the answer is right
- Show the final score
- Ignore invalid input (ask again)

---

## Steps

1. Model one question as a dictionary, and keep all of them in a list:

```python
questions = [
    {"text": "What is the capital of France?",
     "options": ["Berlin", "Paris", "Rome"],
     "answer": 2},
    # more questions...
]
```

2. Loop with `for number, q in enumerate(questions, start=1):`.
3. Print the options with a second loop and read the answer with `input`.
4. Validate with a `while True:` loop that only breaks on a valid number.
5. Count the correct answers in a variable.

## Stretch goals

- Shuffle the questions with `random.shuffle`
- Load the questions from a JSON file
- Add a timer for each question (`time.time()`)
- Keep a high score table in a file
