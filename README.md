# Python Programming (1BEC305) — Interactive Learning Portal

An interactive website covering all five modules of **Python Programming, 1BEC305 (Scheme 2025, Semester III, PCC, 3 credits)**.
Students read a concept, run real Python in the browser, experiment with visualizers, practise, and take quizzes — no installation needed.

Python runs on **Pyodide** (CPython 3.12 compiled to WebAssembly). No output on the site is faked: every program, quiz check and auto-graded problem is executed by real Python on the student's own device.

---

## Run it locally

You need any modern browser and Python 3 (only to serve the files).

```bash
cd python-portal          # the folder containing index.html
python -m http.server 8000
```

Open **http://localhost:8000** in Chrome, Edge, Firefox or Safari.

> Opening `index.html` by double-clicking (a `file://` address) mostly works, but browsers restrict some requests from local files, and the HTTP lesson's live fetch of `data/romeo.txt` needs a web server. Use the command above.

The first time Python is needed, the browser downloads the runtime (about 10 MB, then cached). The SQLite package (about 1.5 MB) downloads the first time a database lesson runs.

## Host it (e.g. GitHub Pages)

It is a static site: upload the whole folder to any web host. For GitHub Pages, push the folder to a repository and enable *Settings → Pages → Deploy from branch*. No server code or database is required.

## Use it fully offline (optional)

By default Pyodide loads from the jsDelivr CDN. For a lab without internet:

1. Download `pyodide-0.26.4.tar.bz2` from https://github.com/pyodide/pyodide/releases/tag/0.26.4
2. Extract it and copy the contents of its `pyodide/` folder into a new `pyodide/` folder next to `index.html`.
3. In `js/core.js` change `PYODIDE_URL` to `'./pyodide/'`.

(The full release is large; only `pyodide.js`, `pyodide.asm.js`, `pyodide.asm.wasm`, `python_stdlib.zip`, `pyodide-lock.json` and `sqlite3-1.0.0.zip` are actually needed.)

Fonts come from Google Fonts and fall back to system fonts when offline.

---

## What is included

| Section | Contents |
|---|---|
| Home | Live Python shell, module cards with progress, Continue Learning |
| Course Overview | Official course data, 5 course outcomes, roadmap, module-wise syllabus, **topic coverage checklist** (all 88 syllabus topics mapped to lessons), notes on syllabus discrepancies |
| Modules 1–5 | 37 lessons; each follows the 10-step sequence: Concept → Syntax → Worked example → Execution → Interactive demonstration → Visual explanation → Common mistakes → Practice (Easy/Medium/Hard) → Mini challenge → Summary |
| Python Code Playground | Editor with highlighting, Run / Reset / Clear / Copy, `input()` support, sample programs grouped by module, 10-second infinite-loop guard |
| Practice Problems | 15 problems auto-graded against multiple test cases, progressive hints, solution + explanation after the first attempt; 5 mini-projects |
| Quizzes | 88 questions (17–18 per module): multiple choice, predict-the-output, find-the-error, code completion; shuffled, answers hidden until submission, topic-wise results; 25-question final test |
| Learning Dashboard | Completion ring, module bars, quiz scores, recent activity, topics needing revision, 11 badges, reset with confirmation |
| Revision and Reference | Syntax cheat sheet, data-structure comparison, list/string methods, regex symbols, file handling, OOP summary, XML vs JSON, SQL, keys and JOIN, error messages, glossary, module-wise revision checklist |

### Interactive tools

- **Module 1:** expression shell, step-by-step program visualizer (frames, variables, return values, object memory diagram), if/elif/else flowchart animation with real-Python check, for/while tracing, scope side-by-side, error lab, playable Guess the Number.
- **Module 2:** list visualizer (append, insert, remove, pop, sort, slicing with positive/negative indices), string visualizer (slicing, traversal, 21 methods), dictionary editor, mutability experiments, student-records manager.
- **Module 3:** regex playground (highlighted matches, positions, groups, flags, `search`/`findall`/`sub`, plain-English explanation of each token), plain-search vs regex comparison, `os.path` explorer (Linux and Windows/`ntpath` modes), file read/write visualizer on a virtual file system, working `shelve` and `pprint.pformat()` examples.
- **Module 4:** class/object visualizer with animated `__init__`, interactive Rectangle with alias / shallow / deep copy comparison, pure function vs modifier Time lab, operator overloading and polymorphism demos.
- **Module 5:** step-through HTTP request/response (sample data, labelled), real same-site HTTP fetch, XML editor with tree and `findall` paths, JSON formatter/validator with error position, SQLite explorer with schema view (PK / UNIQUE / FK), animated INNER and LEFT JOIN with SQLite confirmation, keys diagram, Student–Course–Enrollment application, Twitter-spider case study using a mock API.

