'use strict';
// Checks a typed answer for fill / fix / write questions.
//
// Two ways to grade, used together:
//
//  1. RUN (smart): when the question has a "run" block and the language's tools are installed,
//     the learner's code is compiled and run, and its OUTPUT is compared. Any solution that
//     behaves correctly passes, however it is written.
//
//  2. PATTERN (fallback): when the tools are missing the typed text is compared with the
//     question's "answer" / "checks". A question is correct when
//        - none of its "not" checks match        (known mistakes)
//        - all of its normal checks match        (required pieces)
//        - it matches one of its "answer" values (if "answer" is given)
//
// A check with "enforce": true is still required in RUN mode (use it when the lesson is about
// HOW something is written, e.g. "use a for loop").

const runner = require('./runner');

const collapse = (s) => String(s).replace(/\s+/g, ' ').trim();

// Whitespace-insensitive form: `x = 5 ;` and `x=5;` become the same text.
const squash = (s) =>
  collapse(s).replace(/\s*([(){}\[\];,:=<>+\-*\/&!.|?%^~@#])\s*/g, '$1');

const toArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

function hit(check, text, squashed) {
  if (typeof check.has === 'string') return squashed.includes(squash(check.has));
  try {
    return new RegExp(check.regex, check.flags || '').test(text);
  } catch {
    return false;
  }
}

/** Pattern grading only. -> { correct, problems, triggered, missing } */
function gradeAnswer(q, input) {
  const text = collapse(input);
  if (!text) return { correct: false, problems: ['Type an answer first.'], triggered: [], missing: [] };

  const squashed = squash(input);
  const checks = q.checks || [];

  const triggered = checks.filter((k) => k.not && hit(k, text, squashed)).map((k) => k.explain);
  const missing = checks.filter((k) => !k.not && !hit(k, text, squashed)).map((k) => k.explain);

  const answers = toArray(q.answer);
  const answerOk = answers.length === 0 || answers.some((a) => squash(a) === squashed);

  return {
    correct: triggered.length === 0 && missing.length === 0 && answerOk,
    // Known mistakes are the most specific feedback, so they win.
    problems: triggered.length ? triggered : missing,
    triggered,
    missing,
  };
}

/** Can this question be graded by running code on this computer? */
const canRun = (q, lang) => Boolean(q.run) && runner.available(lang);

/**
 * Grade an answer, running it when possible.
 * -> { correct, problems: string[], detail, mode: 'run' | 'pattern' }
 *    detail (run mode, when wrong): { kind: 'compile'|'runtime'|'timeout'|'output', message, expected?, got? }
 */
function grade(q, input, lang) {
  const pattern = gradeAnswer(q, input);
  if (!collapse(input) || !canRun(q, lang)) return { ...pattern, detail: null, mode: 'pattern' };

  const text = collapse(input);
  const squashed = squash(input);

  // checks marked "enforce" still count, even if the program behaves correctly
  const enforced = (q.checks || []).filter((k) => k.enforce);
  const enforceProblems = enforced
    .filter((k) => (k.not ? hit(k, text, squashed) : !hit(k, text, squashed)))
    .map((k) => k.explain);

  const run = q.run;
  const result = runner.runProgram(lang, runner.buildSource(run.template, input));

  let detail = null;
  if (!result.ok) {
    if (result.timedOut) {
      detail = { kind: 'timeout', message: 'Your code ran for too long (or printed far too much). Is there an endless loop?' };
    } else {
      detail = {
        kind: result.stage === 'compile' ? 'compile' : 'runtime',
        message: runner.summarizeError(lang, result.stderr),
      };
    }
  } else if (typeof run.output === 'string' && !runner.sameOutput(result.stdout, run.output, run.exact === true)) {
    detail = { kind: 'output', message: 'The code ran, but it printed something different.', expected: run.output, got: result.stdout };
  }

  if (!detail && !enforceProblems.length) return { correct: true, problems: [], detail: null, mode: 'run' };

  // Wrong. Specific explanations first: enforced rules, then known mistakes the learner made.
  const problems = enforceProblems.length ? enforceProblems : pattern.triggered;
  return { correct: false, problems, detail, mode: 'run' };
}

module.exports = { gradeAnswer, grade, canRun, squash, collapse, toArray };
