'use strict';
// One door for all user input. In a real terminal it uses the interactive widgets
// (arrow keys, live code editor). When input is piped, or classic mode is on
// (CLX_CLASSIC=1 or "classicInput": true in config.json), it falls back to plain typed lines.

const readline = require('readline');
const ui = require('./ui');
const config = require('./config');
const { COMMAND_RE } = require('./editor');

const { c } = ui;
const LETTERS = 'ABCDEFGH';

const interactive = () => Boolean(process.stdin.isTTY && process.stdout.isTTY) && !config.classicInput();
const term = () => require('./terminal'); // loaded only when needed

// ------------------------------------------------------------------ plain line input
// Lines are queued as they arrive, so typing ahead and piped input both work.
class LineInput {
  constructor() {
    this.queue = [];
    this.waiting = null;
    this.closed = false;
    this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    this.rl.on('line', (line) => {
      if (this.waiting) {
        const resolve = this.waiting;
        this.waiting = null;
        if (!process.stdin.isTTY) process.stdout.write(line + '\n');
        resolve(line);
      } else {
        this.queue.push(line);
      }
    });
    this.rl.on('close', () => {
      this.closed = true;
      if (this.waiting) { const resolve = this.waiting; this.waiting = null; resolve(null); }
    });
  }

  read(prompt) {
    return new Promise((resolve) => {
      if (this.queue.length) {
        const line = this.queue.shift();
        if (!process.stdin.isTTY) process.stdout.write(prompt + line + '\n');
        return resolve(line);
      }
      if (this.closed) return resolve(null);
      this.waiting = resolve;
      this.rl.setPrompt(prompt);
      this.rl.prompt();
    });
  }
}

let lines = null;

/** Ask for one typed line. Ctrl+C / Ctrl+D / end of input throw QuitSignal. */
async function askLine(prompt) {
  if (!lines) lines = new LineInput();
  const line = await lines.read(prompt);
  if (line === null) throw new ui.QuitSignal();
  return line;
}

// ------------------------------------------------------------------ public API
/** "Press Enter..." -> '' (Enter) or 'q' */
async function pause(prompt) {
  if (interactive()) return term().pause(prompt);
  return (await askLine(c.gray('  ' + prompt))).trim().toLowerCase();
}

async function confirm(question) {
  if (interactive()) return term().confirm(question);
  const a = (await askLine(question + ' ')).trim().toLowerCase();
  return a === 'y' || a === 'yes';
}

/**
 * Choose from a list.
 *   items:  [{ label, hint?, disabled? }]
 *   keys:   { q: 'quit', b: 'back', h: 'hint' }   single key -> command
 *   letters: label options A) B) C) instead of 1) 2) 3)
 *   footer / fallbackFooter: help line for the interactive / the plain version
 * -> { index } or { cmd }
 */
async function select(opts) {
  if (interactive()) return term().select(opts);

  const { items, letters = false, keys = {}, fallbackFooter = '' } = opts;
  const tag = (i) => (letters ? LETTERS[i] : String(i + 1)) + ')';
  items.forEach((it, i) => {
    if (it.disabled) console.log(c.gray(`  ${it.tried ? '✘' : '–'} ${tag(i)} ${it.label}`));
    else console.log(ui.paragraph(it.label + (it.hint ? '  ' + c.gray(it.hint) : ''), '  ' + c.cyan(tag(i)) + ' ', '     '));
  });
  if (fallbackFooter) console.log('\n  ' + c.gray(fallbackFooter) + '\n');

  while (true) {
    const raw = (await askLine(c.green('  › '))).trim().toLowerCase();
    const word = raw.replace(/^:/, '');
    if (keys[word] && (word.length === 1 || raw.startsWith(':'))) return { cmd: keys[word] };
    if (word === 'quit' && keys.q) return { cmd: keys.q };
    if (word === 'back' && keys.b) return { cmd: keys.b };
    if (word === 'hint' && keys.h) return { cmd: keys.h };
    if (word === 'skip' && keys.s) return { cmd: keys.s };

    let index = -1;
    if (letters && /^[a-h]$/.test(raw)) index = raw.charCodeAt(0) - 97;
    else if (/^\d+$/.test(raw)) index = Number(raw) - 1;
    if (index < 0 || index >= items.length) { console.log(c.red('  Not a valid choice.')); continue; }
    if (items[index].disabled) { console.log(c.yellow('  You already tried that one - pick another.')); continue; }
    return { index };
  }
}

/**
 * Type code. Interactive: live editor. Fallback: typed lines, empty line = done.
 *   { lang, multiline, cfg (editor settings), candidates, help } -> { text }
 */
async function editCode(opts) {
  if (interactive()) return term().editCode(opts);

  console.log('  ' + c.gray(opts.help) + '\n');
  const first = await askLine(c.green('  › '));
  if (COMMAND_RE.test(first.trim()) || !opts.multiline || !first.trim()) return { text: first };
  const rows = [first];
  while (true) {
    const next = await askLine(c.gray('  … '));
    if (!next.trim()) break;
    rows.push(next);
  }
  return { text: rows.join('\n') };
}

function close() {
  if (lines) lines.rl.close();
  if (interactive()) term().stop();
}

module.exports = { interactive, pause, confirm, select, editCode, close };
