---
title: Habit Tracker
difficulty: medium
time: about 3-4 hours
skills: data structures, dates, files, functions
---
## What you'll build

A command-line tracker for daily habits with streaks.

```text
> add Drink water
> add Read 20 minutes
> done 1
> list
1. Drink water       streak: 3 days  (done today)
2. Read 20 minutes   streak: 0 days
```

## Requirements

- Add, list, complete and delete habits
- Remember on which dates each habit was completed
- Calculate the **current streak**: consecutive days up to today (or yesterday)
- Save to a file so the data survives restarting
- Refuse to mark the same habit done twice on the same day

---

## Steps

1. Choose a data structure: a list of habits, where each habit has a name and a list/set of completed dates.
2. Write the functions first (`add_habit`, `complete`, `streak`) and test them with fixed dates before you add any input handling.
3. The streak algorithm:

```text
streak = 0
day = today (or yesterday, if today is not done yet)
while day is in the habit's completed dates:
    streak = streak + 1
    day = day - 1 day
```

4. Save the data in a simple format (JSON is ideal) and load it at start.
5. Add the command loop last.

## Stretch goals

- Show the longest streak ever
- Print a calendar view of the last 14 days with checkmarks
- Weekly goals ("3 times a week")
- Reminders: list which habits are not done today
