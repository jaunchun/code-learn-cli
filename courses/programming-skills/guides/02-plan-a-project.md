---
title: How to plan a project
summary: From idea to finished program without getting lost
---
## 1. Write the goal in one sentence

"A command-line program that tracks my daily habits and shows my streaks."

If you cannot say it in one sentence, the project is too big or too vague.

## 2. Define the MVP

The **minimum viable product** is the smallest version that is still useful. List what it must do, and *only* that:

- add a habit
- mark it done today
- list habits with their streak

Everything else goes on a "later" list: colors, saving to a cloud, reminders. This is how you fight **scope creep**.

## 3. Break it into small tasks

Each task should take under an hour and produce something you can run:

1. Print a hard-coded list of habits
2. Add a habit from keyboard input
3. Mark a habit done
4. Calculate a streak
5. Save and load from a file

---

## 4. Build one thin slice from end to end

Get the simplest version working first, even if it is ugly. A program that runs and does 20% of the job is a solid base. Then add features one at a time, running the code after every small change.

## 5. Commit often

Use Git (see the Git guide). A commit after every working step means you can always go back.

## 6. Know when you are done

Write a **definition of done** before you start: "I can add, complete and list habits, the data survives restarting, and I have tried three bad inputs without crashing."

## 7. Finish, then improve

1. Make it work
2. Make it right (clean up, handle errors)
3. Make it nice (extra features, polish)

> Do not skip to step 3. A working ugly program teaches you more than a beautiful unfinished one.

## Project checklist

- [ ] One-sentence goal
- [ ] MVP list and a "later" list
- [ ] Tasks of under an hour each
- [ ] Tried at least three kinds of bad input
- [ ] A short README: what it does and how to run it
- [ ] Code in Git with meaningful commit messages
