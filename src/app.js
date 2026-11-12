'use strict';
// The screens: course list -> lesson list -> material -> questions -> results.

const ui = require('./ui');
const loader = require('./loader');
const progress = require('./progress');
const { env } = require('./env');
const prompts = require('./prompts');
const config = require('./config');
const { grade, canRun, toArray } = require('./grader');
const runner = require('./runner');
const pkg = require('../package.json');

const { c } = ui;
const LETTERS = 'ABCDEFGH';
const TYPE_LABEL = { choice: 'Multiple choice', fill: 'Fill in the blank', fix: 'Fix the code', write: 'Write code' };

// ------------------------------------------------------------------ entry
async function main(args) {
  const [cmd] = args;
  try {
    switch (cmd) {
      case undefined:
      case 'start': await homeScreen(); break;
      case 'validate': process.exitCode = validateCommand(args[1]); break;
      case 'reset': await resetCommand(); break;
      case '-v':
      case '--version': console.log(pkg.version); break;
      case '-h':
      case '--help':
      case 'help': printHelp(); break;
      default:
        console.log(`Unknown command: ${cmd}\n`);
        printHelp();
        process.exitCode = 1;
    }
  } catch (e) {
    if (e instanceof ui.QuitSignal) console.log('\n  ' + c.gray('Bye! Keep practicing.') + '\n');
    else throw e;
  } finally {
    prompts.close();
  }
}

function printHelp() {
  console.log(`
  ${c.bold('Code Learn')} - learn to code in your terminal

  ${c.cyan('clx')}                 start learning
  ${c.cyan('clx validate [path]')} check courses for mistakes (use this after writing a lesson)
  ${c.cyan('clx reset')}           forget all saved progress
  ${c.cyan('clx help')}            show this help

  Courses live in:  <this folder>/courses  and  ~/.clx/courses
  Editor settings:  ~/.clx/config.json   (auto-closing brackets, indentation, suggestions)
  Docs for adding courses (and for AI authors):  docs/AI_AUTHORING_GUIDE.md
`);
}

// ------------------------------------------------------------------ menus
async function menu(title, items, { back = false } = {}) {
  console.log('  ' + c.bold(title) + '\n');
  const r = await prompts.select({
    items,
    keys: back ? { q: 'quit', b: 'back' } : { q: 'quit' },
    footer: `↑/↓ move  ·  Enter open  ·  ${back ? 'b back  ·  ' : ''}q quit`,
    fallbackFooter: `number = open  ·  ${back ? 'b = back  ·  ' : ''}q = quit`,
  });
  if (r.cmd === 'quit') throw new ui.QuitSignal();
  if (r.cmd === 'back') return -1;
  return r.index;
}

async function homeScreen() {
  while (true) {
    const { courses, skipped } = loader.loadPlayable();
    ui.clear();
    ui.banner();

    if (!courses.length) {
      console.log('  No courses found. Put course folders in one of these places:\n');
      loader.courseRoots().forEach((r) => console.log('    ' + r));
      console.log('\n  See docs/AI_AUTHORING_GUIDE.md\n');
      return;
    }
    if (skipped) console.log(c.yellow(`  ! ${skipped} lesson(s)/course(s) skipped because of errors. Run "clx validate" to see them.\n`));

    const prog = progress.load();
    const idx = await menu('Pick a course', courses.map((co) => {
      const done = co.lessons.filter((l) => progress.status(prog, co.id, l.id)).length;
      const parts = [];
      if (co.lessons.length) parts.push(`${done}/${co.lessons.length} lessons`);
      if (co.challenges.length) parts.push(`${co.challenges.length} challenges`);
      if (co.projects.length) parts.push(`${co.projects.length} project ideas`);
      if (co.guides.length) parts.push(`${co.guides.length} guides`);
      return { label: co.title, hint: parts.join(' · ') + (co.description ? '  ·  ' + co.description : '') };
    }));
    await courseScreen(courses[idx]);
  }
}

const DIFF_COLOR = { easy: c.green, medium: c.yellow, hard: c.red };
const diffTag = (d) => (DIFF_COLOR[d] || c.gray)(d);

