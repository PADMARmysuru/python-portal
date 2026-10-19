/*
 * Quality checks for the portal. Run from the project folder:
 *   npm install pyodide@0.26.4        (once)
 *   node tests/qa.mjs
 * Checks: syllabus coverage, lesson structure, quiz/problem bank sizes, and it executes every
 * Python program in the content with real CPython (Pyodide in Node; system python3 for sqlite3,
 * which Pyodide downloads separately in the browser).
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import os from 'os';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, '..');
const require = createRequire(import.meta.url);
let loadPyodide;
try { ({ loadPyodide } = require('pyodide')); }
catch (e) { ({ loadPyodide } = require(path.resolve(site, '..', 'node_modules', 'pyodide'))); }

globalThis.window = globalThis;
const files = ['js/core.js', 'js/vendor-dbm.js', 'js/content/course.js', 'js/content/m1.js', 'js/content/m2.js',
  'js/content/m3.js', 'js/content/m4.js', 'js/content/m5.js', 'js/data/quizzes.js', 'js/data/problems.js', 'js/data/reference.js'];
for (const f of files) {
  const p = path.join(site, f);
  if (fs.existsSync(p)) vm.runInThisContext(fs.readFileSync(p, 'utf8'), { filename: f });
  else console.warn('missing (skipped):', f);
}
const PP = globalThis.PP;
let failures = 0;
const fail = (msg) => { failures++; console.log('  FAIL', msg); };

/* ---------- 1. syllabus coverage and lesson structure ---------- */
console.log('1. Syllabus coverage');
const covered = new Map();
for (const m of PP.modules) for (const l of m.lessons) for (const t of l.covers) {
  if (!covered.has(m.n + '|' + t)) covered.set(m.n + '|' + t, []);
  covered.get(m.n + '|' + t).push(l.id);
}
let topicCount = 0;
for (const [n, mod] of Object.entries(PP.course.syllabus)) {
  for (const t of mod.topics) {
    topicCount++;
    if (!covered.has(n + '|' + t)) fail(`Module ${n} topic not covered: ${t}`);
  }
}
for (const key of covered.keys()) {
  const [n, t] = key.split('|');
  if (!PP.course.syllabus[n].topics.includes(t)) fail(`Lesson covers unknown topic "${t}" (module ${n})`);
}
console.log(`  ${topicCount} syllabus topics, ${PP.allLessons().length} lessons`);

console.log('2. Lesson structure (10-step sequence)');
for (const l of PP.allLessons()) {
  const need = ['concept', 'syntax', 'example', 'demo', 'visual', 'mistakes', 'practice', 'challenge', 'summary'];
  for (const k of need) if (!l[k]) fail(`${l.id} missing ${k}`);
  if (l.practice && l.practice.length < 3) fail(`${l.id} has fewer than 3 practice questions`);
  if (l.practice && l.practice.map((p) => p.lvl).join() !== 'Easy,Medium,Hard') fail(`${l.id} practice levels not Easy/Medium/Hard`);
}

console.log('3. Assessment bank');
if (PP.quizzes) {
  for (const n of [1, 2, 3, 4, 5]) {
    const qs = PP.quizzes[n] || [];
    if (qs.length < 15) fail(`Module ${n} quiz has ${qs.length} questions (< 15)`);
    const types = new Set(qs.map((q) => q.type));
    for (const t of ['mcq', 'output', 'error', 'fill']) if (!types.has(t)) fail(`Module ${n} quiz lacks type ${t}`);
    for (const q of qs) {
      if (!q.explain) fail(`quiz ${n}: question without explanation: ${q.q}`);
      if (q.type !== 'fill' && (q.answer == null || !q.options || q.answer >= q.options.length)) fail(`quiz ${n}: bad answer index: ${q.q}`);
      if (!q.topic) fail(`quiz ${n}: no topic: ${q.q}`);
    }
    console.log(`  Module ${n}: ${qs.length} questions, types ${[...types].join(', ')}`);
  }
} else fail('quizzes.js not loaded');
if (PP.problems) console.log(`  ${PP.problems.length} coding problems, ${(PP.projects || []).length} mini-projects`);

/* ---------- 4. execute all Python ---------- */
console.log('4. Executing Python programs');
const pyrunner = fs.readFileSync(path.join(site, 'js/pyrunner.js'), 'utf8');
const bootSrc = pyrunner.match(/const BOOT = (String\.raw`[\s\S]*?`);\n/)[1];
const BOOT = eval(bootSrc);
const py = await loadPyodide();
py.FS.mkdirTree('/home/pyodide/pylib/dbm');
for (const [n, s] of Object.entries(PP_DBM_FILES)) py.FS.writeFile('/home/pyodide/pylib/dbm/' + n, s);
py.runPython(BOOT);
const ppRun = py.globals.get('pp_run');
const ppViz = py.globals.get('pp_viz');
const ppCheck = py.globals.get('pp_check');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ppqa-'));

