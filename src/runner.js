'use strict';
// Runs the learner's code for real, so any solution that behaves correctly is accepted.
//
// A question with a "run" block is graded like this:
//   1. the learner's text is put into run.template (at {{code}})
//   2. the program is compiled (if the language needs it) and run, with a time limit
//   3. its output is compared with run.output
//
// Needs the language's tools on this computer: rustc for Rust, node for JavaScript,
// python3 for Python. When they are missing the app falls back to pattern checks.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const languages = require('./languages');

const WIN = process.platform === 'win32';
const LIMITS = { compile: 30000, run: 5000, output: 1024 * 1024 };

// How to build and start a program, per language.
//   tool: [command, args] used to detect the tool      src/out: file paths
const RUNNERS = {
  rust: {
    name: 'Rust compiler (rustc)',
    install: 'https://rustup.rs',
    ext: '.rs',
    tool: ['rustc', ['--version']],
    compile: ({ src, out }) => ['rustc', ['--edition', '2021', '-A', 'warnings', '--color', 'never', '-o', out, src]],
    exec: ({ out }) => [out, []],
    exe: true,
  },
  c: {
    name: 'C compiler (gcc)',
    install: 'https://gcc.gnu.org (on Windows: MinGW-w64 or MSYS2)',
    ext: '.c',
    tool: ['gcc', ['--version']],
    compile: ({ src, out }) => ['gcc', ['-std=c11', '-w', '-o', out, src, '-lm']],
    exec: ({ out }) => [out, []],
    exe: true,
  },
  cpp: {
    name: 'C++ compiler (g++)',
    install: 'https://gcc.gnu.org (on Windows: MinGW-w64 or MSYS2)',
    ext: '.cpp',
    tool: ['g++', ['--version']],
    compile: ({ src, out }) => ['g++', ['-std=c++17', '-w', '-o', out, src]],
    exec: ({ out }) => [out, []],
    exe: true,
  },
  go: {
    name: 'Go',
    install: 'https://go.dev/dl',
    ext: '.go',
    tool: ['go', ['version']],
    compile: ({ src, out }) => ['go', ['build', '-o', out, src]],
    exec: ({ out }) => [out, []],
    exe: true,
  },
  java: {
    name: 'Java JDK (javac)',
    install: 'https://adoptium.net',
    ext: '.java',
    file: 'Main.java', // the public class must be called Main
    tool: ['javac', ['-version']],
    compile: ({ src, dir }) => ['javac', ['-d', dir, src]],
    exec: ({ dir }) => ['java', ['-cp', dir, 'Main']],
  },
  javascript: {
    name: 'Node.js',
    install: 'https://nodejs.org',
    ext: '.js',
    tool: [process.execPath, ['--version']],
    exec: ({ src }) => [process.execPath, [src]],
  },
  python: {
    name: 'Python 3',
    install: 'https://python.org',
    ext: '.py',
    tool: [WIN ? 'python' : 'python3', ['--version']],
    exec: ({ src }) => [WIN ? 'python' : 'python3', [src]],
  },
};

const found = {};

const runnerFor = (lang) => RUNNERS[languages.canonical(lang)] || null;

/** Is there a way to run this language on this computer? */
function available(lang) {
  const key = languages.canonical(lang);
  const R = RUNNERS[key];
  if (!R) return false;
  if (!(key in found)) {
    const r = spawnSync(R.tool[0], R.tool[1], { encoding: 'utf8', timeout: 10000 });
    found[key] = !r.error && r.status === 0;
  }
  return found[key];
}

/** Fill the template. A function replacer keeps "$&" and friends in the learner's code intact. */
const buildSource = (template, code) => template.replace(/\{\{code\}\}/g, () => code);

/**
 * Compile (if needed) and run a program.
 * -> { ok, stage: 'compile'|'run'|null, stdout, stderr, timedOut }
 */