// A course with only lessons goes straight to the lesson list; otherwise there is a small hub.
async function courseScreen(course) {
  const hasExtras = course.challenges.length || course.projects.length || course.guides.length;
  if (!hasExtras) return lessonList(course);

  while (true) {
    const prog = progress.load();
    ui.clear();
    ui.banner(course.title);

    const sections = [];
    if (course.lessons.length) {
      const done = course.lessons.filter((l) => progress.status(prog, course.id, l.id)).length;
      sections.push({ label: 'Lessons', hint: `${done}/${course.lessons.length} done`, open: () => lessonList(course) });
    }
    if (course.challenges.length) {
      const done = course.challenges.filter((x) => progress.challengeStatus(prog, course.id, x.id)).length;
      sections.push({ label: 'Challenges', hint: `${done}/${course.challenges.length} solved`, open: () => challengeList(course) });
    }
    if (course.projects.length) {
      const done = course.projects.filter((x) => progress.projectStatus(prog, course.id, x.id) === 'done').length;
      sections.push({ label: 'Project ideas', hint: `${done}/${course.projects.length} built`, open: () => projectList(course) });
    }

    if (course.guides.length) {
      sections.push({ label: 'Guides & cheat sheets', hint: `${course.guides.length} guides`, open: () => guideList(course) });
    }

    const idx = await menu('What do you want to do?', sections, { back: true });
    if (idx === -1) return;
    await sections[idx].open();
  }
}

async function lessonList(course) {
  while (true) {
    const prog = progress.load();
    ui.clear();
    ui.banner(course.title + ' › Lessons');

    const idx = await menu('Pick a lesson', course.lessons.map((l) => {
      const st = progress.status(prog, course.id, l.id);
      return {
        label: (st ? c.green('✔') : c.gray('○')) + ' ' + l.title,
        hint: st ? `best ${st.best}/${st.total}` : `${l.questions.length} questions`,
      };
    }), { back: true });

    if (idx === -1) return;
    await lessonScreen(course, course.lessons[idx]);
  }
}

// ------------------------------------------------------------------ challenges
async function challengeList(course) {
  while (true) {
    const prog = progress.load();
    ui.clear();
    ui.banner(course.title + ' › Challenges');
    console.log(ui.paragraph('Bigger problems with no step-by-step help. Write the code, run it against tests, and ask for hints only when you are stuck.') + '\n');

    const idx = await menu('Pick a challenge', course.challenges.map((ch) => {
      const st = progress.challengeStatus(prog, course.id, ch.id);
      return {
        label: (st ? c.green('✔') : c.gray('○')) + ' ' + ch.title + '  ' + diffTag(ch.difficulty),
        hint: st ? `solved in ${st.attempts} ${st.attempts === 1 ? 'try' : 'tries'}${st.hints ? `, ${st.hints} hint${st.hints === 1 ? '' : 's'}` : ''}` : '',
      };
    }), { back: true });

    if (idx === -1) return;
    await challengeScreen(course, course.challenges[idx]);
  }
}

function showSolution(ch, lang) {
  console.log('\n  ' + c.bold('Reference solution:') + '\n');
  console.log(ui.codeBlock(ch.solution, lang));
  if (ch.explanation) console.log('\n' + ui.paragraph(ch.explanation, '    '));
  console.log();
}

async function challengeMenu(ch, hintsShown) {
  const left = ch.hints.length - hintsShown;
  const r = await prompts.select({
    items: [
      { label: 'Keep editing' },
      { label: left > 0 ? `Show a hint  (${hintsShown}/${ch.hints.length} used)` : 'Show a hint  (no more hints)', disabled: left <= 0 },
      { label: 'Give up and show the solution' },
      { label: 'Leave this challenge' },
    ],
    keys: { e: 'edit', h: 'hint', s: 'solution', q: 'leave' },
    footer: '↑/↓ move  ·  Enter select  ·  e edit  ·  h hint  ·  s solution  ·  q leave',
    fallbackFooter: 'number = choose  ·  :h hint  ·  :s solution  ·  :q leave',
  });
  if (r.cmd) return r.cmd;
  return ['edit', 'hint', 'solution', 'leave'][r.index];
}

