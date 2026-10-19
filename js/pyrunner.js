/* Real Python in the browser via Pyodide. All program output shown on the site comes from here. */
(function () {
  'use strict';
  const PP = window.PP;

  const BOOT = String.raw`
import sys, io, os, time, types, json, traceback, builtins, linecache
sys.path.insert(0, '/home/pyodide/pylib')
os.umask(0o022)
WS = '/home/pyodide/workspace'
os.makedirs(WS, exist_ok=True)
os.chdir(WS)
sys.path.insert(0, WS)          # so modules written by programs (e.g. myCats.py) can be imported

def _pp_seed_files():
    os.makedirs(os.path.join(WS, 'data'), exist_ok=True)
    with open(os.path.join(WS, 'sample.txt'), 'w') as f:
        f.write('Python is a high-level programming language.\n'
                'It was created by Guido van Rossum.\n'
                'Files let programs remember data between runs.\n')
    with open(os.path.join(WS, 'data', 'marks.csv'), 'w') as f:
        f.write('name,marks\nAsha,88\nRavi,64\nMeera,91\nJohn,67\nPriya,74\n')
_pp_seed_files()

_STDIN = []
_TICKS = 0
_DEADLINE = 0.0
TIME_LIMIT = 10.0
_GUARDED = {'<main.py>', '<shell>'}

def _pp_input(prompt=''):
    prompt = str(prompt)
    sys.stdout.write(prompt)
    if _STDIN:
        s = _STDIN.pop(0)
    else:
        import js
        s = js.window.prompt(prompt if prompt.strip() else 'The program is waiting for input:')
        if s is None:
            raise EOFError('input() was cancelled in the prompt box')
        s = str(s)
    sys.stdout.write(s + '\n')
    return s

def _pp_line(frame, event, arg):
    global _TICKS
    _TICKS += 1
    if (_TICKS & 4095) == 0 and time.time() > _DEADLINE:
        raise TimeoutError('Stopped after %d seconds: the program may contain an infinite loop.' % TIME_LIMIT)
    return _pp_line

def _pp_guard(frame, event, arg):
    if frame.f_code.co_filename in _GUARDED:
        return _pp_line
    return None

def _pp_fmt_exc(e, fname):
    tb = e.__traceback__
    while tb is not None and tb.tb_frame.f_code.co_filename != fname:
        tb = tb.tb_next
    return ''.join(traceback.format_exception(type(e), e, tb))

_NSS = {}
def pp_ns(key, reset=False):
    if reset or key not in _NSS:
        _NSS[key] = {'__name__': '__main__', 'input': _pp_input}
    return _NSS[key]

def _register(src, fname):
    linecache.cache[fname] = (len(src), None, src.splitlines(True), fname)

def pp_run(src, stdin_json='[]', key=None):
    global _STDIN, _TICKS, _DEADLINE
    _STDIN = list(json.loads(stdin_json))
    _register(src, '<main.py>')
    ns = pp_ns(key) if key else {'__name__': '__main__', 'input': _pp_input}
    buf = io.StringIO()
    old = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = buf
    status, err = 'ok', ''
    _TICKS = 0
    _DEADLINE = time.time() + TIME_LIMIT
    try:
        os.chdir(WS)
        code = compile(src, '<main.py>', 'exec')
        sys.settrace(_pp_guard)
        try:
            exec(code, ns)
        finally:
            sys.settrace(None)
    except SystemExit as e:
        status = 'exit'
    except BaseException as e:
        status = 'error'
        err = _pp_fmt_exc(e, '<main.py>')
    finally:
        sys.stdout, sys.stderr = old
    return json.dumps({'status': status, 'out': buf.getvalue(), 'err': err})

def pp_shell(key, src):
    global _TICKS, _DEADLINE
    ns = pp_ns(key)
    _register(src, '<shell>')
    buf = io.StringIO()
    old = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = buf
    err, value = '', None
    _TICKS = 0
    _DEADLINE = time.time() + TIME_LIMIT
    try:
        try:
            code, is_expr = compile(src, '<shell>', 'eval'), True
        except SyntaxError:
            code, is_expr = compile(src, '<shell>', 'exec'), False
        sys.settrace(_pp_guard)
        try:
            result = eval(code, ns) if is_expr else exec(code, ns)
        finally:
            sys.settrace(None)
        if is_expr and result is not None:
            value = repr(result)
            ns['_'] = result
    except SystemExit:
        err = 'SystemExit: sys.exit() was called (the shell would close here).'
    except BaseException as e:
        tb = _pp_fmt_exc(e, '<shell>').rstrip().splitlines()
        err = '\n'.join(tb[-3:]) if len(tb) > 3 else '\n'.join(tb)
    finally:
        sys.stdout, sys.stderr = old
    return json.dumps({'out': buf.getvalue(), 'value': value, 'err': err})

def pp_check(src, tests_json):
    """Run student code, then evaluate each test expression in the same namespace."""
    global _TICKS, _DEADLINE
    tests = json.loads(tests_json)
    res = json.loads(pp_run(src, '[]', None))
    if res['status'] == 'error':
        return json.dumps({'run': res, 'tests': [], 'passed': 0, 'total': len(tests)})
    ns = {'__name__': '__main__', 'input': _pp_input}
    buf = io.StringIO(); old = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = buf
    out = []
    try:
        exec(compile(src, '<main.py>', 'exec'), ns)
        for expr, expected in tests:
            _TICKS = 0
            _DEADLINE = time.time() + TIME_LIMIT
            item = {'expr': expr, 'expected': expected}
            try:
                sys.settrace(_pp_guard)
                try:
                    got = eval(expr, ns)
                finally:
                    sys.settrace(None)
                want = eval(expected, {})
                item['got'] = repr(got)
                item['ok'] = (got == want) and type(got) == type(want) or (isinstance(want, float) and isinstance(got, (int, float)) and abs(got - want) < 1e-9)
            except BaseException as e:
                item['got'] = type(e).__name__ + ': ' + str(e)
                item['ok'] = False
            out.append(item)
    except BaseException as e:
        res['err'] = _pp_fmt_exc(e, '<main.py>')
    finally:
        sys.stdout, sys.stderr = old
    return json.dumps({'run': res, 'tests': out, 'passed': sum(1 for t in out if t['ok']), 'total': len(tests)})

def pp_viz(src, stdin_json='[]'):
    """Step-by-step trace of a program (frames, variables, objects, output) using sys.settrace."""
    global _STDIN
    _STDIN = list(json.loads(stdin_json))
    _register(src, '<viz>')
    buf = io.StringIO()
    ns = {'__name__': '__main__', 'input': _pp_input}
    steps, labels, keep = [], {}, []
    LIMIT = 700

    def enc(v, heap, depth):
        if v is None or isinstance(v, (bool, int, float, complex, str, bytes)):
            r = repr(v)
            return {'p': r if len(r) < 70 else r[:67] + '...'}
        if isinstance(v, types.FunctionType):
            return {'p': 'function ' + v.__name__ + '()'}
        if isinstance(v, (types.BuiltinFunctionType, types.MethodType)):
            return {'p': '<' + type(v).__name__ + ' ' + getattr(v, '__name__', '') + '>'}
        if isinstance(v, type):
            return {'p': 'class ' + v.__name__}
        if isinstance(v, types.ModuleType):
            return {'p': 'module ' + v.__name__}
        i = id(v)
        if i not in labels:
            labels[i] = len(labels) + 1
            keep.append(v)
        k = labels[i]
        if k not in heap:
            node = {'t': type(v).__name__}
            heap[k] = node
            if depth > 4:
                node['more'] = True
            elif isinstance(v, (list, tuple, set, frozenset)):
                items = list(v)
                node['items'] = [enc(x, heap, depth + 1) for x in items[:25]]
                if len(items) > 25: node['more'] = True
            elif isinstance(v, dict):
                node['pairs'] = [[enc(a, heap, depth + 1), enc(b, heap, depth + 1)] for a, b in list(v.items())[:25]]
            elif hasattr(v, '__dict__'):
                node['attrs'] = [[a, enc(b, heap, depth + 1)] for a, b in vars(v).items()]
            else:
                node['repr'] = repr(v)[:80]
        return {'r': k}

    def is_class_body(f):
        loc = f.f_locals
        return '__module__' in loc and '__qualname__' in loc and f.f_code.co_name == str(loc.get('__qualname__')).split('.')[-1]

    def snap(frame, event, arg):
        heap, frames, chain, f = {}, [], [], frame
        while f is not None:
            if f.f_code.co_filename == '<viz>' and not is_class_body(f):
                chain.append(f)
            f = f.f_back
        for f in reversed(chain):
            if f.f_code.co_name == '<module>':
                items = [(k, v) for k, v in f.f_globals.items()
                         if not k.startswith('__') and k != 'input' and not isinstance(v, types.ModuleType)]
                label = 'Global frame'
            else:
                items = list(f.f_locals.items())
                label = f.f_code.co_name + '()'
            frames.append({'name': label, 'vars': [[k, enc(v, heap, 0)] for k, v in items]})
        st = {'line': frame.f_lineno, 'event': event, 'frames': frames, 'heap': heap, 'out': buf.getvalue()}
        if event == 'return':
            st['ret'] = enc(arg, heap, 0)
            st['fn'] = frame.f_code.co_name
        if event == 'exception':
            st['exc'] = arg[0].__name__ + ': ' + str(arg[1])
        steps.append(st)

    def local(frame, event, arg):
        if len(steps) >= LIMIT:
            raise RuntimeError('The visualizer stops after %d steps. Use a smaller example.' % LIMIT)
        if event in ('line', 'return', 'exception'):
            snap(frame, event, arg)
        return local

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != '<viz>' or is_class_body(frame):
            return None
        if frame.f_code.co_name != '<module>':
            snap(frame, 'call', arg)
        return local

    old = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = buf
    error = ''
    try:
        code = compile(src, '<viz>', 'exec')
        sys.settrace(tracer)
        try:
            exec(code, ns)
        finally:
            sys.settrace(None)
    except SystemExit:
        error = 'sys.exit() ended the program.'
    except BaseException as e:
        error = _pp_fmt_exc(e, '<viz>')
    finally:
        sys.stdout, sys.stderr = old
    return json.dumps({'steps': steps, 'error': error, 'out': buf.getvalue()})

def pp_regex(args_json):
    import re
    a = json.loads(args_json)
    flags = 0
    for f in a.get('flags', []):
        flags |= getattr(re, f)
    try:
        rx = re.compile(a['pattern'], flags)
    except re.error as e:
        return json.dumps({'error': 're.error: ' + str(e)})
    text = a['text']
    ms = []
    for m in rx.finditer(text):
        ms.append({'s': m.start(), 'e': m.end(), 'm': m.group(),
                   'g': [m.group(i) for i in range(1, rx.groups + 1)]})
        if len(ms) >= 300: break
    res = {'matches': ms, 'groups': rx.groups}
    fn = a.get('func', 'findall')
    try:
        if fn == 'search':
            m = rx.search(text)
            res['result'] = 'None' if m is None else repr(m) + '\nmo.group() -> ' + repr(m.group())
        elif fn == 'findall':
            res['result'] = repr(rx.findall(text))
        elif fn == 'sub':
            res['result'] = repr(rx.sub(a.get('repl', ''), text))
    except (re.error, IndexError) as e:
        res['result'] = type(e).__name__ + ': ' + str(e)
    return json.dumps(res)

def pp_xml(text, query=''):
    import xml.etree.ElementTree as ET
    try:
        root = ET.fromstring(text)
    except ET.ParseError as e:
        return json.dumps({'error': 'ParseError: ' + str(e)})
    ids, n = {}, [0]
    def build(el, path):
        ids[id(el)] = n[0]
        node = {'id': n[0], 'tag': el.tag, 'attrib': dict(el.attrib),
                'text': (el.text or '').strip(), 'path': path, 'children': []}
        n[0] += 1
        counts = {}
        for ch in el:
            counts[ch.tag] = counts.get(ch.tag, 0) + 1
            node['children'].append(build(ch, path + '/' + ch.tag + '[' + str(counts[ch.tag]) + ']'))
        return node
    tree = build(root, '/' + root.tag)
    res = {'tree': tree}
    if query:
        try:
            found = root.findall(query)
            res['found'] = [ids[id(x)] for x in found if id(x) in ids]
        except (SyntaxError, KeyError) as e:
            res['qerror'] = type(e).__name__ + ': ' + str(e)
    return json.dumps(res)

def pp_json(text, indent=2):
    try:
        obj = json.loads(text)
    except json.JSONDecodeError as e:
        return json.dumps({'error': e.msg, 'line': e.lineno, 'col': e.colno})
    def shape(v):
        if isinstance(v, dict): return {'t': 'dict', 'c': [[k, shape(x)] for k, x in v.items()]}
        if isinstance(v, list): return {'t': 'list', 'c': [[i, shape(x)] for i, x in enumerate(v)]}
        return {'t': type(v).__name__, 'v': repr(v)}
    return json.dumps({'pretty': json.dumps(obj, indent=int(indent)), 'compact': json.dumps(obj, separators=(',', ':')),
                       'type': type(obj).__name__, 'shape': shape(obj)})

_DBS = {}
def pp_db(key, sql, reset_script=None):
    import sqlite3
    if reset_script is not None or key not in _DBS:
        if key in _DBS:
            _DBS[key].close()
        conn = sqlite3.connect(':memory:')
        conn.execute('PRAGMA foreign_keys = ON')
        if reset_script:
            conn.executescript(reset_script)
        _DBS[key] = conn
    conn = _DBS[key]
    results, stmt = [], ''
    try:
        for line in (sql or '').splitlines(True):
            stmt += line
            if sqlite3.complete_statement(stmt):
                s = stmt.strip(); stmt = ''
                if not s or s == ';': continue
                cur = conn.execute(s)
                r = {'sql': s}
                if cur.description:
                    r['columns'] = [d[0] for d in cur.description]
                    r['rows'] = [list(map(lambda x: x if isinstance(x, (int, float, str)) or x is None else repr(x), row)) for row in cur.fetchmany(300)]
                else:
                    r['rowcount'] = cur.rowcount
                results.append(r)
        if stmt.strip():
            cur = conn.execute(stmt.strip())
            r = {'sql': stmt.strip()}
            if cur.description:
                r['columns'] = [d[0] for d in cur.description]
                r['rows'] = [list(row) for row in cur.fetchmany(300)]
            else:
                r['rowcount'] = cur.rowcount
            results.append(r)
        conn.commit()
        err = ''
    except sqlite3.Error as e:
        conn.rollback()
        err = type(e).__name__ + ': ' + str(e)
    schema = []
    for (name, ddl) in conn.execute("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"):
        cols = [{'name': c[1], 'type': c[2], 'notnull': bool(c[3]), 'pk': bool(c[5])} for c in conn.execute('PRAGMA table_info(%s)' % name)]
        fks = [{'from': f[3], 'table': f[2], 'to': f[4]} for f in conn.execute('PRAGMA foreign_key_list(%s)' % name)]
        uniq = []
        for idx in conn.execute('PRAGMA index_list(%s)' % name):
            if idx[2]:
                uniq.append([c[2] for c in conn.execute('PRAGMA index_info(%s)' % idx[1])])
        count = conn.execute('SELECT COUNT(*) FROM %s' % name).fetchone()[0]
        schema.append({'name': name, 'sql': ddl, 'cols': cols, 'fks': fks, 'unique': uniq, 'count': count})
    return json.dumps({'results': results, 'error': err, 'schema': schema})

def pp_fs():
    out = []
    for dirpath, dirs, files in os.walk(WS):
        dirs.sort()
        rel = os.path.relpath(dirpath, WS)
        for d in dirs:
            out.append({'path': os.path.normpath(os.path.join(rel, d)), 'dir': True})
        for f in sorted(files):
            p = os.path.join(dirpath, f)
            out.append({'path': os.path.normpath(os.path.join(rel, f)), 'dir': False, 'size': os.path.getsize(p)})
    return json.dumps({'cwd': WS, 'items': out})

def pp_read(path):
    p = os.path.join(WS, path)
    try:
        with open(p, encoding='utf-8') as fh:
            return json.dumps({'text': fh.read()})
    except UnicodeDecodeError:
        with open(p, 'rb') as fh:
            data = fh.read(400)
        return json.dumps({'text': repr(data) + (' ...' if os.path.getsize(p) > 400 else ''), 'binary': True})
    except OSError as e:
        return json.dumps({'error': str(e)})

'ready'
`;

  const py = (PP.py = {
    status: 'idle', pyodide: null, _p: null, listeners: new Set(),
    onStatus(fn) { this.listeners.add(fn); fn(this.status, this.message); return () => this.listeners.delete(fn); },
    _set(s, msg) { this.status = s; this.message = msg || ''; this.listeners.forEach((fn) => fn(s, this.message)); },

    load() {
      if (this._p) return this._p;
      this._p = (async () => {
        this._set('loading', 'Downloading Python (about 10 MB, first time only)…');
        if (!window.loadPyodide) {
          await new Promise((res, rej) => {
            const s = document.createElement('script');
            s.src = PP.config.PYODIDE_URL + 'pyodide.js';
            s.onload = res;
            s.onerror = () => rej(new Error('Could not download the Python runtime from ' + PP.config.PYODIDE_URL));
            document.head.appendChild(s);
          });
        }
        this._set('loading', 'Starting the Python interpreter…');
        const pyo = await window.loadPyodide({ indexURL: PP.config.PYODIDE_URL });
        pyo.FS.mkdirTree('/home/pyodide/pylib/dbm');
        for (const [name, src] of Object.entries(window.PP_DBM_FILES || {})) pyo.FS.writeFile('/home/pyodide/pylib/dbm/' + name, src);
        pyo.runPython(BOOT.replace('TIME_LIMIT = 10.0', 'TIME_LIMIT = ' + Number(PP.config.TIME_LIMIT_S).toFixed(1)));
        this.pyodide = pyo;
        this._set('ready', 'Python ' + pyo.runPython('import sys; sys.version.split()[0]') + ' is running in your browser');
        return pyo;
      })().catch((e) => {
        this._p = null;
        this._set('error', e.message || String(e));
        throw e;
      });
      return this._p;
    },

    async call(fn, ...args) {
      const pyo = await this.load();
      const f = pyo.globals.get(fn);
      try { return JSON.parse(f(...args)); } finally { f.destroy && f.destroy(); }
    },

    async ensureImports(code) {
      const pyo = await this.load();
      try { await pyo.loadPackagesFromImports(code); }
      catch (e) { throw new Error('A package needed by this code could not be downloaded: ' + (e.message || e)); }
    },

    async run(code, { stdin = [], key = null } = {}) {
      await this.ensureImports(code);
      return this.call('pp_run', code, JSON.stringify(stdin), key);
    },
    async check(code, tests) { await this.ensureImports(code); return this.call('pp_check', code, JSON.stringify(tests)); },
    async viz(code, stdin = []) { await this.ensureImports(code); return this.call('pp_viz', code, JSON.stringify(stdin)); },
    async shell(key, src) { await this.ensureImports(src); return this.call('pp_shell', key, src); },
    async db(key, sql, resetScript) {
      const pyo = await this.load();
      await pyo.loadPackage('sqlite3');
      return this.call('pp_db', key, sql, resetScript === undefined ? null : resetScript);
    }
  });
})();
