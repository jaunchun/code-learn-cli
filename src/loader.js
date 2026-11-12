'use strict';
// Finds courses on disk, reads them, and checks them for mistakes.
//
//   courses/<course-id>/course.json
//   courses/<course-id>/<lesson-id>/lesson.md
//   courses/<course-id>/<lesson-id>/questions.json
//
// Courses are searched in: <app>/courses, ~/.clx/courses, and every folder in $CLX_COURSES.

const fs = require('fs');
const path = require('path');
const progress = require('./progress');
const { env } = require('./env');
const { gradeAnswer, grade, toArray } = require('./grader');
const runner = require('./runner');

const QUESTION_TYPES = ['choice', 'fill', 'fix', 'write'];
const QUESTION_KEYS = new Set(['type', 'prompt', 'code', 'options', 'answer', 'checks', 'explanation', 'hint', 'solution', 'shuffle', 'suggest', 'run']);
const OPTION_KEYS = new Set(['text', 'correct', 'explain']);
const EDITOR_KEYS = new Set(['pairs', 'quotes', 'indent', 'indentAfter', 'dedent']);
const CHECK_KEYS = new Set(['has', 'regex', 'flags', 'not', 'explain', 'enforce']);
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const RESERVED_DIRS = new Set(['challenges', 'projects', 'guides']); // inside a course folder: not lessons
const CHALLENGE_KEYS = new Set(['title', 'difficulty', 'prompt', 'starter', 'hints', 'run', 'solution', 'explanation', 'checks', 'answer', 'suggest']);
const PROJECT_KEYS = new Set(['title', 'difficulty', 'time', 'skills']);
const GUIDE_KEYS = new Set(['title', 'summary']);
const RUN_KEYS = new Set(['template', 'output', 'exact']);

const isStr = (v) => typeof v === 'string' && v.trim() !== '';

function courseRoots() {
  const roots = [path.join(__dirname, '..', 'courses'), path.join(progress.home, 'courses')];
  if (env('COURSES')) roots.push(...env('COURSES').split(path.delimiter).filter(Boolean));
  return roots;
}

