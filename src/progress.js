'use strict';
// Saves which lessons you finished, in ~/.clx/progress.json
// (set CLX_HOME to store it somewhere else).

const fs = require('fs');
const os = require('os');
const path = require('path');

const { env } = require('./env');

// Data folder: ~/.clx. People who used the app before the rename (~/.dojo) are moved over once.
const home = env('HOME') || path.join(os.homedir(), '.clx');
if (!env('HOME')) {
  const legacy = path.join(os.homedir(), '.dojo');
  if (fs.existsSync(legacy) && !fs.existsSync(home)) {
    try { fs.renameSync(legacy, home); } catch { /* keep going with a fresh folder */ }
  }
}
const file = path.join(home, 'progress.json');

function load() {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.courses = data.courses || {};
    data.challenges = data.challenges || {};
    data.projects = data.projects || {};
    return data;
  } catch {
    return { courses: {}, challenges: {}, projects: {} };
  }
}

function save(data) {
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/** -> { best, total, last, at } or null when the lesson was never finished */
function status(data, courseId, lessonId) {
  return (data.courses[courseId] || {})[lessonId] || null;
}

function record(courseId, lessonId, score, total) {
  const data = load();
  const course = (data.courses[courseId] = data.courses[courseId] || {});
  const prev = course[lessonId];
  course[lessonId] = {
    best: Math.max(prev ? prev.best : 0, score),
    total,
    last: score,
    at: new Date().toISOString(),
  };
  save(data);
}

/** -> { attempts, hints, at } when solved, else null */
function challengeStatus(data, courseId, id) {
  return (data.challenges[courseId] || {})[id] || null;
}

function recordChallenge(courseId, id, { attempts, hints }) {
  const data = load();
  const course = (data.challenges[courseId] = data.challenges[courseId] || {});
  const prev = course[id];
  course[id] = {
    attempts: prev ? Math.min(prev.attempts, attempts) : attempts,
    hints: prev ? Math.min(prev.hints, hints) : hints,
    at: new Date().toISOString(),
  };
  save(data);
}

/** -> 'started' | 'done' | null */
function projectStatus(data, courseId, id) {
  return (data.projects[courseId] || {})[id] || null;
}

function setProject(courseId, id, status) {
  const data = load();
  const course = (data.projects[courseId] = data.projects[courseId] || {});
  if (status) course[id] = status; else delete course[id];
  save(data);
}

function reset() {
  try { fs.unlinkSync(file); } catch { /* nothing to delete */ }
}

module.exports = { home, file, load, status, record, challengeStatus, recordChallenge, projectStatus, setProject, reset };
