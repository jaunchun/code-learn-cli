'use strict';
// Interactive (raw keyboard) widgets: arrow-key menus, the code editor box, single key waits.
// Only used when stdin/stdout are a real terminal; see prompts.js for the plain fallback.

const readline = require('readline');
const ui = require('./ui');
const { Editor, COMMAND_RE } = require('./editor');

const { c } = ui;
const out = (s) => process.stdout.write(s);
const LETTERS = 'ABCDEFGH';

// ------------------------------------------------------------------ keys
let started = false;
const queue = [];
let waiter = null;

function restore() {
  out('\x1b[?25h'); // show cursor
  if (started && process.stdin.isTTY) {
    try { process.stdin.setRawMode(false); } catch { /* already closed */ }
  }
}

function start() {
  if (started) return;
  started = true;
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('keypress', (str, key) => {
    const ev = { str: str || '', key: key || {} };
    if (waiter) { const w = waiter; waiter = null; w(ev); } else queue.push(ev);
  });
  process.on('exit', restore);
}

function stop() {
  if (!started) return;
  restore();
  process.stdin.pause();
}

/** Next key press. Ctrl+C leaves the app (throws QuitSignal). */
function nextKey() {
  start();
  return new Promise((resolve, reject) => {
    const take = (ev) => {
      if (ev.key.ctrl && ev.key.name === 'c') {
        restore();
        out('\n');
        reject(new ui.QuitSignal());
      } else {
        resolve(ev);
      }
    };
    if (queue.length) take(queue.shift());
    else waiter = take;
  });
}

const isEnter = (key) => key.name === 'return' || key.name === 'enter';

/** "Press Enter..." -> '' for Enter/Space, 'q' for q/Esc */
async function pause(prompt) {
  out(c.gray('  ' + prompt));
  while (true) {
    const { str, key } = await nextKey();
    if (isEnter(key) || key.name === 'space') { out('\n'); return ''; }
    if (str.toLowerCase() === 'q' || key.name === 'escape') { out('\n'); return 'q'; }
  }
}

async function confirm(question) {
  out(question + ' ');
  while (true) {
    const { str, key } = await nextKey();
    const ch = str.toLowerCase();
    if (ch === 'y') { out('y\n'); return true; }
    if (ch === 'n' || isEnter(key) || key.name === 'escape') { out('n\n'); return false; }
  }
}

// ------------------------------------------------------------------ in-place drawing
// A "block" is a few lines we redraw in place. The cursor always sits inside it.
function eraseBlock(rowOfCursor) {
  return (rowOfCursor > 0 ? `\x1b[${rowOfCursor}A` : '') + '\r\x1b[J';
}

// ------------------------------------------------------------------ select (arrow-key menu)
/**
 * items: [{ label, hint?, disabled? }]
 * keys:  { q: 'quit', b: 'back', h: 'hint', ... }   a key -> command name
 * -> { index } or { cmd }
 */
