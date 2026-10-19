/* Progress is kept in this browser's localStorage only. It is not a secure or shared database. */
(function () {
  'use strict';
  const PP = window.PP;
  const blank = () => ({ v: 1, lessons: {}, last: null, quizzes: {}, problems: {}, runs: 0, activity: [], checklist: {}, badges: {}, theme: null });
  let mem = blank();
  let persistent = true;

  function load() {
    try {
      const raw = localStorage.getItem(PP.config.STORAGE_KEY);
      if (raw) mem = Object.assign(blank(), JSON.parse(raw));
    } catch (e) { persistent = false; }
  }
  function save() {
    try { localStorage.setItem(PP.config.STORAGE_KEY, JSON.stringify(mem)); }
    catch (e) { persistent = false; }
  }
  function log(msg, href) {
    mem.activity.unshift({ t: Date.now(), msg, href: href || null });
    mem.activity = mem.activity.slice(0, 25);
  }

  const BADGES = [
    { id: 'first-run', name: 'Hello, world', desc: 'Ran your first Python program', test: (s) => s.runs >= 1 },
    { id: 'runner-25', name: 'Experimenter', desc: 'Ran 25 programs', test: (s) => s.runs >= 25 },
    { id: 'first-lesson', name: 'First step', desc: 'Completed a lesson', test: (s) => Object.keys(s.lessons).length >= 1 },
    { id: 'm1', name: 'Fundamentals', desc: 'Completed every Module 1 lesson', test: (s) => modDone(s, 1) },
    { id: 'm2', name: 'Data wrangler', desc: 'Completed every Module 2 lesson', test: (s) => modDone(s, 2) },
    { id: 'm3', name: 'Pattern hunter', desc: 'Completed every Module 3 lesson', test: (s) => modDone(s, 3) },
    { id: 'm4', name: 'Object thinker', desc: 'Completed every Module 4 lesson', test: (s) => modDone(s, 4) },
    { id: 'm5', name: 'Data engineer', desc: 'Completed every Module 5 lesson', test: (s) => modDone(s, 5) },
    { id: 'quiz-80', name: 'Quiz ace', desc: 'Scored 80% or more in a module quiz', test: (s) => Object.entries(s.quizzes).some(([k, q]) => k !== 'final' && q.best >= 80) },
    { id: 'solver-5', name: 'Problem solver', desc: 'Solved 5 coding problems', test: (s) => Object.values(s.problems).filter((p) => p.solved).length >= 5 },
    { id: 'final', name: 'Course ready', desc: 'Scored 60% or more in the final revision test', test: (s) => s.quizzes.final && s.quizzes.final.best >= 60 }
  ];
  function modDone(s, n) {
    const m = PP.modules.find((x) => x.n === n);
    return !!m && m.lessons.every((l) => s.lessons[l.id]);
  }
  function checkBadges() {
    for (const b of BADGES) {
      if (!mem.badges[b.id] && b.test(mem)) {
        mem.badges[b.id] = Date.now();
        log('Badge earned: ' + b.name);
        PP.toast && setTimeout(() => PP.toast('Badge earned: ' + b.name), 300);
      }
    }
  }

  PP.store = {
    BADGES,
    get state() { return mem; },
    get persistent() { return persistent; },
    load, save,
    visit(lessonId) { mem.last = lessonId; save(); },
    isDone(id) { return !!mem.lessons[id]; },
    setDone(id, done) {
      const l = PP.lessonById(id);
      if (done) { mem.lessons[id] = Date.now(); log('Completed lesson: ' + (l ? l.title : id), '#/lesson/' + id); }
      else delete mem.lessons[id];
      checkBadges(); save(); PP.app && PP.app.refreshProgress();
    },
    noteRun() { mem.runs++; checkBadges(); save(); },
    quizResult(key, pct, topics, label) {
      const q = mem.quizzes[key] || { best: 0, attempts: 0, topics: {} };
      q.attempts++; q.last = pct; q.best = Math.max(q.best, pct); q.at = Date.now();
      for (const [t, r] of Object.entries(topics)) {
        const cur = q.topics[t] || { c: 0, n: 0 };
        q.topics[t] = { c: r.c, n: r.n, best: Math.max(cur.best || 0, r.n ? Math.round((100 * r.c) / r.n) : 0) };
      }
      mem.quizzes[key] = q;
      log(label + ': ' + pct + '%', '#/quiz/' + key);
      checkBadges(); save(); PP.app && PP.app.refreshProgress();
    },
    problemResult(id, solved, title) {
      const p = mem.problems[id] || { solved: false, attempts: 0 };
      p.attempts++;
      if (solved && !p.solved) { p.solved = true; log('Solved problem: ' + title, '#/practice'); }
      mem.problems[id] = p;
      checkBadges(); save();
    },
    toggleCheck(key, on) { if (on) mem.checklist[key] = 1; else delete mem.checklist[key]; save(); },
    setTheme(t) { mem.theme = t; save(); },
    moduleProgress(n) {
      const m = PP.modules.find((x) => x.n === n);
      if (!m) return 0;
      return Math.round((100 * m.lessons.filter((l) => mem.lessons[l.id]).length) / m.lessons.length);
    },
    overall() {
      const all = PP.allLessons();
      return all.length ? Math.round((100 * all.filter((l) => mem.lessons[l.id]).length) / all.length) : 0;
    },
    reset() { const theme = mem.theme; mem = blank(); mem.theme = theme; save(); }
  };
  load();
})();
