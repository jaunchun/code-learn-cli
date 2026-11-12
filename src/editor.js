'use strict';
// The text-editing brain of the code box. No terminal code in here, so it is easy to test.
// Handles: cursor movement, auto-closing pairs, auto-indent, and ghost-text suggestions.

const COMMAND_RE = /^:(h|hint|s|skip|q|quit)$/i;

class Editor {
  constructor(opts = {}) {
    this.cfg = {
      pairs: opts.pairs || {},
      quotes: opts.quotes || [],
      indent: opts.indent === undefined ? '    ' : opts.indent,
      indentAfter: opts.indentAfter === undefined ? '{([' : opts.indentAfter,
      dedent: opts.dedent === undefined ? '}])' : opts.dedent,
      autoPairs: opts.autoPairs !== false,
      autoIndent: opts.autoIndent !== false,
      suggestions: opts.suggestions !== false,
      multiline: opts.multiline !== false,
    };
    this.candidates = opts.candidates || [];
    this.closers = new Set(Object.values(this.cfg.pairs));
    this.lines = [''];
    this.row = 0;
    this.col = 0;
    this.want = 0; // column to return to when moving up/down
  }

  get line() { return this.lines[this.row]; }
  get before() { return this.line.slice(0, this.col); }
  get after() { return this.line.slice(this.col); }
  text() { return this.lines.join('\n').replace(/\s+$/, ''); }
  hasContent() { return this.lines.some((l) => l.trim() !== ''); }

  /**
   * Replace the content (starter code). A "$0" marks where the cursor goes and is removed;
   * otherwise the cursor goes to the end, or to `cursor` ({ row, col }) when given.
   */
  load(text, cursor) {
    const lines = String(text).replace(/\r/g, '').split('\n');
    let row = lines.length - 1;
    let col = lines[row].length;
    const i = lines.findIndex((l) => l.includes('$0'));
    if (i >= 0) {
      col = lines[i].indexOf('$0');
      lines[i] = lines[i].replace('$0', '');
      row = i;
    }
    if (cursor && Number.isInteger(cursor.row) && Number.isInteger(cursor.col)) {
      row = Math.max(0, Math.min(cursor.row, lines.length - 1));
      col = Math.max(0, Math.min(cursor.col, lines[row].length));
    }
    this.lines = lines;
    this.row = row;
    this.col = col;
    this.want = col;
  }