async function select({ items, letters = false, keys = {}, footer = '' }) {
  start();
  const enabled = (i) => !items[i].disabled;
  let cur = items.findIndex((_, i) => enabled(i));
  if (cur < 0) cur = 0;
  let drawn = 0;

  const tag = (i) => (letters ? LETTERS[i] : String(i + 1)) + ')';
  const plain = (s) => String(s).replace(/[`*]/g, '');

  const frame = () => {
    const lines = [];
    items.forEach((it, i) => {
      if (it.disabled) {
        lines.push(c.gray(`    ${it.tried ? '✘' : '–'} ${tag(i)} ${plain(it.label)}`));
        return;
      }
      const text = ui.inline(it.label) + (it.hint ? '  ' + c.gray(it.hint) : '');
      if (i === cur) {
        lines.push(ui.wrapText(c.bold(text), '  ' + c.cyan('❯ ') + c.bold(c.cyan(tag(i))) + ' ', '       '));
      } else {
        lines.push(ui.wrapText(text, '    ' + c.cyan(tag(i)) + ' ', '       '));
      }
    });
    if (footer) lines.push('', c.gray('  ' + footer));
    return lines.join('\n').split('\n');
  };

  const draw = () => {
    const lines = frame();
    out((drawn ? eraseBlock(drawn - 1) : '') + lines.join('\n'));
    drawn = lines.length;
  };

  const move = (dir) => {
    for (let n = 1; n <= items.length; n++) {
      const j = (cur + dir * n + items.length * n) % items.length;
      if (enabled(j)) { cur = j; return; }
    }
  };

  const finish = (result) => {
    out(eraseBlock(drawn - 1) + '\x1b[?25h');
    return result;
  };

  out('\x1b[?25l');
  draw();
  while (true) {
    let ev;
    try { ev = await nextKey(); } catch (e) { out('\x1b[?25h'); throw e; }
    const { str, key } = ev;
    const ch = str.toLowerCase();

    if (key.name === 'up' || (ch === 'k' && !keys.k)) move(-1);
    else if (key.name === 'down' || (ch === 'j' && !keys.j)) move(1);
    else if (isEnter(key)) { if (enabled(cur)) return finish({ index: cur }); }
    else if (key.name === 'escape' && keys.q) return finish({ cmd: keys.q });
    else if (ch && keys[ch]) return finish({ cmd: keys[ch] });
    else if (letters && /^[a-h]$/.test(ch) && ch.charCodeAt(0) - 97 < items.length) {
      const j = ch.charCodeAt(0) - 97;
      if (enabled(j)) cur = j;
    } else if (!letters && /^[1-9]$/.test(ch) && Number(ch) <= items.length) {
      const j = Number(ch) - 1;
      if (enabled(j)) cur = j;
    } else continue;
    draw();
  }
}

// ------------------------------------------------------------------ code editor box
/**
 * Live code box: cursor keys, auto-closing brackets, auto-indent, ghost autocomplete.
 * -> { text }
 */
async function editCode({ lang, multiline, cfg, candidates, help, initial, cursor, escMenu = false, erase = false }) {
  start();
  const ed = new Editor({ ...cfg, multiline, candidates });
  if (initial) ed.load(initial, cursor);
  const gutterW = multiline ? 7 : 4;
  const gutter = (i) => (multiline ? c.gray(`  ${String(i + 1).padStart(2)} │ `) : c.green('  › '));
  const avail = () => Math.max(20, (process.stdout.columns || 80) - gutterW - 1);
  const offsetFor = () => (ed.col >= avail() ? ed.col - avail() + 8 : 0); // scroll long lines sideways
  let drawn = false;
  let cursorRow = 0;

  const lineText = (i, sug) => {
    let toks = ui.tokenize(ed.lines[i], lang);
    let off = 0;
    if (i === ed.row) {
      if (sug) toks = ui.insertTokens(toks, ed.col, [{ t: sug.ghost, k: 'ghost' }]);
      off = offsetFor();
    }
    return gutter(i) + ui.paintTokens(ui.sliceTokens(toks, off, off + avail()));
  };

  const render = (final) => {
    const sug = final ? null : ed.suggestion();
    const rows = ed.lines.map((_, i) => lineText(i, sug));
    let status = '';
    if (!final) {
      const label = sug ? 'Tab ⇥ ' : '';
      status = sug
        ? c.gray('  ' + label) + c.cyan(sug.text.length > 50 ? sug.text.slice(0, 47) + '...' : sug.text)
        : c.gray('  ' + help);
    }
    const all = final ? rows : [...rows, status];

    let s = drawn ? eraseBlock(cursorRow) : '';
    s += all.join('\n');
    if (final) {
      s += '\n';
    } else {
      const up = all.length - 1 - ed.row;
      if (up > 0) s += `\x1b[${up}A`;
      const x = gutterW + Math.min(ed.col - offsetFor(), avail());
      s += '\r' + (x > 0 ? `\x1b[${x}C` : '');
      cursorRow = ed.row;
    }
    drawn = true;
    out(s);
  };

  // Leave the editor. `erase` removes the box from the screen; otherwise the typed code stays visible.
  const submit = (extra = {}) => {
    const where = { row: ed.row, col: ed.col };
    if (erase) {
      out(eraseBlock(cursorRow));
    } else {
      while (ed.lines.length > 1 && !ed.lines[ed.lines.length - 1].trim()) ed.lines.pop(); // drop empty last lines
      ed.row = Math.min(ed.row, ed.lines.length - 1);
      render(true);
    }
    return { text: ed.text(), cursor: where, ...extra };
  };

  render(false);
  while (true) {
    const { str, key } = await nextKey();
    const name = key.name;

    // Esc first: newer Node versions report a lone Esc with meta = true
    if (name === 'escape') {
      if (escMenu) return submit({ menu: true });
      continue;
    }

    if (key.ctrl) {
      if (name === 'd') return submit();
      else if (name === 'a') ed.home();
      else if (name === 'e') ed.end();
      else if (name === 'u') ed.killToStart();
      else if (name === 'k') ed.killToEnd();
      else if (name === 'w') ed.deleteWord();
      else continue;
    } else if (key.meta) {
      continue;
    } else if (isEnter(key)) {
      if (!multiline) return submit();
      const single = ed.lines.length === 1;
      if (single && COMMAND_RE.test(ed.text().trim())) return submit();               // :h  :s  :q
      const blankLast = ed.row === ed.lines.length - 1 && ed.col === ed.line.length && !ed.line.trim();
      if (blankLast && ed.hasContent() && !escMenu) return submit();                  // empty line = done
      ed.enter();
    } else if (name === 'backspace') ed.backspace();
    else if (name === 'delete') ed.del();
    else if (name === 'left') ed.left();
    else if (name === 'right') ed.right();
    else if (name === 'up') ed.up();
    else if (name === 'down') ed.down();
    else if (name === 'home') ed.home();
    else if (name === 'end') ed.end();
    else if (name === 'tab') { if (!key.shift && !ed.acceptSuggestion()) ed.insertTab(); }
    else if (str && !/[\x00-\x1f\x7f]/.test(str)) ed.insertText(str);
    else continue;

    render(false);
  }
}

module.exports = { select, editCode, pause, confirm, nextKey, stop };
