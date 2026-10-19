/* Lightweight Python editor: a transparent <textarea> layered over a highlighted <pre>. */
(function () {
  'use strict';
  const PP = window.PP, h = PP.h, esc = PP.esc;

  const KW = new Set('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '));
  const BI = new Set('print input len range int float str list dict tuple set type isinstance open sorted sum min max abs round enumerate zip map filter id repr super object bool chr ord format vars hasattr getattr setattr iter next reversed any all divmod pow hex bin'.split(' '));
  const TOKEN = /(#[^\n]*)|((?:\b[rRbBuUfF]{1,2})?(?:'''[\s\S]*?(?:'''|$)|"""[\s\S]*?(?:"""|$)|'(?:\\.|[^'\\\n])*'?|"(?:\\.|[^"\\\n])*"?))|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(@\w+)|([A-Za-z_]\w*)/g;

  PP.highlight = function (src) {
    let out = '', last = 0, m, prev = '';
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(src))) {
      out += esc(src.slice(last, m.index));
      const t = m[0];
      if (m[1]) out += '<span class="t-c">' + esc(t) + '</span>';
      else if (m[2]) out += '<span class="t-s">' + esc(t) + '</span>';
      else if (m[3]) out += '<span class="t-n">' + esc(t) + '</span>';
      else if (m[4]) out += '<span class="t-d">' + esc(t) + '</span>';
      else {
        let cls = '';
        if (KW.has(t)) cls = 't-k';
        else if (prev === 'def' || prev === 'class') cls = 't-f';
        else if (BI.has(t)) cls = 't-b';
        else if (t === 'self') cls = 't-self';
        out += cls ? '<span class="' + cls + '">' + esc(t) + '</span>' : esc(t);
      }
      prev = m[5] || '';
      last = TOKEN.lastIndex;
    }
    return out + esc(src.slice(last));
  };

  /* Static highlighted block */
  PP.codeView = (code, cls) => h('pre.code-static' + (cls ? '.' + cls : ''), h('code', { html: PP.highlight(code) }));

  class Editor {
    constructor(code, opts = {}) {
      this.opts = opts;
      this.el = h('div.editor');
      this.pre = h('pre.ed-hl', { 'aria-hidden': 'true' }, h('code'));
      this.ta = h('textarea.ed-ta', {
        spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', wrap: 'off',
        'aria-label': opts.label || 'Python code editor'
      });
      this.el.append(this.pre, this.ta);
      this.ta.value = code || '';
      this.ta.addEventListener('input', () => this.refresh());
      this.ta.addEventListener('scroll', () => { this.pre.scrollTop = this.ta.scrollTop; this.pre.scrollLeft = this.ta.scrollLeft; });
      this.ta.addEventListener('keydown', (e) => this.onKey(e));
      this.refresh();
    }
    onKey(e) {
      const ta = this.ta;
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); this.opts.onRun && this.opts.onRun(); return; }
      if (e.key === 'Escape') { ta.blur(); return; } // lets keyboard users leave the editor
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const s = ta.selectionStart;
        ta.setRangeText('    ', s, ta.selectionEnd, 'end'); this.refresh();
      } else if (e.key === 'Enter') {
        const s = ta.selectionStart, line = ta.value.slice(0, s).split('\n').pop();
        let ind = line.match(/^\s*/)[0];
        if (/:\s*(#.*)?$/.test(line)) ind += '    ';
        e.preventDefault(); ta.setRangeText('\n' + ind, s, ta.selectionEnd, 'end'); this.refresh();
      }
    }
    refresh() {
      const v = this.ta.value;
      this.pre.firstChild.innerHTML = PP.highlight(v) + '\n';
      const lines = v.split('\n').length;
      const minL = this.opts.minLines || 3, maxL = this.opts.maxLines || 24;
      this.el.style.setProperty('--lines', Math.max(minL, Math.min(maxL, lines)));
    }
    get value() { return this.ta.value; }
    set value(v) { this.ta.value = v; this.refresh(); }
  }
  PP.Editor = Editor;

  /* Renders a Python result object {status,out,err} into an output panel */
  PP.renderOutput = function (panel, res) {
    panel.innerHTML = '';
    panel.hidden = false;
    const out = (res.out || '');
    if (out) panel.appendChild(h('pre.out-text', out));
    if (res.err) panel.appendChild(h('pre.out-err', res.err));
    if (!out && !res.err) panel.appendChild(h('p.out-empty', 'The program finished without printing anything.'));
    if (res.status === 'exit') panel.appendChild(h('p.out-note', 'sys.exit() stopped the program. In a terminal the Python process would end here.'));
  };

  /*
   * Runnable code block. opts: {title, stdin:[...], runnable:true|false, note, expect, onRun(res), minLines, key}
   * runnable:false is used for programs that need sockets / the real OS (they are shown, not faked).
   */
  PP.codeBlock = function (code, opts = {}) {
    const wrap = h('div.runner');
    const head = h('div.runner-head', h('span.runner-title', opts.title || 'main.py'));
    const out = h('div.runner-out', { role: 'region', 'aria-live': 'polite', 'aria-label': 'Program output' });
    out.hidden = true;
    let ed;
    const run = async () => {
      if (opts.runnable === false) return;
      runBtn.disabled = true; runBtn.textContent = 'Running…';
      out.hidden = false; out.innerHTML = '<p class="out-empty">Starting Python…</p>';
      try {
        const res = await PP.py.run(ed.value, { stdin: opts.stdin || [], key: opts.key || null });
        PP.renderOutput(out, res);
        if (opts.expect != null) {
          const ok = (res.out || '').trim() === String(opts.expect).trim();
          out.appendChild(h('p.' + (ok ? 'out-pass' : 'out-fail'), ok ? 'Output matches the expected output.' : 'Output differs from the expected output:'));
          if (!ok) out.appendChild(h('pre.out-expect', String(opts.expect)));
        }
        PP.store && PP.store.noteRun();
        opts.onRun && opts.onRun(res);
      } catch (e) {
        out.innerHTML = '';
        out.appendChild(h('pre.out-err', 'Python could not start: ' + (e.message || e) + '\nCheck your internet connection (the Python runtime downloads once, about 10 MB), then try again.'));
      }
      runBtn.disabled = false; runBtn.textContent = 'Run';
    };
    ed = new Editor(code, { onRun: run, minLines: opts.minLines, maxLines: opts.maxLines, label: (opts.title || 'Python') + ' code editor' });
    const runBtn = h('button.btn.btn-run', { type: 'button', onclick: run, title: 'Run (Ctrl+Enter)' }, 'Run');
    const tools = h('div.runner-tools',
      opts.runnable === false ? h('span.badge.badge-warn', 'Desktop Python only') : runBtn,
      h('button.btn.btn-ghost', { type: 'button', onclick: () => { ed.value = code; out.hidden = true; } }, 'Reset'),
      h('button.btn.btn-ghost', { type: 'button', onclick: () => PP.copyText(ed.value) }, 'Copy'),
      opts.noPlayground ? null : h('button.btn.btn-ghost', { type: 'button', onclick: () => { PP.app.openInPlayground(ed.value, opts.stdin); } }, 'Open in playground')
    );
    head.appendChild(tools);
    wrap.append(head, ed.el);
    if (opts.stdin && opts.stdin.length) wrap.appendChild(h('p.runner-note', 'Sample input supplied to input(): ' + opts.stdin.map((s) => JSON.stringify(s)).join(', ') + '. After those run out, the browser asks you with a prompt box.'));
    if (opts.note) wrap.appendChild(h('p.runner-note', { html: opts.note }));
    wrap.appendChild(out);
    wrap.editor = ed; wrap.run = run; wrap.output = out;
    return wrap;
  };
})();
