# npm and package.json

A CLI project needs a repeatable way to record its name, version and scripts. npm manages JavaScript packages and project metadata.

```text
npm init -y
npm install
npm run
```

---

## Understand the idea

`npm init` creates a package.json file. The `-y` option accepts defaults. package.json records metadata, scripts and dependency declarations.

---

## Apply it in a real project

`npm install package-name` installs a dependency and records it in package.json. `npm run name` executes a custom script defined under `scripts`.

> **Tip:** Read the example, predict what it does, then try changing one value or instruction.
