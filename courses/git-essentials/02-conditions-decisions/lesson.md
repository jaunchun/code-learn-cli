# Branches and Merging

You need to add a feature without disrupting the stable version of a project. Branches let you work independently.

```text
git switch -c feature/search
git add .
git commit -m "Add search"
git switch main
git merge feature/search
```

---

## Understand the idea

A branch is a movable name pointing to a commit. `git switch -c` creates and switches to a branch. `git merge` integrates another branch into the current branch.

---

## Apply it in a real project

A merge conflict happens when Git cannot automatically combine changes. Resolve the affected files, inspect the result, then stage and complete the merge.

> **Tip:** Read the example, predict what it does, then try changing one value or instruction.
