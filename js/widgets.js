/* Interactive widgets. Every result that claims to be Python output is produced by real Python (Pyodide).
   Pure-JavaScript animations (flowchart, HTTP exchange, JOIN matching, guessing game) are labelled as visualizations. */
(function () {
  'use strict';
  const PP = window.PP, h = PP.h, esc = PP.esc;
  const W = (PP.widgets = {});
  let counter = 0;
  const uid = (p) => (p || 'w') + (++counter) + Math.random().toString(36).slice(2, 6);
  const sleep = (ms) => new Promise((r) => setTimeout(r, PP.reducedMotion() ? 0 : ms));
  const pyStr = (s) => JSON.stringify(String(s));
  /* Interpret what a student types: numbers/True/False/None stay literal, everything else becomes a string */
  const literal = (t) => {
    t = String(t).trim();
    if (/^-?\d+(\.\d+)?$/.test(t) || ['True', 'False', 'None'].includes(t)) return t;
    if (/^(['"]).*\1$/.test(t)) return t;
    return pyStr(t);
  };
  const errBox = (msg) => h('pre.out-err', msg);
  const busy = (btn, on, label) => { btn.disabled = on; if (label) btn.textContent = on ? 'Working…' : label; };

  /* Run statements in a persistent namespace, then fetch a JSON snapshot of some expression */
  async function pyState(key, stmt, expr) {
    let res = { status: 'ok', out: '', err: '' };
    if (stmt) res = await PP.py.run(stmt, { key });
    const snap = await PP.py.run('import json as _j\nprint("@@STATE@@" + _j.dumps(' + expr + ', default=repr))', { key });
    let state = null;
    const line = (snap.out || '').split('\n').find((l) => l.startsWith('@@STATE@@'));
    if (line) state = JSON.parse(line.slice(9));
    return { res, state, snapErr: snap.err };
  }
  PP.pyState = pyState;

  function stmtLog() {
    const el = h('div.stmt-log', { 'aria-live': 'polite' });
    el.show = (code, res) => {
      el.innerHTML = '';
      el.appendChild(h('div.stmt-code', h('span.stmt-label', 'Python ran'), PP.codeView(code)));
      if (res && res.out) el.appendChild(h('pre.out-text', res.out));
      if (res && res.err) el.appendChild(errBox(res.err.trim().split('\n').slice(-1)[0]));
    };
    return el;
  }

  /* ------------------------------------------------------------------ code / pair */
  W.code = (o) => PP.codeBlock(o.code, { stdin: o.stdin, title: o.title });
  W.pair = (o) => h('div.pair',
    PP.codeBlock(o.left.code, { title: o.left.title }),
    PP.codeBlock(o.right.code, { title: o.right.title }));

  /* ------------------------------------------------------------------ shell */
  W.shell = (o) => {
    const key = uid('shell');
    const log = h('div.shell-log', { role: 'log', 'aria-live': 'polite', 'aria-label': 'Shell transcript' },
      h('div.shell-note', 'Python interactive shell — each line is evaluated by real Python.'));
    const input = h('input.shell-in', { type: 'text', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'Python expression', placeholder: 'Type an expression, e.g. 2 + 3 * 6' });
    const hist = []; let hi = 0;
    const submit = async (src) => {
      src = src.trim(); if (!src) return;
      hist.push(src); hi = hist.length;
      log.appendChild(h('div.shell-line', h('span.shell-p', '>>> '), src));
      input.value = ''; input.disabled = true;
      try {
        const r = await PP.py.shell(key, src);
        if (r.out) log.appendChild(h('pre.shell-out', r.out.replace(/\n$/, '')));
        if (r.value != null) log.appendChild(h('pre.shell-val', r.value));
        if (r.err) log.appendChild(h('pre.shell-err', r.err));
        PP.store.noteRun();
      } catch (e) { log.appendChild(h('pre.shell-err', 'Python could not start: ' + e.message)); }
      input.disabled = false; input.focus();
      log.scrollTop = log.scrollHeight;
    };
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit(input.value);
      else if (e.key === 'ArrowUp' && hi > 0) { input.value = hist[--hi]; e.preventDefault(); }
      else if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; }
    });
    const chips = h('div.chips', { 'aria-label': 'Sample expressions' }, (o.presets || []).map((p) =>
      h('button.chip', { type: 'button', onclick: () => submit(p) }, p)));
    return h('div.shell', chips, log, h('div.shell-row', h('span.shell-p', { 'aria-hidden': 'true' }, '>>>'), input,
      h('button.btn.btn-run', { type: 'button', onclick: () => submit(input.value) }, 'Enter')));
  };

  /* ------------------------------------------------------------------ trace (step-by-step visualizer) */
  function valNode(v) {
    if (!v) return h('span.tr-prim', '');
    if (v.p != null) return h('span.tr-prim', v.p);
    return h('span.tr-ref', { 'data-ref': v.r, style: '--hue:' + ((v.r * 67) % 360), title: 'reference to object #' + v.r }, '→ #' + v.r);
  }
  W.trace = (o) => {
    const ed = new PP.Editor(o.code, { minLines: 4, maxLines: 18, label: 'Code to visualize' });
    const runBtn = h('button.btn.btn-run', { type: 'button' }, 'Visualize');
    const stage = h('div.tr-stage'); stage.hidden = true;
    const wrap = h('div.tracer', h('div.runner-head', h('span.runner-title', 'Program visualizer'),
      h('div.runner-tools', runBtn, h('button.btn.btn-ghost', { type: 'button', onclick: () => { ed.value = o.code; stage.hidden = true; } }, 'Reset'))), ed.el, stage);
    let steps = [], i = 0, src = '', timer = null, error = '';
    const codePane = h('div.tr-code', { 'aria-label': 'Program with current line' });
    const caption = h('p.tr-caption', { 'aria-live': 'polite' });
    const framesPane = h('div.tr-frames');
    const heapPane = h('div.tr-heap');
    const outPane = h('pre.tr-out');
    const slider = h('input', { type: 'range', min: 0, max: 0, value: 0, 'aria-label': 'Step' });
    const count = h('span.tr-count');
    const btn = (label, fn, title) => h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: fn, title: title || label }, label);
    const play = btn('Play', () => {
      if (timer) { clearInterval(timer); timer = null; play.textContent = 'Play'; return; }
      play.textContent = 'Pause';
      timer = setInterval(() => { if (i >= steps.length - 1) { clearInterval(timer); timer = null; play.textContent = 'Play'; return; } i++; render(); }, 700);
    });
    stage.append(
      h('div.tr-controls', btn('⏮', () => { i = 0; render(); }, 'First step'), btn('◀ Back', () => { if (i > 0) { i--; render(); } }),
        btn('Next ▶', () => { if (i < steps.length - 1) { i++; render(); } }), btn('⏭', () => { i = steps.length - 1; render(); }, 'Last step'), play, count),
      slider, caption,
      h('div.tr-grid', h('div', h('h4.tr-h', 'Code'), codePane), h('div', h('h4.tr-h', 'Frames (variables)'), framesPane), h('div', h('h4.tr-h', 'Objects'), heapPane)),
      h('h4.tr-h', 'Output'), outPane);
    slider.addEventListener('input', () => { i = +slider.value; render(); });
    stage.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' && i < steps.length - 1) { i++; render(); } if (e.key === 'ArrowLeft' && i > 0) { i--; render(); } });
    stage.tabIndex = -1;
    stage.addEventListener('mouseover', (e) => {
      const r = e.target.closest('.tr-ref'); PP.$$('.tr-obj.hl', heapPane).forEach((x) => x.classList.remove('hl'));
      if (r) { const box = heapPane.querySelector('[data-obj="' + r.dataset.ref + '"]'); box && box.classList.add('hl'); }
    });
    function render() {
      const st = steps[i];
      slider.max = steps.length - 1; slider.value = i;
      count.textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
      codePane.innerHTML = '';
      src.split('\n').forEach((line, n) => {
        const cur = st.line === n + 1;
        codePane.appendChild(h('div.tr-line' + (cur ? '.cur.ev-' + st.event : ''), h('span.tr-ln', String(n + 1)), h('code', { html: PP.highlight(line) || ' ' })));
      });
      const top = st.frames[st.frames.length - 1];
      let msg;
      if (st.event === 'call') msg = 'Calling ' + (top ? top.name : 'function') + ' — a new frame is created for its parameters.';
      else if (st.event === 'return') msg = (st.fn === '<module>' ? 'The program finished.' : st.fn + '() returns ' + (st.ret.p != null ? st.ret.p : 'object #' + st.ret.r) + ' and its frame is removed.');
      else if (st.event === 'exception') msg = 'Exception raised on line ' + st.line + ': ' + st.exc;
      else msg = 'Line ' + st.line + ' is about to run.';
      caption.textContent = msg;
      framesPane.innerHTML = '';
      st.frames.forEach((f, k) => {
        const rows = f.vars.length ? f.vars.map(([n, v]) => h('tr', h('th', n), h('td', valNode(v)))) : [h('tr', h('td.muted', { colspan: 2 }, 'no variables yet'))];
        framesPane.appendChild(h('div.tr-frame' + (k === st.frames.length - 1 ? '.top' : ''), h('div.tr-fname', f.name), h('table', h('tbody', rows))));
      });
      if (st.event === 'return' && st.fn !== '<module>') framesPane.appendChild(h('div.tr-ret', 'Return value: ', valNode(st.ret)));
      heapPane.innerHTML = '';
      const keys = Object.keys(st.heap).map(Number).sort((a, b) => a - b);
      if (!keys.length) heapPane.appendChild(h('p.muted', 'Lists, dicts and objects appear here. Ints, floats and strings are shown inside the frames.'));
      keys.forEach((k) => {
        const ob = st.heap[k];
        let body;
        if (ob.items) body = h('div.tr-items', ob.items.map((v, idx) => h('div.tr-cell', h('small', ob.t === 'set' ? '' : String(idx)), valNode(v))));
        else if (ob.pairs) body = h('table', h('tbody', ob.pairs.map(([a, b]) => h('tr', h('th', valNode(a)), h('td', valNode(b))))));
        else if (ob.attrs) body = h('table', h('tbody', ob.attrs.length ? ob.attrs.map(([a, b]) => h('tr', h('th', a), h('td', valNode(b)))) : h('tr', h('td.muted', 'no attributes'))));
        else body = h('code', ob.repr || '…');
        heapPane.appendChild(h('div.tr-obj', { 'data-obj': k, style: '--hue:' + ((k * 67) % 360) }, h('div.tr-otype', '#' + k + ' ' + ob.t + (ob.t !== 'list' && ob.t !== 'dict' && ob.t !== 'tuple' && ob.t !== 'set' && ob.attrs ? ' instance' : '')), body, ob.more ? h('small.muted', '…more') : null));
      });
      outPane.textContent = st.out || ' ';
      if (i === steps.length - 1 && error) outPane.appendChild(h('span.out-err-inline', '\n' + error));
    }
    runBtn.addEventListener('click', async () => {
      busy(runBtn, true, 'Visualize');
      try {
        src = ed.value;
        const res = await PP.py.viz(src, o.stdin || []);
        steps = res.steps; error = res.error; i = 0;
        stage.hidden = false;
        if (!steps.length) { stage.innerHTML = ''; stage.appendChild(errBox(error || 'Nothing to show.')); }
        else { render(); PP.store.noteRun(); }
      } catch (e) { stage.hidden = false; stage.innerHTML = ''; stage.appendChild(errBox('Python could not start: ' + e.message)); }
      busy(runBtn, false, 'Visualize');
    });
    if (o.stdin && o.stdin.length) wrap.appendChild(h('p.runner-note', 'Sample input: ' + o.stdin.map((s) => JSON.stringify(s)).join(', ')));
    return wrap;
  };

  /* ------------------------------------------------------------------ flowViz (if/elif/else + loops) */
  W.flowViz = () => {
    const NS = 'http://www.w3.org/2000/svg';
    const svgEl = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (text != null) e.textContent = text; return e; };
    const conds = [[85, 'S'], [70, 'A'], [50, 'B']];
    const svg = svgEl('svg', { viewBox: '0 0 340 380', class: 'flow-svg', role: 'img', 'aria-label': 'Flowchart of an if / elif / else grade chain' });
    const nodes = [];
    conds.forEach(([t, g], k) => {
      const y = 50 + k * 95;
      const g1 = svgEl('g', { class: 'fnode', 'data-k': k });
      g1.appendChild(svgEl('polygon', { points: `110,${y - 32} 190,${y} 110,${y + 32} 30,${y}` }));
      g1.appendChild(svgEl('text', { x: 110, y: y + 4, 'text-anchor': 'middle' }, 'marks >= ' + t));
      svg.appendChild(g1);
      const o = svgEl('g', { class: 'fout', 'data-g': g });
      o.appendChild(svgEl('rect', { x: 240, y: y - 18, width: 86, height: 36, rx: 8 }));
      o.appendChild(svgEl('text', { x: 283, y: y + 5, 'text-anchor': 'middle' }, 'Grade ' + g));
      svg.appendChild(o);
      svg.appendChild(svgEl('line', { x1: 190, y1: y, x2: 240, y2: y, class: 'fedge', 'data-e': 't' + k }));
      svg.appendChild(svgEl('text', { x: 196, y: y - 6, class: 'flab' }, 'True'));
      svg.appendChild(svgEl('line', { x1: 110, y1: y + 32, x2: 110, y2: y + 63, class: 'fedge', 'data-e': 'f' + k }));
      svg.appendChild(svgEl('text', { x: 116, y: y + 52, class: 'flab' }, 'False'));
      nodes.push(g1);
    });
    const fo = svgEl('g', { class: 'fout', 'data-g': 'F' });
    fo.appendChild(svgEl('rect', { x: 67, y: 335, width: 86, height: 36, rx: 8 }));
    fo.appendChild(svgEl('text', { x: 110, y: 358, 'text-anchor': 'middle' }, 'else: F'));
    svg.appendChild(fo);
    const code = (m) => `marks = ${m}\nif marks >= 85:\n    print('Grade: S')\nelif marks >= 70:\n    print('Grade: A')\nelif marks >= 50:\n    print('Grade: B')\nelse:\n    print('Grade: F')`;
    const slider = h('input', { type: 'range', min: 0, max: 100, value: 72, 'aria-label': 'Marks' });
    const val = h('output.flow-val', '72');
    const codePane = h('div.flow-code');
    const explain = h('p.flow-explain', { 'aria-live': 'polite' });
    const verify = h('div');
    let token = 0;
    async function animate() {
      const m = +slider.value, my = ++token;
      val.textContent = m;
      PP.$$('.active,.taken,.chosen', svg).forEach((e) => e.classList.remove('active', 'taken', 'chosen'));
      const lines = code(m).split('\n');
      const showCode = (hl) => { codePane.innerHTML = ''; lines.forEach((l, n) => codePane.appendChild(h('div.tr-line' + (hl.includes(n) ? '.cur' : ''), h('code', { html: PP.highlight(l) || ' ' })))); };
      const steps = [];
      for (let k = 0; k < conds.length; k++) {
        const ok = m >= conds[k][0];
        nodes[k].classList.add('active'); showCode([1 + 2 * k]);
        explain.textContent = `Check ${k === 0 ? 'if' : 'elif'} marks >= ${conds[k][0]}: ${m} >= ${conds[k][0]} is ${ok ? 'True' : 'False'}.`;
        steps.push(explain.textContent);
        await sleep(650); if (my !== token) return;
        svg.querySelector(`[data-e="${ok ? 't' : 'f'}${k}"]`).classList.add('taken');
        if (ok) { svg.querySelector(`[data-g="${conds[k][1]}"]`).classList.add('chosen'); showCode([1 + 2 * k, 2 + 2 * k]); explain.textContent = steps.join(' ') + ` Run its block and skip the rest of the chain.`; return; }
      }
      fo.classList.add('chosen'); showCode([7, 8]); explain.textContent = steps.join(' ') + ' No condition was True, so the else block runs.';
    }
    slider.addEventListener('input', () => { val.textContent = slider.value; clearTimeout(slider._t); slider._t = setTimeout(animate, 120); });
    const runReal = h('button.btn.btn-ghost', { type: 'button', onclick: async () => {
      verify.innerHTML = ''; const res = await PP.py.run(code(slider.value)); const out = h('div.runner-out'); PP.renderOutput(out, res); verify.appendChild(out);
    } }, 'Check with real Python');
    const ifPanel = h('div.flow-panel', h('div.flow-ctrl', h('label', 'marks ', slider, ' ', val), runReal), h('div.flow-grid', svg, codePane), explain, verify);
    const loops = {
      for: `fruits = ['apple', 'mango', 'guava']\nfor i in range(len(fruits)):\n    print(i, fruits[i])\nprint('loop done')`,
      while: `count = 0\nwhile count < 3:\n    print('count is', count)\n    count = count + 1\nprint('loop done')`,
      break: `n = 0\nwhile True:\n    n = n + 1\n    if n == 2:\n        continue\n    if n > 4:\n        break\n    print(n)`
    };
    const loopHost = h('div');
    const loopSel = h('div.chips', Object.keys(loops).map((k) => h('button.chip', { type: 'button', onclick: () => { loopHost.innerHTML = ''; loopHost.appendChild(W.trace({ code: loops[k] })); loopHost.querySelector('.btn-run').click(); } }, k === 'break' ? 'break / continue' : k + ' loop')));
    const loopPanel = h('div.flow-panel', h('p.muted', 'Choose a loop; it runs in the step-by-step visualizer so you can see the loop variable change and execution jump back to the loop header.'), loopSel, loopHost);
    loopPanel.hidden = true;
    const tabs = h('div.tabs', { role: 'tablist' },
      h('button.tab.on', { type: 'button', role: 'tab', 'aria-selected': 'true', onclick: (e) => sw(e, false) }, 'if / elif / else'),
      h('button.tab', { type: 'button', role: 'tab', 'aria-selected': 'false', onclick: (e) => sw(e, true) }, 'for and while'));
    function sw(e, loopsOn) { PP.$$('.tab', tabs).forEach((t) => { t.classList.toggle('on', t === e.target); t.setAttribute('aria-selected', t === e.target); }); ifPanel.hidden = loopsOn; loopPanel.hidden = !loopsOn; }
    setTimeout(animate, 50);
    return h('div.flowviz', tabs, ifPanel, loopPanel, h('p.viz-label', 'The flowchart animation is a visualization; “Check with real Python” runs the actual code.'));
  };

  /* ------------------------------------------------------------------ guess the number game */
  W.guess = () => {
    let secret, tries, over;
    const strip = h('div.g-strip', { 'aria-hidden': 'true' });
    const msg = h('p.g-msg', { 'aria-live': 'polite' });
    const hist = h('div.g-hist');
    const left = h('span.g-left');
    const input = h('input.g-in', { type: 'number', min: 1, max: 20, inputmode: 'numeric', 'aria-label': 'Your guess (1 to 20)' });
    const go = h('button.btn.btn-run', { type: 'button' }, 'Guess');
    let lo = 1, hi = 20;
    function draw() {
      strip.innerHTML = '';
      for (let n = 1; n <= 20; n++) strip.appendChild(h('span.g-cell' + (n < lo || n > hi ? '.out' : ''), String(n)));
      left.textContent = over ? '' : (6 - tries) + ' guess' + (6 - tries === 1 ? '' : 'es') + ' left';
    }
    function start() {
      secret = 1 + Math.floor(Math.random() * 20); tries = 0; over = false; lo = 1; hi = 20;
      hist.innerHTML = ''; msg.textContent = 'I am thinking of a number between 1 and 20. Take a guess.';
      input.disabled = go.disabled = false; input.value = ''; draw();
    }
    function guess() {
      if (over) return;
      const g = parseInt(input.value, 10);
      if (!Number.isInteger(g) || g < 1 || g > 20) { msg.textContent = 'Please type a whole number from 1 to 20.'; return; }
      tries++;
      let cls;
      if (g < secret) { msg.textContent = g + ' — your guess is too low.'; lo = Math.max(lo, g + 1); cls = 'low'; }
      else if (g > secret) { msg.textContent = g + ' — your guess is too high.'; hi = Math.min(hi, g - 1); cls = 'high'; }
      else { msg.textContent = 'Good job! You guessed my number in ' + tries + ' guess' + (tries > 1 ? 'es' : '') + '!'; over = true; cls = 'win'; lo = hi = g; }
      hist.appendChild(h('span.g-chip.' + cls, String(g)));
      if (!over && tries >= 6) { over = true; msg.textContent += ' Nope — the number I was thinking of was ' + secret + '.'; }
      if (over) { input.disabled = go.disabled = true; }
      input.value = ''; input.focus(); draw();
    }
    go.addEventListener('click', guess);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') guess(); });
    start();
    return h('div.guess', msg, h('div.g-row', input, go, h('button.btn.btn-ghost', { type: 'button', onclick: start }, 'New game'), left), strip, hist,
      h('p.viz-label', 'Game logic matches the Python program: 1–20, six guesses, a hint after each guess.'));
  };

  /* ------------------------------------------------------------------ error lab */
  W.errorLab = (o) => {
    const out = h('div.err-out', { 'aria-live': 'polite' });
    const chips = h('div.chips', o.items.map((it) => h('button.chip', { type: 'button', onclick: async (e) => {
      PP.$$('.chip', chips).forEach((c) => c.classList.toggle('on', c === e.target));
      out.innerHTML = '';
      out.appendChild(PP.codeView(it.code));
      const panel = h('div.runner-out'); out.appendChild(panel); panel.innerHTML = '<p class="out-empty">Running…</p>';
      try { PP.renderOutput(panel, await PP.py.run(it.code)); } catch (err) { panel.innerHTML = ''; panel.appendChild(errBox(err.message)); }
      out.appendChild(h('p.err-explain', it.explain));
    } }, it.label)));
    return h('div.errlab', chips, out);
  };

  /* ------------------------------------------------------------------ list visualizer */
  W.listViz = (o) => {
    const key = uid('list');
    const init = o.methods ? '[5, 3, 8, 1]' : "['cat', 'bat', 'rat', 'elephant']";
    const cells = h('div.cells', { role: 'list', 'aria-label': 'List items' });
    const repr = h('code.lv-repr');
    const log = stmtLog();
    const valIn = h('input', { type: 'text', value: o.methods ? '7' : 'moose', 'aria-label': 'Value', size: 8 });
    const idxIn = h('input', { type: 'number', value: 1, 'aria-label': 'Index', style: 'width:4.5em' });
    const sliceIn = h('input', { type: 'text', value: '1:3', 'aria-label': 'Slice start:stop:step', size: 7 });
    let selected = [];
    async function act(stmt) {
      try {
        const { res, state } = await pyState(key, stmt, 'lst');
        if (stmt) log.show(stmt, res);
        draw(state);
      } catch (e) { log.innerHTML = ''; log.appendChild(errBox('Python could not start: ' + e.message)); }
    }
    function draw(lst) {
      cells.innerHTML = '';
      const n = lst.length;
      repr.textContent = 'lst = ' + JSON.stringify(lst).replace(/"/g, "'").replace(/,/g, ', ');
      if (!n) cells.appendChild(h('p.muted', 'The list is empty: []'));
      lst.forEach((v, k) => cells.appendChild(h('div.cell' + (selected.includes(k) ? '.sel' : ''), { role: 'listitem' },
        h('span.c-pos', String(k)), h('span.c-val', typeof v === 'string' ? "'" + v + "'" : String(v)), h('span.c-neg', String(k - n)))));
    }
    async function doSlice() {
      const s = sliceIn.value.trim();
      if (!/^-?\d*(:-?\d*){0,2}$/.test(s)) { log.innerHTML = ''; log.appendChild(errBox('Use the form start:stop or start:stop:step, e.g. 1:3 or ::-1')); return; }
      const { res, state } = await pyState(key, '', `{"idx": list(range(len(lst)))[${s}], "val": lst[${s}]}`);
      if (!state) { log.show('lst[' + s + ']', res); return; }
      selected = Array.isArray(state.idx) ? state.idx : [state.idx];
      log.show('lst[' + s + ']   # -> ' + JSON.stringify(state.val).replace(/"/g, "'"), null);
      act('');
    }
    const B = (label, fn) => h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: () => { selected = []; fn(); } }, label);
    const v = () => literal(valIn.value), ix = () => parseInt(idxIn.value || '0', 10);
    const ops = h('div.lv-ops',
      h('div.op-row', h('label', 'value ', valIn), h('label', 'index ', idxIn)),
      h('div.op-row',
        B('append(value)', () => act(`lst.append(${v()})`)),
        B('insert(index, value)', () => act(`lst.insert(${ix()}, ${v()})`)),
        B('remove(value)', () => act(`lst.remove(${v()})`)),
        B('pop()', () => act(`print('popped:', repr(lst.pop()))`)),
        B('pop(index)', () => act(`print('popped:', repr(lst.pop(${ix()})))`)),
        B('lst[index] = value', () => act(`lst[${ix()}] = ${v()}`)),
        B('del lst[index]', () => act(`del lst[${ix()}]`)),
        B('sort()', () => act('lst.sort()')),
        B('reverse()', () => act('lst.reverse()')),
        B('index(value)', () => act(`print(lst.index(${v()}))`)),
        B('value in lst', () => act(`print(${v()} in lst)`)),
        B('len(lst)', () => act('print(len(lst))')),
        B('Reset', () => act('lst = ' + init))),
      h('div.op-row', h('label', 'slice lst[', sliceIn, ']'), h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: doSlice }, 'Highlight slice')));
    const el = h('div.listviz', repr, cells, h('p.legend', 'Top: positive index · bottom: negative index'), ops, log);
    act('lst = ' + init);
    return el;
  };

  /* ------------------------------------------------------------------ string visualizer */
  W.strViz = (o) => {
    const key = uid('str');
    const textIn = h('input.sv-text', { type: 'text', value: 'Hello, world!', 'aria-label': 'String value' });
    const sliceIn = h('input', { type: 'text', value: '0:5', size: 7, 'aria-label': 'Slice' });
    const cells = h('div.cells.chars');
    const log = stmtLog();
    let sel = [];
    function draw() {
      const s = textIn.value; cells.innerHTML = '';
      [...s].forEach((c, k) => cells.appendChild(h('div.cell' + (sel.includes(k) ? '.sel' : ''), h('span.c-pos', String(k)), h('span.c-val', c === ' ' ? '␣' : c), h('span.c-neg', String(k - s.length)))));
    }
    textIn.addEventListener('input', () => { sel = []; draw(); });
    async function slice() {
      const s = sliceIn.value.trim();
      if (!/^-?\d*(:-?\d*){0,2}$/.test(s)) { log.innerHTML = ''; log.appendChild(errBox('Use start:stop[:step], e.g. 7:12 or ::-1')); return; }
      const { res, state } = await pyState(key, 's = ' + pyStr(textIn.value), `{"idx": list(range(len(s)))[${s}], "val": s[${s}]}`);
      if (!state) { log.show('s[' + s + ']', res); return; }
      sel = Array.isArray(state.idx) ? state.idx : [state.idx]; draw();
      log.show(`s = ${pyStr(textIn.value)}\ns[${s}]   # -> ${pyStr(state.val)}`, null);
    }
    async function traverse() {
      const s = textIn.value;
      const { state } = await pyState(key, 's = ' + pyStr(s), '[[c, ord(c), c.isalpha(), c.isdecimal()] for c in s]');
      log.show('for ch in s:\n    print(ch, ord(ch))', null);
      for (let k = 0; k < state.length; k++) {
        sel = [k]; draw();
        const [c, code, al, dg] = state[k];
        log.lastChild && log.lastChild.classList && log.lastChild.classList.contains('trav') && log.lastChild.remove();
        log.appendChild(h('p.trav', `ch = ${pyStr(c)}   ord = ${code}   ${al ? 'letter' : dg ? 'digit' : 'other'}`));
        await sleep(380);
      }
      sel = []; draw();
    }
    const methods = [
      ['upper()', 's.upper()'], ['lower()', 's.lower()'], ['title()', 's.title()'], ['capitalize()', 's.capitalize()'], ['swapcase()', 's.swapcase()'],
      ['strip()', 's.strip()'], ['split()', 's.split()'], ["split(',')", "s.split(',')"], ["replace('o', '0')", "s.replace('o', '0')"],
      ["find('o')", "s.find('o')"], ["count('l')", "s.count('l')"], ["startswith('Hello')", "s.startswith('Hello')"], ["endswith('!')", "s.endswith('!')"],
      ['isalpha()', 's.isalpha()'], ['isdecimal()', 's.isdecimal()'], ['isupper()', 's.isupper()'], ["center(21, '*')", "s.center(21, '*')"], ['rjust(20)', 's.rjust(20)'],
      ["'-'.join(s)", "'-'.join(s)"], ['s[::-1]', 's[::-1]'], ['len(s)', 'len(s)']
    ];
    const res = h('div.sv-res');
    const mchips = o.methods ? h('div.chips', methods.map(([label, expr]) => h('button.chip', { type: 'button', onclick: async () => {
      const { state, res: r } = await pyState(key, 's = ' + pyStr(textIn.value), 'repr(' + expr + ')');
      log.show(`s = ${pyStr(textIn.value)}\nresult = ${expr}`, r);
      res.innerHTML = ''; res.appendChild(h('div.sv-out', h('span.muted', 'result → '), h('code', state)));
      res.appendChild(h('p.muted', 's is still ' + pyStr(textIn.value) + ' — strings are immutable.'));
    } }, label))) : null;
    const el = h('div.strviz', h('label.sv-label', 's = ', textIn), cells, h('p.legend', 'Top: positive index · bottom: negative index'),
      h('div.op-row', h('label', 's[', sliceIn, ']'), h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: slice }, 'Highlight slice'),
        h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: traverse }, 'Traverse with for')), mchips, res, log);
    draw();
    return el;
  };

  /* ------------------------------------------------------------------ dictionary */
  W.dictViz = () => {
    const key = uid('dict');
    const init = "d = {'Asha': 88, 'Ravi': 74, 'Meera': 91}";
    const table = h('table.ref.dv-table');
    const kIn = h('input', { type: 'text', value: 'John', size: 10, 'aria-label': 'Key' });
    const vIn = h('input', { type: 'text', value: '67', size: 8, 'aria-label': 'Value' });
    const log = stmtLog();
    let hl = null;
    async function act(stmt, highlight) {
      const { res, state } = await pyState(key, stmt, '[[repr(k), repr(v)] for k, v in d.items()]');
      if (stmt !== init) log.show(stmt, res);
      hl = highlight || null; draw(state);
    }
    function draw(pairs) {
      table.innerHTML = '';
      table.appendChild(h('thead', h('tr', h('th', 'key'), h('th', 'value'))));
      table.appendChild(h('tbody', pairs.length ? pairs.map(([k, v]) => h('tr' + (hl && k === hl ? '.sel' : ''), h('td', h('code', k)), h('td', h('code', v)))) : h('tr', h('td.muted', { colspan: 2 }, 'empty dictionary {}'))));
    }
    const k = () => literal(kIn.value), v = () => literal(vIn.value);
    const B = (label, fn) => h('button.btn.btn-ghost.btn-sm', { type: 'button', onclick: fn }, label);
    const el = h('div.dictviz', h('div.op-row', h('label', 'key ', kIn), h('label', 'value ', vIn)),
      h('div.op-row',
        B('d[key] = value (add / update)', () => act(`d[${k()}] = ${v()}`, k().replace(/"/g, "'"))),
        B('d[key]', () => act(`print(d[${k()}])`, k().replace(/"/g, "'"))),
        B("d.get(key, 'not found')", () => act(`print(d.get(${k()}, 'not found'))`)),
        B('key in d', () => act(`print(${k()} in d)`)),
        B('del d[key]', () => act(`del d[${k()}]`)),
        B('d.pop(key)', () => act(`print(d.pop(${k()}))`)),
        B('setdefault(key, value)', () => act(`print(d.setdefault(${k()}, ${v()}))`, k().replace(/"/g, "'"))),
        B('keys()', () => act('print(list(d.keys()))')), B('values()', () => act('print(list(d.values()))')), B('items()', () => act('print(list(d.items()))')),
        B('Reset', () => act(init))), table, log);
    act(init);
    return el;
  };
})();