async function challengeScreen(course, ch) {
  const lang = course.language;
  const crumb = `${course.title} › Challenges`;
  ui.clear();
  ui.banner(crumb);

  if (!canRun(ch.q, lang)) {
    const R = runner.runnerFor(lang);
    console.log(ui.paragraph(`Challenges check your code by running it, which needs ${R ? R.name : 'the language tools'} on this computer.` +
      (R ? ` Install it from ${R.install} and come back.` : '')) + '\n');
    await prompts.pause('Press Enter ');
    return;
  }

  console.log('  ' + c.bold(ch.title) + '  ' + diffTag(ch.difficulty));
  console.log(ui.renderMarkdown(ch.prompt, lang));
  console.log();

  const cfg = config.editorFor(lang, course.editor);
  const candidates = candidatesFor(ch.q);
  const interactive = prompts.interactive();
  if (!interactive && ch.starter) {
    console.log('  ' + c.gray('Starter code:'));
    console.log(ui.codeBlock(ch.starter.replace('$0', ''), lang) + '\n');
  }

  let code = ch.starter;
  let cursor;
  let attempts = 0;
  let hintsShown = 0;

  while (true) {
    const r = await prompts.editCode({
      lang, multiline: true, cfg, candidates, initial: code, cursor, escMenu: true, erase: true,
      help: 'Ctrl+D run your code  ·  Esc menu (hints, solution)  ·  Tab autocomplete',
    });
    code = r.text;
    cursor = r.cursor;

    let action = null;
    const typed = parseCommand(r.text);
    if (typed === 'leave') action = 'leave';
    else if (typed === 'hint') action = 'hint';
    else if (typed === 'skip') action = 'solution';
    else if (r.menu) action = await challengeMenu(ch, hintsShown);
    else if (!r.text.trim()) { console.log('  ' + c.gray('Write some code first.') + '\n'); continue; }
    else {
      attempts++;
      const result = gradeWithSpinner(ch.q, r.text, lang);
      if (result.correct) {
        console.log('  ' + c.green(c.bold('✔ Solved!')) + c.gray(`  ${attempts} ${attempts === 1 ? 'try' : 'tries'}` + (hintsShown ? `, ${hintsShown} hint${hintsShown === 1 ? '' : 's'}` : ', no hints')));
        if (ch.explanation) console.log(ui.paragraph(ch.explanation, '    '));
        progress.recordChallenge(course.id, ch.id, { attempts, hints: hintsShown });
        console.log();
        const after = await prompts.select({
          items: [{ label: 'Back to challenges' }, { label: 'See the reference solution' }],
          keys: { q: 'back' },
          footer: '↑/↓ move  ·  Enter select',
          fallbackFooter: 'number = choose',
        });
        if (after.index === 1) { showSolution({ ...ch, explanation: '' }, lang); await prompts.pause('Press Enter '); }
        return;
      }
      printWrong(result.problems.length ? result.problems : (result.detail ? [] : ['That is not the expected result.']));
      if (result.detail) { if (result.problems.length) console.log(); printDetail(result.detail); }
      console.log();
      action = await challengeMenu(ch, hintsShown);
    }

    if (action === 'leave') return;
    if (action === 'solution') {
      showSolution(ch, lang);
      await prompts.pause('Press Enter to go back ');
      return;
    }
    if (action === 'hint') {
      if (hintsShown < ch.hints.length) {
        console.log('  ' + c.yellow(`Hint ${hintsShown + 1}/${ch.hints.length}: `) + ui.paragraph(ch.hints[hintsShown], '', '       '));
        hintsShown++;
      } else {
        console.log('  ' + c.gray('No more hints for this challenge.'));
      }
      console.log();
    }
    // 'edit' (and after a hint) -> back to the editor with the same code
  }
}

