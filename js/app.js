(function () {
  'use strict';
  const PP = window.PP, h = PP.h, $ = PP.$, $$ = PP.$$;
  const store = PP.store;
  const app = (PP.app = {});
  const main = () => $('#main');
  const STEP_TITLES = ['Concept', 'Syntax', 'Worked example', 'Execution', 'Interactive demonstration', 'Visual explanation', 'Common mistakes', 'Practice', 'Mini challenge', 'Summary'];
  const MOD_SHORT = { 1: 'Python Fundamentals', 2: 'Data Structures', 3: 'Regular Expressions and Files', 4: 'Object-Oriented Programming', 5: 'Web, XML, JSON and Databases' };

  /* ---------------------------------------------------------------- theme */
  function applyTheme(t) {
    const theme = t || store.state.theme || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    const b = $('#themeBtn'); if (b) { b.setAttribute('aria-pressed', theme === 'dark'); b.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'; b.textContent = theme === 'dark' ? '☀' : '☾'; }
  }

  /* ---------------------------------------------------------------- sidebar */
  const NAV = [
    ['#/', 'Home'], ['#/overview', 'Course Overview'],
    ...[1, 2, 3, 4, 5].map((n) => ['#/module/' + n, 'Module ' + n + ' – ' + MOD_SHORT[n]]),
    ['#/playground', 'Python Code Playground'], ['#/practice', 'Practice Problems'], ['#/quiz', 'Quizzes and Assessments'],
    ['#/dashboard', 'Learning Dashboard'], ['#/reference', 'Revision and Reference']
  ];
  function buildSidebar() {
    const nav = $('#sidebar');
    nav.innerHTML = '';
    const sideSearch = h('form.side-search', { role: 'search', onsubmit: (e) => { e.preventDefault(); location.hash = '#/search?q=' + encodeURIComponent(e.target.elements.q.value.trim()); } },
      h('label.sr', { for: 'sideQ' }, 'Search the course'), h('input#sideQ', { type: 'search', name: 'q', placeholder: 'Search lessons…', autocomplete: 'off' }));
    nav.appendChild(sideSearch);
    const list = h('ul.nav-main');
    NAV.forEach(([href, label]) => {
      const m = href.match(/module\/(\d)/);
      if (m) {
        const mod = PP.modules.find((x) => x.n === +m[1]);
        const pct = store.moduleProgress(mod.n);
        const det = h('details.nav-mod', { 'data-mod': mod.n },
          h('summary', h('a', { href }, label), h('span.nav-pct', { 'aria-label': pct + '% complete' }, pct + '%')),
          h('ul', mod.lessons.map((l) => h('li', h('a.nav-lesson', { href: '#/lesson/' + l.id, 'data-id': l.id },
            h('span.tick' + (store.isDone(l.id) ? '.done' : ''), { 'aria-label': store.isDone(l.id) ? 'completed' : 'not completed' }, store.isDone(l.id) ? '✓' : ''), l.id.replace('m', '').replace('-', '.') + ' ' + l.title))),
            h('li', h('a.nav-lesson', { href: '#/quiz/' + mod.n }, h('span.tick'), 'Module ' + mod.n + ' quiz'))));
        list.appendChild(h('li', det));
      } else list.appendChild(h('li', h('a', { href }, label)));
    });
    nav.appendChild(list);
    const ov = h('div.overall', h('div.ov-label', 'Course completion'), h('div.bar', h('span', { style: 'width:' + store.overall() + '%' })), h('div.ov-num', store.overall() + '%'));
    nav.appendChild(ov);
    markActive();
  }
  function markActive() {
    const hash = location.hash || '#/';
    $$('#sidebar a').forEach((a) => {
      const on = a.getAttribute('href') === hash;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const lm = hash.match(/lesson\/m(\d)/) || hash.match(/module\/(\d)/) || hash.match(/quiz\/(\d)/);
    if (lm) { const d = $('#sidebar details[data-mod="' + lm[1] + '"]'); if (d) d.open = true; }
  }
  app.refreshProgress = () => { const open = $$('#sidebar details[open]').map((d) => d.dataset.mod); buildSidebar(); open.forEach((m) => { const d = $('#sidebar details[data-mod="' + m + '"]'); if (d) d.open = true; }); };

  /* ---------------------------------------------------------------- python status pill */
  function pythonPill() {
    const pill = $('#pyStatus');
    PP.py.onStatus((s, msg) => {
      pill.dataset.state = s;
      pill.textContent = { idle: 'Python: loads when needed', loading: 'Python: loading…', ready: 'Python ready', error: 'Python failed — retry' }[s];
      pill.title = msg || 'Click to start the Python runtime';
    });
    pill.addEventListener('click', () => PP.py.load().catch(() => PP.toast('Python could not load. Check your connection and try again.')));
  }

  /* ---------------------------------------------------------------- helpers */
  const crumbs = (items) => h('nav.crumbs', { 'aria-label': 'Breadcrumb' }, h('ol', items.map(([label, href], i) =>
    h('li', href && i < items.length - 1 ? h('a', { href }, label) : h('span', { 'aria-current': 'page' }, label)))));
  const bar = (pct) => h('div.bar', { role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('span', { style: 'width:' + pct + '%' }));
  const title = (text, sub) => [h('h1#pageTitle', { tabindex: '-1' }, text), sub ? h('p.lead', sub) : null];
  function nextLesson() {
    const all = PP.allLessons();
    const last = store.state.last && all.findIndex((l) => l.id === store.state.last);
    if (store.state.last && last >= 0 && !store.isDone(store.state.last)) return all[last];
    return all.find((l) => !store.isDone(l.id)) || all[all.length - 1];
  }
  function ring(pct, size) {
    size = size || 120; const r = size / 2 - 9, c = 2 * Math.PI * r;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`); svg.setAttribute('class', 'ring'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', pct + '% complete');
    svg.innerHTML = `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}" transform="rotate(-90 ${size / 2} ${size / 2})"/><text x="50%" y="54%" text-anchor="middle" class="ring-txt">${pct}%</text>`;
    return svg;
  }

  /* ---------------------------------------------------------------- pages */
  const pages = {};

  pages.home = () => {
    const nl = nextLesson();
    const hero = h('section.hero',
      h('div.hero-text',
        h('p.hero-code', '1BEC305 · Semester III · Scheme 2025'),
        h('h1#pageTitle', { tabindex: '-1' }, 'Learn Python by running it.'),
        h('p.lead', 'All five modules of the Python Programming syllabus, with real Python running in your browser — no installation. Read a concept, run the example, change it, and see what happens.'),
        h('div.hero-cta', h('a.btn.btn-run.btn-lg', { href: '#/lesson/' + nl.id }, store.overall() ? 'Continue: ' + nl.title : 'Start Module 1'),
          h('a.btn.btn-ghost.btn-lg', { href: '#/overview' }, 'Course overview'))),
      h('div.hero-shell', h('p.hero-shell-label', 'Try it now — this is a live Python shell'), PP.widgets.shell({ presets: ["'Python' * 3", '2 ** 10', 'len("1BEC305")', "sorted(['VLSI', 'DSP', 'Python'])", 'import math; math.pi'] })));
    const cards = h('div.mod-cards', PP.modules.map((m) => {
      const pct = store.moduleProgress(m.n);
      return h('a.mod-card', { href: '#/module/' + m.n, style: '--m:' + m.n },
        h('div.mc-num', 'Module ' + m.n), h('h3', m.title), h('p', m.blurb), bar(pct),
        h('div.mc-meta', m.lessons.length + ' lessons · ' + pct + '% done'));
    }));
    return [hero, h('h2.sec-h', 'Modules'), cards,
      h('div.home-tools',
        h('a.tool', { href: '#/playground' }, h('strong', 'Code playground'), h('span', 'Write and run any Python program, with sample programs from every module.')),
        h('a.tool', { href: '#/practice' }, h('strong', 'Practice problems'), h('span', '15 auto-graded problems with progressive hints, plus mini-projects.')),
        h('a.tool', { href: '#/quiz' }, h('strong', 'Quizzes'), h('span', 'Module quizzes and a final revision test with explanations.')),
        h('a.tool', { href: '#/dashboard' }, h('strong', 'Your dashboard'), h('span', 'Progress, scores, badges and topics to revise.')))];
  };

  pages.overview = () => {
    const c = PP.course;
    const info = h('table.ref.info', h('tbody',
      [['Course', c.title], ['Course code', c.code], ['Scheme', c.scheme], ['Type of course', c.type], ['Semester', c.semester],
        ['Teaching hours/week (L:T:P)', c.ltp], [c.pedagogyLabel, c.pedagogyHours], ['Credits', c.credits], ['CIE marks', c.cie], ['SEE marks', c.see],
        ['Total marks', c.total], ['Examination type (SEE)', c.seeType], ['Exam hours', c.examHours]].map(([k, v]) => h('tr', h('th', k), h('td', String(v))))));
    const NS = 'http://www.w3.org/2000/svg';
    const road = document.createElementNS(NS, 'svg'); road.setAttribute('viewBox', '0 0 560 120'); road.setAttribute('class', 'roadmap'); road.setAttribute('role', 'img'); road.setAttribute('aria-label', 'Course roadmap: Module 1 to Module 5');
    road.innerHTML = '<path d="M40 60 H520" class="rm-line"/>' + [1, 2, 3, 4, 5].map((n, i) => {
      const x = 40 + i * 120; const pct = store.moduleProgress(n);
      return `<a href="#/module/${n}"><circle cx="${x}" cy="60" r="22" class="rm-dot${pct === 100 ? ' done' : ''}"/><text x="${x}" y="66" text-anchor="middle" class="rm-n">${n}</text><text x="${x}" y="104" text-anchor="middle" class="rm-t">${['Fundamentals', 'Data structures', 'Regex + files', 'OOP', 'Web + databases'][i]}</text><text x="${x}" y="26" text-anchor="middle" class="rm-co">CO${n}</text></a>`;
    }).join('');
    const syl = PP.modules.map((m) => {
      const s = c.syllabus[m.n];
      return h('details.syl', { open: m.n === 1 }, h('summary', h('strong', 'Module ' + m.n + ' — ' + m.title), h('span.muted', ' · ' + (s.hours ? s.hours + ' hours' : 'hours not visible in the supplied copy') + (s.textbook ? ' · ' + s.textbook : ''))),
        h('table.ref.cov', h('thead', h('tr', h('th', 'Syllabus topic (official wording)'), h('th', 'Covered in'))), h('tbody', s.topics.map((t) => {
          const ls = m.lessons.filter((l) => l.covers.includes(t));
          return h('tr', h('td', t), h('td', ls.map((l) => h('a', { href: '#/lesson/' + l.id }, l.id.replace('m', '').replace('-', '.')))));
        }))));
    });
    const total = Object.values(c.syllabus).reduce((a, s) => a + s.topics.length, 0);
    return [crumbs([['Home', '#/'], ['Course Overview']]), ...title('Course overview', 'Python Programming · ' + c.code + ' · Semester ' + c.semester),
      h('div.two-col', info, h('div', h('h2', 'Course outcomes'), h('ol.cos', c.outcomes.map((o, i) => h('li', o, h('a.co-link', { href: '#/module/' + (i + 1) }, ' Module ' + (i + 1))))),
        h('p.muted', 'Each outcome maps to the module with the same number.'))),
      h('h2', 'Course roadmap'), road,
      h('h2', 'Syllabus and topic coverage checklist'), h('p', `Every one of the ${total} topics listed in the syllabus is mapped to at least one lesson. Click a lesson number to open it.`), ...syl,
      h('h2', 'Notes on the source syllabus'), h('ul.notes', c.notes.map((n) => h('li', n)))];
  };

  pages.module = (n) => {
    const m = PP.modules.find((x) => x.n === +n);
    if (!m) return pages.notfound();
    const pct = store.moduleProgress(m.n);
    const s = PP.course.syllabus[m.n];
    const best = store.state.quizzes[m.n];
    return [crumbs([['Home', '#/'], ['Module ' + m.n]]), ...title('Module ' + m.n + ': ' + m.title, m.blurb),
      h('div.mod-meta', h('span', 'Course outcome CO' + m.co + ': ' + PP.course.outcomes[m.co - 1]), h('span', s.hours ? s.hours + ' hours' : 'Hours: not visible in supplied syllabus'), s.textbook ? h('span', s.textbook) : null),
      h('div.mod-progress', bar(pct), h('span', pct + '% complete')),
      h('ol.lesson-list', m.lessons.map((l) => h('li' + (store.isDone(l.id) ? '.done' : ''), h('a', { href: '#/lesson/' + l.id },
        h('span.ll-num', l.id.replace('m', '').replace('-', '.')), h('span.ll-body', h('strong', l.title), h('small', l.covers.join(' · '))),
        h('span.ll-state', store.isDone(l.id) ? 'Completed' : 'Open'))))),
      h('div.mod-quiz', h('div', h('h3', 'Module ' + m.n + ' quiz'), h('p.muted', PP.quizzes[m.n].length + ' questions' + (best ? ' · best score ' + best.best + '%' : ''))), h('a.btn.btn-run', { href: '#/quiz/' + m.n }, best ? 'Retake quiz' : 'Take quiz'))];
  };

  /* ---------------- lesson */
  function practiceItem(p, idx, isChallenge) {
    const solBox = h('div.sol'); solBox.hidden = true;
    const solBtn = h('button.btn.btn-ghost.btn-sm', { type: 'button', disabled: true, title: 'Run your attempt first' }, 'Show model solution');
    solBtn.addEventListener('click', () => { solBox.hidden = !solBox.hidden; solBtn.textContent = solBox.hidden ? 'Show model solution' : 'Hide model solution'; });
    solBox.append(h('p.muted', 'One possible solution:'), PP.codeBlock(p.sol, { title: 'solution.py', stdin: p.stdin, runnable: p.runnable, noPlayground: true }));
    const block = PP.codeBlock(p.starter || '', { title: isChallenge ? 'challenge.py' : 'practice_' + (idx + 1) + '.py', stdin: p.stdin, expect: p.expect, runnable: p.runnable,
      onRun: () => { solBtn.disabled = false; solBtn.title = ''; } });
    if (p.runnable === false) solBtn.disabled = false;
    return h('div.practice' + (isChallenge ? '.challenge' : ''), isChallenge ? null : h('span.lvl.lvl-' + p.lvl.toLowerCase(), p.lvl), h('div.pq', { html: p.q }),
      p.expect != null ? h('p.muted.small', 'Your output is compared with the expected output when you run.') : null, block, solBtn, solBox);
  }
  function widgetOrHtml(part) {
    if (!part) return null;
    if (part.w) {
      const f = PP.widgets[part.w];
      if (!f) return h('p.out-err', 'Missing widget ' + part.w);
      return h('div.widget-wrap', part.title ? h('h3', part.title) : null, part.intro ? h('p.widget-intro', part.intro) : null, f(part));
    }
    return h('div.visual', { html: part.html });
  }
  pages.lesson = (id) => {
    const l = PP.lessonById(id);
    if (!l) return pages.notfound();
    store.visit(id);
    PP.py.load().catch(() => {});
    const all = PP.allLessons(), i = all.indexOf(l), prev = all[i - 1], next = all[i + 1];
    const m = PP.modules.find((x) => x.n === l.module);
    const sec = (k, ...content) => h('section.step', { id: 'step-' + (k + 1) }, h('h2.step-h', h('span.step-n', String(k + 1)), STEP_TITLES[k]), ...content);
    const ex = l.example;
    const exBlock = PP.codeBlock(ex.code, { title: ex.title || l.id + '_example.py', stdin: ex.stdin, runnable: ex.runnable, note: ex.note });
    const execPanel = h('div.exec');
    if (ex.runnable === false) execPanel.append(h('p', 'This program needs operating-system features (network sockets) that browsers block, so it cannot run here. Copy it into IDLE, Thonny or a terminal: ', h('code', 'python3 program.py'), '. The interactive demonstration below shows the same ideas with runnable code.'));
    else {
      const out = exBlock.output; out.remove();
      execPanel.append(h('div.op-row', h('button.btn.btn-run', { type: 'button', onclick: () => exBlock.run() }, 'Run the worked example'), h('span.muted', 'Real output from Python appears below. Edit the code above and run again.')), out);
    }
    const doneBtn = h('button.btn' + (store.isDone(id) ? '.btn-ghost' : '.btn-run'), { type: 'button', onclick: () => {
      store.setDone(id, !store.isDone(id)); route();
      if (store.isDone(id)) PP.toast('Lesson marked complete');
    } }, store.isDone(id) ? 'Completed ✓ (undo)' : 'Mark lesson complete');
    const toc = h('nav.toc', { 'aria-label': 'Lesson steps' }, h('ol', STEP_TITLES.map((t, k) => h('li', h('a', { href: '#', onclick: (e) => { e.preventDefault(); document.getElementById('step-' + (k + 1)).scrollIntoView({ behavior: PP.reducedMotion() ? 'auto' : 'smooth' }); } }, t)))));
    return [crumbs([['Home', '#/'], ['Module ' + m.n, '#/module/' + m.n], [l.title]]),
      h('p.lesson-kicker', 'Lesson ' + l.id.replace('m', '').replace('-', '.') + ' · Module ' + m.n),
      ...title(l.title), h('div.covers', l.covers.map((c) => h('span.cover', c))), toc,
      sec(0, h('div.prose', { html: l.concept })),
      sec(1, PP.codeView(l.syntax)),
      sec(2, exBlock),
      sec(3, execPanel),
      sec(4, widgetOrHtml(l.demo)),
      sec(5, widgetOrHtml(l.visual), l.extra ? widgetOrHtml(l.extra) : null),
      sec(6, h('div.mistakes', l.mistakes.map((mk) => h('div.mistake', h('div.mk-wrong', h('span.mk-l', 'Mistake'), PP.codeView(mk.wrong)), h('div.mk-right', h('span.mk-l', 'Correct'), PP.codeView(mk.right)), h('p.mk-why', mk.why))))),
      sec(7, h('p.muted', 'Three questions of increasing difficulty. Run your attempt; the model solution unlocks after your first run.'), l.practice.map((p, k) => practiceItem(p, k))),
      sec(8, practiceItem(Object.assign({ lvl: 'Challenge' }, l.challenge), 0, true)),
      sec(9, h('ul.summary', l.summary.map((s) => h('li', s)))),
      h('div.lesson-end', doneBtn,
        h('div.pn', prev ? h('a.btn.btn-ghost', { href: '#/lesson/' + prev.id, rel: 'prev' }, '← ' + prev.title) : h('span'),
          next ? h('a.btn.btn-run', { href: '#/lesson/' + next.id, rel: 'next' }, next.title + ' →') : h('a.btn.btn-run', { href: '#/quiz/final' }, 'Final revision test →')))];
  };

  /* ---------------- playground */
  let pgPending = null;
  app.openInPlayground = (code, stdin) => { pgPending = { code, stdin: stdin || [] }; location.hash = '#/playground'; };
  pages.playground = () => {
    PP.py.load().catch(() => {});
    const samples = [];
    PP.modules.forEach((m) => m.lessons.forEach((l) => { if (l.example.runnable !== false) samples.push({ group: 'Module ' + m.n, label: l.id.replace('m', '').replace('-', '.') + ' ' + l.title, code: l.example.code, stdin: l.example.stdin }); }));
    (PP.projects || []).forEach((p) => samples.push({ group: 'Mini-projects', label: p.title, code: p.starter }));
    const start = pgPending || { code: "# Write any Python program here and press Run (Ctrl+Enter).\nname = input('What is your name? ')\nprint('Hello, ' + name + '!')\nfor i in range(1, 4):\n    print(i, 'x', 7, '=', i * 7)\n", stdin: [] };
    pgPending = null;
    let starter = start.code;
    const ed = new PP.Editor(starter, { minLines: 14, maxLines: 30, onRun: () => run(), label: 'Playground code editor' });
    const stdin = h('textarea.mono', { rows: 3, 'aria-label': 'Input lines for input()', placeholder: 'One line per input() call (optional). Leave empty to be asked with a prompt box.' }, (start.stdin || []).join('\n'));
    const out = h('div.runner-out.pg-out', { 'aria-live': 'polite' }, h('p.out-empty', 'Output appears here.'));
    const sel = h('select', { 'aria-label': 'Sample programs' }, h('option', { value: '' }, 'Load a sample program…'));
    const groups = {};
    samples.forEach((s, k) => { (groups[s.group] = groups[s.group] || h('optgroup', { label: s.group })).appendChild(h('option', { value: k }, s.label)); });
    Object.values(groups).forEach((g) => sel.appendChild(g));
    sel.addEventListener('change', () => { if (sel.value === '') return; const s = samples[+sel.value]; ed.value = starter = s.code; stdin.value = (s.stdin || []).join('\n'); out.innerHTML = '<p class="out-empty">Sample loaded. Press Run.</p>'; });
    const runBtn = h('button.btn.btn-run', { type: 'button', onclick: () => run(), title: 'Ctrl+Enter' }, 'Run');
    async function run() {
      runBtn.disabled = true; runBtn.textContent = 'Running…'; out.innerHTML = '<p class="out-empty">Running…</p>';
      try {
        const lines = stdin.value ? stdin.value.replace(/\n$/, '').split('\n') : [];
        const t0 = performance.now();
        const res = await PP.py.run(ed.value, { stdin: lines });
        PP.renderOutput(out, res);
        out.appendChild(h('p.out-note', (res.status === 'error' ? 'Finished with an error' : 'Finished') + ' in ' + Math.round(performance.now() - t0) + ' ms.'));
        store.noteRun();
      } catch (e) { out.innerHTML = ''; out.appendChild(h('pre.out-err', 'Python could not start: ' + e.message)); }
      runBtn.disabled = false; runBtn.textContent = 'Run';
    }
    return [crumbs([['Home', '#/'], ['Playground']]), ...title('Python code playground', 'A full Python 3 interpreter in your browser. Your code runs on your own device.'),
      h('div.pg-tools', runBtn,
        h('button.btn.btn-ghost', { type: 'button', onclick: () => { ed.value = starter; } }, 'Reset to starter'),
        h('button.btn.btn-ghost', { type: 'button', onclick: () => { out.innerHTML = '<p class="out-empty">Output cleared.</p>'; } }, 'Clear output'),
        h('button.btn.btn-ghost', { type: 'button', onclick: () => PP.copyText(ed.value) }, 'Copy code'), sel),
      h('div.pg-grid', h('div', ed.el, h('label.pg-label', 'Input for input()'), stdin), h('div', h('div.pg-label', 'Output and errors'), out)),
      h('details.limits', h('summary', 'What works here and what does not'), h('ul',
        h('li', 'The standard library works: math, random, re, json, xml, datetime, collections, copy, sqlite3 (downloaded on first use), shelve (via the bundled dbm.dumb backend), and more.'),
        h('li', 'Files are saved in a virtual folder (/home/pyodide/workspace) inside the browser and disappear on reload. Your computer’s files are not accessible.'),
        h('li', 'Raw sockets and urllib.request cannot reach the internet from a browser. pyodide.http.open_url() can fetch files from this website’s own server.'),
        h('li', 'Programs are stopped after 10 seconds, which catches accidental infinite loops.'),
        h('li', 'Packages that are not part of Pyodide, GUI toolkits (tkinter) and subprocess are not available.')))];
  };

  /* ---------------- practice */
  pages.practice = () => {
    PP.py.load().catch(() => {});
    let filter = 0;
    const listEl = h('div.problems');
    const chips = h('div.chips', [0, 1, 2, 3, 4, 5].map((n) => h('button.chip' + (n === 0 ? '.on' : ''), { type: 'button', onclick: (e) => { filter = n; $$('.chip', chips).forEach((c) => c.classList.toggle('on', c === e.target)); draw(); } }, n ? 'Module ' + n : 'All modules')));
    function problemCard(p) {
      const st = store.state.problems[p.id];
      const ed = new PP.Editor(p.starter, { minLines: 6, maxLines: 22, label: p.title + ' code', onRun: () => submit() });
      const out = h('div.runner-out'); out.hidden = true;
      const hintBox = h('ol.hints'); let hintN = 0;
      const solBox = h('div.sol'); solBox.hidden = true;
      const hintBtn = h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: () => {
        if (hintN < p.hints.length) { hintBox.appendChild(h('li', { html: p.hints[hintN] })); hintN++; }
        hintBtn.textContent = hintN < p.hints.length ? 'Show hint ' + (hintN + 1) + ' of ' + p.hints.length : 'No more hints';
        hintBtn.disabled = hintN >= p.hints.length;
      } }, 'Show hint 1 of ' + p.hints.length);
      const solBtn = h('button.btn.btn-ghost.btn-sm', { type: 'button', disabled: !(st && st.attempts), onclick: () => { solBox.hidden = !solBox.hidden; } }, 'Show solution and explanation');
      solBox.append(PP.codeView(p.solution), h('p', { html: p.explain }));
      const submitBtn = h('button.btn.btn-run', { type: 'button', onclick: () => submit() }, 'Run tests');
      async function submit() {
        submitBtn.disabled = true; submitBtn.textContent = 'Testing…'; out.hidden = false; out.innerHTML = '<p class="out-empty">Running your code against the tests…</p>';
        try {
          const r = await PP.py.check(ed.value, p.tests);
          out.innerHTML = '';
          if (r.run.out) out.appendChild(h('pre.out-text', r.run.out));
          if (r.run.err) out.appendChild(h('pre.out-err', r.run.err));
          if (r.tests.length) out.appendChild(h('table.ref.tests', h('thead', h('tr', h('th', 'Test'), h('th', 'Expected'), h('th', 'Your result'), h('th', ''))),
            h('tbody', r.tests.map((t) => h('tr.' + (t.ok ? 'pass' : 'fail'), h('td', h('code', t.expr.length > 70 ? t.expr.slice(0, 67) + '…' : t.expr)), h('td', h('code', t.expected)), h('td', h('code', t.got)), h('td', t.ok ? '✓' : '✗'))))));
          const solved = r.total > 0 && r.passed === r.total;
          out.appendChild(h('p.' + (solved ? 'out-pass' : 'out-fail'), solved ? 'All ' + r.total + ' tests passed. Well done!' : r.passed + ' of ' + r.total + ' tests passed.'));
          store.problemResult(p.id, solved, p.title); store.noteRun();
          solBtn.disabled = false;
          card.querySelector('.p-state').textContent = store.state.problems[p.id].solved ? 'Solved' : 'Attempted';
        } catch (e) { out.innerHTML = ''; out.appendChild(h('pre.out-err', 'Python could not start: ' + e.message)); }
        submitBtn.disabled = false; submitBtn.textContent = 'Run tests';
      }
      const card = h('article.problem', h('header', h('span.lvl.lvl-' + p.level.toLowerCase(), p.level), h('h3', p.title), h('span.muted', 'Module ' + p.module + ' · ' + p.topic), h('span.p-state', st && st.solved ? 'Solved' : st ? 'Attempted' : '')),
        h('div.pq', { html: p.statement }), ed.el, h('div.op-row', submitBtn, h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: () => { ed.value = p.starter; } }, 'Reset'), hintBtn, solBtn),
        hintBox, out, solBox);
      return card;
    }
    function draw() {
      listEl.innerHTML = '';
      PP.problems.filter((p) => !filter || p.module === filter).forEach((p) => listEl.appendChild(problemCard(p)));
    }
    draw();
    const projects = h('div.projects', (PP.projects || []).map((p) => h('article.project', h('h3', 'Module ' + p.module + ': ' + p.title), h('p', p.brief),
      h('button.btn.btn-ghost', { type: 'button', onclick: () => app.openInPlayground(p.starter) }, 'Open starter code in playground'))));
    return [crumbs([['Home', '#/'], ['Practice']]), ...title('Practice problems', 'Your code is executed and checked against several test cases — not just searched for keywords. Hints unlock one at a time; the solution unlocks after your first attempt.'),
      chips, listEl, h('h2', 'Practical mini-projects'), h('p.muted', 'Open-ended projects that combine a whole module. Start from the code skeleton in the playground.'), projects,
      h('p.muted', 'Each lesson also has three graded practice questions and a mini challenge.')];
  };

  /* ---------------- quizzes */
  pages.quizList = () => {
    const rows = [1, 2, 3, 4, 5].map((n) => {
      const q = store.state.quizzes[n];
      return h('a.quiz-card', { href: '#/quiz/' + n }, h('div.mc-num', 'Module ' + n), h('h3', MOD_SHORT[n]), h('p', PP.quizzes[n].length + ' questions'), h('p.muted', q ? 'Best ' + q.best + '% · last ' + q.last + '% · ' + q.attempts + ' attempt(s)' : 'Not attempted yet'));
    });
    const f = store.state.quizzes.final;
    return [crumbs([['Home', '#/'], ['Quizzes']]), ...title('Quizzes and assessments', 'Multiple choice, predict-the-output, find-the-error and code-completion questions. Answers and explanations stay hidden until you submit. Question order is shuffled on every attempt.'),
      h('div.mod-cards', rows), h('div.final-card', h('div', h('h2', 'Final course revision test'), h('p', '25 questions drawn at random from all five modules (5 per module).'), f ? h('p.muted', 'Best ' + f.best + '% · ' + f.attempts + ' attempt(s)') : null), h('a.btn.btn-run.btn-lg', { href: '#/quiz/final' }, 'Start the final test'))];
  };

  pages.quiz = (key) => {
    const isFinal = key === 'final';
    if (!isFinal && !PP.quizzes[key]) return pages.notfound();
    const label = isFinal ? 'Final revision test' : 'Module ' + key + ' quiz';
    const host = h('div');
    function build() {
      const pool = isFinal ? [1, 2, 3, 4, 5].flatMap((n) => PP.shuffle(PP.quizzes[n]).slice(0, 5).map((q) => Object.assign({ mod: n }, q))) : PP.quizzes[key].map((q) => Object.assign({ mod: +key }, q));
      const qs = PP.shuffle(pool).map((q) => {
        if (q.type === 'fill') return q;
        const order = PP.shuffle(q.options.map((o, i) => i));
        return Object.assign({}, q, { options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) });
      });
      host.innerHTML = '';
      const form = h('form.quiz', { novalidate: true });
      const TYPE = { mcq: 'Multiple choice', output: 'Predict the output', error: 'Find the error', fill: 'Complete the code' };
      qs.forEach((q, i) => {
        const name = 'q' + i;
        let ans;
        if (q.type === 'fill') ans = h('label.fill', 'Your answer: ', h('input.mono', { type: 'text', name, autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Answer for question ' + (i + 1) }));
        else ans = h('div.opts', { role: 'radiogroup', 'aria-label': 'Options for question ' + (i + 1) }, q.options.map((o, k) => h('label.opt', h('input', { type: 'radio', name, value: k }),
          q.type === 'output' ? h('pre.opt-pre', o) : h('span', { html: o }))));
        form.appendChild(h('fieldset.qq', { 'data-i': i }, h('legend', h('span.qn', (i + 1) + '.'), h('span.qtype', TYPE[q.type]), isFinal ? h('span.qtype', 'M' + q.mod) : null),
          h('div.qtext', { html: q.q }), q.code ? PP.codeView(q.code) : null, ans, h('div.qfb')));
      });
      const submit = h('button.btn.btn-run.btn-lg', { type: 'submit' }, 'Submit answers');
      form.appendChild(h('div.quiz-submit', submit, h('span.muted', qs.length + ' questions')));
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const unanswered = qs.filter((q, i) => q.type === 'fill' ? !form.elements['q' + i].value.trim() : !form.querySelector(`input[name="q${i}"]:checked`)).length;
        if (unanswered && !confirm(unanswered + ' question(s) are unanswered and will be marked wrong. Submit anyway?')) return;
        let score = 0; const topics = {};
        qs.forEach((q, i) => {
          const fs = form.querySelector(`fieldset[data-i="${i}"]`);
          let ok, given;
          if (q.type === 'fill') {
            given = form.elements['q' + i].value;
            const norm = (s) => s.replace(/\s+/g, '').replace(/"/g, "'");
            ok = q.answer.some((a) => norm(a) === norm(given));
          } else {
            const c = form.querySelector(`input[name="q${i}"]:checked`);
            given = c ? +c.value : -1; ok = given === q.answer;
            $$('label.opt', fs).forEach((lab, k) => { lab.classList.toggle('right', k === q.answer); lab.classList.toggle('wrong', k === given && !ok); });
          }
          if (ok) score++;
          const tk = isFinal ? 'Module ' + q.mod + ': ' + q.topic : q.topic;
          topics[tk] = topics[tk] || { c: 0, n: 0 }; topics[tk].n++; if (ok) topics[tk].c++;
          fs.classList.add(ok ? 'is-right' : 'is-wrong');
          const fb = fs.querySelector('.qfb');
          fb.append(h('p.' + (ok ? 'out-pass' : 'out-fail'), ok ? 'Correct.' : 'Incorrect.' + (q.type === 'fill' ? ' Accepted answer: ' + q.answer[0] : ' Correct answer is highlighted.')), h('p', { html: q.explain }));
          $$('input', fs).forEach((x) => { x.disabled = true; });
        });
        const pct = Math.round((100 * score) / qs.length);
        store.quizResult(key, pct, topics, label);
        submit.remove();
        const summary = h('section.quiz-summary', { tabindex: '-1' }, h('h2', 'Score: ' + score + ' / ' + qs.length + ' (' + pct + '%)'),
          h('p', pct >= 80 ? 'Excellent — you have a strong grasp of this material.' : pct >= 60 ? 'Good. Review the topics below that scored under 60%.' : 'Revise the lessons for the weaker topics below, then try again.'),
          h('table.ref', h('thead', h('tr', h('th', 'Topic'), h('th', 'Correct'), h('th', ''))), h('tbody', Object.entries(topics).sort((a, b) => a[1].c / a[1].n - b[1].c / b[1].n).map(([t, r]) =>
            h('tr' + (r.c / r.n < 0.6 ? '.weak' : ''), h('td', t), h('td', r.c + ' / ' + r.n), h('td', r.c / r.n < 0.6 ? 'Revise' : '✓'))))),
          h('div.op-row', h('button.btn.btn-run', { type: 'button', onclick: () => { build(); window.scrollTo(0, 0); } }, 'Retry with new order'), h('a.btn.btn-ghost', { href: '#/dashboard' }, 'View dashboard'),
            isFinal ? null : h('a.btn.btn-ghost', { href: '#/module/' + key }, 'Back to Module ' + key)));
        host.insertBefore(summary, form); summary.focus(); summary.scrollIntoView();
      });
      host.appendChild(form);
    }
    build();
    return [crumbs([['Home', '#/'], ['Quizzes', '#/quiz'], [label]]), ...title(label, isFinal ? 'Five random questions from each module.' : MOD_SHORT[key]), host];
  };

  /* ---------------- dashboard */
  pages.dashboard = () => {
    const s = store.state; const all = PP.allLessons();
    const done = all.filter((l) => s.lessons[l.id]).length;
    const nl = nextLesson();
    const weak = [];
    Object.entries(s.quizzes).forEach(([k, q]) => Object.entries(q.topics || {}).forEach(([t, r]) => { if (r.n && r.c / r.n < 0.6) weak.push([k === 'final' ? t : 'Module ' + k + ': ' + t, '#/quiz/' + k]); }));
    PP.modules.forEach((m) => { const started = m.lessons.some((l) => s.lessons[l.id]); if (started) m.lessons.filter((l) => !s.lessons[l.id]).forEach((l) => weak.push(['Unfinished lesson: ' + l.title, '#/lesson/' + l.id])); });
    const solved = Object.values(s.problems).filter((p) => p.solved).length;
    return [crumbs([['Home', '#/'], ['Dashboard']]), ...title('Learning dashboard'),
      h('div.dash-top', h('div.dash-ring', ring(store.overall(), 140), h('p', 'Course completion')),
        h('div.stats', [['Lessons completed', done + ' / ' + all.length], ['Problems solved', solved + ' / ' + PP.problems.length], ['Programs run', s.runs], ['Badges', Object.keys(s.badges).length + ' / ' + store.BADGES.length]].map(([a, b]) => h('div.stat', h('strong', String(b)), h('span', a)))),
        h('a.btn.btn-run.btn-lg', { href: '#/lesson/' + nl.id }, 'Continue learning: ' + nl.title)),
      h('div.dash-grid',
        h('section.card', h('h2', 'Modules'), PP.modules.map((m) => h('div.dm', h('a', { href: '#/module/' + m.n }, 'Module ' + m.n + ' – ' + m.title), bar(store.moduleProgress(m.n)), h('small', m.lessons.filter((l) => s.lessons[l.id]).length + ' of ' + m.lessons.length + ' lessons')))),
        h('section.card', h('h2', 'Quiz scores'), h('table.ref', h('thead', h('tr', h('th', 'Quiz'), h('th', 'Best'), h('th', 'Last'), h('th', 'Attempts'))),
          h('tbody', [...[1, 2, 3, 4, 5].map(String), 'final'].map((k) => { const q = s.quizzes[k]; return h('tr', h('td', h('a', { href: '#/quiz/' + k }, k === 'final' ? 'Final test' : 'Module ' + k)), h('td', q ? q.best + '%' : '—'), h('td', q ? q.last + '%' : '—'), h('td', q ? String(q.attempts) : '0')); })))),
        h('section.card', h('h2', 'Topics needing revision'), weak.length ? h('ul.weak-list', weak.slice(0, 12).map(([t, href]) => h('li', h('a', { href }, t)))) : h('p.muted', 'Nothing flagged yet. Topics where you score under 60% in a quiz, and unfinished lessons in modules you have started, appear here.')),
        h('section.card', h('h2', 'Recent activity'), s.activity.length ? h('ul.activity', s.activity.slice(0, 10).map((a) => h('li', h('time', new Date(a.t).toLocaleString()), ' ', a.href ? h('a', { href: a.href }, a.msg) : a.msg))) : h('p.muted', 'No activity yet.'))),
      h('h2', 'Achievements'), h('div.badges', store.BADGES.map((b) => h('div.badge-card' + (s.badges[b.id] ? '.earned' : ''), h('span.bdg-icon', { 'aria-hidden': 'true' }, s.badges[b.id] ? '★' : '☆'), h('strong', b.name), h('small', b.desc)))),
      h('section.card.privacy', h('h2', 'About your data'),
        h('p', 'Progress is saved in this browser’s localStorage' + (store.persistent ? '' : ' — which is currently unavailable, so progress lasts only until you close the page') + '. It is not sent anywhere, is not a secure record, and is not synchronised across devices or browsers. Clearing browser data erases it.'),
        h('button.btn.btn-danger', { type: 'button', onclick: () => { if (confirm('Reset all progress, scores, badges and activity? This cannot be undone.')) { store.reset(); app.refreshProgress(); route(); PP.toast('Progress reset'); } } }, 'Reset progress'))];
  };

  /* ---------------- reference */
  pages.reference = () => {
    const gl = h('dl.glossary');
    const glIn = h('input', { type: 'search', placeholder: 'Filter glossary…', 'aria-label': 'Filter glossary' });
    const drawGl = () => { gl.innerHTML = ''; const q = glIn.value.toLowerCase(); PP.glossary.filter(([t, d]) => !q || (t + d).toLowerCase().includes(q)).forEach(([t, d]) => gl.append(h('dt', t), h('dd', d))); };
    glIn.addEventListener('input', drawGl); drawGl();
    const checklist = PP.modules.map((m) => h('details.syl', h('summary', h('strong', 'Module ' + m.n + ' revision checklist')), h('ul.checklist', PP.course.syllabus[m.n].topics.map((t, i) => {
      const k = m.n + ':' + i;
      const cb = h('input', { type: 'checkbox', checked: !!store.state.checklist[k], onchange: (e) => store.toggleCheck(k, e.target.checked) });
      return h('li', h('label', cb, ' ', t));
    }))));
    const toc = h('nav.toc', h('ol', PP.reference.map((r) => h('li', h('a', { href: '#', onclick: (e) => { e.preventDefault(); document.getElementById('ref-' + r.id).scrollIntoView(); } }, r.title))).concat([h('li', h('a', { href: '#', onclick: (e) => { e.preventDefault(); $('#ref-glossary').scrollIntoView(); } }, 'Glossary')), h('li', h('a', { href: '#', onclick: (e) => { e.preventDefault(); $('#ref-check').scrollIntoView(); } }, 'Revision checklist'))])));
    return [crumbs([['Home', '#/'], ['Revision and Reference']]), ...title('Revision and reference', 'Quick-reference sheets matched to the syllabus, a glossary and a module-wise revision checklist (ticks are saved in this browser).'), toc,
      ...PP.reference.map((r) => h('section.ref-sec', { id: 'ref-' + r.id }, h('h2', r.title, r.module ? h('small.muted', ' · Module ' + r.module) : null), h('div.table-scroll', { html: r.html }))),
      h('section.ref-sec#ref-glossary', h('h2', 'Glossary'), glIn, gl),
      h('section.ref-sec#ref-check', h('h2', 'Module-wise revision checklist'), ...checklist)];
  };

  /* ---------------- search */
  let index = null;
  function buildIndex() {
    index = [];
    PP.allLessons().forEach((l) => index.push({ type: 'Lesson', module: l.module, title: l.title, href: '#/lesson/' + l.id, text: [l.covers.join(' '), PP.stripHtml(l.concept), l.summary.join(' '), l.syntax].join(' ') }));
    PP.reference.forEach((r) => index.push({ type: 'Reference', module: r.module, title: r.title, href: '#/reference', text: PP.stripHtml(r.html) }));
    PP.glossary.forEach(([t, d]) => index.push({ type: 'Glossary', module: 0, title: t, href: '#/reference', text: d }));
    PP.problems.forEach((p) => index.push({ type: 'Problem', module: p.module, title: p.title, href: '#/practice', text: PP.stripHtml(p.statement) + ' ' + p.topic }));
  }
  pages.search = (params) => {
    if (!index) buildIndex();
    const q = (params.get('q') || '').trim();
    let mod = +(params.get('m') || 0);
    const input = h('input.search-big', { type: 'search', value: q, 'aria-label': 'Search the course', placeholder: 'Search lessons, reference and glossary' });
    const results = h('div.results', { 'aria-live': 'polite' });
    const chips = h('div.chips', [0, 1, 2, 3, 4, 5].map((n) => h('button.chip' + (n === mod ? '.on' : ''), { type: 'button', onclick: (e) => { mod = n; $$('.chip', chips).forEach((c) => c.classList.toggle('on', c === e.target)); draw(); } }, n ? 'Module ' + n : 'All')));
    function draw() {
      results.innerHTML = '';
      const terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) { results.appendChild(h('p.muted', 'Type a word such as “slicing”, “shelve”, “JOIN” or “__str__”.')); return; }
      const scored = index.filter((e) => !mod || e.module === mod).map((e) => {
        const tt = e.title.toLowerCase(), tx = e.text.toLowerCase(); let score = 0;
        for (const t of terms) { if (!tt.includes(t) && !tx.includes(t)) return null; score += (tt.includes(t) ? 10 : 0) + Math.min(5, tx.split(t).length - 1); }
        return [score, e];
      }).filter(Boolean).sort((a, b) => b[0] - a[0]);
      results.appendChild(h('p.muted', scored.length + ' result' + (scored.length === 1 ? '' : 's')));
      scored.slice(0, 40).forEach(([, e]) => {
        const tx = e.text, pos = tx.toLowerCase().indexOf(terms[0]);
        const snip = pos >= 0 ? (pos > 60 ? '…' : '') + tx.slice(Math.max(0, pos - 60), pos + 120) + '…' : tx.slice(0, 160);
        results.appendChild(h('a.result', { href: e.href }, h('span.r-type', e.type + (e.module ? ' · Module ' + e.module : '')), h('strong', e.title), h('span.r-snip', snip)));
      });
    }
    input.addEventListener('input', draw);
    setTimeout(() => { draw(); input.focus(); }, 0);
    return [crumbs([['Home', '#/'], ['Search']]), ...title('Search'), input, chips, results];
  };

  pages.notfound = () => [...title('Page not found'), h('p', 'That page does not exist. '), h('a.btn.btn-run', { href: '#/' }, 'Go to Home')];

  /* ---------------------------------------------------------------- router */
  function route() {
    const hash = location.hash || '#/';
    const [path, qs] = hash.slice(1).split('?');
    const parts = path.split('/').filter(Boolean);
    let content;
    try {
      if (!parts.length) content = pages.home();
      else if (parts[0] === 'overview') content = pages.overview();
      else if (parts[0] === 'module') content = pages.module(parts[1]);
      else if (parts[0] === 'lesson') content = pages.lesson(parts[1]);
      else if (parts[0] === 'playground') content = pages.playground();
      else if (parts[0] === 'practice') content = pages.practice();
      else if (parts[0] === 'quiz') content = parts[1] ? pages.quiz(parts[1]) : pages.quizList();
      else if (parts[0] === 'dashboard') content = pages.dashboard();
      else if (parts[0] === 'reference') content = pages.reference();
      else if (parts[0] === 'search') content = pages.search(new URLSearchParams(qs || ''));
      else content = pages.notfound();
    } catch (e) {
      console.error(e);
      content = [h('h1', 'Something went wrong'), h('pre.out-err', String(e && e.stack || e))];
    }
    const m = main();
    m.innerHTML = '';
    [].concat(content).forEach((c) => c && m.appendChild(c));
    document.body.classList.remove('nav-open');
    markActive();
    const t = $('#pageTitle', m);
    document.title = (t ? t.textContent + ' · ' : '') + 'Python Programming 1BEC305';
    window.scrollTo(0, 0);
    if (t && app._navigated) t.focus({ preventScroll: true });
    app._navigated = true;
  }
  app.route = route;

  /* ---------------------------------------------------------------- init */
  function init() {
    applyTheme();
    buildSidebar();
    pythonPill();
    $('#themeBtn').addEventListener('click', () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; store.setTheme(t); applyTheme(t); });
    $('#menuBtn').addEventListener('click', () => { const open = document.body.classList.toggle('nav-open'); $('#menuBtn').setAttribute('aria-expanded', open); });
    $('#scrim').addEventListener('click', () => document.body.classList.remove('nav-open'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.body.classList.remove('nav-open'); });
    $('#searchForm').addEventListener('submit', (e) => { e.preventDefault(); const q = $('#searchBox').value.trim(); location.hash = '#/search?q=' + encodeURIComponent(q); });
    window.addEventListener('hashchange', route);
    route();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