---

## Project structure

```
index.html              page shell, loads the scripts below
css/style.css           all styles (light + dark themes, responsive)
js/core.js              configuration (PYODIDE_URL, time limit) and helpers
js/editor.js            Python highlighter, editor, runnable code block
js/pyrunner.js          loads Pyodide; Python-side helpers: runner, tracer, test checker, regex/XML/JSON/SQLite helpers
js/vendor-dbm.js        CPython's pure-Python dbm.dumb (PSF licence) — restores shelve, which Pyodide removes
js/store.js             progress, quiz scores, badges (browser localStorage)
js/widgets.js           shell, tracer, flowchart, game, list/string/dict visualizers
js/widgets2.js          regex, files, OOP labs, HTTP, XML, JSON, database, JOIN, keys
js/app.js               routing, navigation, pages, quiz engine, dashboard, search
js/content/course.js    course data and exact syllabus topic list
js/content/m1.js … m5.js   lesson content for each module
js/data/quizzes.js      quiz bank
js/data/problems.js     coding problems (with tests) and mini-projects
js/data/reference.js    revision sheets and glossary
data/                   sample datasets: school.sql, students.xml, catalog.json, romeo.txt
tests/qa.mjs            automated quality checks (see below)
```

To edit content, change the module files in `js/content/`; each lesson is one object. `covers` must use the exact topic wording from `course.js` (the QA script checks this).

## Quality checks

```bash
npm install pyodide@0.26.4
node tests/qa.mjs
```

The script verifies syllabus coverage, the 10-step structure of every lesson, quiz-bank size and question types, then **executes every program** in the content with real Python. This covers worked examples, demos, visualizer traces, practice and challenge solutions, every quiz "predict the output" answer, and every problem's reference solution against its tests. It also confirms each starter fails the tests. Programs using `sqlite3` are run with your system `python3`, because Node-based Pyodide does not download that package.

Status at delivery:
- `qa.mjs`: all checks passed (270 programs/traces run; 126 outputs matched exactly).
- Browser test in headless Chromium: 50 of 50 interactive checks passed with no JavaScript errors, covering all routes, all 37 lessons and every widget.

---

## Limitations (please read)

- **Progress is stored in the browser's localStorage only.** It is private to that browser on that device, is not synchronised, is not a secure or official record, and is erased if browser data is cleared. There is no login; nothing is sent to any server.
- **Browser sandbox.** Web pages cannot open raw sockets or read the student's own files. The socket and `urllib` programs (Module 5) are shown with a "Desktop Python only" label and should be run in IDLE/Thonny; the runnable parts of those lessons use clearly labelled sample data. File lessons use a virtual folder (`/home/pyodide/workspace`) that resets when the page reloads.
- `pyodide.http.open_url()` (used in lesson 5.2) is Pyodide-specific and can only fetch from the same site or servers that allow cross-origin requests.
- **Twitter/X** now requires paid API access, so the spidering lesson uses a mock API with the same program structure.
- **shelve:** Pyodide omits the `dbm` module; the site bundles CPython's own `dbm.dumb`, so `shelve` behaves as documented, storing `.dat`/`.dir`/`.bak` files.
- Programs are stopped after **10 seconds** to catch infinite loops (change `TIME_LIMIT_S` in `js/core.js`). `input()` uses supplied sample input first, then a browser prompt box.
- `tkinter`, `subprocess`, threads that need the OS, and packages not built for Pyodide are unavailable.

## Notes on the source syllabus

- The supplied syllabus page ends after the Module 5 topic list, so **Module 5 hours and textbook chapters are not visible**. The site shows them as "not visible" rather than guessing. Modules 1–4 total 34 hours; with 42 lecture hours stated, Module 5 would be 8 hours — confirm with the full document.
- Textbook titles are not on the supplied page (only "Text book 1/2" with chapter numbers). The topic names match Sweigart's *Automate the Boring Stuff with Python* (Modules 1–3), Downey's *Think Python* 2e (Module 4) and Severance's *Python for Everybody* (Module 5). Lesson explanations are written for this site; several short examples deliberately follow the textbooks' well-known exercises (phone-number matching, the Point/Rectangle/Time classes, the Tracks database) so students recognise them from their reading.
- "Manipulating Strings" appears twice in Module 2; it is taught once and both entries map to lessons 2.3–2.4.
- Course codes other than 1BEC305 in the sample database are marked "(sample)" and are fictional.