function listDirs(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('.') && !d.name.startsWith('_'))
      .map((d) => d.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

function readJSON(file, errors) {
  const name = path.basename(file);
  if (!fs.existsSync(file)) { errors.push(`${name} is missing`); return null; }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${name} is not valid JSON: ${e.message}`);
    return null;
  }
}

// ------------------------------------------------------------------ questions
function validateQuestion(q, i, lang = '', deep = false, opts = {}) {
  const errors = [];
  const warnings = [];
  let skippedRun = false;
  const at = `Q${i + 1}`;
  const err = (m) => errors.push(`${at}: ${m}`);
  const warn = (m) => warnings.push(`${at}: ${m}`);

  if (!q || typeof q !== 'object' || Array.isArray(q)) { err('must be an object'); return { errors, warnings, skippedRun }; }
  if (!QUESTION_TYPES.includes(q.type)) {
    err(`"type" must be one of: ${QUESTION_TYPES.join(', ')}`);
    return { errors, warnings, skippedRun };
  }
  for (const k of Object.keys(q)) if (!QUESTION_KEYS.has(k)) warn(`unknown key "${k}" (typo?)`);
  if (!isStr(q.prompt)) err('"prompt" is required');
  if (q.suggest !== undefined && !(Array.isArray(q.suggest) && q.suggest.every(isStr))) err('"suggest" must be an array of non-empty strings');
  if (!isStr(q.explanation)) warn('no "explanation" - add one so learners see why the right answer is right');

  if (q.type === 'choice') {
    if (q.run !== undefined) warn('"run" is ignored for choice questions');
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 5) {
      err('"options" must be an array of 2-5 options');
    } else {
      let correct = 0;
      q.options.forEach((o, j) => {
        const n = j + 1;
        if (!o || typeof o !== 'object') { err(`option ${n} must be an object`); return; }
        for (const k of Object.keys(o)) if (!OPTION_KEYS.has(k)) warn(`option ${n}: unknown key "${k}"`);
        if (!isStr(o.text)) err(`option ${n} needs "text"`);
        if (o.correct === true) correct++;
        else if (!isStr(o.explain)) err(`wrong option ${n} needs "explain" (why this answer is wrong)`);
        else if (o.explain.trim().length < 25) warn(`option ${n}: "explain" is very short - say WHY it is wrong`);
      });
      if (correct !== 1) err(`exactly one option must have "correct": true (found ${correct})`);
    }
    return { errors, warnings, skippedRun };
  }

  // fill / fix / write
  const answers = toArray(q.answer);
  if (q.checks !== undefined && !Array.isArray(q.checks)) err('"checks" must be an array');
  const checks = Array.isArray(q.checks) ? q.checks : [];

  checks.forEach((k, j) => {
    const where = `checks[${j}]`;
    if (!k || typeof k !== 'object') { err(`${where} must be an object`); return; }
    for (const key of Object.keys(k)) if (!CHECK_KEYS.has(key)) warn(`${where}: unknown key "${key}"`);
    if (!isStr(k.explain)) err(`${where} needs "explain"`);
    if (!isStr(k.has) && !isStr(k.regex)) err(`${where} needs "has" or "regex"`);
    if (k.enforce !== undefined && typeof k.enforce !== 'boolean') err(`${where}: "enforce" must be true or false`);
    if (isStr(k.regex)) {
      try { new RegExp(k.regex, k.flags || ''); } catch (e) { err(`${where} has an invalid regex: ${e.message}`); }
    }
  });
  if (!opts.allowNoChecks && !answers.length && !checks.some((k) => k && !k.not)) err('needs "answer" or at least one normal (non-"not") check');

  if (q.type === 'fill' && !(isStr(q.code) && q.code.includes('___'))) err('"code" must contain a ___ blank');
  if (q.type === 'fix' && !isStr(q.code)) err('"code" (the broken code) is required');
  if ((q.type === 'fix' || q.type === 'write') && !isStr(q.solution)) err('"solution" is required');

  // "run": program template used for smart grading
  if (q.run !== undefined) {
    if (!q.run || typeof q.run !== 'object' || Array.isArray(q.run)) {
      err('"run" must be an object like { "template": "...{{code}}...", "output": "..." }');
    } else {
      for (const k of Object.keys(q.run)) if (!RUN_KEYS.has(k)) warn(`run: unknown key "${k}"`);
      if (!isStr(q.run.template) || !q.run.template.includes('{{code}}')) err('run.template must be a program containing {{code}}');
      if (q.run.output !== undefined && typeof q.run.output !== 'string') err('run.output must be a string');
      if (q.run.exact !== undefined && typeof q.run.exact !== 'boolean') err('run.exact must be true or false');
    }
  }

  // Self-test: the answers and the solution must be graded as correct.
  if (!errors.length) {
    const samples = [...answers];
    if (isStr(q.solution)) samples.push(q.solution);
    for (const s of samples) {
      const r = gradeAnswer(q, s);
      if (!r.correct) {
        err(`self-test failed: ${JSON.stringify(s)} should be correct but is graded wrong` +
            (r.problems.length ? ` (${r.problems.join(' | ')})` : ' (does not match "answer")'));
      }
    }
    // ...and, when a "run" block exists, they must really work when compiled and run.
    if (deep && q.run && !errors.length) {
      if (!runner.available(lang)) {
        skippedRun = true;
      } else {
        for (const s of samples) {
          const r = grade(q, s, lang);
          if (!r.correct) {
            const why = r.detail
              ? r.detail.kind === 'output'
                ? `printed ${JSON.stringify(r.detail.got)} but run.output is ${JSON.stringify(r.detail.expected)}`
                : r.detail.message
              : r.problems.join(' | ');
            err(`run self-test failed: ${JSON.stringify(s)} -> ${why}`);
          }
        }
      }
    }
  }
  return { errors, warnings, skippedRun };
}

// ------------------------------------------------------------------ challenges
// One JSON file per challenge in <course>/challenges/. A challenge is a bigger "write" task that is
// always graded by running the code, and has a title, difficulty, starter code and progressive hints.
function validateChallenge(c, lang, deep) {
  const errors = [];
  const warnings = [];
  if (!c || typeof c !== 'object' || Array.isArray(c)) return { errors: ['must be a JSON object'], warnings, skippedRun: false };

  for (const k of Object.keys(c)) if (!CHALLENGE_KEYS.has(k)) warnings.push(`unknown key "${k}" (typo?)`);
  if (!isStr(c.title)) errors.push('"title" is required');
  if (!DIFFICULTIES.includes(c.difficulty)) errors.push(`"difficulty" must be one of: ${DIFFICULTIES.join(', ')}`);
  if (c.starter !== undefined && typeof c.starter !== 'string') errors.push('"starter" must be a string');
  if (c.hints !== undefined && !(Array.isArray(c.hints) && c.hints.every(isStr))) errors.push('"hints" must be an array of strings');
  else if (!c.hints || !c.hints.length) warnings.push('no "hints" - add 2-3, from gentle to specific');
  if (c.run === undefined) errors.push('"run" is required: challenges are graded by running the code');

  // everything else is checked like a "write" question
  const q = { type: 'write' };
  for (const k of Object.keys(c)) if (CHALLENGE_KEYS.has(k) && !['title', 'difficulty', 'starter', 'hints'].includes(k)) q[k] = c[k];
  const r = validateQuestion(q, 0, lang, deep, { allowNoChecks: true });
  const strip = (m) => m.replace(/^Q1: /, '');
  errors.push(...r.errors.map(strip));
  warnings.push(...r.warnings.map(strip));
  return { errors, warnings, skippedRun: r.skippedRun };
}

function listFiles(dir, ext) {
  try {
    return fs.readdirSync(dir)
      .filter((f) => f.endsWith(ext) && !f.startsWith('.') && !f.startsWith('_'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

function loadChallenges(courseDir, language, deep) {
  const dir = path.join(courseDir, 'challenges');
  return listFiles(dir, '.json').map((file) => {
    const ch = { id: path.basename(file, '.json'), file, title: file, difficulty: 'easy', prompt: '', starter: '', hints: [], solution: '', explanation: '', q: null, errors: [], warnings: [] };
    const data = readJSON(path.join(dir, file), ch.errors);
    if (data) {
      const r = validateChallenge(data, language, deep);
      ch.errors.push(...r.errors);
      ch.warnings.push(...r.warnings);
      if (r.skippedRun) {
        const R = runner.runnerFor(language);
        ch.warnings.push(`solution not test-run: ${R ? R.name : 'the language tools'} not found`);
      }
      if (!r.errors.length) {
        Object.assign(ch, { title: data.title, difficulty: data.difficulty, prompt: data.prompt, starter: data.starter || '', hints: data.hints || [], solution: data.solution, explanation: data.explanation || '' });
        ch.q = { ...data, type: 'write' }; // what the grader sees
      }
    }
    return ch;
  });
}

// ------------------------------------------------------------------ project ideas
// <course>/projects/*.md: a front matter block (title, difficulty, time, skills), then Markdown.
function parseFrontMatter(text) {
  const m = text.replace(/\r/g, '').match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n([\s\S]*))?$/);
  if (!m) return null;
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (kv) meta[kv[1].toLowerCase()] = kv[2].trim();
  }
  return { meta, body: (m[2] || '').trim() };
}

function loadProjects(courseDir) {
  const dir = path.join(courseDir, 'projects');
  return listFiles(dir, '.md').map((file) => {
    const p = { id: path.basename(file, '.md'), file, title: file, difficulty: 'easy', time: '', skills: '', pages: [], errors: [], warnings: [] };
    const parsed = parseFrontMatter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (!parsed) {
      p.errors.push('needs a front matter block at the top: --- / title: ... / difficulty: ... / ---');
      return p;
    }
    const { meta, body } = parsed;
    for (const k of Object.keys(meta)) if (!PROJECT_KEYS.has(k)) p.warnings.push(`unknown front matter key "${k}"`);
    if (!isStr(meta.title)) p.errors.push('front matter needs "title"'); else p.title = meta.title;
    if (!DIFFICULTIES.includes(meta.difficulty)) p.errors.push(`front matter "difficulty" must be one of: ${DIFFICULTIES.join(', ')}`); else p.difficulty = meta.difficulty;
    p.time = meta.time || '';
    p.skills = meta.skills || '';
    p.pages = body.split(/^---\s*$/m).map((x) => x.trim()).filter(Boolean);
    if (!p.pages.length) p.errors.push('the project has no text after the front matter');
    if (!p.time) p.warnings.push('no "time" estimate in the front matter');
    return p;
  });
}

// ------------------------------------------------------------------ guides
// <course>/guides/*.md: cheat sheets, best practices, how-tos. Front matter: title (+ summary), then Markdown.
function loadGuides(courseDir) {
  const dir = path.join(courseDir, 'guides');
  return listFiles(dir, '.md').map((file) => {
    const g = { id: path.basename(file, '.md'), file, title: file, summary: '', pages: [], errors: [], warnings: [] };
    const parsed = parseFrontMatter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (!parsed) {
      g.errors.push('needs a front matter block at the top: --- / title: ... / summary: ... / ---');
      return g;
    }
    const { meta, body } = parsed;
    for (const k of Object.keys(meta)) if (!GUIDE_KEYS.has(k)) g.warnings.push(`unknown front matter key "${k}"`);
    if (!isStr(meta.title)) g.errors.push('front matter needs "title"'); else g.title = meta.title;
    g.summary = meta.summary || '';
    g.pages = body.split(/^---\s*$/m).map((x) => x.trim()).filter(Boolean);
    if (!g.pages.length) g.errors.push('the guide has no text after the front matter');
    if (!g.summary) g.warnings.push('no "summary" line in the front matter');
    return g;
  });
}

// ------------------------------------------------------------------ lessons & courses
function loadLesson(dir, language = '', deep = false) {
  const lesson = { id: path.basename(dir), dir, title: path.basename(dir), pages: [], questions: [], errors: [], warnings: [] };

  const mdFile = path.join(dir, 'lesson.md');
  if (!fs.existsSync(mdFile)) {
    lesson.errors.push('lesson.md is missing');
  } else {
    const md = fs.readFileSync(mdFile, 'utf8');
    const title = md.match(/^#\s+(.+)$/m);
    if (title) lesson.title = title[1].trim(); else lesson.warnings.push('lesson.md has no "# Title" line');
    lesson.pages = md.split(/^---\s*$/m).map((p) => p.trim()).filter(Boolean);
    if (!lesson.pages.length) lesson.errors.push('lesson.md is empty');
  }

  const questions = readJSON(path.join(dir, 'questions.json'), lesson.errors);
  if (questions !== null) {
    if (!Array.isArray(questions) || !questions.length) {
      lesson.errors.push('questions.json must be a non-empty array');
    } else {
      lesson.questions = questions;
      if (questions.length < 3) lesson.warnings.push('fewer than 3 questions (5-8 is a good size)');
      let skipped = 0;
      questions.forEach((q, i) => {
        const r = validateQuestion(q, i, language, deep);
        lesson.errors.push(...r.errors);
        lesson.warnings.push(...r.warnings);
        if (r.skippedRun) skipped++;
      });
      if (skipped) {
        const R = runner.runnerFor(language);
        lesson.warnings.push(`${skipped} question(s) not test-run: ${R ? R.name : 'the language tools'} not found${R ? ' (' + R.install + ')' : ''}`);
      }
    }
  }
  return lesson;
}

function loadCourse(dir, deep = false) {
  const course = { id: path.basename(dir), dir, title: path.basename(dir), description: '', language: '', order: 1000, editor: {}, lessons: [], challenges: [], projects: [], guides: [], errors: [] };
  const meta = readJSON(path.join(dir, 'course.json'), course.errors);
  if (meta) {
    if (isStr(meta.title)) course.title = meta.title; else course.errors.push('course.json needs a "title"');
    course.description = isStr(meta.description) ? meta.description : '';
    course.language = isStr(meta.language) ? meta.language.toLowerCase() : '';
    if (meta.order !== undefined) {
      if (typeof meta.order === 'number') course.order = meta.order;
      else course.errors.push('course.json: "order" must be a number');
    }
    if (meta.editor !== undefined) {
      if (!meta.editor || typeof meta.editor !== 'object' || Array.isArray(meta.editor)) {
        course.errors.push('course.json: "editor" must be an object');
      } else {
        course.editor = meta.editor;
        for (const k of Object.keys(meta.editor)) {
          if (!EDITOR_KEYS.has(k)) course.errors.push(`course.json: unknown editor setting "${k}" (allowed: ${[...EDITOR_KEYS].join(', ')})`);
        }
      }
    }
  }
  for (const name of listDirs(dir).filter((n) => !RESERVED_DIRS.has(n))) course.lessons.push(loadLesson(path.join(dir, name), course.language, deep));
  course.challenges = loadChallenges(dir, course.language, deep);
  course.projects = loadProjects(dir);
  course.guides = loadGuides(dir);
  if (!course.lessons.length && !course.challenges.length && !course.projects.length && !course.guides.length) course.errors.push('no lesson folders (or challenges / projects / guides) found');
  return course;
}

const loadRoot = (root, deep = false) => listDirs(root).map((n) => loadCourse(path.join(root, n), deep));

/** Courses that can be played: broken courses/lessons are left out and counted in `skipped`. */
function loadPlayable() {
  const byId = new Map();
  let skipped = 0;
  for (const root of courseRoots()) {
    for (const course of loadRoot(root)) {
      if (course.errors.length) { skipped++; continue; }
      for (const key of ['lessons', 'challenges', 'projects', 'guides']) {
        const good = course[key].filter((x) => !x.errors.length);
        skipped += course[key].length - good.length;
        course[key] = good;
      }
      if (!course.lessons.length && !course.challenges.length && !course.projects.length && !course.guides.length) continue;
      byId.set(course.id, course); // a later folder (e.g. ~/.clx/courses) overrides an earlier one
    }
  }
  const courses = [...byId.values()].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return { courses, skipped };
}

/** For `clx validate [path]`: a course folder, a folder of courses, or (no path) everything. */
function loadForValidation(target) {
  if (!target) return courseRoots().flatMap((r) => loadRoot(r, true));
  const abs = path.resolve(target);
  if (fs.existsSync(path.join(abs, 'course.json'))) return [loadCourse(abs, true)];
  return loadRoot(abs, true);
}

module.exports = { courseRoots, loadPlayable, loadForValidation, validateQuestion };
