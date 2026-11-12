---
title: Writing clean code
summary: Code is read far more often than it is written
---
## Names

Good names remove the need for comments.

```text
bad:   d = 7 * x
good:  weekly_total = DAYS_PER_WEEK * daily_total
```

- Variables are nouns (`user_count`), functions are verbs (`calculate_total`), booleans read like questions (`is_valid`, `has_items`)
- Avoid abbreviations nobody will understand
- Use the naming style of your language (`snake_case`, `camelCase`, `PascalCase`)

---

## Functions

- One function, **one job**. If you need "and" to describe it, split it
- Keep functions short enough to read at a glance
- Prefer few parameters (three or fewer)
- **Return early** to avoid deep nesting:

```text
bad:    if user exists:
            if user is active:
                if has permission:
                    do the work
good:   if user does not exist: return
        if user is not active: return
        if no permission: return
        do the work
```

## Do not repeat yourself (DRY)

If you copy and paste a block, put it in a function. Fix bugs in one place, not five. (But do not over-abstract: three similar lines are better than a confusing helper.)

## Comments

- Explain **why**, not what. The code already says what
- Delete commented-out code (that is what Git is for)
- Keep comments true: an outdated comment is worse than none

## No magic numbers

```text
bad:   if age >= 18
good:  ADULT_AGE = 18
       if age >= ADULT_AGE
```

---

## Habits of tidy programmers

- Format the code consistently (use your language's formatter)
- Handle errors on purpose; never swallow them silently
- Test small pieces as you go. A few quick checks with known answers catch most mistakes
- Refactor in small steps, running the program after each one
- Leave the code a little cleaner than you found it
