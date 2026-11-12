# Remotes and Collaboration

Your team hosts a repository online. A remote lets your local repository exchange commits with another repository.

```text
git remote add origin https://example.com/team/app.git
git push -u origin main
git pull
```

---

## Understand the idea

`git remote` manages remote repository names and URLs. `git push` sends local commits to a remote. `git pull` fetches and integrates remote changes.

---

## Apply it in a real project

`git clone` creates a local copy of an existing repository. Before pushing shared work, fetch or pull changes so your branch can integrate teammates' commits.

> **Tip:** Read the example, predict what it does, then try changing one value or instruction.