// ------------------------------------------------------------------ project ideas
async function projectList(course) {
  while (true) {
    const prog = progress.load();
    ui.clear();
    ui.banner(course.title + ' › Project ideas');
    console.log(ui.paragraph('Things to build on your own once you know the basics. Each idea lists what to build, steps to follow and stretch goals.') + '\n');

    const idx = await menu('Pick a project', course.projects.map((p) => {
      const st = progress.projectStatus(prog, course.id, p.id);
      const mark = st === 'done' ? c.green('✔') : st === 'started' ? c.yellow('◐') : c.gray('○');
      return { label: `${mark} ${p.title}  ${diffTag(p.difficulty)}`, hint: p.time };
    }), { back: true });

    if (idx === -1) return;
    await projectScreen(course, course.projects[idx]);
  }
}

async function projectScreen(course, p) {
  const crumb = `${course.title} › Project ideas`;
  for (let i = 0; i < p.pages.length; i++) {
    ui.clear();
    ui.banner(crumb);
    if (i === 0) {
      console.log('  ' + c.bold(c.cyan(p.title)) + '  ' + diffTag(p.difficulty) + (p.time ? c.gray('  ·  ' + p.time) : ''));
      if (p.skills) console.log('  ' + c.gray('Practices: ' + p.skills));
      console.log();
    }
    console.log(ui.renderMarkdown(p.pages[i], course.language));
    if (p.pages.length > 1) console.log('\n  ' + c.gray(`Page ${i + 1} of ${p.pages.length}`));
    const last = i === p.pages.length - 1;
    const answer = await prompts.pause(last ? 'Press Enter to continue (q = back) ' : 'Press Enter for the next page (q = back) ');
    if (answer === 'q') return;
  }

  const current = progress.projectStatus(progress.load(), course.id, p.id);
  console.log();
  const r = await prompts.select({
    items: [
      { label: 'Back to project ideas' },
      { label: "I'm working on this", disabled: current === 'started' },
      { label: 'I built it  ✔', disabled: current === 'done' },
      { label: 'Mark as not started', disabled: !current },
    ],
    keys: { q: 'back', b: 'back' },
    footer: '↑/↓ move  ·  Enter select',
    fallbackFooter: 'number = choose',
  });
  if (r.index === 1) progress.setProject(course.id, p.id, 'started');
  else if (r.index === 2) progress.setProject(course.id, p.id, 'done');
  else if (r.index === 3) progress.setProject(course.id, p.id, null);
}

// ------------------------------------------------------------------ guides
async function guideList(course) {
  while (true) {
    ui.clear();
    ui.banner(course.title + ' › Guides');
    console.log(ui.paragraph('Cheat sheets, best practices and how-tos you can come back to any time.') + '\n');

    const idx = await menu('Pick a guide', course.guides.map((g) => ({ label: g.title, hint: g.summary })), { back: true });
    if (idx === -1) return;
    await guideScreen(course, course.guides[idx]);
  }
}

async function guideScreen(course, g) {
  for (let i = 0; i < g.pages.length; i++) {
    ui.clear();
    ui.banner(`${course.title} › Guides`);
    if (i === 0) console.log('  ' + c.bold(c.cyan(g.title)) + '\n');
    console.log(ui.renderMarkdown(g.pages[i], course.language));
    if (g.pages.length > 1) console.log('\n  ' + c.gray(`Page ${i + 1} of ${g.pages.length}`));
    const last = i === g.pages.length - 1;
    const answer = await prompts.pause(last ? 'Press Enter to go back ' : 'Press Enter for the next page (q = back) ');
    if (answer === 'q') return;
  }
}

