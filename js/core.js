/* Python Programming Portal (1BEC305) — core helpers and configuration */
(function () {
  'use strict';
  const PP = (window.PP = window.PP || {});

  PP.config = {
    // Pyodide (CPython compiled to WebAssembly). To run fully offline, download the
    // Pyodide 0.26.4 "full" release, unpack it into ./pyodide/ and change this to './pyodide/'.
    PYODIDE_URL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
    STORAGE_KEY: 'pp-1bec305-progress-v1',
    TIME_LIMIT_S: 10
  };

  PP.modules = [];
  PP.addModule = (m) => { PP.modules.push(m); PP.modules.sort((a, b) => a.n - b.n); };

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  PP.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]);

  /* h('div.card#x', {attrs}, children...) — tiny DOM builder */
  PP.h = function h(sel, attrs, ...kids) {
    const m = sel.match(/^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i);
    const el = document.createElement((m && m[1]) || 'div');
    if (m && m[2]) m[2].replace(/([.#])([\w-]+)/g, (_, t, v) => (t === '.' ? el.classList.add(v) : (el.id = v)));
    if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    const add = (k) => {
      if (k == null || k === false) return;
      if (Array.isArray(k)) return k.forEach(add);
      el.appendChild(k instanceof Node ? k : document.createTextNode(String(k)));
    };
    kids.forEach(add);
    return el;
  };

  PP.$ = (s, r) => (r || document).querySelector(s);
  PP.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  PP.stripHtml = (s) => String(s || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

  PP.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  PP.toast = (msg) => {
    let t = PP.$('#toast');
    if (!t) { t = PP.h('div#toast', { role: 'status', 'aria-live': 'polite' }); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(PP._toastT); PP._toastT = setTimeout(() => t.classList.remove('show'), 2600);
  };

  PP.copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); PP.toast('Copied to clipboard'); }
    catch (e) {
      const ta = PP.h('textarea', { style: 'position:fixed;opacity:0' }, text); document.body.appendChild(ta);
      ta.select(); try { document.execCommand('copy'); PP.toast('Copied to clipboard'); } catch (_) { PP.toast('Copy failed — select the text manually'); }
      ta.remove();
    }
  };

  PP.allLessons = () => PP.modules.flatMap((m) => m.lessons.map((l) => Object.assign(l, { module: m.n })));
  PP.lessonById = (id) => PP.allLessons().find((l) => l.id === id);
  PP.reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
})();