function runProgram(lang, source) {
  const key = languages.canonical(lang);
  const R = RUNNERS[key];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clx-'));
  const src = path.join(dir, R.file || 'main' + R.ext);
  const out = path.join(dir, 'main' + (R.exe && WIN ? '.exe' : ''));
  const result = { ok: false, stage: null, stdout: '', stderr: '', timedOut: false };

  try {
    fs.writeFileSync(src, source);

    if (R.compile) {
      const [cmd, args] = R.compile({ src, out, dir });
      const c = spawnSync(cmd, args, { encoding: 'utf8', cwd: dir, timeout: LIMITS.compile, maxBuffer: LIMITS.output });
      if (c.error || c.status !== 0) {
        result.stage = 'compile';
        result.stderr = (c.stderr || (c.error && c.error.message) || '').toString();
        result.timedOut = Boolean(c.error && c.error.code === 'ETIMEDOUT');
        return result;
      }
    }

    const [cmd, args] = R.exec({ src, out, dir });
    const r = spawnSync(cmd, args, { encoding: 'utf8', cwd: dir, timeout: LIMITS.run, maxBuffer: LIMITS.output, input: '' });
    result.stdout = (r.stdout || '').toString();
    result.stderr = (r.stderr || '').toString();
    if (r.error) {
      // killed for taking too long, or for printing far too much (an endless loop)
      result.stage = 'run';
      result.timedOut = true;
      return result;
    }
    if (r.status !== 0) { result.stage = 'run'; return result; }
    result.ok = true;
    return result;
  } finally {
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* temp folder, not important */ }
  }
}

// ------------------------------------------------------------------ output + errors
const normalizeOutput = (s, exact) => {
  const t = String(s).replace(/\r\n/g, '\n');
  return exact ? t : t.split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
};

const sameOutput = (actual, expected, exact) => normalizeOutput(actual, exact) === normalizeOutput(expected, exact);

/** One readable line from a compiler / runtime error. */
function summarizeError(lang, stderr) {
  const key = languages.canonical(lang);
  const lines = String(stderr).replace(/\r/g, '').split('\n');
  const first = (re) => { for (const l of lines) { const m = l.match(re); if (m) return m; } return null; };

  if (key === 'rust') {
    const i = lines.findIndex((l) => /^error(\[E\d+\])?:/.test(l) && !/^error: aborting/.test(l));
    if (i >= 0) {
      let msg = lines[i].replace(/^error(\[E\d+\])?:\s*/, '');
      const help = lines.slice(i + 1, i + 25).find((l) => /^\s*=?\s*help:/.test(l));
      if (help) msg += ' (' + help.replace(/^\s*=?\s*help:\s*/, 'help: ') + ')';
      return msg;
    }
    const panic = lines.find((l) => /panicked at/.test(l));
    if (panic) return panic.trim();
  } else if (key === 'c' || key === 'cpp') {
    const m = first(/^.*?:\d+:\d+:\s*(?:fatal )?error:\s*(.*)$/);
    if (m) return m[1];
  } else if (key === 'go') {
    const m = first(/^(?:\.\/)?[^\s:]+\.go:\d+(?::\d+)?:\s*(.*)$/);
    if (m) return m[1];
    const panic = lines.find((l) => /^panic:/.test(l));
    if (panic) return panic.trim();
  } else if (key === 'java') {
    const exc = lines.find((l) => /^Exception in thread/.test(l));
    if (exc) return exc.replace(/^Exception in thread "[^"]*"\s*/, '');
    const m = first(/^.*\.java:\d+:\s*error:\s*(.*)$/);
    if (m) return m[1];
  } else if (key === 'javascript') {
    const m = first(/^(\w*Error\b.*)$/);
    if (m) return m[1];
  }
  const last = lines.map((l) => l.trim()).filter(Boolean);
  return last.length ? last[last.length - 1] : 'the program stopped with an error';
}

module.exports = { available, runnerFor, buildSource, runProgram, sameOutput, summarizeError, LIMITS };
