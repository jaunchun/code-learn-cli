'use strict';
// Optional user settings in ~/.clx/config.json (folder can be changed with CLX_HOME):
//
// {
//   "autoPairs": true,        // typing ( inserts ()  -  same for { [ " and so on
//   "autoIndent": true,       // keep indentation when pressing Enter
//   "suggestions": true,      // grey autocomplete hints inside the code editor
//   "classicInput": false,    // true = plain typed input, no arrow-key menus / editor
//   "languages": {            // per-language overrides of the editor
//     "rust": { "pairs": { "(": ")", "{": "}" }, "indent": "  " }
//   }
// }

const fs = require('fs');
const path = require('path');
const progress = require('./progress');
const { env } = require('./env');
const languages = require('./languages');

let cache = null;

function load() {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(path.join(progress.home, 'config.json'), 'utf8')) || {};
  } catch {
    cache = {};
  }
  return cache;
}

// Keep only well-formed editor fields (a typo in a config file must never crash the app).
function sanitize(e) {
  const out = {};
  if (!e || typeof e !== 'object') return out;
  if (e.pairs && typeof e.pairs === 'object' && !Array.isArray(e.pairs)) {
    out.pairs = {};
    for (const [open, close] of Object.entries(e.pairs)) {
      if (open.length === 1 && typeof close === 'string' && close.length === 1) out.pairs[open] = close;
    }
  }
  if (Array.isArray(e.quotes)) out.quotes = e.quotes.filter((q) => typeof q === 'string' && q.length === 1);
  for (const k of ['indent', 'indentAfter', 'dedent']) if (typeof e[k] === 'string') out[k] = e[k];
  return out;
}

/** Final editor settings: language defaults < course.json "editor" < user config. */
function editorFor(lang, courseEditor) {
  const cfg = load();
  const merged = {
    ...languages.editorDefaults(lang),
    ...sanitize(courseEditor),
    ...sanitize((cfg.languages || {})[lang]),
  };
  merged.autoPairs = cfg.autoPairs !== false;
  merged.autoIndent = cfg.autoIndent !== false;
  merged.suggestions = cfg.suggestions !== false;
  return merged;
}

const classicInput = () => Boolean(env('CLASSIC')) || load().classicInput === true;

module.exports = { load, editorFor, sanitize, classicInput };
