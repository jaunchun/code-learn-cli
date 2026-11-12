'use strict';
// Everything about how things look: colors, markdown, code boxes, and reading input.

const readline = require('readline');

// ---------------------------------------------------------------- colors
const useColor = Boolean(process.env.FORCE_COLOR) || (process.stdout.isTTY && !process.env.NO_COLOR);
const paint = (open, close) => (s) => (useColor ? `\x1b[${open}m${s}\x1b[${close}m` : String(s));

const c = {
  bold: paint(1, 22),
  dim: paint(2, 22),
  italic: paint(3, 23),
  red: paint(31, 39),
  green: paint(32, 39),
  yellow: paint(33, 39),
  blue: paint(34, 39),
  magenta: paint(35, 39),
  cyan: paint(36, 39),
  gray: paint(90, 39),
};

const stripAnsi = (s) => String(s).replace(/\x1b\[[0-9;]*m/g, '');
const termWidth = () => Math.max(40, Math.min(process.stdout.columns || 80, 92));

// ---------------------------------------------------------------- text helpers
// Spaces inside `code`, **bold** and *italic* become non-breaking so word-wrapping never splits them.
function inline(s) {
  const nb = (t) => t.replace(/ /g, '\u00a0');
  return String(s)
    .split(/(`[^`]+`)/)
    .map((part, i) => {
      if (i % 2 === 1) { // `code`
        const t = part.slice(1, -1);
        return useColor ? c.cyan(nb(t)) : '`' + nb(t) + '`';
      }
      return part
        .replace(/\*\*([^*]+)\*\*/g, (_, t) => c.bold(nb(t)))
        .replace(/(^|[^*\w])\*([^*\s](?:[^*]*[^*\s])?)\*(?![*\w])/g, (_, pre, t) => pre + c.italic(nb(t)));
    })
    .join('');
}

// Word-wrap one line. `first` prefixes the first line, `rest` the following ones.
function wrapText(text, first = '  ', rest = first) {
  const max = termWidth();
  const out = [];
  let line = '';
  let prefix = first;
  for (const word of String(text).split(' ')) {
    const candidate = line ? line + ' ' + word : word;
    if (line && stripAnsi(prefix + candidate).length > max) {
      out.push(prefix + line);
      prefix = rest;
      line = word;
    } else {
      line = candidate;
    }
  }
  out.push(prefix + line);
  return out.map((s) => s.replace(/\u00a0/g, ' ')).join('\n');
}

// Inline-formatted, wrapped text (handles several lines).
const paragraph = (text, first = '  ', rest = first) =>
  String(text).split('\n').map((l) => wrapText(inline(l), first, rest)).join('\n');

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------------------------------------------------------- syntax highlighting
// Language definitions (keywords, quotes, ...) live in languages.js.
const languages = require('./languages');

/** Split a line of code into [{ t: text, k: kind }]; kind drives the color. */
function tokenize(line, lang) {
  const L = languages.get(lang);
  const toks = [];
  if (!L) {
    line.split(/(___)/).forEach((part, i) => { if (part) toks.push({ t: part, k: i % 2 ? 'blank' : 'plain' }); });
    return toks;
  }
  L.re.lastIndex = 0;
  let last = 0;
  let m;
  while ((m = L.re.exec(line))) {
    if (m[0] === '') { L.re.lastIndex++; continue; }
    if (m.index > last) toks.push({ t: line.slice(last, m.index), k: 'plain' });
    const [text, comment, blank, str, num, word] = m;
    let k = 'plain';
    if (comment) k = 'comment';
    else if (blank) k = 'blank';
    else if (str) k = 'string';
    else if (num) k = 'number';
    else if (word) k = L.kw.has(word) ? 'keyword' : L.ty.has(word) ? 'type' : word.endsWith('!') ? 'macro' : 'plain';
    toks.push({ t: text, k });
    last = m.index + text.length;
  }
  if (last < line.length) toks.push({ t: line.slice(last), k: 'plain' });
  return toks;
}

// Ghost text uses the "dim" attribute (not a color), so it stays visible even with NO_COLOR.
const ghostPaint = (t) => (process.stdout.isTTY ? `\x1b[2m${t}\x1b[22m` : t);
const PAINT = {
  plain: (t) => t,
  comment: c.gray,
  blank: (t) => c.yellow(c.bold(t)),
  string: c.green,
  number: c.yellow,
  keyword: c.magenta,
  type: c.cyan,
  macro: c.blue,
  ghost: ghostPaint,
};
const paintTokens = (toks) => toks.map((tk) => (PAINT[tk.k] || PAINT.plain)(tk.t)).join('');

/** Keep only the characters between positions `from` and `to`. */
function sliceTokens(toks, from, to) {
  const out = [];
  let pos = 0;
  for (const tk of toks) {
    const s = pos;
    const e = pos + tk.t.length;
    pos = e;
    if (e <= from || s >= to) continue;
    out.push({ t: tk.t.slice(Math.max(0, from - s), to - s), k: tk.k });
  }
  return out;
}

/** Insert extra tokens at character position `at`. */
function insertTokens(toks, at, extra) {
  const out = [];
  let pos = 0;
  let done = false;
  for (const tk of toks) {
    const e = pos + tk.t.length;
    if (!done && at >= pos && at <= e) {
      const i = at - pos;
      if (i > 0) out.push({ t: tk.t.slice(0, i), k: tk.k });
      out.push(...extra);
      if (i < tk.t.length) out.push({ t: tk.t.slice(i), k: tk.k });
      done = true;
    } else {
      out.push(tk);
    }
    pos = e;
  }
  if (!done) out.push(...extra);
  return out;
}

const highlight = (line, lang) => (useColor ? paintTokens(tokenize(line, lang)) : line);

function codeBlock(code, lang) {
  const lines = String(code).replace(/\r/g, '').replace(/\n+$/, '').split('\n');
  const label = lang && lang !== 'text' ? ` ${lang} ` : '';
  return [
    c.gray('  ╭─' + label + '─'.repeat(Math.max(4, 14 - label.length))),
    ...lines.map((l) => c.gray('  │ ') + highlight(l, lang)),
    c.gray('  ╰──────────'),
  ].join('\n');
}

// ---------------------------------------------------------------- tiny markdown renderer
// Supports: # headings, paragraphs, - bullets, 1. lists, > tips, ``` code ```, `code`, **bold**.
function renderMarkdown(md, defaultLang) {
  const out = [];
  let code = null;
  let lang = '';

  for (const raw of String(md).replace(/\r/g, '').split('\n')) {
    const line = raw.replace(/\s+$/, '');
    const fence = line.match(/^```\s*([\w+-]*)/);

    if (fence) {
      if (code === null) {
        code = [];
        lang = fence[1] || defaultLang;
      } else {
        out.push(codeBlock(code.join('\n'), lang));
        code = null;
      }
      continue;
    }
    if (code !== null) { code.push(raw); continue; }
    if (!line.trim()) { out.push(''); continue; }

    let m;
    if ((m = line.match(/^#\s+(.*)/))) {
      out.push('', '  ' + c.bold(c.cyan(m[1])), '  ' + c.cyan('═'.repeat(Math.min(m[1].length, 60))));
    } else if ((m = line.match(/^##+\s+(.*)/))) {
      out.push('', '  ' + c.bold(c.yellow(m[1])));
    } else if ((m = line.match(/^\s*[-*]\s+(.*)/))) {
      out.push(wrapText(inline(m[1]), '   ' + c.cyan('•') + ' ', '     '));
    } else if ((m = line.match(/^\s*(\d+)\.\s+(.*)/))) {
      out.push(wrapText(inline(m[2]), '   ' + c.cyan(m[1] + '.') + ' ', '      '));
    } else if ((m = line.match(/^>\s?(.*)/))) {
      const bar = '  ' + c.yellow('▌ ');
      out.push(wrapText(inline(m[1]), bar, bar));
    } else {
      out.push(wrapText(inline(line), '  '));
    }
  }
  if (code !== null) out.push(codeBlock(code.join('\n'), lang));
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

// ---------------------------------------------------------------- screen
function clear() {
  if (process.stdout.isTTY) console.clear();
}

function banner(sub) {
  console.log('\n  ' + c.bold(c.cyan('◆ Code Learn')) + (sub ? c.gray('   ' + sub) : ''));
  console.log('  ' + c.gray('─'.repeat(Math.min(termWidth() - 4, 60))) + '\n');
}

class QuitSignal extends Error {}

module.exports = {
  c, useColor, stripAnsi, termWidth, inline, wrapText, paragraph, shuffle,
  tokenize, paintTokens, sliceTokens, insertTokens, highlight, codeBlock, renderMarkdown,
  clear, banner, QuitSignal,
};
