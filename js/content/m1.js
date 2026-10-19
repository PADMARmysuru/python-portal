(function () {
  'use strict';
  const R = String.raw;
  window.PP.addModule({
    n: 1, title: 'Python Fundamentals', co: 1,
    blurb: 'Expressions, data types, variables, flow control, functions, scope and exceptions — ending with a complete game.',
    lessons: [
      {
        id: 'm1-1', title: 'Python basics, language features and history',
        covers: ['Python Basics', 'Python language features', 'History'],
        concept: R`<p>Python is a <strong>high-level, general-purpose programming language</strong>. You write instructions in readable text; the Python interpreter turns them into actions. The reference interpreter, <strong>CPython</strong>, first compiles your source into <em>bytecode</em> and then runs that bytecode on the Python virtual machine — which is why Python is usually called an interpreted language.</p>
<p>Key language features:</p>
<ul>
<li><strong>Readable syntax</strong> — indentation (not braces) marks blocks of code.</li>
<li><strong>Dynamically typed</strong> — a variable can hold an integer now and a string later; types are checked while the program runs.</li>
<li><strong>Multi-paradigm</strong> — procedural, object-oriented (Module 4) and functional styles all work.</li>
<li><strong>“Batteries included”</strong> — a large standard library (<code>random</code>, <code>re</code>, <code>os</code>, <code>json</code>, <code>sqlite3</code>…) ships with the language.</li>
<li><strong>Portable, free and open source</strong> — the same program runs on Windows, Linux and macOS.</li>
</ul>
<p><strong>History.</strong> Guido van Rossum began Python at CWI in the Netherlands around Christmas 1989 and published version 0.9.0 in February 1991. The name comes from the comedy series <em>Monty Python’s Flying Circus</em>, not the snake. Python 3.0 (December 2008) deliberately broke compatibility with Python 2 to fix design problems; Python 2 reached end of life on 1 January 2020.</p>
<p class="callout">Language vs. environment: everything on this site runs on <strong>Pyodide</strong>, which is CPython compiled to WebAssembly so it can run inside your browser. The Python language is the same; only operating-system features such as network sockets differ.</p>`,
        syntax: R`# A comment starts with #
print('Hello, Python!')          # a function call
if 3 > 2:                        # a colon opens a block
    print('Indented = inside the if block')
print('Back at the left margin = outside the block')`,
        example: { code: R`import sys
print('Hello from Python', sys.version.split()[0])

languages = ['C', 'Java', 'Python']
for lang in languages:
    if lang == 'Python':
        print(lang, 'marks blocks with indentation instead of braces')
    else:
        print(lang, 'uses braces { }')` },
        demo: { w: 'code', intro: 'Dynamic typing in action. Change the values, then run again. The last line prints “The Zen of Python”, a list of design principles built into every Python installation.', code: R`x = 42
print(x, type(x))
x = 'now a string'
print(x, type(x))
x = 3.5
print(x, type(x))

import this   # prints the Zen of Python` },
        visual: { html: R`<ol class="timeline">
<li><b>1989</b> Guido van Rossum starts Python as a hobby project at CWI, Amsterdam.</li>
<li><b>1991</b> Version 0.9.0 is published: functions, exceptions, lists and dictionaries already exist.</li>
<li><b>1994</b> Python 1.0 adds lambda, map and filter.</li>
<li><b>2000</b> Python 2.0 adds list comprehensions and cycle-detecting garbage collection.</li>
<li><b>2008</b> Python 3.0: print becomes a function, text is Unicode by default — not backward compatible.</li>
<li><b>2018</b> Guido steps down as “Benevolent Dictator For Life”; an elected steering council now guides the language.</li>
<li><b>2020</b> Python 2 reaches end of life. All new code is Python 3.</li>
</ol>` },
        mistakes: [
          { wrong: R`print 'Hello'`, right: R`print('Hello')`, why: 'That is Python 2 syntax. In Python 3, print is a function and needs parentheses — otherwise you get a SyntaxError.' },
          { wrong: R`if True:
print('inside')`, right: R`if True:
    print('inside')`, why: 'The body of a block must be indented (4 spaces is the convention). Missing indentation raises IndentationError.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Print exactly: <code>Python was first released in 1991</code>', starter: R`# write one print() call
`, sol: R`print('Python was first released in 1991')`, expect: 'Python was first released in 1991' },
          { lvl: 'Medium', q: 'Use <code>sys.version_info</code> to print the major and minor version, for example <code>3.12</code>. (Hint: <code>sys.version_info.major</code>.)', starter: R`import sys
`, sol: R`import sys
print(str(sys.version_info.major) + '.' + str(sys.version_info.minor))` },
          { lvl: 'Hard', q: 'With one <code>print()</code> call, show the types of <code>7</code>, <code>7.0</code>, <code>\'7\'</code> and <code>True</code>, separated by spaces.', starter: '', sol: R`print(type(7), type(7.0), type('7'), type(True))`, expect: "<class 'int'> <class 'float'> <class 'str'> <class 'bool'>" }
        ],
        challenge: { q: 'Draw a box around the text <code>Monty Python</code> using string replication (<code>\'-\' * n</code>) so the box always fits the text, whatever its length.', starter: R`name = 'Monty Python'
`, sol: R`name = 'Monty Python'
border = '+' + '-' * (len(name) + 2) + '+'
print(border)
print('| ' + name + ' |')
print(border)` },
        summary: ['Python is a high-level, interpreted, dynamically typed, general-purpose language.', 'Indentation defines blocks; a colon starts a block.', 'Created by Guido van Rossum (first release 1991); Python 3 is the current line.', 'CPython is the reference interpreter; Pyodide runs CPython in a browser.']
      },
      {
        id: 'm1-2', title: 'The interactive shell, data types and variables',
        covers: ['Entering Expressions into the Interactive Shell', 'The Integer, Floating-Point, and String Data Types', 'String Concatenation and Replication', 'Storing Values in Variables'],
        concept: R`<p>The <strong>interactive shell</strong> (the <code>&gt;&gt;&gt;</code> prompt) reads one expression, evaluates it and prints the result immediately. An <strong>expression</strong> is made of <em>values</em> and <em>operators</em> and always reduces to a single value.</p>
<table class="ref"><thead><tr><th>Operator</th><th>Operation</th><th>Example</th><th>Result</th></tr></thead><tbody>
<tr><td><code>**</code></td><td>Exponent</td><td><code>2 ** 3</code></td><td>8</td></tr>
<tr><td><code>%</code></td><td>Remainder (modulus)</td><td><code>22 % 8</code></td><td>6</td></tr>
<tr><td><code>//</code></td><td>Integer (floor) division</td><td><code>22 // 8</code></td><td>2</td></tr>
<tr><td><code>/</code></td><td>Division (always a float)</td><td><code>22 / 8</code></td><td>2.75</td></tr>
<tr><td><code>*</code></td><td>Multiplication</td><td><code>3 * 5</code></td><td>15</td></tr>
<tr><td><code>-</code> <code>+</code></td><td>Subtraction, addition</td><td><code>5 - 2</code></td><td>3</td></tr>
</tbody></table>
<p>Precedence runs from top to bottom of the table (<code>**</code> first, <code>+ -</code> last); parentheses override it.</p>
<p>Every value has a <strong>data type</strong>. The three basic ones: <code>int</code> (−2, 0, 42), <code>float</code> (1.25, −0.5, 3.0) and <code>str</code> (text in quotes: <code>'Hello'</code>). With strings, <code>+</code> means <strong>concatenation</strong> (<code>'Alice' + 'Bob'</code> → <code>'AliceBob'</code>) and <code>*</code> with an integer means <strong>replication</strong> (<code>'Ha' * 3</code> → <code>'HaHaHa'</code>). Mixing a string and a number with <code>+</code> is a <code>TypeError</code>.</p>
<p>A <strong>variable</strong> is a named box that stores a value, created by an <strong>assignment statement</strong> (<code>spam = 42</code>). Assigning again overwrites the old value. Names may contain letters, digits and underscores, cannot start with a digit, are case-sensitive and cannot be keywords such as <code>if</code>.</p>`,
        syntax: R`2 + 3 * 6          # 20  (multiplication first)
(2 + 3) * 6        # 30
23 / 7             # 3.2857142857142856
23 // 7            # 3
23 % 7             # 2
'Alice' + 'Bob'    # 'AliceBob'
'Alice' * 3        # 'AliceAliceAlice'
spam = 40          # assignment statement
spam = spam + 2    # overwrite: spam is now 42`,
        example: { code: R`eggs = 2
spam = 40
print(spam + eggs)
spam = spam + 2
print(spam)
name = 'Ada'
print('Hello, ' + name + '!' * 3)
print(type(42), type(3.14), type('42'))` },
        demo: { w: 'shell', intro: 'A real Python shell. Click a sample expression or type your own and press Enter. Variables you create stay available for the next line, just like IDLE.', presets: ['2 + 3 * 6', '(2 + 3) * 6', '48565878 * 578453', '2 ** 8', '23 / 7', '23 // 7', '23 % 7', "'Alice' + 'Bob'", "'Alice' * 5", "'Alice' + 42", 'spam = 40', 'spam + 2', '0.1 + 0.2'] },
        visual: { w: 'trace', intro: 'Step through the program to watch each variable box being created and overwritten.', code: R`spam = 'Hello'
print(spam)
spam = 'Goodbye'
print(spam)
eggs = 2
total = eggs * 3.5
label = 'x' * eggs` },
        mistakes: [
          { wrong: R`'I have ' + 3 + ' cats'`, right: R`'I have ' + str(3) + ' cats'`, why: 'TypeError: can only concatenate str (not "int") to str. Convert the number with str() first.' },
          { wrong: R`2fast = 10
my var = 5`, right: R`fast2 = 10
my_var = 5`, why: 'Variable names cannot start with a digit or contain spaces.' },
          { wrong: R`'Alice' * 'Bob'`, right: R`'Alice' * 3`, why: 'Replication needs one string and one integer.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Print the number of seconds in one day using an expression (not by typing 86400).', starter: '', sol: R`print(24 * 60 * 60)`, expect: '86400' },
          { lvl: 'Medium', q: 'With <code>price = 249.5</code> and <code>qty = 4</code>, print on three lines: the total, how many full 500-rupee notes fit in the total (<code>//</code>), and what is left over (<code>%</code>).', starter: R`price = 249.5
qty = 4
`, sol: R`price = 249.5
qty = 4
total = price * qty
print(total)
print(total // 500)
print(total % 500)`, expect: '998.0\n1.0\n498.0' },
          { lvl: 'Hard', q: 'Swap <code>a = 5</code> and <code>b = 9</code> using only arithmetic (no third variable), then print <code>a = 9 b = 5</code>.', starter: R`a = 5
b = 9
`, sol: R`a = 5
b = 9
a = a + b
b = a - b
a = a - b
print('a =', a, 'b =', b)`, expect: 'a = 9 b = 5' }
        ],
        challenge: { q: 'Temperature converter: store <code>c = 37.5</code>, convert to Fahrenheit with <code>f = c * 9 / 5 + 32</code>, and print <code>37.5 C = 99.5 F</code> using concatenation and <code>str()</code>.', starter: R`c = 37.5
`, sol: R`c = 37.5
f = c * 9 / 5 + 32
print(str(c) + ' C = ' + str(f) + ' F')`, expect: '37.5 C = 99.5 F' },
        summary: ['The shell evaluates an expression and shows its value.', 'Operator precedence: ** then * / // % then + -; use parentheses to override.', 'int, float and str are the basic types; / always gives a float.', '+ concatenates strings, * replicates them; str + int is a TypeError.', 'An assignment statement stores a value in a variable; reassigning overwrites it.']
      },
      {
        id: 'm1-3', title: 'Your first program, dissected',
        covers: ['Your First Program', 'Dissecting Your Program'],
        concept: R`<p>The shell runs one instruction at a time. A <strong>program</strong> is a file (ending in <code>.py</code>) whose instructions run from top to bottom when you execute it. Dissecting a first program introduces the most common building blocks:</p>
<ul>
<li><strong>Comments</strong> — everything after <code>#</code> is ignored by Python and written for humans.</li>
<li><strong><code>print()</code></strong> — displays the value passed to it. <code>print()</code> with nothing prints a blank line.</li>
<li><strong><code>input()</code></strong> — waits for the user to type text and press Enter, and <em>always returns a string</em>.</li>
<li><strong><code>len()</code></strong> — returns the number of characters in a string as an integer.</li>
<li><strong><code>str()</code>, <code>int()</code>, <code>float()</code></strong> — convert a value to another type: <code>str(29)</code> → <code>'29'</code>, <code>int('42')</code> → 42, <code>float('3.5')</code> → 3.5, <code>int(7.9)</code> → 7 (truncates).</li>
</ul>
<p>A string is never equal to a number: <code>42 == '42'</code> is <code>False</code>, but an integer can equal a float: <code>42 == 42.0</code> is <code>True</code>.</p>
<p class="callout">On this site, <code>input()</code> first uses any sample input supplied with the example; after that a browser prompt box asks you.</p>`,
        syntax: R`# comment
print('text')          # output
name = input()         # input: always returns a str
len(name)              # number of characters
str(5), int('5'), float('5.5')`,
        example: { code: R`# This program says hello and asks for a name and age.
print('Hello, world!')
print('What is your name?')       # ask for their name
my_name = input()
print('It is good to meet you, ' + my_name)
print('The length of your name is:')
print(len(my_name))
print('What is your age?')        # ask for their age
my_age = input()
print('You will be ' + str(int(my_age) + 1) + ' in a year.')`, stdin: ['Ada', '19'] },
        demo: { w: 'code', intro: 'Experiment with type conversion. Predict each line before you run it.', code: R`print(str(29), int('42'), float('3.14'), int(7.9))
print(int('99') + 1)      # arithmetic
print('99' + '1')         # concatenation
print(42 == '42', 42 == 42.0, 42.0 == 0042.000)
print(len('hello'), len(''))` },
        visual: { w: 'trace', intro: 'Watch input() store the typed text in a variable, and how int() and str() create new values.', code: R`print('What is your age?')
my_age = input()
next_year = int(my_age) + 1
message = 'You will be ' + str(next_year)
print(message)`, stdin: ['19'] },
        mistakes: [
          { wrong: R`age = input()
print(age + 1)`, right: R`age = int(input())
print(age + 1)`, why: 'input() returns a string, so age + 1 raises TypeError. Convert with int() first.' },
          { wrong: R`int('3.5')`, right: R`float('3.5')   # or int(float('3.5'))`, why: "int() cannot parse a decimal string: ValueError: invalid literal for int() with base 10: '3.5'." }
        ],
        practice: [
          { lvl: 'Easy', q: 'Read two whole numbers with <code>input()</code> (one per line) and print their sum.', starter: '', stdin: ['12', '30'], sol: R`a = int(input())
b = int(input())
print(a + b)` },
          { lvl: 'Medium', q: 'Read a name and print a sentence like <code>Ada has 3 letters</code>.', starter: '', stdin: ['Ada'], sol: R`name = input()
print(name + ' has ' + str(len(name)) + ' letters')` },
          { lvl: 'Hard', q: 'Read a birth year and print the age the person turns in 2026 and in 2030, on two lines, each as a full sentence.', starter: '', stdin: ['2007'], sol: R`year = int(input())
print('In 2026 you turn ' + str(2026 - year))
print('In 2030 you turn ' + str(2030 - year))` }
        ],
        challenge: { q: 'Bill splitter: read the bill amount (it may have decimals) and the number of friends, then print each person’s share rounded to 2 decimal places with <code>round(value, 2)</code>.', starter: '', stdin: ['1250.75', '4'], sol: R`total = float(input())
friends = int(input())
share = round(total / friends, 2)
print('Each person pays ' + str(share))` },
        summary: ['A program is a .py file executed top to bottom.', 'Comments start with # and are ignored.', 'input() always returns a str; convert it with int() or float().', 'len() counts characters; str(), int(), float() convert between types.', "42 == '42' is False; 42 == 42.0 is True."]
      },
      {
        id: 'm1-4', title: 'Boolean values and operators',
        covers: ['Flow control', 'Boolean Values', 'Comparison Operators', 'Boolean Operators', 'Mixing Boolean and Comparison Operators'],
        concept: R`<p>A program rarely runs every line in order. <strong>Flow control</strong> statements decide which instructions to run, skip or repeat, based on conditions that evaluate to a <strong>Boolean</strong> value.</p>
<p>The Boolean type has exactly two values: <code>True</code> and <code>False</code> — capitalised, without quotes. <code>true</code> is just an undefined name.</p>
<p><strong>Comparison operators</strong> compare two values and produce a Boolean: <code>==</code> (equal to), <code>!=</code> (not equal), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. Note the difference: <code>=</code> assigns a value; <code>==</code> asks whether two values are equal. <code>==</code> and <code>!=</code> work on any types; the ordering operators need comparable types (two numbers, or two strings).</p>
<p><strong>Boolean operators</strong> combine Booleans: <code>and</code> is True only if both sides are True; <code>or</code> is True if at least one side is True; <code>not</code> flips a single value.</p>
<p><strong>Mixing them:</strong> Python evaluates arithmetic and comparison operators first, then <code>not</code>, then <code>and</code>, then <code>or</code>. Evaluation <em>short-circuits</em>: in <code>False and X</code> or <code>True or X</code>, the right side <code>X</code> is never evaluated.</p>`,
        syntax: R`42 == 42          # True
42 != 99          # True
'hello' == 'Hello' # False (case matters)
True and False    # False
True or False     # True
not True          # False
(4 < 5) and (5 < 6)   # True`,
        example: { code: R`age = 20
has_id = True
print(age >= 18)
print(age >= 18 and has_id)
print(not has_id)
print((4 < 5) and (5 < 6))
print((1 == 2) or (2 == 2))
print(2 + 2 == 4 and not 2 + 2 == 5 and 2 * 2 == 2 + 2)
print('hello' == 'Hello', 42 == 42.0, 42 != '42')` },
        demo: { w: 'shell', intro: 'Evaluate Boolean expressions in the shell. Try changing the numbers in the samples.', presets: ['True and False', 'True or False', 'not True', "42 == '42'", '3 < 5 < 9', "'apple' < 'banana'", '(5 > 3) and (2 > 4)', 'False and 1/0', 'True or 1/0', 'True + True'] },
        visual: { html: R`<div class="tt-grid">
<table class="ref tt"><caption>and</caption><thead><tr><th>A</th><th>B</th><th>A and B</th></tr></thead><tbody>
<tr><td>True</td><td>True</td><td class="yes">True</td></tr><tr><td>True</td><td>False</td><td>False</td></tr><tr><td>False</td><td>True</td><td>False</td></tr><tr><td>False</td><td>False</td><td>False</td></tr></tbody></table>
<table class="ref tt"><caption>or</caption><thead><tr><th>A</th><th>B</th><th>A or B</th></tr></thead><tbody>
<tr><td>True</td><td>True</td><td class="yes">True</td></tr><tr><td>True</td><td>False</td><td class="yes">True</td></tr><tr><td>False</td><td>True</td><td class="yes">True</td></tr><tr><td>False</td><td>False</td><td>False</td></tr></tbody></table>
<table class="ref tt"><caption>not</caption><thead><tr><th>A</th><th>not A</th></tr></thead><tbody>
<tr><td>True</td><td>False</td></tr><tr><td>False</td><td class="yes">True</td></tr></tbody></table>
</div>
<p class="muted">Order of evaluation in <code>2 + 2 == 4 and not 2 + 2 == 5</code>: arithmetic (<code>4 == 4 and not 4 == 5</code>) → comparisons (<code>True and not False</code>) → <code>not</code> (<code>True and True</code>) → <code>and</code> (<code>True</code>).</p>` },
        mistakes: [
          { wrong: R`if x = 5:`, right: R`if x == 5:`, why: '= is assignment; a condition needs ==. Python reports a SyntaxError.' },
          { wrong: R`answer == 'yes' or 'y'`, right: R`answer == 'yes' or answer == 'y'`, why: "The right side 'y' is a non-empty string, which is always truthy, so the whole condition is always True." },
          { wrong: R`flag = true`, right: R`flag = True`, why: 'Booleans are capitalised. true raises NameError.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Print whether 17 lies strictly between 10 and 20 using <code>and</code>.', starter: R`n = 17
`, sol: R`n = 17
print(n > 10 and n < 20)`, expect: 'True' },
          { lvl: 'Medium', q: 'A year is a leap year if it is divisible by 4 and not by 100, or divisible by 400. Print the Boolean result for 2024 and then for 1900.', starter: '', sol: R`for y in [2024, 1900]:
    print((y % 4 == 0 and y % 100 != 0) or y % 400 == 0)`, expect: 'True\nFalse' },
          { lvl: 'Hard', q: 'Use short-circuiting so that <code>n / d &gt; 2</code> is never evaluated when <code>d</code> is 0. Print the result for <code>n=10, d=0</code> and then <code>n=10, d=4</code>.', starter: '', sol: R`n, d = 10, 0
print(d != 0 and n / d > 2)
n, d = 10, 4
print(d != 0 and n / d > 2)`, expect: 'False\nTrue' }
        ],
        challenge: { q: 'Access rule: a user may enter if (username is <code>admin</code> and password is <code>vlsi@123</code>) or the user is a guest during visiting hours (<code>9 &lt;= hour &lt; 17</code>). Print the Boolean decision for three test users of your choice.', starter: R`def allowed(user, pwd, is_guest, hour):
    return False   # replace with one Boolean expression

print(allowed('admin', 'vlsi@123', False, 20))
print(allowed('ravi', 'x', True, 10))
print(allowed('ravi', 'x', True, 18))`, sol: R`def allowed(user, pwd, is_guest, hour):
    return (user == 'admin' and pwd == 'vlsi@123') or (is_guest and 9 <= hour < 17)

print(allowed('admin', 'vlsi@123', False, 20))
print(allowed('ravi', 'x', True, 10))
print(allowed('ravi', 'x', True, 18))`, expect: 'True\nTrue\nFalse' },
        summary: ['Flow control chooses which code runs, based on Boolean conditions.', 'True and False are the only Boolean values (capitalised).', '== compares, = assigns.', 'and / or / not combine conditions; not binds tighter than and, which binds tighter than or.', 'and/or short-circuit: the right side may never be evaluated.']
      },
      {
        id: 'm1-5', title: 'Elements of flow control and flow control statements',
        covers: ['Elements of Flow Control', 'Program Execution', 'Flow Control Statements'],
        concept: R`<p>Flow control is built from two <strong>elements</strong>:</p>
<ul><li><strong>Conditions</strong> — expressions that evaluate to <code>True</code> or <code>False</code>.</li>
<li><strong>Blocks</strong> — groups of lines with the same indentation. A block begins when indentation increases, can contain nested blocks, and ends when indentation returns to the earlier level.</li></ul>
<p><strong>Program execution</strong> starts at the top of the file and moves down one instruction at a time. Flow control statements make execution jump, skip or loop.</p>
<p><strong>Statements:</strong></p>
<ul>
<li><code>if</code> / <code>elif</code> / <code>else</code> — run at most one branch: the first whose condition is True (or the <code>else</code> block if none is).</li>
<li><code>while</code> — repeat a block as long as its condition stays True.</li>
<li><code>break</code> — leave the nearest loop immediately. <code>continue</code> — jump back to the loop’s condition check, skipping the rest of the block.</li>
<li><code>for</code> with <code>range()</code> — repeat a block a fixed number of times. <code>range(stop)</code>, <code>range(start, stop)</code> and <code>range(start, stop, step)</code> all exclude <code>stop</code>.</li>
</ul>
<p><strong>Truthy and falsey values:</strong> <code>0</code>, <code>0.0</code> and <code>''</code> behave like <code>False</code> in a condition; all other numbers and non-empty strings behave like <code>True</code>.</p>`,
        syntax: R`if condition:
    ...
elif other_condition:
    ...
else:
    ...

while condition:
    ...          # break leaves, continue restarts

for i in range(start, stop, step):
    ...`,
        example: { code: R`marks = 72
if marks >= 85:
    print('Grade: S')
elif marks >= 70:
    print('Grade: A')
elif marks >= 50:
    print('Grade: B')
else:
    print('Grade: F')

total = 0
for i in range(1, 6):
    total = total + i
print('Sum 1..5 =', total)

count = 0
while True:
    count = count + 1
    if count == 2:
        continue
    if count > 4:
        break
    print('count is', count)
print('range(0, 10, 3):', list(range(0, 10, 3)))` },
        demo: { w: 'flowViz', intro: 'Move the slider and watch which branch of the if / elif / else chain the value takes. Then switch to the loop tab to see for and while run step by step.' },
        visual: { w: 'trace', intro: 'A while loop computing a factorial. Notice how execution returns to the while line after each pass.', code: R`n = 4
factorial = 1
i = 1
while i <= n:
    factorial = factorial * i
    i = i + 1
print(n, '! =', factorial)` },
        mistakes: [
          { wrong: R`if marks > 40
    print('pass')`, right: R`if marks > 40:
    print('pass')`, why: 'Every if, elif, else, while and for line ends with a colon.' },
          { wrong: R`i = 0
while i < 5:
    print(i)`, right: R`i = 0
while i < 5:
    print(i)
    i = i + 1`, why: 'Without changing i, the condition never becomes False: an infinite loop. (This site stops programs after 10 seconds; IDLE needs Ctrl+C.)' },
          { wrong: R`for i in range(1, 5):   # expecting 1..5`, right: R`for i in range(1, 6):`, why: 'range() stops before its stop value.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Print the even numbers from 2 to 10 on one line using <code>range()</code> with a step and <code>print(i, end=\' \')</code>.', starter: '', sol: R`for i in range(2, 11, 2):
    print(i, end=' ')`, expect: '2 4 6 8 10' },
          { lvl: 'Medium', q: 'Use a <code>while</code> loop to find the sum of the digits of 5274.', starter: R`n = 5274
`, sol: R`n = 5274
total = 0
while n > 0:
    total = total + n % 10
    n = n // 10
print(total)`, expect: '18' },
          { lvl: 'Hard', q: 'Find and print the first number between 100 and 200 that is divisible by both 7 and 9. Stop the loop with <code>break</code> as soon as you find it.', starter: '', sol: R`for n in range(100, 201):
    if n % 7 == 0 and n % 9 == 0:
        print(n)
        break`, expect: '126' }
        ],
        challenge: { q: 'FizzBuzz for 1 to 15: print <code>Fizz</code> for multiples of 3, <code>Buzz</code> for multiples of 5, <code>FizzBuzz</code> for multiples of both, otherwise the number.', starter: '', sol: R`for i in range(1, 16):
    if i % 15 == 0:
        print('FizzBuzz')
    elif i % 3 == 0:
        print('Fizz')
    elif i % 5 == 0:
        print('Buzz')
    else:
        print(i)`, expect: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' },
        summary: ['Conditions + blocks are the elements of flow control.', 'Execution runs top to bottom unless a flow control statement redirects it.', 'if/elif/else picks one branch; while repeats while a condition is True.', 'break exits a loop; continue jumps to the next iteration.', 'range(start, stop, step) never includes stop.']
      },
      {
        id: 'm1-6', title: 'Importing modules and ending early with sys.exit()',
        covers: ['Importing Modules', 'Ending a Program Early with sys.exit()'],
        concept: R`<p>Built-in functions such as <code>print()</code> and <code>len()</code> are always available. Everything else in the <strong>standard library</strong> lives in <strong>modules</strong> — Python files grouping related functions — which you load with an <code>import</code> statement: <code>math</code> (mathematics), <code>random</code> (random numbers), <code>sys</code> (the interpreter), <code>os</code> (the operating system).</p>
<ul>
<li><code>import random</code> — then call <code>random.randint(1, 10)</code>.</li>
<li><code>import random, sys, os, math</code> — several modules at once.</li>
<li><code>from random import randint</code> — then call <code>randint()</code> without the prefix.</li>
<li><code>from random import *</code> — imports every name; legal but discouraged because it hides where names come from.</li>
<li><code>import math as m</code> — an alias.</li>
</ul>
<p><strong>Ending early:</strong> a program normally ends after its last line. <code>sys.exit()</code> stops it immediately. Technically it raises the <code>SystemExit</code> exception, which ends the interpreter unless something catches it — in this browser the runner catches it and tells you the program stopped.</p>`,
        syntax: R`import random
import math as m
from math import sqrt
import sys
sys.exit()        # stop the program now`,
        example: { code: R`import random, math, sys
random.seed(7)          # fixed seed -> the same "random" numbers every run
for i in range(3):
    print(random.randint(1, 10))
print(math.sqrt(144), math.pi)

from math import factorial
print(factorial(5))

import math as m
print(m.floor(3.7), m.ceil(3.2))` },
        demo: { w: 'code', intro: 'sys.exit() in a loop. The sample input types hello, python, then exit; the loop never finishes on its own.', code: R`import sys
while True:
    print('Type exit to exit.')
    response = input()
    if response == 'exit':
        sys.exit()
    print('You typed ' + response + '.')
print('This line is never reached.')`, stdin: ['hello', 'python', 'exit'] },
        visual: { html: R`<ol class="steps">
<li><b>Find</b> — Python searches the folders in <code>sys.path</code> (starting with the program’s own folder) for <code>random.py</code>.</li>
<li><b>Run once</b> — the module’s code executes the first time it is imported, creating its functions.</li>
<li><b>Bind a name</b> — <code>import random</code> creates the name <code>random</code> referring to the module object; <code>from random import randint</code> binds only <code>randint</code>.</li>
<li><b>Use</b> — <code>random.randint(1, 6)</code> looks up <code>randint</code> inside the module.</li>
</ol>
<p class="muted">Because the program’s own folder is searched first, naming your file <code>random.py</code> hides the real module.</p>` },
        mistakes: [
          { wrong: R`import random
print(randint(1, 6))`, right: R`import random
print(random.randint(1, 6))`, why: 'After import random, the function is reached through the module name. Bare randint raises NameError.' },
          { wrong: R`# file saved as random.py
import random`, right: R`# file saved as dice_game.py
import random`, why: 'Your file shadows the standard-library module, so random.randint() is not found (AttributeError).' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Import <code>math</code> and print the area of a circle with radius 7, rounded to 2 decimals.', starter: '', sol: R`import math
print(round(math.pi * 7 ** 2, 2))`, expect: '153.94' },
          { lvl: 'Medium', q: 'Use <code>from math import gcd, lcm</code> to print the GCD of 84 and 36 and the LCM of 4 and 6 on one line.', starter: '', sol: R`from math import gcd, lcm
print(gcd(84, 36), lcm(4, 6))`, expect: '12 12' },
          { lvl: 'Hard', q: 'Read numbers with <code>input()</code> and print a running total after each one. If the total goes above 100, print <code>Limit crossed</code> and stop the program with <code>sys.exit()</code>.', starter: R`import sys
total = 0
`, stdin: ['40', '50', '30', '10'], sol: R`import sys
total = 0
while True:
    total = total + int(input())
    print('Total:', total)
    if total > 100:
        print('Limit crossed')
        sys.exit()` }
        ],
        challenge: { q: 'Dice experiment: with <code>random.seed(42)</code>, roll two dice 1000 times. Count how often the sum is 7 and print the count and the percentage. Compare with the theoretical 1/6 ≈ 16.7%.', starter: R`import random
random.seed(42)
`, sol: R`import random
random.seed(42)
sevens = 0
for _ in range(1000):
    if random.randint(1, 6) + random.randint(1, 6) == 7:
        sevens = sevens + 1
print('Sum 7 appeared', sevens, 'times')
print('Percentage:', sevens / 1000 * 100)` },
        summary: ['import loads a standard-library module; call its functions as module.function().', 'from module import name imports a single name; import module as alias renames it.', 'Do not name your files after standard modules.', 'sys.exit() raises SystemExit and ends the program immediately.']
      },
      {
        id: 'm1-7', title: 'Functions, parameters, return values and None',
        covers: ['Functions', 'def Statements with Parameters', 'Return Values and return Statements', 'The None Value', 'Keyword Arguments and print()'],
        concept: R`<p>A <strong>function</strong> is a named mini-program. Defining code once and calling it many times removes duplication, which makes programs shorter and easier to fix.</p>
<ul>
<li>A <code>def</code> statement <strong>defines</strong> a function; its indented body runs only when the function is <strong>called</strong>.</li>
<li><strong>Parameters</strong> are the variables named in the <code>def</code> line; <strong>arguments</strong> are the values passed in a call. Parameters are created when the call starts and forgotten when it returns.</li>
<li>A <strong><code>return</code> statement</strong> ends the call and sends a value back; the call expression evaluates to that <strong>return value</strong>.</li>
<li>A function with no <code>return</code> (or a bare <code>return</code>) returns <strong><code>None</code></strong> — the single value of type <code>NoneType</code>, meaning “no value”. <code>print()</code> itself returns <code>None</code>.</li>
<li><strong>Keyword arguments</strong> are identified by name rather than position. <code>print()</code> has two useful ones: <code>end</code> (what to print after the values, default <code>'\n'</code>) and <code>sep</code> (what to print between values, default <code>' '</code>).</li>
</ul>`,
        syntax: R`def function_name(param1, param2):
    """optional docstring"""
    result = param1 + param2
    return result

value = function_name(3, 4)     # 7
print('a', 'b', sep='-', end='!\n')`,
        example: { code: R`import random

def hello(name):
    print('Hello, ' + name)

def get_answer(answer_number):
    if answer_number == 1:
        return 'It is certain'
    elif answer_number == 2:
        return 'It is decidedly so'
    elif answer_number == 3:
        return 'Yes'
    else:
        return 'Reply hazy, try again'

hello('Alice')
hello('Bob')
print(get_answer(2))
print('Random answer:', get_answer(random.randint(1, 4)))

spam = print('print() returns...')
print(spam is None, spam)

print('Hello', end='')
print('World')
print('cats', 'dogs', 'mice', sep=', ')` },
        demo: { w: 'trace', intro: 'The function visualizer. Each call creates a new frame holding its parameters and local variables; when it returns, the frame disappears and the return value flows back to the caller. Edit the code and press Visualize again.', code: R`def area(width, height):
    result = width * height
    return result

def describe(w, h):
    a = area(w, h)
    return 'Area of ' + str(w) + 'x' + str(h) + ' is ' + str(a)

msg = describe(3, 4)
print(msg)
nothing = print('done')` },
        visual: { html: R`<div class="callflow">
<div class="cf-row"><span class="cf-box cf-global">Global: <code>msg = describe(3, 4)</code></span></div>
<div class="cf-arrow">call ↓ arguments 3, 4 → parameters w, h</div>
<div class="cf-row"><span class="cf-box">describe(w=3, h=4): <code>a = area(w, h)</code></span></div>
<div class="cf-arrow">call ↓ 3, 4 → width, height</div>
<div class="cf-row"><span class="cf-box cf-top">area(width=3, height=4): <code>return result</code> → 12</span></div>
<div class="cf-arrow">↑ returns 12, frame destroyed</div>
<div class="cf-row"><span class="cf-box">describe: <code>return 'Area of 3x4 is 12'</code></span></div>
<div class="cf-arrow">↑ returns the string; msg now refers to it</div>
</div>` },
        mistakes: [
          { wrong: R`def double(n):
    n * 2
print(double(4))`, right: R`def double(n):
    return n * 2
print(double(4))`, why: 'Without return, the function returns None, so this prints None instead of 8.' },
          { wrong: R`greet('Ana')
def greet(name):
    print('Hi', name)`, right: R`def greet(name):
    print('Hi', name)
greet('Ana')`, why: 'A function must be defined (its def must have run) before it is called: NameError.' },
          { wrong: R`print(sep='-', 'a', 'b')`, right: R`print('a', 'b', sep='-')`, why: 'Keyword arguments must come after positional arguments: SyntaxError.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Write <code>square(n)</code> that returns n squared, then print <code>square(9)</code>.', starter: '', sol: R`def square(n):
    return n * n
print(square(9))`, expect: '81' },
          { lvl: 'Medium', q: 'Write <code>grade(m)</code> returning <code>S</code> (≥85), <code>A</code> (≥70), <code>B</code> (≥50) or <code>F</code>. Print the grades for 92, 74 and 40 in one <code>print()</code> call using <code>sep=\'-\'</code>.', starter: '', sol: R`def grade(m):
    if m >= 85:
        return 'S'
    elif m >= 70:
        return 'A'
    elif m >= 50:
        return 'B'
    return 'F'
print(grade(92), grade(74), grade(40), sep='-')`, expect: 'S-A-F' },
          { lvl: 'Hard', q: 'The Collatz step: <code>collatz(number)</code> returns <code>number // 2</code> if number is even, otherwise <code>3 * number + 1</code>. Starting from 6, keep calling it and printing each result until the value becomes 1.', starter: '', sol: R`def collatz(number):
    if number % 2 == 0:
        return number // 2
    return 3 * number + 1

n = 6
while n != 1:
    n = collatz(n)
    print(n)`, expect: '3\n10\n5\n16\n8\n4\n2\n1' }
        ],
        challenge: { q: 'Write <code>make_line(char=\'-\', width=10)</code> with <em>default</em> parameter values that returns a line of characters. Print <code>make_line()</code>, <code>make_line(\'*\', 5)</code> and <code>make_line(width=3, char=\'#\')</code> on separate lines using one <code>print()</code> call with <code>sep=\'\\n\'</code>.', starter: '', sol: R`def make_line(char='-', width=10):
    return char * width

print(make_line(), make_line('*', 5), make_line(width=3, char='#'), sep='\n')`, expect: '----------\n*****\n###' },
        summary: ['def defines a function; its body runs only when called.', 'Arguments are passed into parameters; parameters are local to the call.', 'return sends a value back and ends the call.', 'No return → the function returns None.', 'print() accepts keyword arguments end and sep.']
      },
      {
        id: 'm1-8', title: 'Local and global scope',
        covers: ['Local and Global Scope', 'The global Statement'],
        concept: R`<p>Variables assigned inside a function live in that call’s <strong>local scope</strong>; variables assigned outside all functions live in the <strong>global scope</strong>. A local scope is created when a function is called and destroyed when it returns.</p>
<p>Four rules:</p>
<ol><li>Code in the global scope cannot use local variables.</li>
<li>A local scope can <em>read</em> global variables.</li>
<li>Code in one function’s local scope cannot use another function’s local variables.</li>
<li>A local and a global variable may share a name — they are still different variables.</li></ol>
<p>How Python decides whether a name inside a function is local or global:</p>
<ul><li>If there is a <strong><code>global</code> statement</strong> for it in the function → global.</li>
<li>Otherwise, if it is <strong>assigned anywhere</strong> in the function → local (for the whole function).</li>
<li>Otherwise → global.</li></ul>
<p>The second rule explains <code>UnboundLocalError</code>: if a function both reads and assigns a name, the name is local everywhere in that function, so reading it before the assignment fails. Prefer parameters and return values over <code>global</code>; globals make it hard to know which function changed a value.</p>`,
        syntax: R`counter = 0          # global

def increment():
    global counter   # refer to the global variable
    counter = counter + 1`,
        example: { code: R`def spam():
    eggs = 'spam local'
    print(eggs)

def bacon():
    eggs = 'bacon local'
    print(eggs)
    spam()
    print(eggs)

eggs = 'global'
bacon()
print(eggs)` },
        demo: { w: 'pair', intro: 'Side by side: assigning to a global name inside a function without, and with, the global statement.', left: { title: 'Without global', code: R`counter = 0

def increment():
    counter = counter + 1   # assignment makes counter local

try:
    increment()
except UnboundLocalError as e:
    print('UnboundLocalError:', e)
print('counter =', counter)` }, right: { title: 'With global', code: R`counter = 0

def increment():
    global counter
    counter = counter + 1

increment()
increment()
print('counter =', counter)` } },
        visual: { w: 'trace', intro: 'Three variables named eggs exist at once: one global and one in each active function frame.', code: R`def spam():
    eggs = 'spam local'
    print(eggs)

def bacon():
    eggs = 'bacon local'
    spam()
    print(eggs)

eggs = 'global'
bacon()
print(eggs)` },
        mistakes: [
          { wrong: R`total = 0
def add(x):
    total = total + x`, right: R`def add(total, x):
    return total + x
total = add(0, 5)`, why: 'Reading and assigning total in the same function raises UnboundLocalError. Passing values in and returning results avoids globals altogether.' },
          { wrong: R`def make():
    result = 42
make()
print(result)`, right: R`def make():
    return 42
result = make()
print(result)`, why: 'Local variables vanish when the call returns: NameError.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Predict, then run: does the function change the global <code>x</code>?', starter: R`x = 5
def f():
    x = 10
f()
print(x)`, sol: R`# The assignment inside f() creates a separate local x.
x = 5
def f():
    x = 10
f()
print(x)`, expect: '5' },
          { lvl: 'Medium', q: 'Using the <code>global</code> statement, write <code>add_bonus()</code> that increases a global <code>salary</code> (starting at 20000) by 1000. Call it twice and print the salary.', starter: R`salary = 20000
`, sol: R`salary = 20000
def add_bonus():
    global salary
    salary = salary + 1000
add_bonus()
add_bonus()
print(salary)`, expect: '22000' },
          { lvl: 'Hard', q: 'Rewrite the previous task <em>without</em> <code>global</code>: <code>add_bonus(s)</code> returns the new salary.', starter: R`salary = 20000
`, sol: R`def add_bonus(s):
    return s + 1000
salary = 20000
salary = add_bonus(salary)
salary = add_bonus(salary)
print(salary)`, expect: '22000' }
        ],
        challenge: { q: 'Write a function <code>log(msg)</code> that prints numbered messages (<code>1: start</code>, <code>2: load</code>, …) by keeping the count in a global variable. Then explain in a comment one risk of this design.', starter: '', sol: R`count = 0
def log(msg):
    global count
    count = count + 1
    print(str(count) + ': ' + msg)

log('start')
log('load')
log('done')
# Risk: any function can change count, so a bug elsewhere could reset or skip numbers.`, expect: '1: start\n2: load\n3: done' },
        summary: ['Each call gets a fresh local scope that disappears on return.', 'Globals can be read inside functions; assigning makes the name local unless declared global.', 'UnboundLocalError = a local name read before it is assigned.', 'Prefer parameters and return values to global variables.']
      },
      {
        id: 'm1-9', title: 'Exception handling',
        covers: ['Exception Handling'],
        concept: R`<p>An error while a program runs raises an <strong>exception</strong>. If nothing handles it, the program crashes with a <strong>traceback</strong> that names the exception type, the message and the line where it happened.</p>
<p>A <strong><code>try</code>/<code>except</code></strong> statement handles exceptions: code that might fail goes in the <code>try</code> block; if an exception of the named type occurs, execution jumps to the matching <code>except</code> block and then continues after the whole statement.</p>
<p>Placement matters. Once an exception jumps to <code>except</code>, the rest of the <code>try</code> block is skipped — so a <code>try</code> wrapped around an entire loop stops the loop at the first error, while a <code>try</code> inside the loop handles each item separately.</p>
<p>Common exception types: <code>ZeroDivisionError</code>, <code>ValueError</code> (e.g. <code>int('abc')</code>), <code>TypeError</code>, <code>NameError</code>, <code>IndexError</code>, <code>KeyError</code>, <code>FileNotFoundError</code>.</p>
<p class="callout">Beyond the textbook chapter: <code>else</code> runs when no exception occurred, <code>finally</code> always runs, and <code>raise</code> raises an exception yourself. All are standard Python.</p>`,
        syntax: R`try:
    risky_code()
except ValueError:
    handle_bad_value()
except ZeroDivisionError as e:
    print('Problem:', e)
else:
    print('no exception')     # optional
finally:
    print('always runs')      # optional`,
        example: { code: R`def spam(divide_by):
    try:
        return 42 / divide_by
    except ZeroDivisionError:
        print('Error: Invalid argument.')

print(spam(2))
print(spam(12))
print(spam(0))
print(spam(1))` },
        demo: { w: 'errorLab', intro: 'Each button runs a deliberately broken program in real Python. Read the traceback, then read how to fix or handle it.', items: [
          { label: 'Divide by zero', code: R`print(10 / 0)`, explain: 'ZeroDivisionError. Check the divisor first, or catch ZeroDivisionError.' },
          { label: 'Bad number', code: R`age = int('twenty')`, explain: 'ValueError: int() cannot parse that text. Wrap the conversion in try/except ValueError and ask again.' },
          { label: 'Mixing types', code: R`print('Total: ' + 42)`, explain: 'TypeError: convert with str(42), or use print("Total:", 42).' },
          { label: 'Misspelt name', code: R`count = 3
print(cuont)`, explain: 'NameError: the name was never assigned. Usually a typo.' },
          { label: 'Handled properly', code: R`for text in ['8', 'abc', '0', '4']:
    try:
        print(100 / int(text))
    except ValueError:
        print(repr(text), 'is not a number')
    except ZeroDivisionError:
        print('cannot divide by zero')`, explain: 'With try/except inside the loop, every item is handled and the loop keeps going.' }
        ] },
        visual: { w: 'trace', intro: 'Watch execution jump from the failing line straight to the matching except block.', code: R`values = ['10', 'abc', '0', '5']
for v in values:
    try:
        n = int(v)
        print(100 / n)
    except ValueError:
        print(v, 'is not a number')
    except ZeroDivisionError:
        print('cannot divide by zero')` },
        mistakes: [
          { wrong: R`try:
    for x in data:
        print(10 / x)
except ZeroDivisionError:
    print('error')`, right: R`for x in data:
    try:
        print(10 / x)
    except ZeroDivisionError:
        print('error')`, why: 'With the try around the loop, the first error ends the whole loop.' },
          { wrong: R`try:
    value = int(text)
except:
    pass`, right: R`try:
    value = int(text)
except ValueError:
    value = 0`, why: 'A bare except silently swallows every error, including typos and real bugs. Catch the specific exception you expect.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Convert the string <code>\'12a\'</code> to an integer; if that fails, print <code>Invalid number</code>.', starter: R`text = '12a'
`, sol: R`text = '12a'
try:
    print(int(text))
except ValueError:
    print('Invalid number')`, expect: 'Invalid number' },
          { lvl: 'Medium', q: 'Write <code>safe_div(a, b)</code> that returns <code>a / b</code>, or <code>None</code> when b is 0. Print <code>safe_div(10, 4)</code> and <code>safe_div(1, 0)</code> on one line.', starter: '', sol: R`def safe_div(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None
print(safe_div(10, 4), safe_div(1, 0))`, expect: '2.5 None' },
          { lvl: 'Hard', q: 'Keep asking for an age until the user types a valid non-negative integer, printing a helpful message for each bad entry, then print <code>Age accepted: 21</code>.', starter: '', stdin: ['twenty', '-5', '21'], sol: R`while True:
    try:
        age = int(input('Age: '))
    except ValueError:
        print('Please type digits only.')
        continue
    if age < 0:
        print('Age cannot be negative.')
        continue
    break
print('Age accepted: ' + str(age))` }
        ],
        challenge: { q: 'Compute the average of the valid numbers in <code>[\'4\', \'x\', \'6\', \'8\', \'\']</code>, skipping anything that cannot be converted. Print the average.', starter: R`data = ['4', 'x', '6', '8', '']
`, sol: R`data = ['4', 'x', '6', '8', '']
total = 0
count = 0
for item in data:
    try:
        total = total + int(item)
        count = count + 1
    except ValueError:
        pass
print(total / count)`, expect: '6.0' },
        summary: ['An unhandled exception crashes the program with a traceback.', 'try/except catches named exception types and continues afterwards.', 'The rest of the try block is skipped once an exception occurs.', 'Catch specific exceptions; avoid bare except.']
      },
      {
        id: 'm1-10', title: 'A short program: Guess the Number',
        covers: ['A Short Program: Guess the Number'],
        concept: R`<p>This program combines almost everything in Module 1. The computer picks a secret number from 1 to 20; the player has six guesses and is told whether each one is too high or too low.</p>
<ul>
<li><code>import random</code> and <code>random.randint(1, 20)</code> pick the secret number.</li>
<li>A <code>for</code> loop with <code>range(1, 7)</code> allows at most six guesses; the loop variable counts the guesses taken.</li>
<li><code>int(input())</code> reads a guess as an integer.</li>
<li>An <code>if</code>/<code>elif</code>/<code>else</code> chain compares the guess with the secret; a correct guess leaves the loop early with <code>break</code>.</li>
<li>After the loop, one more <code>if</code> decides whether the player won and builds the message with <code>str()</code> and concatenation.</li>
</ul>`,
        syntax: R`for guesses_taken in range(1, 7):
    guess = int(input())
    if guess < secret:
        ...
    elif guess > secret:
        ...
    else:
        break`,
        example: { code: R`# Guess the number
import random

secret = random.randint(1, 20)
print('I am thinking of a number between 1 and 20.')

for guesses_taken in range(1, 7):      # at most six guesses
    print('Take a guess.')
    guess = int(input())
    if guess < secret:
        print('Your guess is too low.')
    elif guess > secret:
        print('Your guess is too high.')
    else:
        break                           # correct guess

if guess == secret:
    print('Good job! You guessed my number in ' + str(guesses_taken) + ' guesses!')
else:
    print('Nope. The number I was thinking of was ' + str(secret))`, stdin: ['10', '5', '15', '8', '12', '3'], note: 'The sample input guesses six fixed numbers, so the result depends on the random secret. Clear the sample by using the playground to play with your own guesses.' },
        demo: { w: 'guess', intro: 'A fully playable version. The game keeps the same rules: 1–20, six attempts, a hint after every guess.' },
        visual: { w: 'trace', intro: 'Trace a game with a fixed secret (random.seed makes it repeatable). Watch guesses_taken and the branch taken each round.', code: R`import random
random.seed(3)
secret = random.randint(1, 20)
for guesses_taken in range(1, 7):
    guess = int(input())
    if guess < secret:
        print('Too low')
    elif guess > secret:
        print('Too high')
    else:
        break
print('Secret was', secret, '- guesses:', guesses_taken)`, stdin: ['10', '15', '13', '12', '11', '14'] },
        mistakes: [
          { wrong: R`guess = input()
if guess < secret:`, right: R`guess = int(input())
if guess < secret:`, why: "Comparing a str with an int raises TypeError: '<' not supported between instances of 'str' and 'int'." },
          { wrong: R`for guesses_taken in range(6):`, right: R`for guesses_taken in range(1, 7):`, why: 'range(6) counts 0–5, so the final message would report one guess fewer than the player actually took.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Change the game to use numbers from 1 to 50 and allow 7 guesses. Update every message to match.', starter: '', stdin: ['25', '12', '37', '6', '18', '43', '30'], sol: R`import random
secret = random.randint(1, 50)
print('I am thinking of a number between 1 and 50.')
for guesses_taken in range(1, 8):
    guess = int(input('Take a guess: '))
    if guess < secret:
        print('Too low.')
    elif guess > secret:
        print('Too high.')
    else:
        break
if guess == secret:
    print('Got it in ' + str(guesses_taken) + ' guesses!')
else:
    print('The number was ' + str(secret))` },
          { lvl: 'Medium', q: 'Make the game robust: if the player types something that is not a number, print a warning and do not count it as a guess.', starter: '', stdin: ['ten', '10', '5', '15', '8', '12', '3'], sol: R`import random
secret = random.randint(1, 20)
guesses_taken = 0
guess = None
while guesses_taken < 6:
    text = input('Guess: ')
    try:
        guess = int(text)
    except ValueError:
        print('Numbers only, please.')
        continue
    guesses_taken = guesses_taken + 1
    if guess < secret:
        print('Too low.')
    elif guess > secret:
        print('Too high.')
    else:
        break
print('You win!' if guess == secret else 'The number was ' + str(secret))` },
          { lvl: 'Hard', q: 'Reverse the roles: with <code>secret = 37</code> and range 1–100, let the computer guess using binary search (always guess the middle of the remaining range). Print each guess and the number of guesses.', starter: R`secret = 37
low, high = 1, 100
`, sol: R`secret = 37
low, high = 1, 100
count = 0
while True:
    guess = (low + high) // 2
    count = count + 1
    print('Guess', guess)
    if guess < secret:
        low = guess + 1
    elif guess > secret:
        high = guess - 1
    else:
        break
print('Found', secret, 'in', count, 'guesses')`, expect: 'Guess 50\nGuess 25\nGuess 37\nFound 37 in 3 guesses' }
        ],
        challenge: { q: 'Prove that binary search always finds a number from 1 to 100 within 7 guesses: run the computer-guesser for every secret from 1 to 100 and print the largest number of guesses needed.', starter: '', sol: R`def guesses_needed(secret):
    low, high, count = 1, 100, 0
    while True:
        guess = (low + high) // 2
        count += 1
        if guess < secret:
            low = guess + 1
        elif guess > secret:
            high = guess - 1
        else:
            return count

worst = 0
for s in range(1, 101):
    worst = max(worst, guesses_needed(s))
print('Worst case:', worst)`, expect: 'Worst case: 7' },
        summary: ['randint picks the secret; a for loop limits the number of guesses.', 'int(input()) converts each guess so it can be compared.', 'break ends the loop early on a correct guess.', 'The final if uses the loop variable to report the number of guesses.']
      }
    ]
  });
})();