  // ---- strings ------------------------------------------------------
  /** If `text` ends inside a string literal: { quote, index of the opening quote } */
  scanQuote(text) {
    let state = null;
    let index = -1;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (state) {
        if (ch === '\\') i++;
        else if (ch === state) state = null;
      } else if (this.cfg.quotes.includes(ch)) {
        state = ch;
        index = i;
      }
    }
    return state ? { quote: state, index } : null;
  }

  // ---- typing -------------------------------------------------------
  insertRaw(str) {
    this.lines[this.row] = this.before + str + this.after;
    this.col += str.length;
    this.want = this.col;
  }

  insertText(str) {
    for (const ch of str) {
      if (ch === '\n' || ch === '\r') this.enter();
      else this.typeChar(ch);
    }
  }

  typeChar(ch) {
    const { pairs, autoPairs, autoIndent, indent, dedent } = this.cfg;
    const next = this.after[0];
    const prev = this.before.slice(-1);

    // typing a closer that is already right there just steps over it
    if (autoPairs && this.closers.has(ch) && next === ch && prev !== '\\') {
      this.col++;
      this.want = this.col;
      return;
    }

    // a closing brace on an indent-only line steps back one level
    if (autoIndent && indent && dedent.includes(ch) && /^\s+$/.test(this.before) && this.before.endsWith(indent)) {
      this.lines[this.row] = this.before.slice(0, -indent.length) + this.after;
      this.col -= indent.length;
    }

    if (autoPairs && pairs[ch] && prev !== '\\') {
      const close = pairs[ch];
      const isQuote = close === ch;
      const nextOk = next === undefined || /\s/.test(next) || this.closers.has(next) || ',;'.includes(next);
      let pair = nextOk;
      // it's / 'a  ->  a quote after a letter is an apostrophe; a quote inside a string ends it
      if (isQuote && (/\w/.test(prev) || this.scanQuote(this.before))) pair = false;
      if (pair) {
        this.insertRaw(ch + close);
        this.col--;
        this.want = this.col;
        return;
      }
    }
    this.insertRaw(ch);
  }

  insertTab() { this.insertRaw(this.cfg.indent || '  '); }

  enter() {
    const { autoIndent, indent, indentAfter, pairs } = this.cfg;
    const before = this.before;
    const rest = autoIndent ? this.after.trimStart() : this.after;
    const base = autoIndent ? before.match(/^\s*/)[0] : '';
    const last = before.trimEnd().slice(-1);
    const opens = autoIndent && last !== '' && indentAfter.includes(last);

    let inserted;
    if (opens && pairs[last] && rest[0] === pairs[last]) {
      // { | }  ->  three lines, cursor on the indented middle one
      inserted = [before, base + indent, base + rest];
      this.lines.splice(this.row, 1, ...inserted);
      this.row += 1;
      this.col = (base + indent).length;
    } else {
      const lead = opens ? base + indent : base;
      this.lines.splice(this.row, 1, before, lead + rest);
      this.row += 1;
      this.col = lead.length;
    }
    this.want = this.col;
  }

  // ---- deleting -----------------------------------------------------
  backspace() {
    const { pairs, autoPairs, autoIndent, indent } = this.cfg;
    if (this.col > 0) {
      const before = this.before;
      const prev = before.slice(-1);
      const next = this.after[0];
      let cut = 1;
      if (autoPairs && pairs[prev] && pairs[prev] === next) {
        // delete the empty pair together: (|) -> |
        this.lines[this.row] = before.slice(0, -1) + this.after.slice(1);
      } else {
        if (autoIndent && indent && /^\s+$/.test(before) && before.endsWith(indent)) cut = indent.length;
        this.lines[this.row] = before.slice(0, -cut) + this.after;
      }
      this.col -= cut;
    } else if (this.row > 0) {
      const joinAt = this.lines[this.row - 1].length;
      this.lines[this.row - 1] += this.line;
      this.lines.splice(this.row, 1);
      this.row--;
      this.col = joinAt;
    }
    this.want = this.col;
  }

  del() {
    if (this.col < this.line.length) {
      this.lines[this.row] = this.before + this.after.slice(1);
    } else if (this.row < this.lines.length - 1) {
      this.lines[this.row] += this.lines[this.row + 1];
      this.lines.splice(this.row + 1, 1);
    }
  }

  killToStart() { this.lines[this.row] = this.after; this.col = 0; this.want = 0; }
  killToEnd() { this.lines[this.row] = this.before; }
  deleteWord() {
    const cut = this.before.replace(/(\s*\w+|\s*[^\w\s]|\s+)$/, '');
    this.lines[this.row] = cut + this.after;
    this.col = cut.length;
    this.want = this.col;
  }

  // ---- moving -------------------------------------------------------
  left() {
    if (this.col > 0) this.col--;
    else if (this.row > 0) { this.row--; this.col = this.line.length; }
    this.want = this.col;
  }
  right() {
    if (this.col < this.line.length) this.col++;
    else if (this.row < this.lines.length - 1) { this.row++; this.col = 0; }
    this.want = this.col;
  }
  up() { if (this.row > 0) { this.row--; this.col = Math.min(this.want, this.line.length); } }
  down() { if (this.row < this.lines.length - 1) { this.row++; this.col = Math.min(this.want, this.line.length); } }
  home() { this.col = 0; this.want = 0; }
  end() { this.col = this.line.length; this.want = this.col; }

  // ---- suggestions --------------------------------------------------
  /**
   * Ghost text for the word being typed, e.g. typing `R` inside "..." offers `Rust is fun`.
   * Phrases (with spaces) are only offered inside a string literal.
   * -> { text, start, ghost } or null
   */
  suggestion() {
    if (!this.cfg.suggestions || !this.candidates.length) return null;
    if (!/^[\s)\]}"'`;,>]*$/.test(this.after)) return null; // only at the end of the line (before auto-closed pairs)

    const before = this.before;
    const inStr = this.scanQuote(before);
    let start;
    if (inStr) {
      start = inStr.index + 1; // everything typed since the opening quote
    } else {
      const m = before.match(/[A-Za-z_][\w!:]*$/);
      if (!m) return null;
      start = before.length - m[0].length;
    }
    const prefix = before.slice(start);
    if (!prefix) return null;

    const p = prefix.toLowerCase();
    for (const cand of this.candidates) {
      const t = cand.text;
      if (t.length <= prefix.length || !t.toLowerCase().startsWith(p)) continue;
      if (!inStr && /\s/.test(t)) continue;
      return { text: t, start, ghost: t.slice(prefix.length) };
    }
    return null;
  }

  acceptSuggestion() {
    const s = this.suggestion();
    if (!s) return false;
    this.lines[this.row] = this.line.slice(0, s.start) + s.text + this.after;
    this.col = s.start + s.text.length;
    this.want = this.col;
    return true;
  }
}

module.exports = { Editor, COMMAND_RE };
