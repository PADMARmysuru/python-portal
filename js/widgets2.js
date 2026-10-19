(function () {
  'use strict';
  const PP = window.PP, h = PP.h, W = PP.widgets;
  const pyStr = (s) => JSON.stringify(String(s));
  const sleep = (ms) => new Promise((r) => setTimeout(r, PP.reducedMotion() ? 0 : ms));
  const errBox = (m) => h('pre.out-err', m);
  let n = 0; const uid = (p) => p + (++n) + Math.random().toString(36).slice(2, 6);
  const NS = 'http://www.w3.org/2000/svg';
  const S = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, v); if (text != null) e.textContent = text; return e; };

  /* ------------------------------------------------------------------ regex playground */
  const ESC = { d: 'a digit 0–9', D: 'any character except a digit', w: 'a word character (letter, digit or _)', W: 'any non-word character', s: 'a whitespace character (space, tab, newline)', S: 'any non-whitespace character', b: 'a word boundary', B: 'a position that is not a word boundary', n: 'a newline', t: 'a tab', A: 'the very start of the string', Z: 'the very end of the string' };
  PP.explainRegex = function (p) {
    const out = []; let i = 0, g = 0, lit = '';
    const flush = () => { if (lit) { out.push([lit, 'the literal text "' + lit + '"']); lit = ''; } };
    while (i < p.length) {
      const c = p[i];
      if (c === '\\') {
        flush(); const nx = p[i + 1];
        if (nx === undefined) { out.push(['\\', 'a backslash with nothing after it (error)']); break; }
        out.push(['\\' + nx, ESC[nx] || (/\d/.test(nx) ? 'the text matched by group ' + nx : 'a literal "' + nx + '"')]); i += 2; continue;
      }
      if (c === '[') {
        flush(); let j = i + 1; if (p[j] === '^') j++; if (p[j] === ']') j++;
        while (j < p.length && p[j] !== ']') { if (p[j] === '\\') j++; j++; }
        const cls = p.slice(i, j + 1);
        out.push([cls, cls[1] === '^' ? 'one character NOT in: ' + cls.slice(2, -1) : 'one character from: ' + cls.slice(1, -1)]); i = j + 1; continue;
      }
      if (c === '(') { flush(); if (p.startsWith('(?:', i)) { out.push(['(?:', 'start of a non-capturing group']); i += 3; } else { g++; out.push(['(', 'start of group ' + g]); i++; } continue; }
      if (c === ')') { flush(); out.push([')', 'end of group']); i++; continue; }
      const q = p.slice(i).match(/^\{(\d*)(,?)(\d*)\}(\?)?/);
      if (q) {
        flush(); const [all, a, comma, b, lazy] = q;
        let d = comma ? (a && b ? `between ${a} and ${b}` : a ? `${a} or more` : `up to ${b}`) : `exactly ${a}`;
        out.push([all, d + ' repetitions of the previous item' + (lazy ? ', as FEW as possible (non-greedy)' : comma ? ', as many as possible (greedy)' : '')]); i += all.length; continue;
      }
      if ('*+?'.includes(c)) {
        flush(); const lazy = p[i + 1] === '?';
        const m = { '*': 'zero or more of the previous item', '+': 'one or more of the previous item', '?': 'the previous item is optional (zero or one)' }[c];
        out.push([c + (lazy ? '?' : ''), m + (lazy ? ' — non-greedy' : '')]); i += lazy ? 2 : 1; continue;
      }
      if (c === '^') { flush(); out.push(['^', 'start of the string']); i++; continue; }
      if (c === '$') { flush(); out.push(['$', 'end of the string']); i++; continue; }
      if (c === '.') { flush(); out.push(['.', 'any single character except a newline']); i++; continue; }
      if (c === '|') { flush(); out.push(['|', 'OR: the part before or the part after']); i++; continue; }
      lit += c; i++;
    }
    flush();
    return out;
  };

  W.regex = (o) => {
    const presets = o.presets || [];
    const first = presets[0] || { pattern: R(`\\d+`), text: 'Room 101', func: 'findall' };
    function R(s) { return s; }
    const pat = h('input.rx-pat', { type: 'text', spellcheck: 'false', autocapitalize: 'off', value: first.pattern, 'aria-label': 'Regular expression pattern' });
    const text = h('textarea.rx-text', { rows: 3, spellcheck: 'false', 'aria-label': 'Text to search' }, first.text);
    const fn = h('select', { 'aria-label': 'Function' }, ['search', 'findall', 'sub'].map((f) => h('option', { value: f }, f + '()')));
    fn.value = first.func || 'findall';
    const repl = h('input', { type: 'text', value: first.repl || '', size: 10, 'aria-label': 'Replacement for sub()', placeholder: 'replacement' });
    const flags = ['IGNORECASE', 'DOTALL', 'MULTILINE', 'VERBOSE'].map((f) => { const cb = h('input', { type: 'checkbox', value: f }); return { f, cb, el: h('label.rx-flag', cb, ' re.' + f) }; });
    const view = h('div.rx-view', { 'aria-live': 'polite' });
    const matches = h('div.rx-matches');
    const result = h('pre.rx-result');
    const explain = h('ul.rx-explain');
    const codeOut = h('div');
    const setFlags = (list) => flags.forEach((x) => { x.cb.checked = (list || []).includes(x.f); });
    setFlags(first.flags);
    const chips = h('div.chips', presets.map((p) => h('button.chip', { type: 'button', onclick: () => {
      pat.value = p.pattern; text.value = p.text; fn.value = p.func || 'findall'; repl.value = p.repl || ''; setFlags(p.flags); update();
    } }, p.label)));
    async function update() {
      repl.hidden = fn.value !== 'sub';
      const fl = flags.filter((x) => x.cb.checked).map((x) => x.f);
      explain.innerHTML = '';
      PP.explainRegex(pat.value).forEach(([tok, d]) => explain.appendChild(h('li', h('code', tok), ' — ', d)));
      const flagCode = fl.length ? ', ' + fl.map((f) => 're.' + f).join(' | ') : '';
      const call = fn.value === 'sub' ? `regex.sub(r${pyStr(repl.value).replace(/\\\\/g, '\\')}, text)` : `regex.${fn.value}(text)`;
      codeOut.innerHTML = '';
      codeOut.appendChild(PP.codeView(`import re\nregex = re.compile(r'${pat.value.replace(/'/g, "\\'")}'${flagCode})\nprint(${call})`));
      let r;
      try { r = await PP.py.call('pp_regex', JSON.stringify({ pattern: pat.value, text: text.value, flags: fl, func: fn.value, repl: repl.value })); }
      catch (e) { view.innerHTML = ''; view.appendChild(errBox('Python could not start: ' + e.message)); return; }
      view.innerHTML = ''; matches.innerHTML = ''; result.textContent = '';
      if (r.error) { view.appendChild(errBox(r.error)); return; }
      const t = text.value; let pos = 0;
      const box = h('div.rx-hl');
      r.matches.forEach((m, k) => {
        box.appendChild(document.createTextNode(t.slice(pos, m.s)));
        box.appendChild(h('mark', { class: 'm' + (k % 2), title: 'match ' + (k + 1) + ': span(' + m.s + ', ' + m.e + ')' }, t.slice(m.s, m.e) || '∅'));
        pos = m.e;
      });
      box.appendChild(document.createTextNode(t.slice(pos)));
      view.appendChild(box);
      view.appendChild(h('p.muted', r.matches.length + ' match' + (r.matches.length === 1 ? '' : 'es') + (fn.value === 'search' ? ' in the text — search() returns only the first.' : '.')));
      if (r.matches.length) matches.appendChild(h('table.ref.rx-table', h('thead', h('tr', h('th', '#'), h('th', 'match'), h('th', 'span'), r.groups ? h('th', 'groups') : null)),
        h('tbody', r.matches.slice(0, 50).map((m, k) => h('tr', h('td', String(k + 1)), h('td', h('code', JSON.stringify(m.m))), h('td', `(${m.s}, ${m.e})`), r.groups ? h('td', h('code', m.g.map((x) => x === null ? 'None' : JSON.stringify(x)).join(', '))) : null)))));
      result.textContent = r.result != null ? 'Result: ' + r.result : '';
    }
    let t; const deb = () => { clearTimeout(t); t = setTimeout(update, 300); };
    [pat, text, repl].forEach((e) => e.addEventListener('input', deb));
    fn.addEventListener('change', update); flags.forEach((x) => x.cb.addEventListener('change', update));
    setTimeout(update, 30);
    return h('div.regexlab', chips,
      h('label.rx-row', h('span', "r'"), pat, h('span', "'")),
      h('div.op-row', fn, repl, flags.map((x) => x.el)),
      h('label.sr', 'Text'), text, view, result, matches,
      h('details.rx-why', { open: true }, h('summary', 'What each part of the pattern means'), explain),
      h('details', h('summary', 'Equivalent Python program'), codeOut));
  };

  W.regexRef = () => {
    const rows = [
      ['?', 'zero or one of the preceding group'], ['*', 'zero or more of the preceding group'], ['+', 'one or more of the preceding group'],
      ['{n}', 'exactly n of the preceding group'], ['{n,}', 'n or more'], ['{,m}', '0 to m'], ['{n,m}', 'at least n, at most m'],
      ['{n,m}? *? +?', 'non-greedy match of the preceding group'], ['^spam', 'string must begin with spam'], ['spam$', 'string must end with spam'],
      ['.', 'any character except newline'], [R('\\d \\w \\s'), 'digit, word character, whitespace'], [R('\\D \\W \\S'), 'anything except digit, word char, whitespace'],
      ['[abc]', 'any character between the brackets'], ['[^abc]', 'any character not between the brackets'], ['a|b', 'a or b'], ['( )', 'group (captured)']
    ];
    function R(s) { return s; }
    return h('table.ref', h('caption', 'Review of regex symbols'), h('thead', h('tr', h('th', 'Symbol'), h('th', 'Matches'))),
      h('tbody', rows.map(([a, b]) => h('tr', h('td', h('code', a)), h('td', b)))));
  };

  /* ------------------------------------------------------------------ file system helpers */
  async function fsList() { return PP.py.call('pp_fs'); }
  function fsPanel(onPick) {
    const el = h('div.fs-panel');
    el.refresh = async () => {
      const r = await fsList();
      el.innerHTML = '';
      el.appendChild(h('div.fs-head', h('strong', 'Virtual workspace'), h('code', r.cwd)));
      el.appendChild(h('ul.fs-list', r.items.length ? r.items.map((it) => {
        const depth = it.path.split('/').length - 1;
        return h('li', { style: 'padding-left:' + (depth * 1.1) + 'em' }, it.dir ? h('span.fs-dir', '📁 ' + it.path.split('/').pop() + '/') :
          h('button.fs-file', { type: 'button', onclick: () => onPick && onPick(it.path) }, '📄 ' + it.path.split('/').pop(), h('small', ' ' + it.size + ' B')));
      }) : h('li.muted', 'empty')));
    };
    return el;
  }

  /* ------------------------------------------------------------------ os.path explorer */
  W.pathViz = () => {
    const input = h('input', { type: 'text', value: 'data/marks.csv', spellcheck: 'false', 'aria-label': 'Path', size: 26 });
    const win = h('input', { type: 'checkbox' });
    const table = h('div');
    const fs = fsPanel((p) => { input.value = p; go(); });
    async function go() {
      const p = input.value;
      const isWin = win.checked;
      const code = `import os, ntpath, json
P = ${isWin ? 'ntpath' : 'os.path'}
p = ${pyStr(p)}
rows = [
  ("join(p, 'notes.txt')", P.join(p, 'notes.txt')),
  ('abspath(p)', P.abspath(p)), ('isabs(p)', P.isabs(p)),
  ('dirname(p)', P.dirname(p)), ('basename(p)', P.basename(p)),
  ('split(p)', P.split(p)), ('splitext(p)', P.splitext(p)), ('normpath(p)', P.normpath(p)),
]
${isWin ? '' : `rows += [('exists(p)', P.exists(p)), ('isfile(p)', P.isfile(p)), ('isdir(p)', P.isdir(p)),
         ('getsize(p)', P.getsize(p) if P.isfile(p) else '(not a file)'), ('relpath(p)', P.relpath(P.abspath(p)))]`}
print('@@' + json.dumps([[a, repr(b)] for a, b in rows]))`;
      table.innerHTML = '';
      try {
        const res = await PP.py.run(code);
        if (res.err) { table.appendChild(errBox(res.err)); return; }
        const rows = JSON.parse(res.out.split('@@')[1]);
        table.appendChild(h('table.ref', h('thead', h('tr', h('th', (isWin ? 'ntpath.' : 'os.path.') + 'function'), h('th', 'result'))),
          h('tbody', rows.map(([a, b]) => h('tr', h('td', h('code', a)), h('td', h('code', b)))))));
        if (isWin) table.appendChild(h('p.muted', 'Windows mode uses the ntpath module (what os.path is on Windows). exists/isfile/isdir are omitted because they would check this Linux-style virtual disk.'));
      } catch (e) { table.appendChild(errBox('Python could not start: ' + e.message)); }
      fs.refresh();
    }
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    win.addEventListener('change', go);
    const chips = h('div.chips', ['data/marks.csv', 'sample.txt', '/home/pyodide/workspace/data', '../pyodide', 'data/../sample.txt', 'missing/file.txt', 'C:\\Users\\Asha\\notes.txt'].map((p) =>
      h('button.chip', { type: 'button', onclick: () => { input.value = p; if (p.startsWith('C:')) win.checked = true; go(); } }, p)));
    setTimeout(go, 30);
    return h('div.pathviz', chips, h('div.op-row', h('label', 'p = ', input), h('button.btn.btn-run', { type: 'button', onclick: go }, 'Evaluate'), h('label', win, ' Windows (ntpath)')),
      h('div.pv-grid', table, fs));
  };

  /* ------------------------------------------------------------------ file operation visualizer */
  W.fileViz = () => {
    const name = h('input', { type: 'text', value: 'notes.txt', size: 14, 'aria-label': 'File name' });
    const op = h('select', { 'aria-label': 'Operation' },
      [['w', "write — open(name, 'w')"], ['a', "append — open(name, 'a')"], ['r', "read() — open(name, 'r')"], ['rl', "readlines() — open(name, 'r')"]].map(([v, l]) => h('option', { value: v }, l)));
    const content = h('textarea', { rows: 3, 'aria-label': 'Text to write' }, 'First line\nSecond line\n');
    const stages = h('ol.fv-stages', ['open()', 'write() / read()', 'close()'].map((s) => h('li', s)));
    const codeBox = h('div'); const out = h('div.runner-out'); out.hidden = true;
    const preview = h('div.fv-preview');
    const fs = fsPanel((p) => show(p));
    async function show(p) {
      const r = await PP.py.call('pp_read', p);
      preview.innerHTML = '';
      preview.appendChild(h('div.fv-ph', 'Contents of ', h('code', p)));
      preview.appendChild(r.error ? errBox(r.error) : h('pre.fv-text', r.text === '' ? '(empty file)' : r.text));
      if (r.text) preview.appendChild(h('p.muted', 'repr: ' + JSON.stringify(r.text).slice(0, 160)));
    }
    function build() {
      const f = pyStr(name.value), v = op.value;
      if (v === 'w' || v === 'a') return `f = open(${f}, '${v}')\nn = f.write(${pyStr(content.value)})\nf.close()\nprint('wrote', n, 'characters')`;
      if (v === 'r') return `f = open(${f}, 'r')\ncontent = f.read()\nf.close()\nprint(repr(content))`;
      return `f = open(${f}, 'r')\nlines = f.readlines()\nf.close()\nprint(lines)`;
    }
    const sync = () => { codeBox.innerHTML = ''; codeBox.appendChild(PP.codeView(build())); content.hidden = !['w', 'a'].includes(op.value); };
    [name, op, content].forEach((e) => e.addEventListener('input', sync)); op.addEventListener('change', sync);
    const run = h('button.btn.btn-run', { type: 'button', onclick: async () => {
      run.disabled = true;
      const lis = PP.$$('li', stages); lis.forEach((l) => l.classList.remove('on', 'done'));
      for (const l of lis) { l.classList.add('on'); await sleep(450); l.classList.remove('on'); l.classList.add('done'); }
      try {
        const res = await PP.py.run(build());
        PP.renderOutput(out, res); PP.store.noteRun();
        await fs.refresh(); if (!res.err || op.value !== 'r') show(name.value);
      } catch (e) { out.hidden = false; out.innerHTML = ''; out.appendChild(errBox(e.message)); }
      run.disabled = false;
    } }, 'Run the three steps');
    sync(); setTimeout(() => fs.refresh().catch(() => {}), 50);
    return h('div.fileviz', h('div.op-row', h('label', 'file ', name), op), content, stages, codeBox, run, out,
      h('div.pv-grid', preview, fs), h('p.viz-label', 'Files live in the browser’s virtual file system (real Python file I/O). Your own computer’s files are never touched, and the workspace resets when the page reloads.'));
  };

  /* ------------------------------------------------------------------ class / object visualizer */
  W.classViz = (o) => {
    const key = uid('cls');
    const init = o.mode === 'init';
    const classCode = init ? `class Student:
    def __init__(self, name, usn, marks=0):
        self.name = name
        self.usn = usn
        self.marks = marks

    def grade(self):
        return 'Pass' if self.marks >= 40 else 'Fail'

    def __str__(self):
        return self.name + ' (' + self.usn + '): ' + str(self.marks)` : `class Point:
    """Represents a point in 2-D space."""`;
    const cls = init ? 'Student' : 'Point';
    const fields = init ? [['name', 'Asha'], ['usn', '1GS23EC001'], ['marks', '88']] : [['x', '3.0'], ['y', '4.0']];
    const inputs = fields.map(([f, v]) => [f, h('input', { type: 'text', value: v, size: 10, 'aria-label': f })]);
    const classBox = h('div.cv-class',
      h('div.cv-cname', 'class ' + cls), h('div.cv-sec', h('small', 'attributes (set per object)'), init ? h('div', 'name, usn, marks') : h('div.muted', 'none defined — added by assignment')),
      h('div.cv-sec', h('small', 'methods'), init ? h('div', '__init__(self, name, usn, marks=0)', h('br'), 'grade(self)', h('br'), '__str__(self)') : h('div.muted', 'none')));
    const codePane = h('div.cv-code');
    const objs = h('div.cv-objs', { 'aria-live': 'polite' });
    const log = h('div');
    let count = 0;
    const drawCode = (hl) => { codePane.innerHTML = ''; classCode.split('\n').forEach((l, i) => codePane.appendChild(h('div.tr-line' + (hl === i ? '.cur' : ''), h('code', { html: PP.highlight(l) || ' ' })))); };
    const stateExpr = `{k: {'attrs': [[a, repr(v)] for a, v in vars(o).items()], 'str': str(o), 'id': hex(id(o))} for k, o in list(globals().items()) if isinstance(o, ${cls})}`;
    function draw(state, animateName) {
      objs.innerHTML = '';
      const names = Object.keys(state || {});
      if (!names.length) objs.appendChild(h('p.muted', 'No objects yet. Create one.'));
      names.forEach((k) => {
        const ob = state[k];
        const card = h('div.cv-obj' + (k === animateName ? '.new' : ''), h('div.cv-var', h('code', k), ' → ', h('small', cls + ' object at ' + ob.id)),
          h('table', h('tbody', ob.attrs.length ? ob.attrs.map(([a, v]) => h('tr', { 'data-a': a }, h('th', a), h('td', h('code', v)))) : h('tr', h('td.muted', 'no attributes')))),
          init ? h('div.cv-str', 'print(' + k + ') → ', h('code', ob.str)) : null);
        objs.appendChild(card);
      });
    }
    async function refresh(stmt, animateName) {
      const { res, state } = await PP.pyState(key, stmt, stateExpr);
      log.innerHTML = '';
      if (stmt) { log.appendChild(PP.codeView(stmt)); if (res.out) log.appendChild(h('pre.out-text', res.out)); if (res.err) log.appendChild(errBox(res.err.trim().split('\n').pop())); }
      return state;
    }
    const create = h('button.btn.btn-run', { type: 'button', onclick: async () => {
      create.disabled = true;
      const v = Object.fromEntries(inputs.map(([f, i]) => [f, i.value]));
      const name = (init ? 's' : 'p') + (++count);
      try {
        if (init) {
          const lit = (x, numeric) => numeric && /^-?\d+(\.\d+)?$/.test(x.trim()) ? x.trim() : pyStr(x);
          const stmt = `${name} = Student(${lit(v.name)}, ${lit(v.usn)}, ${lit(v.marks, true)})`;
          // Animate __init__: highlight each assignment line while a placeholder card fills in
          const before = await refresh('', null);
          draw(before, null);
          const ghost = h('div.cv-obj.new', h('div.cv-var', h('code', name), ' → ', h('small', 'new Student object (self)')), h('table', h('tbody')));
          objs.appendChild(ghost);
          const tb = ghost.querySelector('tbody');
          drawCode(1); await sleep(500);
          for (const [i, f] of [[2, 'name'], [3, 'usn'], [4, 'marks']]) {
            drawCode(i); tb.appendChild(h('tr', h('th', f), h('td', h('code', f === 'marks' ? lit(v.marks, true) : JSON.stringify(v[f]).replace(/"/g, "'"))))); await sleep(550);
          }
          drawCode(9); await sleep(400);
          const state = await refresh(stmt, name); draw(state, name); drawCode(-1);
        } else {
          const stmt = `${name} = Point()\n${name}.x = ${v.x}\n${name}.y = ${v.y}`;
          const state = await refresh(stmt, name); draw(state, name);
        }
        PP.store.noteRun();
      } catch (e) { log.innerHTML = ''; log.appendChild(errBox(e.message)); }
      create.disabled = false;
    } }, init ? 'Create object (run __init__)' : 'Create object');
    const extra = init ? h('div.op-row',
      h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: async () => { if (!count) return; const st = await refresh(`print(s${count}.grade())`); draw(st); } }, 'Call s_latest.grade()'),
      h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: async () => { if (!count) return; const st = await refresh(`s${count}.marks = s${count}.marks + 5`); draw(st); } }, 'Change marks (+5)'),
      h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: async () => { const st = await refresh(`print(s1 is s${Math.max(count, 1)}, type(s1).__name__)`); draw(st); } }, 's1 is latest?'))
      : h('div.op-row', h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: async () => { if (!count) return; const st = await refresh(`p${count}.label = 'origin' if p${count}.x == 0 else 'point'`); draw(st); } }, 'Add an attribute to the latest object'),
        h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: async () => { if (!count) return; const st = await refresh(`print(p${count}.z)`); draw(st); } }, 'Read a missing attribute'));
    const reset = h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: async () => { count = 0; await PP.py.run(classCode, { key }); await PP.py.run(`for _k in [k for k in globals() if k[:1] in 'ps' and k[1:].isdigit()]:\n    del globals()[_k]`, { key }); draw({}); log.innerHTML = ''; } }, 'Clear objects');
    drawCode(-1); draw({});
    PP.py.run(classCode, { key }).catch(() => {});
    return h('div.classviz', h('div.cv-grid', h('div', classBox, codePane), h('div', h('div.op-row', inputs.map(([f, i]) => h('label', f + ' ', i))), h('div.op-row', create, reset), extra, objs, log)));
  };

  /* ------------------------------------------------------------------ rectangle lab */
  W.rectLab = () => {
    const key = uid('rect');
    const setup = `import copy
class Point:
    """Represents a point in 2-D space."""
class Rectangle:
    """Represents a rectangle. attributes: width, height, corner."""
box = Rectangle()
box.width, box.height = 100.0, 60.0
box.corner = Point()
box.corner.x, box.corner.y = 10.0, 10.0
for _n in ['alias', 'shallow', 'deep']:
    globals().pop(_n, None)`;
    const expr = `{n: {'w': o.width, 'h': o.height, 'x': o.corner.x, 'y': o.corner.y, 'is_box': o is box, 'shares_corner': o.corner is box.corner}
     for n, o in [(k, globals()[k]) for k in ['box', 'alias', 'shallow', 'deep'] if k in globals()]}`;
    const panes = h('div.rl-panes'); const log = h('div');
    function draw(st) {
      panes.innerHTML = '';
      for (const [name, r] of Object.entries(st)) {
        const svg = S('svg', { viewBox: '0 0 220 160', class: 'rl-svg', role: 'img', 'aria-label': `${name}: ${r.w} by ${r.h} at (${r.x}, ${r.y})` });
        svg.appendChild(S('rect', { x: 0, y: 0, width: 220, height: 160, class: 'rl-bg' }));
        const sc = 0.8;
        svg.appendChild(S('rect', { x: r.x * sc, y: 160 - (r.y + r.h) * sc, width: Math.max(1, r.w * sc), height: Math.max(1, r.h * sc), class: 'rl-rect' }));
        svg.appendChild(S('circle', { cx: r.x * sc, cy: 160 - r.y * sc, r: 4, class: 'rl-corner' }));
        panes.appendChild(h('div.rl-pane', h('div.rl-name', h('code', name)), svg,
          h('div.rl-info', `width ${r.w}, height ${r.h}, corner (${r.x}, ${r.y})`),
          name !== 'box' ? h('div.rl-flags', h('span.badge' + (r.is_box ? '.badge-warn' : ''), r.is_box ? 'same object as box' : 'different object'),
            ' ', h('span.badge' + (r.shares_corner ? '.badge-warn' : ''), r.shares_corner ? 'shares box.corner' : 'own corner')) : null));
      }
    }
    async function act(stmt) {
      try {
        const { res, state } = await PP.pyState(key, stmt, expr);
        log.innerHTML = ''; log.appendChild(PP.codeView(stmt)); if (res.err) log.appendChild(errBox(res.err.trim().split('\n').pop()));
        draw(state); PP.store.noteRun();
      } catch (e) { log.innerHTML = ''; log.appendChild(errBox(e.message)); }
    }
    const B = (l, s) => h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: () => act(s) }, l);
    setTimeout(() => act(setup).then(() => { log.innerHTML = ''; log.appendChild(h('p.muted', 'box = Rectangle(), 100 × 60 with its corner at (10, 10).')); }), 30);
    return h('div.rectlab', h('div.op-row',
      B('grow_rectangle(box, 40, 30)', 'def grow_rectangle(rect, dwidth, dheight):\n    rect.width += dwidth\n    rect.height += dheight\ngrow_rectangle(box, 40, 30)'),
      B('move corner +20, +15', 'box.corner.x += 20\nbox.corner.y += 15'),
      B('alias = box', 'alias = box'), B('shallow = copy.copy(box)', 'shallow = copy.copy(box)'), B('deep = copy.deepcopy(box)', 'deep = copy.deepcopy(box)'),
      B('Reset', setup)), panes, log,
      h('p.muted', 'Try: make all three copies, then move the corner and grow the box. The alias follows everything; the shallow copy follows corner moves only; the deep copy follows nothing.'));
  };

  /* ------------------------------------------------------------------ time lab: pure vs modifier */
  W.timeLab = () => {
    const key = uid('time');
    const setup = `class Time:
    """Represents the time of day."""
def make_time(h, m, s):
    t = Time(); t.hour, t.minute, t.second = h, m, s
    return t
def fmt(t):
    return '%.2d:%.2d:%.2d' % (t.hour, t.minute, t.second)
def time_to_int(t):
    return (t.hour * 60 + t.minute) * 60 + t.second
def int_to_time(seconds):
    minutes, second = divmod(seconds, 60)
    hour, minute = divmod(minutes, 60)
    return make_time(hour, minute, second)
def add_seconds(t, seconds):          # pure function
    return int_to_time(time_to_int(t) + seconds)
def increment(t, seconds):            # modifier
    t.second += seconds
    m, t.second = divmod(t.second, 60)
    t.minute += m
    h, t.minute = divmod(t.minute, 60)
    t.hour += h`;
    const hIn = h('input', { type: 'number', value: 9, min: 0, max: 23, style: 'width:4em', 'aria-label': 'hour' });
    const mIn = h('input', { type: 'number', value: 45, min: 0, max: 59, style: 'width:4em', 'aria-label': 'minute' });
    const sIn = h('input', { type: 'number', value: 0, min: 0, max: 59, style: 'width:4em', 'aria-label': 'second' });
    const secs = h('input', { type: 'number', value: 3725, style: 'width:6em', 'aria-label': 'seconds to add' });
    const cards = h('div.tl-cards'); const log = h('div');
    const card = (title, val, note, cls) => h('div.tl-card' + (cls ? '.' + cls : ''), h('div.tl-title', title), h('div.tl-val', val), h('small', note));
    async function act(kind) {
      const start = `start = make_time(${+hIn.value || 0}, ${+mIn.value || 0}, ${+sIn.value || 0})\nbefore = fmt(start)\n`;
      const call = kind === 'pure' ? `result = add_seconds(start, ${+secs.value || 0})` : `result = increment(start, ${+secs.value || 0})`;
      try {
        await PP.py.run(setup, { key });
        const { res, state } = await PP.pyState(key, start + call, "{'before': before, 'after': fmt(start), 'result': None if result is None else fmt(result), 'same': result is start}");
        log.innerHTML = ''; log.appendChild(PP.codeView(call)); if (res.err) log.appendChild(errBox(res.err));
        cards.innerHTML = '';
        cards.append(card('start before the call', state.before, 'the original object'),
          card('start after the call', state.after, state.after === state.before ? 'unchanged' : 'CHANGED by the function', state.after === state.before ? '' : 'changed'),
          card('return value', state.result === null ? 'None' : state.result, kind === 'pure' ? 'a NEW Time object' : 'modifiers usually return None'));
        PP.store.noteRun();
      } catch (e) { log.innerHTML = ''; log.appendChild(errBox(e.message)); }
    }
    return h('div.timelab', h('div.op-row', h('label', 'start ', hIn, ':', mIn, ':', sIn), h('label', 'seconds ', secs)),
      h('div.op-row', h('button.btn.btn-run', { type: 'button', onclick: () => act('pure') }, 'Call add_seconds (pure)'),
        h('button.btn.btn-run', { type: 'button', onclick: () => act('mod') }, 'Call increment (modifier)')), cards, log,
      h('details', h('summary', 'Functions used'), PP.codeView(setup)));
  };

  /* ------------------------------------------------------------------ HTTP exchange visualization */
  W.httpViz = () => {
    const samples = {
      '/romeo.txt': ['HTTP/1.1 200 OK', ['Date: Wed, 11 Apr 2018 18:52:55 GMT', 'Server: Apache/2.4.7 (Ubuntu)', 'Last-Modified: Sat, 13 May 2017 11:22:22 GMT', 'Content-Length: 167', 'Content-Type: text/plain', 'Connection: close'],
        'But soft what light through yonder window breaks\nIt is the east and Juliet is the sun\nArise fair sun and kill the envious moon\nWho is already sick and pale with grief'],
      '/missing.txt': ['HTTP/1.1 404 Not Found', ['Content-Type: text/html', 'Content-Length: 46', 'Connection: close'], '<html><body><h1>Not Found</h1></body></html>'],
      '/old-page.htm': ['HTTP/1.1 301 Moved Permanently', ['Location: http://data.pr4e.org/page1.htm', 'Content-Length: 0', 'Connection: close'], ''],
      '/cgi/broken': ['HTTP/1.1 500 Internal Server Error', ['Content-Type: text/plain', 'Connection: close'], 'The server encountered an error.']
    };
    const sel = h('select', { 'aria-label': 'Requested path' }, Object.keys(samples).map((p) => h('option', { value: p }, p)));
    const svg = S('svg', { viewBox: '0 0 340 120', class: 'http-svg', role: 'img', 'aria-label': 'Client and server exchanging messages' });
    svg.append(S('rect', { x: 8, y: 30, width: 90, height: 60, rx: 10, class: 'http-node' }), S('text', { x: 53, y: 64, 'text-anchor': 'middle' }, 'Your program'),
      S('rect', { x: 242, y: 30, width: 90, height: 60, rx: 10, class: 'http-node' }), S('text', { x: 287, y: 58, 'text-anchor': 'middle' }, 'data.pr4e.org'), S('text', { x: 287, y: 74, 'text-anchor': 'middle', class: 'http-small' }, 'port 80'),
      S('line', { x1: 98, y1: 60, x2: 242, y2: 60, class: 'http-wire' }));
    const packet = S('circle', { cx: 98, cy: 60, r: 7, class: 'http-packet' }); svg.appendChild(packet);
    const label = S('text', { x: 170, y: 44, 'text-anchor': 'middle', class: 'http-small' }, ''); svg.appendChild(label);
    const msg = h('div.http-msg', { 'aria-live': 'polite' });
    const stepTxt = h('p.http-step');
    let step = 0;
    const steps = ['Connect: mysock.connect((\'data.pr4e.org\', 80)) opens a TCP connection.', 'Send the request line and a blank line.', 'Receive the status line.', 'Receive the headers (metadata).', 'Receive the blank line, then the body.'];
    async function move(fromX, toX, text) {
      label.textContent = text;
      if (PP.reducedMotion()) { packet.setAttribute('cx', toX); return; }
      for (let k = 0; k <= 20; k++) { packet.setAttribute('cx', fromX + (toX - fromX) * k / 20); await sleep(25); }
    }
    async function next() {
      const [status, headers, body] = samples[sel.value];
      if (step >= steps.length) { step = 0; msg.innerHTML = ''; }
      stepTxt.textContent = 'Step ' + (step + 1) + ' of 5 — ' + steps[step];
      if (step === 0) { msg.innerHTML = ''; await move(98, 242, 'SYN / connect'); await move(242, 98, 'connected'); }
      if (step === 1) { await move(98, 242, 'request'); msg.appendChild(h('div.http-req', h('small', 'request (client → server)'), h('pre', `GET http://data.pr4e.org${sel.value} HTTP/1.0\\r\\n\\r\\n`))); }
      if (step === 2) { await move(242, 98, 'status'); const c = status.split(' ')[1]; msg.appendChild(h('div.http-res', h('small', 'status line'), h('pre.http-status.s' + c[0], status))); }
      if (step === 3) { await move(242, 98, 'headers'); msg.appendChild(h('div.http-res', h('small', 'headers'), h('pre', headers.join('\n')))); }
      if (step === 4) { await move(242, 98, 'body'); msg.appendChild(h('div.http-res', h('small', 'blank line, then body (' + body.length + ' characters)'), h('pre', body || '(empty body)'))); }
      step++;
      nextBtn.textContent = step >= steps.length ? 'Start again' : 'Next step';
    }
    const nextBtn = h('button.btn.btn-run', { type: 'button', onclick: next }, 'Next step');
    sel.addEventListener('change', () => { step = 0; msg.innerHTML = ''; stepTxt.textContent = ''; nextBtn.textContent = 'Next step'; });
    return h('div.httpviz', h('div.op-row', h('label', 'GET ', sel), nextBtn), svg, stepTxt, msg,
      h('p.viz-label', 'SAMPLE DATA — a visualization of a typical exchange, not a live network request.'));
  };

  /* ------------------------------------------------------------------ XML lab */
  W.xmlLab = () => {
    const ta = h('textarea.mono', { rows: 12, spellcheck: 'false', 'aria-label': 'XML document' }, PP.SAMPLE_XML.replace(/^<\?xml[^>]*>\n/, ''));
    const q = h('input', { type: 'text', value: 'department/student', size: 22, 'aria-label': 'findall path' });
    const tree = h('div.xml-tree'); const info = h('div.xml-info'); const loop = h('div');
    let last = null;
    function nodeEl(nd, found) {
      const li = h('li', h('button.xml-node' + (found.includes(nd.id) ? '.found' : ''), { type: 'button', onclick: () => select(nd) },
        h('span.xml-tag', '<' + nd.tag + '>'), Object.keys(nd.attrib).length ? h('span.xml-attr', ' ' + Object.entries(nd.attrib).map(([k, v]) => k + '="' + v + '"').join(' ')) : null,
        nd.text ? h('span.xml-text', ' ' + nd.text) : null));
      if (nd.children.length) li.appendChild(h('ul', nd.children.map((c) => nodeEl(c, found))));
      return li;
    }
    function select(nd) {
      info.innerHTML = '';
      info.append(h('h4', '<' + nd.tag + '>'), h('table.ref', h('tbody',
        h('tr', h('th', 'tag'), h('td', h('code', nd.tag))), h('tr', h('th', 'attrib'), h('td', h('code', JSON.stringify(nd.attrib)))),
        h('tr', h('th', 'text'), h('td', h('code', nd.text ? JSON.stringify(nd.text) : 'None / blank'))), h('tr', h('th', 'children'), h('td', String(nd.children.length))),
        h('tr', h('th', 'position'), h('td', h('code', nd.path))))));
    }
    async function parse() {
      tree.innerHTML = ''; loop.innerHTML = '';
      try {
        const r = await PP.py.call('pp_xml', ta.value, q.value);
        if (r.error) { tree.appendChild(errBox(r.error)); return; }
        last = r; const found = r.found || [];
        tree.appendChild(h('ul', nodeEl(r.tree, found)));
        loop.appendChild(PP.codeView(`import xml.etree.ElementTree as ET\ntree = ET.fromstring(data)\nfor node in tree.findall(${pyStr(q.value)}):\n    print(node.tag, node.attrib)`));
        loop.appendChild(h('p', r.qerror ? errBox(r.qerror) : found.length + ' node' + (found.length === 1 ? '' : 's') + ' matched (highlighted). A for loop over findall() visits them in document order.'));
        select(r.tree); PP.store.noteRun();
      } catch (e) { tree.appendChild(errBox(e.message)); }
    }
    q.addEventListener('keydown', (e) => { if (e.key === 'Enter') parse(); });
    setTimeout(parse, 40);
    return h('div.xmllab', ta, h('div.op-row', h('button.btn.btn-run', { type: 'button', onclick: parse }, 'Parse'), h('label', 'findall(', q, ')'),
      h('div.chips', ['department/student', 'department/student/name', 'department', 'student', './/marks', ".//email[@hide='yes']"].map((p) => h('button.chip', { type: 'button', onclick: () => { q.value = p; parse(); } }, p)))),
      h('div.xml-grid', tree, info), loop);
  };

  /* ------------------------------------------------------------------ JSON lab */
  W.jsonLab = () => {
    const ta = h('textarea.mono', { rows: 10, spellcheck: 'false', 'aria-label': 'JSON text' }, PP.SAMPLE_JSON);
    const status = h('div', { 'aria-live': 'polite' }); const treeEl = h('div.json-tree');
    function shape(s, label) {
      if (s.t === 'dict' || s.t === 'list') return h('details', { open: true }, h('summary', label, h('span.json-t', ' ' + s.t + ' (' + s.c.length + ')')), h('ul', s.c.map(([k, v]) => h('li', shape(v, s.t === 'dict' ? JSON.stringify(k) + ': ' : '[' + k + '] ')))));
      return h('span', label, h('code', s.v), h('span.json-t', ' ' + s.t));
    }
    async function go(mode) {
      status.innerHTML = ''; treeEl.innerHTML = '';
      try {
        const r = await PP.py.call('pp_json', ta.value, 2);
        if (r.error) {
          status.appendChild(errBox(`json.JSONDecodeError: ${r.error}: line ${r.line} column ${r.col}`));
          const lines = ta.value.split('\n'); const bad = lines[r.line - 1] || '';
          status.appendChild(h('pre.json-bad', bad + '\n' + ' '.repeat(Math.max(0, r.col - 1)) + '^'));
          return;
        }
        if (mode === 'format') ta.value = r.pretty;
        if (mode === 'minify') ta.value = r.compact;
        status.appendChild(h('p.out-pass', 'Valid JSON. json.loads() returned a Python ' + r.type + '.'));
        treeEl.appendChild(shape(r.shape, 'value: ')); PP.store.noteRun();
      } catch (e) { status.appendChild(errBox(e.message)); }
    }
    const broken = h('button.chip', { type: 'button', onclick: () => { ta.value = "{'name': 'Asha', 'marks': [88, 92,]}"; go(); } }, 'Load invalid example');
    setTimeout(() => go(), 40);
    return h('div.jsonlab', ta, h('div.op-row', h('button.btn.btn-run', { type: 'button', onclick: () => go('format') }, 'Format (indent=2)'),
      h('button.btn.btn-ghost', { type: 'button', onclick: () => go('minify') }, 'Minify'), h('button.btn.btn-ghost', { type: 'button', onclick: () => go() }, 'Validate'), broken,
      h('button.chip', { type: 'button', onclick: () => { ta.value = PP.SAMPLE_JSON; go(); } }, 'Restore sample')), status, treeEl);
  };

  /* ------------------------------------------------------------------ database explorer */
  function resultTable(r) {
    if (!r.columns) return h('p.muted', r.sql.split('\n')[0].slice(0, 60) + (r.sql.length > 60 ? '…' : '') + ' — ' + (r.rowcount >= 0 ? r.rowcount + ' row(s) affected' : 'done'));
    return h('div.table-scroll', h('table.ref.db-res', h('thead', h('tr', r.columns.map((c) => h('th', c)))),
      h('tbody', r.rows.length ? r.rows.map((row) => h('tr', row.map((v) => h('td' + (v === null ? '.null' : ''), v === null ? 'NULL' : String(v))))) : h('tr', h('td.muted', { colspan: r.columns.length }, '(no rows)')))));
  }
  PP.resultTable = resultTable;
  W.dbExplorer = (o) => {
    const key = uid('db');
    const seed = o.seed === 'SCHOOL' ? PP.SCHOOL_SQL : PP.TRACKS_SQL;
    const ta = h('textarea.mono', { rows: 5, spellcheck: 'false', 'aria-label': 'SQL' }, (o.samples && o.samples[0] && o.samples[0].sql) || 'SELECT * FROM sqlite_master;');
    const out = h('div.db-out', { 'aria-live': 'polite' }); const schema = h('div.db-schema');
    function drawSchema(sc) {
      schema.innerHTML = '';
      schema.appendChild(h('h4', 'Schema'));
      sc.forEach((t) => {
        const fkCols = Object.fromEntries(t.fks.map((f) => [f.from, f.table + '.' + f.to]));
        const uniq = new Set(t.unique.filter((u) => u.length === 1).map((u) => u[0]));
        schema.appendChild(h('div.db-tbl', h('div.db-tname', t.name, h('small', ' ' + t.count + ' rows')),
          h('ul', t.cols.map((c) => h('li', h('code', c.name), ' ', h('small.muted', c.type || ''), c.pk ? h('span.badge.k-pk', 'PK') : null,
            uniq.has(c.name) ? h('span.badge.k-uk', 'UNIQUE') : null, fkCols[c.name] ? h('span.badge.k-fk', 'FK → ' + fkCols[c.name]) : null)))));
      });
      if (!sc.length) schema.appendChild(h('p.muted', 'No tables.'));
    }
    async function run(sql, reset) {
      out.innerHTML = '<p class="out-empty">Running SQLite…</p>';
      try {
        const r = await PP.py.db(key, sql, reset ? seed : undefined);
        out.innerHTML = '';
        r.results.forEach((x) => out.appendChild(resultTable(x)));
        if (r.error) out.appendChild(errBox(r.error));
        if (!r.results.length && !r.error) out.appendChild(h('p.muted', reset ? 'Database reset to the sample data.' : 'No statements to run.'));
        drawSchema(r.schema); PP.store.noteRun();
      } catch (e) { out.innerHTML = ''; out.appendChild(errBox('Could not start SQLite: ' + e.message)); }
    }
    const chips = h('div.chips', (o.samples || []).map((s) => h('button.chip', { type: 'button', onclick: () => { ta.value = s.sql; run(s.sql); } }, s.label)));
    ta.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run(ta.value); });
    setTimeout(() => run(ta.value, true), 60);
    return h('div.dbx', chips, ta, h('div.op-row', h('button.btn.btn-run', { type: 'button', onclick: () => run(ta.value) }, 'Run SQL'),
      h('button.btn.btn-ghost', { type: 'button', onclick: () => run('', true) }, 'Reset database'), h('details.db-seed', h('summary', 'Sample data SQL'), PP.codeView(seed))),
      h('div.db-grid', out, schema), h('p.viz-label', 'Real SQLite (Python’s sqlite3 module) running in your browser, using an in-memory database.'));
  };

  /* ------------------------------------------------------------------ JOIN animation */
  W.joinViz = () => {
    const students = [[1, 'Asha'], [2, 'Ravi'], [3, 'Meera'], [4, 'John'], [5, 'Priya']];
    const enroll = [[1, 1, 88], [1, 2, 92], [2, 1, 64], [2, 3, 71], [3, 1, 95], [3, 2, 84], [4, 1, 67]];
    let mode = 'INNER', si = -1, timer = null, result = [];
    const left = h('table.ref.jv'); const right = h('table.ref.jv'); const res = h('table.ref.jv'); const say = h('p.jv-say', { 'aria-live': 'polite' });
    const sqlView = h('div'); const verify = h('div');
    const sql = () => `SELECT Student.id, Student.name, Enrollment.course_id, Enrollment.marks\nFROM Student ${mode === 'LEFT' ? 'LEFT JOIN' : 'JOIN'} Enrollment\n  ON Student.id = Enrollment.student_id\nORDER BY Student.id, Enrollment.course_id;`;
    function draw(matchIdx) {
      left.innerHTML = ''; right.innerHTML = ''; res.innerHTML = '';
      left.append(h('caption', 'Student'), h('thead', h('tr', h('th', 'id'), h('th', 'name'))), h('tbody', students.map((s, k) => h('tr' + (k === si ? '.cur' : k < si ? '.done' : ''), h('td', String(s[0])), h('td', s[1])))));
      right.append(h('caption', 'Enrollment'), h('thead', h('tr', h('th', 'student_id'), h('th', 'course_id'), h('th', 'marks'))),
        h('tbody', enroll.map((e, k) => h('tr' + ((matchIdx || []).includes(k) ? '.match' : si >= 0 && si < students.length ? '.scan' : ''), e.map((v) => h('td', String(v)))))));
      res.append(h('caption', 'Result (' + mode + ' JOIN)'), h('thead', h('tr', ['id', 'name', 'course_id', 'marks'].map((c) => h('th', c)))),
        h('tbody', result.length ? result.map((r, k) => h('tr' + (k >= result.length - (matchIdx ? Math.max(1, matchIdx.length) : 0) && si >= 0 ? '.new' : ''), r.map((v) => h('td' + (v === null ? '.null' : ''), v === null ? 'NULL' : String(v))))) : h('tr', h('td.muted', { colspan: 4 }, 'empty'))));
      sqlView.innerHTML = ''; sqlView.appendChild(PP.codeView(sql()));
    }
    function step() {
      if (si >= students.length - 1) { stop(); say.textContent = 'Done: ' + result.length + ' result rows. ' + (mode === 'LEFT' ? 'Priya has no enrolment, so LEFT JOIN kept her with NULLs.' : 'Priya has no enrolment, so the inner join left her out.'); draw([]); return false; }
      si++;
      const [id, name] = students[si];
      const m = enroll.map((e, k) => (e[0] === id ? k : -1)).filter((k) => k >= 0);
      m.forEach((k) => result.push([id, name, enroll[k][1], enroll[k][2]]));
      if (!m.length && mode === 'LEFT') result.push([id, name, null, null]);
      say.textContent = `Student ${id} (${name}): ${m.length} matching Enrollment row${m.length === 1 ? '' : 's'} where student_id = ${id}` + (m.length ? ' → ' + m.length + ' result row' + (m.length > 1 ? 's' : '') + '.' : mode === 'LEFT' ? ' → kept with NULL columns (LEFT JOIN).' : ' → no result row (inner join).');
      draw(m.length ? m : null);
      return true;
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; playBtn.textContent = 'Play'; } }
    function reset() { stop(); si = -1; result = []; say.textContent = 'Press Step to compare each Student row with the Enrollment table.'; verify.innerHTML = ''; draw(); }
    const playBtn = h('button.btn.btn-ghost', { type: 'button', onclick: () => { if (timer) return stop(); playBtn.textContent = 'Pause'; timer = setInterval(() => { if (!step()) stop(); }, 1100); } }, 'Play');
    const modes = h('div.tabs', { role: 'tablist', 'aria-label': 'Join type' }, ['INNER', 'LEFT'].map((m) => h('button.tab' + (m === mode ? '.on' : ''), { type: 'button', role: 'tab', 'aria-selected': String(m === mode), onclick: (e) => { mode = m; PP.$$('.tab', modes).forEach((t) => { t.classList.toggle('on', t === e.target); t.setAttribute('aria-selected', String(t === e.target)); }); reset(); } }, m + ' JOIN')));
    const check = h('button.btn.btn-ghost', { type: 'button', onclick: async () => {
      verify.innerHTML = '<p class="out-empty">Running in SQLite…</p>';
      try { const r = await PP.py.db(uid('jv'), sql(), PP.SCHOOL_SQL); verify.innerHTML = ''; verify.appendChild(h('p.muted', 'SQLite result for the same query on the sample database:')); r.results.forEach((x) => verify.appendChild(resultTable(x))); if (r.error) verify.appendChild(errBox(r.error)); }
      catch (e) { verify.innerHTML = ''; verify.appendChild(errBox(e.message)); }
    } }, 'Run this query in SQLite');
    reset();
    return h('div.joinviz', modes, h('div.op-row', h('button.btn.btn-run', { type: 'button', onclick: step }, 'Step'), playBtn, h('button.btn.btn-ghost', { type: 'button', onclick: reset }, 'Reset'), check),
      say, h('div.jv-grid', left, right), res, sqlView, verify, h('p.viz-label', 'The matching animation is a visualization; “Run this query in SQLite” executes the real SQL.'));
  };

  /* ------------------------------------------------------------------ keys diagram */
  W.keysViz = () => {
    const svg = S('svg', { viewBox: '0 0 360 320', class: 'keys-svg', role: 'img', 'aria-label': 'Student, Course and Enrollment tables with primary, logical and foreign keys' });
    const table = (x, y, name, cols) => {
      const g = S('g', { class: 'k-table' });
      g.appendChild(S('rect', { x, y, width: 150, height: 26 + cols.length * 22, rx: 8, class: 'k-box' }));
      g.appendChild(S('text', { x: x + 10, y: y + 18, class: 'k-name' }, name));
      cols.forEach(([c, kind], i) => {
        const cy = y + 26 + i * 22;
        const row = S('g', { class: 'k-col k-' + kind, tabindex: 0, 'data-kind': kind, 'data-col': name + '.' + c });
        row.appendChild(S('rect', { x: x + 2, y: cy, width: 146, height: 22, class: 'k-rowbg' }));
        row.appendChild(S('text', { x: x + 10, y: cy + 15 }, c));
        if (kind !== 'none') row.appendChild(S('text', { x: x + 140, y: cy + 15, 'text-anchor': 'end', class: 'k-tag' }, { pk: 'PK', uk: 'UNIQUE', fk: 'FK' }[kind]));
        g.appendChild(row);
      });
      svg.appendChild(g);
    };
    table(8, 10, 'Student', [['id', 'pk'], ['usn', 'uk'], ['name', 'none'], ['branch', 'none']]);
    table(202, 10, 'Course', [['id', 'pk'], ['code', 'uk'], ['title', 'none'], ['credits', 'none']]);
    table(105, 190, 'Enrollment', [['student_id', 'fk'], ['course_id', 'fk'], ['marks', 'none']]);
    const link = (d, cls) => svg.insertBefore(S('path', { d, class: 'k-link ' + cls }), svg.firstChild);
    link('M105 227 C 40 227, 40 47, 50 47', 'l-student');
    link('M255 249 C 330 249, 330 47, 310 47', 'l-course');
    const info = h('p.keys-info', { 'aria-live': 'polite' }, 'Hover or tab to a key to see what it does.');
    const text = {
      pk: 'Primary key: an integer id that uniquely identifies each row. The database assigns it (INTEGER PRIMARY KEY).',
      uk: 'Logical key (a candidate key): the real-world identifier people use to look a row up — USN or course code. Declared UNIQUE so duplicates are rejected and lookups are fast.',
      fk: 'Foreign key: holds the primary key of a row in another table. Enrollment.student_id → Student.id; Enrollment.course_id → Course.id.',
      none: 'Ordinary data column.'
    };
    svg.addEventListener('mouseover', (e) => showK(e.target.closest('.k-col')));
    svg.addEventListener('focusin', (e) => showK(e.target.closest('.k-col')));
    function showK(c) {
      PP.$$('.hl', svg).forEach((x) => x.classList.remove('hl'));
      if (!c) return;
      c.classList.add('hl');
      const col = c.dataset.col;
      if (col === 'Enrollment.student_id' || col === 'Student.id') { svg.querySelector('.l-student').classList.add('hl'); }
      if (col === 'Enrollment.course_id' || col === 'Course.id') { svg.querySelector('.l-course').classList.add('hl'); }
      info.textContent = col + ' — ' + text[c.dataset.kind];
    }
    return h('div.keysviz', svg, info, h('div.k-legend', h('span.badge.k-pk', 'PK primary'), h('span.badge.k-uk', 'UNIQUE logical / candidate'), h('span.badge.k-fk', 'FK foreign')));
  };
})();