// ------------------------------------------------------------------ a lesson
async function lessonScreen(course, lesson) {
  const crumb = `${course.title} › ${lesson.title}`;

  // 1) learning material, one page at a time
  for (let i = 0; i < lesson.pages.length; i++) {
    ui.clear();
    ui.banner(crumb);
    console.log(ui.renderMarkdown(lesson.pages[i], course.language));
    console.log('\n  ' + c.gray(`Page ${i + 1} of ${lesson.pages.length}`));
    const last = i === lesson.pages.length - 1;
    const answer = await prompts.pause(last ? 'Press Enter to start the practice (q = back) ' : 'Press Enter to continue (q = back) ');
    if (answer === 'q') return;
  }

  // 2) practice
  const results = [];
  for (let i = 0; i < lesson.questions.length; i++) {
    ui.clear();
    ui.banner(crumb);
    const result = await askQuestion(lesson.questions[i], i, lesson.questions.length, course);
    if (result === 'leave') {
      console.log('\n  ' + c.yellow('You left the lesson - progress was not saved.') + '\n');
      await prompts.pause('Press Enter ');
      return;
    }
    results.push({ ...result, q: lesson.questions[i], n: i + 1 });
    console.log();
    await prompts.pause(i === lesson.questions.length - 1 ? 'Press Enter to see your results ' : 'Press Enter for the next question ');
  }

  // 3) results
  const total = results.length;
  const score = results.filter((r) => r.firstTry).length;
  progress.record(course.id, lesson.id, score, total);

  ui.clear();
  ui.banner(crumb);
  const filled = Math.round((score / total) * 20);
  console.log('  ' + c.bold(c.green('Lesson complete!')) + '\n');
  console.log(`  First-try score:  ${c.bold(`${score}/${total}`)}  ${c.green('█'.repeat(filled))}${c.gray('░'.repeat(20 - filled))}\n`);

  const missed = results.filter((r) => !r.firstTry);
  if (!missed.length) {
    console.log('  ' + c.green('Flawless! Every answer was right on the first try.'));
  } else {
    console.log('  ' + c.bold('Worth another look:'));
    for (const r of missed) {
      const text = r.q.prompt.replace(/\s+/g, ' ');
      console.log(`   ${c.yellow('•')} Q${r.n}: ${text.length > 70 ? text.slice(0, 67) + '...' : text}`);
    }
    console.log('\n  ' + c.gray('Open the lesson again any time to improve your score.'));
  }
  console.log();
  await prompts.pause('Press Enter to go back ');
}

// ------------------------------------------------------------------ questions
// Typing commands in the code box
function parseCommand(raw) {
  const t = raw.trim().toLowerCase();
  if (t === ':h' || t === ':hint') return 'hint';
  if (t === ':s' || t === ':skip') return 'skip';
  if (t === ':q' || t === ':quit') return 'leave';
  return null;
}

// Words the autocomplete may offer: the question's "suggest" list plus every `code` in the prompt.
function candidatesFor(q) {
  const seen = new Set();
  const list = [];
  const add = (t) => {
    t = String(t).trim();
    if (t.length < 2 || t.length > 60 || t.includes('\n') || seen.has(t)) return;
    seen.add(t);
    list.push({ text: t });
  };
  (q.suggest || []).forEach(add);
  for (const m of q.prompt.matchAll(/`([^`]+)`/g)) add(m[1]);
  return list;
}

async function askQuestion(q, index, total, course) {
  console.log('  ' + c.bold(`Question ${index + 1} of ${total}`) + c.gray(`  ·  ${TYPE_LABEL[q.type]}`) + '\n');
  console.log(ui.paragraph(q.prompt));
  if (q.code) {
    console.log();
    console.log(ui.codeBlock(q.code, course.language));
  }
  console.log();
  return q.type === 'choice' ? askChoice(q) : askCode(q, course);
}

function showHint(q) {
  console.log(q.hint ? '  ' + c.yellow('Hint: ') + ui.paragraph(q.hint, '', '        ') : '  ' + c.gray('No hint for this one.'));
  console.log();
}

function printCorrect(q, attempts, extra) {
  console.log('\n  ' + c.green(c.bold('✔ Correct!')) + (attempts === 1 ? c.gray('  First try.') : ''));
  const why = q.explanation || extra;
  if (why) console.log(ui.paragraph(why, '    '));
}

function printWrong(lines) {
  console.log('\n  ' + c.red(c.bold('✘ Not quite.')));
  for (const l of lines) console.log(ui.paragraph(l, '    '));
}

// -- multiple choice (arrow keys, or A-E to jump, Enter to confirm)
async function askChoice(q) {
  const noShuffle = q.shuffle === false || env('NO_SHUFFLE');
  const idx = q.options.map((_, i) => i);
  const opts = (noShuffle ? idx : ui.shuffle(idx)).map((i) => q.options[i]);
  const tried = new Set();
  const last = LETTERS[opts.length - 1];
  const echo = (i, mark) => console.log('  ' + mark + ' ' + c.bold(`${LETTERS[i]})`) + ' ' + opts[i].text.replace(/`/g, ''));
  let attempts = 0;

  while (true) {
    const r = await prompts.select({
      items: opts.map((o, i) => ({ label: o.text, disabled: tried.has(i), tried: tried.has(i) })),
      letters: true,
      keys: { h: 'hint', s: 'skip', q: 'leave' },
      footer: `↑/↓ move  ·  Enter select  ·  A-${last} jump  ·  h hint  ·  s skip  ·  q leave`,
      fallbackFooter: `Type a letter (A-${last})  ·  :h hint  ·  :s skip  ·  :q leave`,
    });

    if (r.cmd === 'leave') return 'leave';
    if (r.cmd === 'hint') { showHint(q); continue; }
    if (r.cmd === 'skip') {
      const right = opts.findIndex((o) => o.correct);
      console.log('  ' + c.yellow(c.bold('Skipped.')) + ' The answer is:\n');
      echo(right, c.cyan('›'));
      if (q.explanation) console.log('\n' + ui.paragraph(q.explanation, '    '));
      return { firstTry: false };
    }

    const pick = r.index;
    attempts++;
    if (opts[pick].correct) {
      echo(pick, c.green('✔'));
      printCorrect(q, attempts, opts[pick].explain);
      return { firstTry: attempts === 1 };
    }
    tried.add(pick);
    echo(pick, c.red('✘'));
    printWrong([opts[pick].explain]);
    console.log('\n  ' + c.gray('Try again:') + '\n');
  }
}

