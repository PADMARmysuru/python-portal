(function () {
  'use strict';
  const R = String.raw;
  const t = (head, rows) => '<table class="ref"><thead><tr>' + head.map((x) => '<th>' + x + '</th>').join('') + '</tr></thead><tbody>' +
    rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
  window.PP.reference = [
    { id: 'syntax', title: 'Python syntax cheat sheet', module: 1, html: t(['Concept', 'Syntax'], [
      ['Comment', '<code># text</code>'], ['Output / input', "<code>print('a', 'b', sep=', ', end='\\n')</code> · <code>name = input()</code>"],
      ['Conversion', '<code>int(x) float(x) str(x) len(s) type(x)</code>'], ['Arithmetic', '<code>** * / // % + -</code> (highest to lowest)'],
      ['Comparison / Boolean', '<code>== != &lt; &gt; &lt;= &gt;=</code> · <code>and or not</code>'],
      ['if', '<code>if c:</code> … <code>elif c:</code> … <code>else:</code>'], ['Loops', '<code>while c:</code> · <code>for i in range(start, stop, step):</code> · <code>break</code> · <code>continue</code>'],
      ['Functions', '<code>def f(a, b=2):</code> … <code>return value</code> (no return → None)'], ['Scope', '<code>global name</code> inside a function to assign a global'],
      ['Modules', '<code>import random</code> · <code>from math import sqrt</code> · <code>import sys; sys.exit()</code>'],
      ['Exceptions', '<code>try:</code> … <code>except ValueError as e:</code> … <code>else:</code> … <code>finally:</code>']]) },
    { id: 'ds', title: 'Data structures compared', module: 2, html: t(['', 'list', 'tuple', 'str', 'dict'], [
      ['Literal', '<code>[1, 2]</code>', '<code>(1, 2)</code> / <code>(1,)</code>', "<code>'ab'</code>", "<code>{'k': 1}</code>"],
      ['Mutable', 'yes', 'no', 'no', 'yes'], ['Ordered / indexed', 'yes, by position', 'yes, by position', 'yes, by position', 'by key (keeps insertion order)'],
      ['Duplicates', 'allowed', 'allowed', 'n/a', 'keys unique'], ['Typical use', 'collection that changes', 'fixed record, dict key', 'text', 'lookup by key']]) },
    { id: 'methods', title: 'Common list and string methods', module: 2, html: t(['List method', 'Effect', 'String method', 'Returns'], [
      ['<code>append(v)</code>', 'add at end', '<code>upper() lower()</code>', 'case-converted copy'], ['<code>insert(i, v)</code>', 'add at i', '<code>strip() lstrip() rstrip()</code>', 'copy without edge whitespace'],
      ['<code>remove(v)</code>', 'delete first v', '<code>split(sep)</code>', 'list of parts'], ['<code>pop(i)</code>', 'remove and return', "<code>sep.join(list)</code>", 'joined string'],
      ['<code>index(v)</code>', 'position of v', '<code>replace(a, b)</code>', 'copy with replacements'], ['<code>sort(reverse=, key=)</code>', 'sort in place', '<code>find(s) count(s)</code>', 'position (−1) / count'],
      ['<code>reverse()</code>', 'reverse in place', '<code>startswith() endswith()</code>', 'bool'], ['<code>count(v) extend(l)</code>', 'count / add many', '<code>isalpha() isdecimal() isalnum() isspace()</code>', 'bool'],
      ['<code>copy.copy() copy.deepcopy()</code>', 'copies', '<code>rjust(n) ljust(n) center(n)</code>', 'padded copy']]) + '<p class="muted">List methods change the list and return None; string methods return new strings.</p>' },
    { id: 'regex', title: 'Regular expression symbols', module: 3, html: t(['Symbol', 'Meaning'], [
      ['<code>\\d \\w \\s</code>', 'digit · word char (letter, digit, _) · whitespace'], ['<code>\\D \\W \\S</code>', 'the opposites'], ['<code>.</code>', 'any char except newline (all chars with re.DOTALL)'],
      ['<code>[abc] [a-z] [^abc]</code>', 'set · range · negated set'], ['<code>^ $</code>', 'start · end of string'], ['<code>? * +</code>', 'optional · zero or more · one or more'],
      ['<code>{n} {n,m}</code>', 'exact · range of repetitions'], ['<code>*? +? {n,m}?</code>', 'non-greedy'], ['<code>a|b</code>', 'either'], ['<code>( ) (?: )</code>', 'capturing · non-capturing group'],
      ['Functions', '<code>re.compile(r"…", flags)</code>, <code>search</code> → Match or None, <code>findall</code> → list, <code>sub(repl, text)</code>, <code>mo.group(n) / groups()</code>'],
      ['Flags', '<code>re.I</code> (IGNORECASE) · <code>re.DOTALL</code> · <code>re.VERBOSE</code> · combine with <code>|</code>']]) },
    { id: 'files', title: 'File handling syntax', module: 3, html: t(['Task', 'Code'], [
      ['Open / close', "<code>f = open('a.txt', 'r'|'w'|'a')</code> · <code>f.close()</code> · <code>with open(...) as f:</code>"],
      ['Read', '<code>f.read()</code> (one string) · <code>f.readlines()</code> (list of lines) · <code>for line in f:</code>'], ['Write', "<code>f.write('text\\n')</code> returns characters written"],
      ['Paths', "<code>os.path.join() os.getcwd() os.chdir() os.makedirs(p, exist_ok=True)</code>"],
      ['os.path', '<code>abspath isabs relpath dirname basename split splitext getsize exists isfile isdir</code> · <code>os.listdir()</code> · <code>os.walk()</code>'],
      ['shelve', "<code>s = shelve.open('data'); s['k'] = v; s.close()</code>"], ['pprint', "<code>open('m.py','w').write('x = ' + pprint.pformat(x))</code> then <code>import m</code>"]]) },
    { id: 'oop', title: 'Object-oriented programming summary', module: 4, html: t(['Idea', 'Example'], [
      ['Class / instance', '<code>class Point: …</code> · <code>p = Point()</code>'], ['Attribute', '<code>p.x = 3</code> · <code>vars(p)</code>'], ['Embedded object', '<code>box.corner = Point()</code>'],
      ['Alias vs copy', '<code>b = a</code> (same object) · <code>copy.copy(a)</code> (shallow) · <code>copy.deepcopy(a)</code> (deep) · <code>a is b</code>'],
      ['Pure function vs modifier', 'returns a new object · changes its argument'], ['Method', '<code>def m(self, …):</code> · <code>obj.m()</code> = <code>Class.m(obj)</code>'],
      ['Special methods', '<code>__init__</code> (create) · <code>__str__</code> (print) · <code>__add__ __radd__ __eq__ __lt__ __len__</code>'],
      ['Type-based dispatch', '<code>if isinstance(other, Time): … else: …</code>'], ['Polymorphism', 'one function works with any type that supports the operations it uses']]) },
    { id: 'xmljson', title: 'XML and JSON compared', module: 5, html: t(['', 'XML', 'JSON'], [
      ['Form', 'tree of tagged elements with attributes', 'nested objects {} and arrays []'], ['Parse in Python', '<code>ET.fromstring(text)</code>', '<code>json.loads(text)</code>'],
      ['Read values', "<code>find('name').text</code>, <code>get('attr')</code>, <code>findall('a/b')</code>", "<code>data['name']</code>, loop over lists"],
      ['Produce text', '<code>ET.tostring(el, encoding="unicode")</code>', '<code>json.dumps(obj, indent=2)</code>'], ['Strengths', 'self-describing, attributes, schemas', 'compact, maps directly to dict/list']]) },
    { id: 'sql', title: 'SQL command reference', module: 5, html: t(['Command', 'Example'], [
      ['CREATE TABLE', '<code>CREATE TABLE Tracks (id INTEGER PRIMARY KEY, title TEXT UNIQUE, plays INTEGER)</code>'],
      ['INSERT', "<code>INSERT INTO Tracks (title, plays) VALUES (?, ?)</code>"], ['SELECT', '<code>SELECT title FROM Tracks WHERE plays &gt; 10 ORDER BY title DESC LIMIT 5</code>'],
      ['UPDATE', "<code>UPDATE Tracks SET plays = plays + 1 WHERE title = ?</code>"], ['DELETE', '<code>DELETE FROM Tracks WHERE plays &lt; 5</code>'],
      ['Aggregate', '<code>SELECT COUNT(*), AVG(plays) FROM Tracks GROUP BY …</code>'], ['Avoid duplicates', '<code>INSERT OR IGNORE …</code> with a UNIQUE column'],
      ['Python', "<code>conn = sqlite3.connect('f.sqlite'); cur = conn.cursor(); cur.execute(sql, params); conn.commit(); conn.close()</code>"]]) },
    { id: 'keys', title: 'Database keys and JOIN', module: 5, html: t(['Term', 'Meaning'], [
      ['Primary key', 'integer id identifying each row (<code>INTEGER PRIMARY KEY</code>)'], ['Logical key', 'real-world identifier used for lookup (USN, course code); <code>UNIQUE</code>'],
      ['Candidate key', 'any column (set) that could uniquely identify rows; one is chosen as primary key'], ['Foreign key', 'column holding the primary key of a row in another table'],
      ['INNER JOIN', 'rows that match in both tables: <code>FROM A JOIN B ON A.id = B.a_id</code>'], ['LEFT JOIN', 'every row of the left table; NULLs where the right table has no match'],
      ['Connection table', 'turns a many-to-many relationship into two one-to-many links (Enrollment)']]) },
    { id: 'errors', title: 'Common Python error messages', module: 0, html: t(['Error', 'Typical cause', 'Fix'], [
      ['SyntaxError', 'missing colon, bracket or quote; = instead of ==', 'check the line shown (and the one before)'], ['IndentationError', 'block not indented or mixed tabs/spaces', 'indent consistently with 4 spaces'],
      ['NameError', 'misspelt name or used before assignment', 'check spelling; define first'], ['TypeError', "'a' + 1; wrong number of arguments; calling None", 'convert types; check the call'],
      ['ValueError', "int('abc')", 'validate input; try/except'], ['IndexError', 'index past the end of a list or string', 'use len(); remember indices start at 0'],
      ['KeyError', 'missing dictionary key', 'd.get(k, default) or check k in d'], ['AttributeError', "None.group(); missing object attribute; 'list'.join", 'check the object type; test for None'],
      ['ZeroDivisionError', 'division by zero', 'check the divisor'], ['UnboundLocalError', 'local variable read before assignment', 'pass as parameter or declare global'],
      ['FileNotFoundError', 'wrong path or cwd', 'os.getcwd(), os.path.exists()'], ['re.error', 'invalid regular expression', 'escape special characters'],
      ['json.JSONDecodeError', 'single quotes, trailing commas', 'use valid JSON'], ['sqlite3.IntegrityError', 'UNIQUE / PRIMARY KEY / FOREIGN KEY violated', 'INSERT OR IGNORE, or check data']]) }
  ];
  window.PP.glossary = [
    ['Argument', 'A value passed to a function in a call.'], ['Attribute', 'A named value stored in an object, accessed with dot notation.'],
    ['Block', 'A group of consecutive lines with the same indentation.'], ['Boolean', 'The type with values True and False.'],
    ['Class', 'A programmer-defined type; a blueprint for objects.'], ['Concatenation', 'Joining strings with +.'],
    ['Database', 'Organised, persistent data with fast lookup, e.g. an SQLite file.'], ['Deep copy', 'A copy that also copies every embedded object.'],
    ['Dictionary', 'A mutable mapping from unique keys to values.'], ['Exception', 'An error raised while a program runs.'],
    ['Expression', 'A combination of values and operators that evaluates to a single value.'], ['Foreign key', 'A column holding the primary key of a row in another table.'],
    ['Function', 'A named, reusable block of code.'], ['Greedy match', 'A regex quantifier matching as much text as possible.'],
    ['HTTP', 'The protocol browsers and servers use to exchange documents.'], ['Immutable', 'Cannot be changed in place (str, tuple, int).'],
    ['Instance', 'An object created from a class.'], ['JOIN', 'An SQL operation combining rows of tables on a matching condition.'],
    ['JSON', 'A text format for data using objects and arrays.'], ['List', 'A mutable ordered sequence of values.'],
    ['Local scope', 'The variables of a single function call.'], ['Method', 'A function defined inside a class and called on an object.'],
    ['Modifier', 'A function that changes the objects passed to it.'], ['Module', 'A file of Python code that can be imported.'],
    ['Mutable', 'Can be changed in place (list, dict, most objects).'], ['None', 'The value representing “no value”; returned by functions without return.'],
    ['Operator overloading', 'Defining special methods so operators work on your own types.'], ['Parameter', 'A variable in a function definition that receives an argument.'],
    ['Polymorphism', 'Code that works with objects of different types.'], ['Primary key', 'An integer that uniquely identifies a row.'],
    ['Pure function', 'A function that returns a result without modifying its arguments.'], ['Raw string', "A string literal r'…' in which backslashes are not escapes."],
    ['Reference', 'What a variable stores: a link to an object.'], ['Regular expression', 'A pattern describing the shape of text.'],
    ['Replication', 'Repeating a string or list with *.'], ['Shallow copy', 'A new object whose attributes refer to the same embedded objects.'],
    ['Shelf', 'A dictionary-like persistent store created by the shelve module.'], ['Slice', 'A part of a sequence, seq[start:stop:step].'],
    ['Socket', 'A two-way network connection between programs.'], ['SQL', 'The language used to create, query and update relational databases.'],
    ['Traceback', 'The report Python prints when an unhandled exception occurs.'], ['Tuple', 'An immutable ordered sequence.'],
    ['Type-based dispatch', 'Choosing behaviour according to the type of an argument (isinstance).'], ['Variable', 'A name that refers to a value.'],
    ['XML', 'A markup language representing data as a tree of tagged elements.']
  ];
})();
