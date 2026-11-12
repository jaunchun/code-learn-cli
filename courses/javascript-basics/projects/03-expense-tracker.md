---
title: Expense Tracker
difficulty: medium
time: about 3-4 hours
skills: objects, array methods (map/filter/reduce), JSON, files
---
## What you'll build

A tool that records expenses and shows totals per category.

```text
> add 12.50 food lunch
> add 40 transport train ticket
> add 8 food coffee
> summary
food       20.50
transport  40.00
total      60.50
```

## Requirements

- An expense is an object: `{ amount, category, note }`
- Save all expenses to a JSON file so they are still there next time
- `summary` shows the total per category and the grand total
- Reject amounts that are not positive numbers

---

## Steps

1. Load and save with the `fs` module:

```javascript
const fs = require("fs");
const FILE = "expenses.json";

function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}
function save(expenses) {
  fs.writeFileSync(FILE, JSON.stringify(expenses, null, 2));
}
```

2. Total of everything: `expenses.reduce((sum, e) => sum + e.amount, 0)`.
3. Totals per category: loop and add to an object:

```javascript
const totals = {};
for (const e of expenses) {
  totals[e.category] = (totals[e.category] || 0) + e.amount;
}
```

4. Print with `toFixed(2)` so money always has two decimals.

## Stretch goals

- Filter by month using a `date` field
- Add `delete <id>`
- Export the summary as CSV
- Show a bar chart with `"#".repeat(Math.round(amount / 5))`
