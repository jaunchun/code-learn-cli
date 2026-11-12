---
title: Debugging: a step-by-step method
summary: Find bugs systematically instead of guessing
---
## The method

1. **Reproduce it.** Find the exact steps that make the bug happen every time
2. **Read the error message.** Where does it say the problem is? What does it say, word for word?
3. **Form a hypothesis.** "I think `total` is wrong after the loop"
4. **Test the hypothesis.** Print the value, or use a debugger, to check. Do not change code at random
5. **Fix one thing** and run again
6. **Verify** the bug is gone, and that nothing else broke

The golden rule: **change one thing at a time**, and always know *why* you expect it to help.

---

## Techniques

- **Print debugging.** Print variables and "got here" markers to see what the program is really doing, not what you think it is doing. Label them: `print("total =", total)`
- **Use the debugger.** Set a breakpoint, run, and step line by line while watching the variables. This is faster than adding prints once you know it
- **Binary search the bug.** Comment out or skip half of the code. Is the bug still there? Repeat on the half that has it
- **Make a minimal example.** Copy the problem into a tiny new file and remove everything unrelated. Often the bug disappears and shows you the cause
- **Rubber duck.** Explain the code, line by line, out loud
- **Check your assumptions.** Is the file really there? Is the list really non-empty? Is that variable really a number and not text?

## The usual suspects

| Bug | Typical clue |
|---|---|
| Off-by-one (`<` vs `<=`, starting at 0 or 1) | Loop runs once too many or too few; last item missing |
| Wrong type (text vs number) | `"2" + "2"` gives `"22"` |
| Variable in the wrong scope | "not defined" / "cannot find symbol" |
| Using the wrong variable (typo, copy-paste) | Values look plausible but wrong |
| Missing or null value | "NullPointerException", "undefined", "None has no attribute" |
| Forgetting to return or to update a variable | Result is `None`/`undefined`/unchanged |
| Changing a list while looping over it | Items are skipped |

## When nothing works

- Take a break and walk away for 10 minutes
- Go back to the last version that worked (that is what Git is for) and re-apply your changes in smaller steps
- Ask for help with a minimal example, the exact error, and what you tried
