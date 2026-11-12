---
title: Git in 10 minutes
summary: Save your work, undo mistakes and share code
---
## What Git does

Git records snapshots (**commits**) of your project, so you can go back, compare versions and work on features without breaking what already works. GitHub, GitLab and Codeberg are websites that host Git projects.

## The everyday cycle

```text
git init                      # start tracking this folder (once)
git status                    # what changed?
git add main.py               # choose what goes into the next snapshot
git add .                     # ...or everything
git commit -m "Add quiz scoring"   # save the snapshot
git log --oneline             # history
```

---

## Good commits

- Commit **small, working** steps, often
- Write messages in the imperative: `Add habit streak calculation`, `Fix off-by-one in loop`
- Do not commit secrets (passwords, API keys) or generated files. List files to ignore in a **`.gitignore`**:

```text
node_modules/
__pycache__/
target/
*.exe
.env
```

## Branches

A branch is a safe place to try something:

```text
git switch -c add-sound       # create and switch to a new branch
# ...work and commit...
git switch main
git merge add-sound           # bring the work into main
```

## Undo

```text
git diff                      # see unsaved changes
git restore main.py           # throw away unsaved changes in a file
git revert <commit>           # make a new commit that undoes an old one
git stash                     # put changes aside temporarily
```

## Sharing

```text
git remote add origin <url>   # connect to GitHub (once)
git push -u origin main       # upload
git pull                      # download new changes
git clone <url>               # copy a project
```

> **Tip:** If you are scared of breaking things, commit first. As long as it is committed, you can get it back.
