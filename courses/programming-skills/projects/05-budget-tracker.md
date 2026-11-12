---
title: Budget Tracker
difficulty: medium
time: about 4 hours
skills: data modelling, files, grouping and totals, formatting
---
## What you'll build

A program that records income and expenses and reports where the money goes.

```text
> add expense 12.50 food lunch
> add income 1000 salary
> report
Income    1000.00
Expenses    12.50
  food      12.50
Balance    987.50
```

## Requirements

- Each entry has a type (income/expense), amount, category, note and date
- Commands to add, list, delete and report
- The report shows totals per category and the balance
- Data is saved between runs
- Reject non-positive amounts and unknown commands politely

---

## Steps

1. Model one entry as a record/struct/object. Keep all entries in a list.
2. Write the report logic first with hard-coded sample data: loop over entries, add to a total per category.
3. Money tip: store amounts as **whole cents** (integers) to avoid rounding errors like `0.1 + 0.2`. Convert to dollars only when printing.
4. Add file storage (JSON or CSV).
5. Add filtering: by month, by category.

## Stretch goals

- Monthly budgets per category with a warning when you go over
- Export the report to CSV
- A simple text bar chart per category
- Recurring entries (rent on the 1st of each month)