// -- showing why running the code failed
const clip = (text, max = 6) => {
  const rows = String(text).replace(/\r/g, '').replace(/\n+$/, '').split('\n');
  return (rows.length > max ? [...rows.slice(0, max), '...'] : rows).join('\n') || '(nothing)';
};

function printDetail(d) {
  if (!d) return;
  if (d.kind === 'output') {
    console.log(ui.paragraph(d.message, '    '));
    console.log('\n    ' + c.gray('Expected output:'));
    console.log(ui.codeBlock(clip(d.expected), 'text').replace(/^/gm, '  '));
    console.log('    ' + c.gray('Your output:'));
    console.log(ui.codeBlock(clip(d.got), 'text').replace(/^/gm, '  '));
  } else {
    const label = d.kind === 'compile' ? 'The compiler says: ' : d.kind === 'runtime' ? 'Your program crashed: ' : '';
    console.log(ui.paragraph(c.yellow(label) + d.message, '    ', '      '));
  }
}

const warnedNoTool = new Set();
function noteMissingTool(q, lang) {
  if (!q.run || canRun(q, lang) || warnedNoTool.has(lang)) return;
  warnedNoTool.add(lang);
  const R = runner.runnerFor(lang);
  console.log('  ' + c.gray(`(${R ? R.name : 'The language tools'} not found, so answers are checked by pattern instead of by running them.` +
    (R ? ` Install it for smarter checking: ${R.install}` : '') + ')') + '\n');
}

// grade() may compile and run the code, which takes a moment
function gradeWithSpinner(q, text, lang) {
  const slow = canRun(q, lang) && process.stdout.isTTY;
  if (slow) process.stdout.write('  ' + c.gray('Running your code...'));
  const result = grade(q, text, lang);
  if (slow) process.stdout.write('\r\x1b[K');
  return result;
}

