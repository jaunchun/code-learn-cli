'use strict';
// Everything that differs per programming language:
//   - syntax colors   (comment, keywords, types, quotes)
//   - editor behavior (auto-closing pairs, indentation)
//
// To add a language, copy one of the entries below. Courses can also override the
// "editor" part in course.json, and users in ~/.clx/config.json (see README).

const DEFAULT_EDITOR = {
  pairs: { '(': ')', '[': ']', '{': '}', '"': '"' }, // typing the key inserts both characters
  quotes: ['"'],          // characters that start/end a string (used to know when you're "inside a string")
  indent: '    ',          // one level of indentation
  indentAfter: '{([',      // pressing Enter after one of these indents the next line
  dedent: '}])',           // typing one of these on an indent-only line moves it one level back
};

const LANGS = {
  rust: {
    comment: '//',
    charLiteral: true, // 'a' is a char literal
    keywords: 'as break const continue crate else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while',
    types: 'i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 bool char str String Vec Option Result Box Some None Ok Err',
    // No ' pair: Rust uses ' for lifetimes ('a) as much as for chars.
    editor: {},
  },
  javascript: {
    comment: '//',
    keywords: 'async await break case catch class const continue default delete do else export extends false finally for function if import in instanceof let new null of return static super switch this throw true try typeof undefined var void while yield',
    types: 'Array Boolean Date Error JSON Map Math Number Object Promise Set String Symbol console',
    editor: { pairs: { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' }, quotes: ['"', "'", '`'], indent: '  ' },
  },
  c: {
    comment: '//',
    charLiteral: true,
    keywords: 'auto break case char const continue default do double else enum extern float for goto if inline int long register return short signed sizeof static struct switch typedef union unsigned void volatile while',
    types: 'size_t FILE NULL bool true false printf scanf puts putchar getchar malloc free strlen strcmp strcpy abs sqrt pow',
    editor: { pairs: { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" } },
  },
  cpp: {
    comment: '//',
    charLiteral: true,
    keywords: 'auto bool break case catch char class const constexpr continue default delete do double else enum explicit extern false float for friend goto if inline int long mutable namespace new nullptr operator private protected public return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile while',
    types: 'string vector map set cout cin cerr endl size_t std unique_ptr shared_ptr array pair NULL',
    editor: { pairs: { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" } },
  },
  go: {
    comment: '//',
    keywords: 'break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var',
    types: 'int int8 int16 int32 int64 uint uint8 uint16 uint32 uint64 float32 float64 string bool byte rune error nil true false fmt Println Printf Sprintf len cap append make',
    editor: { pairs: { '(': ')', '[': ']', '{': '}', '"': '"', '`': '`' }, quotes: ['"', '`'] }, // spaces, not tabs, so the cursor stays aligned
  },
  java: {
    comment: '//',
    charLiteral: true,
    keywords: 'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long new package private protected public return short static super switch this throw throws try void while var true false null',
    types: 'String Integer Double Boolean Math System List ArrayList Map HashMap Scanner Object Arrays',
    editor: { pairs: { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" } },
  },
  python: {
    comment: '#',
    keywords: 'and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield',
    types: 'bool dict float int list set str tuple print len range',
    editor: { pairs: { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" }, quotes: ['"', "'"], indentAfter: '{([:', dedent: '' },
  },
};

const ALIASES = { rs: 'rust', js: 'javascript', node: 'javascript', py: 'python', 'c++': 'cpp', cc: 'cpp', golang: 'go' };

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');

function prepare(L) {
  L.kw = new Set(L.keywords.split(' '));
  L.ty = new Set(L.types.split(' '));
  const quotes = (L.editor && L.editor.quotes) || DEFAULT_EDITOR.quotes;
  // strings may be unterminated while the learner is still typing
  const strings = quotes.map((q) => {
    const e = escapeRe(q);
    return e + '(?:[^' + e + '\\\\]|\\\\.)*(?:' + e + '|$)';
  });
  if (L.charLiteral) strings.push("'(?:[^'\\\\]|\\\\.)'");
  L.re = new RegExp(
    '(' + escapeRe(L.comment) + '.*$)' +          // 1 comment
    '|(___)' +                                      // 2 blank to fill in
    '|(' + strings.join('|') + ')' +                // 3 string
    '|\\b(\\d[\\d_]*(?:\\.\\d+)?)\\b' +             // 4 number
    '|\\b([A-Za-z_]\\w*!?)',                        // 5 word
    'g'
  );
  return L;
}

/** Canonical language name ("rs" -> "rust"), or the name itself when unknown. */
const canonical = (name) => ALIASES[name] || name;

/** Language definition (with colors regex prepared) or null when unknown. */
function get(name) {
  const L = LANGS[ALIASES[name] || name];
  if (!L) return null;
  return L.re ? L : prepare(L);
}

/** Editor settings for a language, before course/user overrides. */
function editorDefaults(name) {
  const L = LANGS[ALIASES[name] || name];
  return { ...DEFAULT_EDITOR, ...((L && L.editor) || {}) };
}

module.exports = { get, canonical, editorDefaults, DEFAULT_EDITOR };