function runSystem(code) {
  try {
    const out = execFileSync('python3', ['-c', code], { cwd: tmp, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    return { status: 'ok', out, err: '' };
  } catch (e) { return { status: 'error', out: e.stdout || '', err: e.stderr || String(e) }; }
}
function run(code, stdin) {
  if (/pyodide\.http/.test(code)) return { status: 'skipped' };
  if (/\bsqlite3\b/.test(code)) return runSystem(code);
  return JSON.parse(ppRun(code, JSON.stringify(stdin || []), null));
}
let ran = 0, skipped = 0;
function check(label, code, { stdin, expect, allowError } = {}) {
  if (!code) return;
  const r = run(code, stdin);
  if (r.status === 'skipped') { skipped++; return; }
  ran++;
  if (r.status === 'error' && !allowError) fail(`${label}: error\n${r.err.split('\n').slice(-4).join('\n')}`);
  if (expect != null && r.status !== 'error') { globalThis.__cmp = (globalThis.__cmp||0)+1;
    const got = (r.out || '').trim(), want = String(expect).trim();
    if (got !== want) fail(`${label}: output mismatch\n    expected: ${JSON.stringify(want)}\n    got:      ${JSON.stringify(got)}`);
  }
}
for (const l of PP.allLessons()) {
  const ex = l.example;
  if (ex && ex.runnable !== false) check(`${l.id} example`, ex.code, { stdin: ex.stdin });
  for (const part of [l.demo, l.visual, l.extra]) {
    if (!part) continue;
    if (part.w === 'code') check(`${l.id} ${part === l.demo ? 'demo' : 'visual'} code`, part.code, { stdin: part.stdin });
    if (part.w === 'pair') { check(`${l.id} pair-left`, part.left.code); check(`${l.id} pair-right`, part.right.code); }
    if (part.w === 'errorLab') for (const it of part.items) check(`${l.id} errorLab ${it.label}`, it.code, { allowError: true });
    if (part.w === 'trace') {
      const res = JSON.parse(ppViz(part.code, JSON.stringify(part.stdin || [])));
      ran++;
      if (res.error) fail(`${l.id} trace error: ${res.error.split('\n').slice(-2).join(' ')}`);
      if (!res.steps.length) fail(`${l.id} trace produced no steps`);
    }
  }
  l.practice.forEach((p, i) => check(`${l.id} practice ${i + 1}`, p.sol, { stdin: p.stdin, expect: p.expect }));
  if (l.challenge && l.challenge.runnable !== false) check(`${l.id} challenge`, l.challenge.sol, { stdin: l.challenge.stdin, expect: l.challenge.expect });
}
if (PP.problems) {
  for (const p of PP.problems) {
    let res;
    if (/\bsqlite3\b/.test(p.solution)) {
      const harness = p.solution + '\nimport json as _j\n_r=[]\nfor _e,_x in ' + JSON.stringify(p.tests) + ':\n    _g=eval(_e); _r.append(_g==eval(_x))\nprint(_j.dumps(_r))';
      const out = runSystem(harness);
      const oks = out.status === 'ok' ? JSON.parse(out.out.trim().split('\n').pop()) : [];
      res = { passed: oks.filter(Boolean).length, total: p.tests.length, tests: [], run: { err: out.err } };
      ran++;
      if (res.passed !== res.total) fail(`problem ${p.id}: reference solution passes ${res.passed}/${res.total} ${res.run.err}`);
      continue;
    }
    res = JSON.parse(ppCheck(p.solution, JSON.stringify(p.tests)));
    ran++;
    if (res.passed !== res.total) fail(`problem ${p.id}: reference solution passes ${res.passed}/${res.total}\n${JSON.stringify(res.tests.filter((t) => !t.ok))}${res.run.err}`);
    const starter = JSON.parse(ppCheck(p.starter, JSON.stringify(p.tests)));
    if (starter.passed === starter.total) fail(`problem ${p.id}: starter code already passes all tests`);
  }
  for (const pr of PP.projects || []) check(`project ${pr.id}`, pr.solution || pr.starter, {});
}
if (PP.quizzes) {
  for (const n of [1, 2, 3, 4, 5]) for (const q of PP.quizzes[n]) {
    if (q.type === 'output' && q.code && q.verify !== false) {
      const r = run(q.code, []);
      if (r.status === 'skipped') continue;
      ran++;
      const got = (r.out || '').trim();
      const want = String(q.options[q.answer]).trim();
      if (got !== want) fail(`quiz ${n} output question: expected option ${JSON.stringify(want)} but Python printed ${JSON.stringify(got)}\n    ${q.q}`);
    }
  }
}
console.log(`  ${globalThis.__cmp||0} outputs compared with expected; ran ${ran} programs/traces (${skipped} skipped: need the browser network API)`);

/* ---------- 5. reference SQL ---------- */
console.log('5. Sample database SQL');
const sqlCheck = runSystem(`import sqlite3\nc=sqlite3.connect(':memory:')\nc.execute('PRAGMA foreign_keys=ON')\nc.executescript(${JSON.stringify(PP.SCHOOL_SQL)})\nc.executescript(${JSON.stringify(PP.TRACKS_SQL)})\nprint(c.execute('select count(*) from Enrollment').fetchone()[0])`);
if (sqlCheck.status !== 'ok') fail('sample SQL invalid: ' + sqlCheck.err); else console.log('  sample schemas valid, enrollment rows =', sqlCheck.out.trim());
const dataDir = path.join(site, 'data');
for (const f of ['school.sql', 'catalog.json', 'students.xml', 'romeo.txt']) if (!fs.existsSync(path.join(dataDir, f))) fail('missing data/' + f);

console.log(failures ? `\n${failures} problem(s) found.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