// -- fill / fix / write (live code editor)
async function askCode(q, course) {
  const multiline = q.type !== 'fill';
  const lang = course.language;
  const cfg = config.editorFor(lang, course.editor);
  const candidates = candidatesFor(q);
  const help = multiline
    ? 'Enter on an empty line = submit  ·  :h hint  ·  :s skip  ·  :q leave'
    : 'Enter = submit  ·  :h hint  ·  :s skip  ·  :q leave';

  noteMissingTool(q, lang);
  let attempts = 0;
  while (true) {
    const { text } = await prompts.editCode({ lang, multiline, cfg, candidates, help });
    const cmd = parseCommand(text);

    if (cmd === 'leave') return 'leave';
    if (cmd === 'hint') { showHint(q); continue; }
    if (cmd === 'skip') {
      const solution = q.solution || toArray(q.answer)[0];
      console.log('  ' + c.yellow(c.bold('Skipped.')) + ' One correct answer:\n');
      console.log(ui.codeBlock(q.type === 'fill' && q.code ? q.code.replace('___', solution) : solution, lang));
      if (q.explanation) console.log('\n' + ui.paragraph(q.explanation, '    '));
      return { firstTry: false };
    }
    if (!text.trim()) { console.log(c.gray('  Type something first (or :s to skip).\n')); continue; }

    attempts++;
    const result = gradeWithSpinner(q, text, lang);
    if (result.correct) {
      printCorrect(q, attempts);
      return { firstTry: attempts === 1 };
    }
    const fallback = result.detail ? [] : [q.explanation || 'That is not the expected answer.'];
    printWrong(result.problems.length ? result.problems : fallback);
    if (result.detail) {
      if (result.problems.length) console.log();
      printDetail(result.detail);
    }
    if (attempts === 2 && q.hint) { console.log(); showHint(q); }
    else console.log();
    console.log('  ' + c.gray('Try again:') + '\n');
  }
}

// ------------------------------------------------------------------ other commands
function validateCommand(target) {
  const courses = loader.loadForValidation(target);
  if (!courses.length) {
    console.log('No courses found' + (target ? ` in ${target}` : '') + '.');
    return 1;
  }
  let errors = 0, warnings = 0, lessons = 0, questions = 0, challenges = 0, projects = 0, guides = 0;

  for (const co of courses) {
    console.log('\n' + c.bold(co.title) + c.gray(`  (${co.dir})`));
    for (const e of co.errors) { errors++; console.log(c.red('  ✘ ' + e)); }
    for (const l of co.lessons) {
      lessons++;
      questions += l.questions.length;
      console.log(`  ${l.errors.length ? c.red('✘') : c.green('✔')} ${l.id}  ${c.gray(l.questions.length + ' questions')}`);
      for (const e of l.errors) { errors++; console.log(c.red('      error:   ' + e)); }
      for (const w of l.warnings) { warnings++; console.log(c.yellow('      warning: ' + w)); }
    }
    for (const ch of co.challenges) {
      challenges++;
      console.log(`  ${ch.errors.length ? c.red('✘') : c.green('✔')} challenge ${ch.id}  ${c.gray(ch.difficulty)}`);
      for (const e of ch.errors) { errors++; console.log(c.red('      error:   ' + e)); }
      for (const w of ch.warnings) { warnings++; console.log(c.yellow('      warning: ' + w)); }
    }
    for (const g of co.guides) {
      guides++;
      console.log(`  ${g.errors.length ? c.red('✘') : c.green('✔')} guide ${g.id}`);
      for (const e of g.errors) { errors++; console.log(c.red('      error:   ' + e)); }
      for (const w of g.warnings) { warnings++; console.log(c.yellow('      warning: ' + w)); }
    }
    for (const p of co.projects) {
      projects++;
      console.log(`  ${p.errors.length ? c.red('✘') : c.green('✔')} project ${p.id}  ${c.gray(p.difficulty)}`);
      for (const e of p.errors) { errors++; console.log(c.red('      error:   ' + e)); }
      for (const w of p.warnings) { warnings++; console.log(c.yellow('      warning: ' + w)); }
    }
  }
  console.log(`\n${courses.length} course(s), ${lessons} lesson(s), ${questions} question(s), ${challenges} challenge(s), ${projects} project idea(s), ${guides} guide(s): ` +
    (errors ? c.red(`${errors} error(s)`) : c.green('no errors')) + `, ${warnings} warning(s)\n`);
  return errors ? 1 : 0;
}

async function resetCommand() {
  if (await prompts.confirm('Delete all saved progress? (y/N)')) {
    progress.reset();
    console.log('Progress deleted.');
  } else {
    console.log('Nothing changed.');
  }
}

module.exports = { main };
