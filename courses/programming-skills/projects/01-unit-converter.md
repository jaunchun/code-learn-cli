---
title: Unit Converter
difficulty: easy
time: about 1-2 hours
skills: functions, conditions, input/output, number formatting
---
## What you'll build

A program that converts between units of length, weight and temperature.

```text
Convert: 5 km to miles
5 km = 3.11 miles
Convert: 100 c to f
100 c = 212.00 f
```

## Requirements

- Support at least three categories (length, weight, temperature) with two or three units each
- Read input in the form `<number> <unit> to <unit>`
- One function per conversion, or one table of conversion factors
- Show a clear message for unknown units or bad numbers (no crashing)
- Print results with 2 decimal places

---

## Steps

1. Start with **one** conversion hard-coded (km to miles) and print the answer.
2. Turn it into a function and test it with a few known values.
3. Parse the input line: split it into words, convert the first to a number.
4. Add a way to look up the right conversion:

```text
factor table:  km -> m: 1000,  mile -> m: 1609.344
convert(value, from, to) = value * factor[from] / factor[to]
```

(Temperature does not work with a single factor: it needs its own formulas, so give it its own function.)

5. Validate the input and handle errors.

## Stretch goals

- Loop until the user types `quit`
- Add currency with rates you type in
- Support combined units like `km/h` to `m/s`
- Show the answer for *all* units at once
