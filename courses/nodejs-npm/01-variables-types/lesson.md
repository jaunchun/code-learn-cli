# Running JavaScript with Node.js

You want to build a local command-line utility that runs without a browser. Node.js executes JavaScript outside the browser.

```text
console.log("CLX helper started");
```

---

## Understand the idea

Save JavaScript in a `.js` file and run it with `node filename.js`. Node.js provides runtime APIs such as `process`, `path` and `fs`.

---

## Apply it in a real project

The `process.argv` array contains command-line arguments. The first entries identify the Node executable and script path; user arguments follow them.

> **Tip:** Read the example, predict what it does, then try changing one value or instruction.
