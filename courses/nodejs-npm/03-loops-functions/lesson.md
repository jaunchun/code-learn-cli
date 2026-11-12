# Dependencies and Scripts

A team wants a `lint` command and a third-party library. npm scripts make common project tasks easy to repeat.

```text
{
  "scripts": { "start": "node src/index.js" },
  "dependencies": { "kleur": "^4.1.5" }
}
```

---

## Understand the idea

Dependencies are packages the application needs at runtime. Development dependencies are tools used during development, such as test runners and linters.

---

## Apply it in a real project

Use `npm install package` for a runtime dependency and `npm install -D package` for a development dependency. Review package scripts before running unfamiliar projects.

> **Tip:** Read the example, predict what it does, then try changing one value or instruction.
