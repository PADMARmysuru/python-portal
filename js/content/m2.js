(function () {
  'use strict';
  const R = String.raw;
  window.PP.addModule({
    n: 2, title: 'Data Structures', co: 2,
    blurb: 'Lists, strings, tuples and dictionaries — and how to combine them to model real-world things.',
    lessons: [
      {
        id: 'm2-1', title: 'The list data type: creating, indexing and slicing',
        covers: ['Lists: The List Data Type'],
        concept: R`<p>A <strong>list</strong> is a value that contains multiple values in an ordered sequence: <code>['cat', 'bat', 'rat']</code>. The values inside are called <strong>items</strong>; they can be of any type, including other lists. <code>[]</code> is the empty list.</p>
<ul>
<li><strong>Indexing</strong> — <code>spam[0]</code> is the first item, <code>spam[1]</code> the second. A <strong>negative index</strong> counts from the end: <code>spam[-1]</code> is the last item. An index past the end raises <code>IndexError</code>.</li>
<li><strong>Nested lists</strong> — <code>grid[1][0]</code> takes item 1 of <code>grid</code>, then item 0 of that inner list.</li>
<li><strong>Slicing</strong> — <code>spam[start:stop]</code> returns a <em>new list</em> from <code>start</code> up to but not including <code>stop</code>. Omit <code>start</code> to begin at 0, omit <code>stop</code> to go to the end. A third value is the step: <code>spam[::2]</code>, <code>spam[::-1]</code>.</li>
<li><strong>Modifying</strong> — lists are <strong>mutable</strong>: <code>spam[1] = 'aardvark'</code> replaces an item; <code>del spam[2]</code> removes one.</li>
<li><strong>len()</strong> gives the number of items; <code>+</code> joins lists and <code>*</code> repeats a list.</li>
</ul>`,
        syntax: R`spam = ['cat', 'bat', 'rat', 'elephant']
spam[0]        # 'cat'
spam[-1]       # 'elephant'
spam[1:3]      # ['bat', 'rat']
spam[:2]       # ['cat', 'bat']
spam[::-1]     # reversed copy
spam[1] = 'aardvark'
del spam[2]
len(spam)      # 3`,
        example: { code: R`spam = ['cat', 'bat', 'rat', 'elephant']
print(spam[0], spam[3], spam[-1])
print('The ' + spam[1] + ' ate the ' + spam[0] + '.')
grid = [['cat', 'bat'], [10, 20, 30]]
print(grid[1][2])
print(spam[1:3], spam[:2], spam[2:])
spam[1] = 'aardvark'
del spam[2]
print(spam, len(spam))
print([1, 2] + ['A', 'B'], ['X'] * 3)
try:
    print(spam[10])
except IndexError as e:
    print('IndexError:', e)` },
        demo: { w: 'listViz', intro: 'Every operation below runs as real Python on the list. Watch the cells, their positive and negative indices, and the exact statement executed.' },
        visual: { w: 'trace', intro: 'A slice creates a new list object; assigning to an index changes the existing one.', code: R`colours = ['red', 'green', 'blue', 'cyan']
first_two = colours[:2]
colours[1] = 'lime'
del colours[-1]
print(colours, first_two)` },
        mistakes: [
          { wrong: R`spam = ['a', 'b', 'c']
print(spam[3])`, right: R`print(spam[2])     # or spam[-1]`, why: 'Indices start at 0, so a 3-item list has indices 0, 1, 2. spam[3] raises IndexError.' },
          { wrong: R`spam[1.0]`, right: R`spam[1]    # or spam[int(x)]`, why: 'Indices must be integers: TypeError: list indices must be integers or slices, not float.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Given <code>days = [\'Mon\', \'Tue\', \'Wed\', \'Thu\', \'Fri\']</code>, print the first and last day using a positive and a negative index.', starter: R`days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
`, sol: R`days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
print(days[0], days[-1])`, expect: 'Mon Fri' },
          { lvl: 'Medium', q: 'Using slices only, print the middle three days, then every second day, then the list reversed.', starter: R`days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
`, sol: R`days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
print(days[1:4])
print(days[::2])
print(days[::-1])`, expect: "['Tue', 'Wed', 'Thu']\n['Mon', 'Wed', 'Fri']\n['Fri', 'Thu', 'Wed', 'Tue', 'Mon']" },
          { lvl: 'Hard', q: 'A 3×3 matrix is stored as <code>m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]</code>. Print the main diagonal as a list, then replace the centre with 0 and print the matrix.', starter: R`m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
`, sol: R`m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print([m[0][0], m[1][1], m[2][2]])
m[1][1] = 0
print(m)`, expect: '[1, 5, 9]\n[[1, 2, 3], [4, 0, 6], [7, 8, 9]]' }
        ],
        challenge: { q: 'Rotate a list left by k positions using slicing only. For <code>[10, 20, 30, 40, 50]</code> and <code>k = 2</code> the result is <code>[30, 40, 50, 10, 20]</code>. Make it work for any k, including k larger than the length.', starter: R`data = [10, 20, 30, 40, 50]
k = 2
`, sol: R`data = [10, 20, 30, 40, 50]
k = 2
k = k % len(data)
print(data[k:] + data[:k])`, expect: '[30, 40, 50, 10, 20]' },
        summary: ['A list holds an ordered sequence of items: [a, b, c].', 'Index from 0; negative indices count from the end.', 'A slice spam[i:j] makes a new list and excludes j.', 'Lists are mutable: assign to an index or use del.', 'len(), + and * work on lists.']
      },
      {
        id: 'm2-2', title: 'Working with lists: loops, operators and methods',
        covers: ['Working with Lists'],
        concept: R`<p>Storing related values in one list (instead of <code>cat1</code>, <code>cat2</code>, …) lets loops process them however many there are.</p>
<ul>
<li><code>for item in spam:</code> visits each item; <code>for i in range(len(spam)):</code> gives each index when you need it. <code>enumerate()</code> gives both.</li>
<li><code>in</code> / <code>not in</code> test membership: <code>'howdy' in ['hello', 'hi', 'howdy']</code> → <code>True</code>.</li>
<li><strong>Multiple assignment</strong>: <code>size, colour, mood = cat</code> unpacks a list into variables (the counts must match).</li>
<li><strong>Augmented assignment</strong>: <code>spam += 1</code> means <code>spam = spam + 1</code>; also <code>-=</code>, <code>*=</code>, <code>/=</code>, <code>%=</code>.</li>
</ul>
<p><strong>Methods</strong> are functions called on a value with a dot:</p>
<table class="ref"><tbody>
<tr><td><code>index(v)</code></td><td>position of the first <code>v</code> (ValueError if absent)</td></tr>
<tr><td><code>append(v)</code></td><td>add <code>v</code> at the end</td></tr>
<tr><td><code>insert(i, v)</code></td><td>add <code>v</code> at position <code>i</code></td></tr>
<tr><td><code>remove(v)</code></td><td>delete the first <code>v</code> (ValueError if absent)</td></tr>
<tr><td><code>pop(i)</code></td><td>remove and return item <code>i</code> (last item if no argument)</td></tr>
<tr><td><code>sort()</code></td><td>sort in place; <code>reverse=True</code>, <code>key=str.lower</code> for case-insensitive</td></tr>
<tr><td><code>reverse()</code>, <code>count(v)</code>, <code>extend(lst)</code></td><td>reverse in place; count occurrences; append many</td></tr>
</tbody></table>
<p>These methods change the list <strong>in place</strong> and return <code>None</code>, so never write <code>spam = spam.sort()</code>. <code>sort()</code> cannot compare mixed types such as numbers and strings, and sorts uppercase before lowercase (ASCII order) unless you pass <code>key=str.lower</code>.</p>`,
        syntax: R`for i, name in enumerate(names):
    print(i, name)
'x' in spam
a, b, c = [1, 2, 3]
spam += [4]
spam.append('moose')
spam.insert(1, 'chicken')
spam.remove('bat')
last = spam.pop()
spam.sort(key=str.lower)`,
        example: { code: R`supplies = ['pens', 'staplers', 'flamethrowers', 'binders']
for i in range(len(supplies)):
    print('Index ' + str(i) + ' in supplies is: ' + supplies[i])

print('binders' in supplies, 'tape' not in supplies)

cat = ['fat', 'gray', 'loud']
size, colour, disposition = cat
print(size, colour, disposition)

score = 10
score += 5
score *= 2
print(score)

spam = ['cat', 'dog', 'bat']
spam.append('moose')
spam.insert(1, 'chicken')
spam.remove('bat')
print(spam, spam.index('dog'))
popped = spam.pop()
print(popped, spam)
names = ['bob', 'Carol', 'alice', 'Dave']
names.sort()
print(names)
names.sort(key=str.lower)
print(names)
print(spam.sort())   # sort() returns None` },
        demo: { w: 'listViz', intro: 'Try append, insert, remove, pop, sort and reverse. Invalid operations (removing a missing value, popping an empty list) show the real Python error.', methods: true },
        visual: { w: 'trace', intro: 'A for loop over a list. The loop variable takes each item in turn while the total accumulates.', code: R`marks = [78, 92, 65, 88]
total = 0
for m in marks:
    total += m
average = total / len(marks)
marks.sort(reverse=True)
print(marks, average)` },
        mistakes: [
          { wrong: R`spam = spam.sort()`, right: R`spam.sort()`, why: 'sort() changes the list in place and returns None, so spam becomes None.' },
          { wrong: R`[3, 'a', 1].sort()`, right: R`[3, 2, 1].sort()`, why: "TypeError: '<' not supported between instances of 'str' and 'int'." },
          { wrong: R`for item in data:
    if item < 0:
        data.remove(item)`, right: R`data = [item for item in data if item >= 0]`, why: 'Removing from a list while looping over it skips items. Build a new list instead.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Print each fruit with its position, in the form <code>1. apple</code>, using <code>enumerate()</code> starting from 1.', starter: R`fruits = ['apple', 'mango', 'guava']
`, sol: R`fruits = ['apple', 'mango', 'guava']
for i, f in enumerate(fruits, start=1):
    print(str(i) + '. ' + f)`, expect: '1. apple\n2. mango\n3. guava' },
          { lvl: 'Medium', q: 'Starting from an empty list, append 5, 3, 9 and 1; insert 7 at index 1; remove 9; then print the list sorted in descending order.', starter: R`nums = []
`, sol: R`nums = []
for n in [5, 3, 9, 1]:
    nums.append(n)
nums.insert(1, 7)
nums.remove(9)
nums.sort(reverse=True)
print(nums)`, expect: '[7, 5, 3, 1]' },
          { lvl: 'Hard', q: 'Write <code>comma_code(items)</code> that returns a string with all items separated by commas and a space, with <code>and</code> before the last item: <code>[\'apples\', \'bananas\', \'tofu\', \'cats\']</code> → <code>apples, bananas, tofu, and cats</code>. Handle an empty list and a one-item list.', starter: '', sol: R`def comma_code(items):
    if not items:
        return ''
    if len(items) == 1:
        return str(items[0])
    return ', '.join(str(x) for x in items[:-1]) + ', and ' + str(items[-1])

print(comma_code(['apples', 'bananas', 'tofu', 'cats']))
print(comma_code(['solo']))
print(repr(comma_code([])))`, expect: "apples, bananas, tofu, and cats\nsolo\n''" }
        ],
        challenge: { q: 'Marks analysis: for <code>marks = [45, 88, 67, 92, 38, 74, 88]</code>, print the highest, the lowest, the average rounded to 1 decimal, how many students scored 88, and the marks of the students who passed (≥ 40) in ascending order.', starter: R`marks = [45, 88, 67, 92, 38, 74, 88]
`, sol: R`marks = [45, 88, 67, 92, 38, 74, 88]
print(max(marks), min(marks))
print(round(sum(marks) / len(marks), 1))
print(marks.count(88))
passed = []
for m in marks:
    if m >= 40:
        passed.append(m)
passed.sort()
print(passed)`, expect: '92 38\n70.3\n2\n[45, 67, 74, 88, 88, 92]' },
        summary: ['Use for loops (and enumerate) to process every item.', 'in / not in test membership.', 'Multiple assignment unpacks a list into variables.', 'append, insert, remove, pop, sort, reverse change the list in place.', 'In-place methods return None — do not assign their result.']
      },
      {
        id: 'm2-3', title: 'Manipulating strings: literals, indexing and traversal',
        covers: ['Strings: Manipulating Strings', 'Manipulating Strings (listed again at the end of Module 2)'],
        concept: R`<p>Strings can be written several ways:</p>
<ul>
<li>Single or double quotes: <code>'That is Alice\'s cat.'</code> or <code>"That is Alice's cat."</code></li>
<li><strong>Escape characters</strong> start with a backslash: <code>\'</code>, <code>\"</code>, <code>\t</code> (tab), <code>\n</code> (newline), <code>\\</code> (a backslash).</li>
<li><strong>Raw strings</strong> <code>r'C:\new\table'</code> ignore escapes — very useful for Windows paths and regular expressions (Module 3).</li>
<li><strong>Triple quotes</strong> <code>'''...'''</code> or <code>"""..."""</code> span several lines and are used for docstrings and multiline comments.</li>
</ul>
<p>A string is a <strong>sequence of characters</strong>, so it supports the same indexing and slicing as lists: <code>s[0]</code>, <code>s[-1]</code>, <code>s[0:5]</code>, <code>s[::-1]</code>. <code>in</code> and <code>not in</code> test for substrings. <strong>Traversal</strong> means visiting each character, usually with <code>for ch in s:</code>.</p>
<p>Unlike lists, strings are <strong>immutable</strong>: <code>s[0] = 'J'</code> raises <code>TypeError</code>. Every “change” creates a new string, e.g. <code>s = 'J' + s[1:]</code>.</p>`,
        syntax: R`s = 'Hello, world!'
s[0]          # 'H'
s[-1]         # '!'
s[0:5]        # 'Hello'
s[7:]         # 'world!'
'world' in s  # True
for ch in s:  # traversal
    ...
r'C:\temp\new'   # raw string`,
        example: { code: R`print('Hello there!\nHow are you?\nI\'m doing fine.')
print('Name:\tAlice')
print(r'That is Carol\'s cat.')
print(r'C:\new\table')
print('''Dear Alice,
Eve's cat has been arrested.
Sincerely, Bob''')

spam = 'Hello, world!'
print(spam[0], spam[4], spam[-1])
print(spam[0:5], spam[7:], spam[::-1])
print('Hello' in spam, 'cats' not in spam)

vowels = 0
for ch in spam.lower():
    if ch in 'aeiou':
        vowels += 1
print('Vowels:', vowels)

name = 'Python'
name = 'J' + name[1:]     # strings are immutable: build a new one
print(name)` },
        demo: { w: 'strViz', intro: 'Type any text. The cells show each character with both indices; type a slice to highlight the characters it selects. All results come from Python.' },
        visual: { w: 'trace', intro: 'Traversal: the loop variable takes one character at a time while a new reversed string is built.', code: R`word = 'level'
reversed_word = ''
for ch in word:
    reversed_word = ch + reversed_word
print(reversed_word, word == reversed_word)` },
        mistakes: [
          { wrong: R`s = 'cat'
s[0] = 'b'`, right: R`s = 'cat'
s = 'b' + s[1:]`, why: "TypeError: 'str' object does not support item assignment — strings are immutable." },
          { wrong: R`path = 'C:\new\table'`, right: R`path = r'C:\new\table'`, why: '\n and \t are escape sequences, so the path contains a newline and a tab. Use a raw string.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Print the first 3 and the last 3 characters of <code>\'Bengaluru\'</code> on one line.', starter: R`city = 'Bengaluru'
`, sol: R`city = 'Bengaluru'
print(city[:3], city[-3:])`, expect: 'Ben uru' },
          { lvl: 'Medium', q: 'Count the uppercase letters, digits and spaces in <code>\'VLSI Lab 2025 Room B12\'</code> by traversing the string.', starter: R`text = 'VLSI Lab 2025 Room B12'
`, sol: R`text = 'VLSI Lab 2025 Room B12'
upper = digits = spaces = 0
for ch in text:
    if 'A' <= ch <= 'Z':
        upper += 1
    elif '0' <= ch <= '9':
        digits += 1
    elif ch == ' ':
        spaces += 1
print(upper, digits, spaces)`, expect: '7 6 4' },
          { lvl: 'Hard', q: 'Write <code>is_palindrome(s)</code> that ignores case and every non-letter character. Test it on <code>\'Madam, I\'m Adam\'</code> and <code>\'Python\'</code>.', starter: '', sol: R`def is_palindrome(s):
    letters = ''
    for ch in s.lower():
        if 'a' <= ch <= 'z':
            letters += ch
    return letters == letters[::-1]

print(is_palindrome("Madam, I'm Adam"))
print(is_palindrome('Python'))`, expect: 'True\nFalse' }
        ],
        challenge: { q: 'Caesar cipher: shift every lowercase letter of <code>\'attack at dawn\'</code> 3 places forward (z wraps to c) and leave other characters unchanged. Use <code>ord()</code> and <code>chr()</code>.', starter: R`msg = 'attack at dawn'
`, sol: R`msg = 'attack at dawn'
out = ''
for ch in msg:
    if 'a' <= ch <= 'z':
        out += chr((ord(ch) - ord('a') + 3) % 26 + ord('a'))
    else:
        out += ch
print(out)`, expect: 'dwwdfn dw gdzq' },
        summary: ['Quotes, escapes (\\n, \\t, \\\'), raw strings and triple quotes create strings.', 'Strings index and slice like lists.', 'in / not in test substrings; for ch in s traverses characters.', 'Strings are immutable — build new strings instead.']
      },
      {
        id: 'm2-4', title: 'Useful string methods and transformations',
        covers: ['Useful String Methods', 'Working with Strings', 'Manipulating Strings (listed again at the end of Module 2)'],
        concept: R`<p>String methods return <em>new</em> strings (or Booleans, lists, numbers) — the original never changes.</p>
<table class="ref"><tbody>
<tr><td><code>upper()</code>, <code>lower()</code></td><td>convert case; handy for case-insensitive comparison</td></tr>
<tr><td><code>isupper()</code>, <code>islower()</code></td><td>True if there is at least one letter and all letters are that case</td></tr>
<tr><td><code>isalpha()</code>, <code>isalnum()</code>, <code>isdecimal()</code>, <code>isspace()</code>, <code>istitle()</code></td><td>the “isX” validators: letters only; letters/digits; digits; whitespace; title case</td></tr>
<tr><td><code>startswith(s)</code>, <code>endswith(s)</code></td><td>test the beginning or end</td></tr>
<tr><td><code>' '.join(list)</code></td><td>joins a list of strings with the separator it is called on</td></tr>
<tr><td><code>split(sep)</code></td><td>splits into a list; default splits on any whitespace</td></tr>
<tr><td><code>rjust(n)</code>, <code>ljust(n)</code>, <code>center(n, ch)</code></td><td>pad to width n for aligned tables</td></tr>
<tr><td><code>strip()</code>, <code>lstrip()</code>, <code>rstrip()</code></td><td>remove whitespace (or given characters) from the ends</td></tr>
<tr><td><code>replace(a, b)</code>, <code>count(s)</code>, <code>find(s)</code></td><td>replace substrings; count them; first position or −1</td></tr>
</tbody></table>
<p>Methods can be <strong>chained</strong>: <code>'  Hello '.strip().upper()</code> → <code>'HELLO'</code>.</p>
<p class="callout">Modern Python also offers <strong>f-strings</strong>: <code>f'{name} scored {marks}'</code> inserts values directly and avoids long chains of <code>+</code> and <code>str()</code>.</p>`,
        syntax: R`'Hello'.upper()            # 'HELLO'
'abc123'.isalnum()         # True
', '.join(['a', 'b'])      # 'a, b'
'My name is Simon'.split() # ['My', 'name', 'is', 'Simon']
'Hi'.rjust(6, '*')         # '****Hi'
'  spam  '.strip()         # 'spam'
'2025-08-01'.replace('-', '/')`,
        example: { code: R`feeling = 'GREAT'
print('How are you? I feel', feeling.lower())
print('HELLO'.isupper(), 'Hello'.isupper(), '123'.isdecimal(), 'abc 1'.isalnum())
print('Hello world!'.startswith('Hello'), 'report.pdf'.endswith('.pdf'))
print(', '.join(['cats', 'rats', 'bats']))
print('My name is Simon'.split())
print('2025-08-01'.split('-'))

def print_picnic(items, left_width, right_width):
    print('PICNIC ITEMS'.center(left_width + right_width, '-'))
    for k, v in items.items():
        print(k.ljust(left_width, '.') + str(v).rjust(right_width))

print_picnic({'sandwiches': 4, 'apples': 12, 'cups': 4, 'cookies': 8000}, 12, 5)
print(repr('   Hello World   '.strip()))
print('SpamSpamBaconSpamEggsSpamSpam'.strip('ampS'))
print('banana'.count('a'), 'banana'.find('n'), 'banana'.replace('a', 'o'))
name, marks = 'Asha', 91
print(f'{name} scored {marks}')` },
        demo: { w: 'strViz', methods: true, intro: 'Choose a method to transform the text. The exact Python call and its result are shown, and the original string stays unchanged.' },
        visual: { w: 'trace', intro: 'split() and join() convert between a string and a list of words.', code: R`sentence = '  the quick brown fox  '
words = sentence.strip().split()
capitalised = []
for w in words:
    capitalised.append(w.capitalize())
title = ' '.join(capitalised)
print(title)` },
        mistakes: [
          { wrong: R`name = ' asha '
name.strip()
print(name)`, right: R`name = name.strip()`, why: 'String methods return a new string; without reassigning, name is unchanged.' },
          { wrong: R`['a', 'b'].join(', ')`, right: R`', '.join(['a', 'b'])`, why: "join() is a string method called on the separator: AttributeError: 'list' object has no attribute 'join'." },
          { wrong: R`', '.join([1, 2, 3])`, right: R`', '.join(str(n) for n in [1, 2, 3])`, why: 'join() only accepts strings: TypeError: sequence item 0: expected str instance, int found.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Clean up <code>\'   python PROGRAMMING  \'</code> so it prints <code>Python programming</code>.', starter: R`raw = '   python PROGRAMMING  '
`, sol: R`raw = '   python PROGRAMMING  '
print(raw.strip().capitalize())`, expect: 'Python programming' },
          { lvl: 'Medium', q: 'Turn <code>\'2025-08-15\'</code> into <code>15/08/2025</code> using <code>split()</code> and <code>join()</code>.', starter: R`iso = '2025-08-15'
`, sol: R`iso = '2025-08-15'
y, m, d = iso.split('-')
print('/'.join([d, m, y]))`, expect: '15/08/2025' },
          { lvl: 'Hard', q: 'Validate a password: at least 8 characters, contains an uppercase letter, a lowercase letter and a digit, and has no spaces. Print the result for <code>\'Vlsi2025\'</code>, <code>\'vlsi2025\'</code> and <code>\'Short1\'</code>.', starter: '', sol: R`def strong(pw):
    if len(pw) < 8 or ' ' in pw:
        return False
    has_upper = has_lower = has_digit = False
    for ch in pw:
        if ch.isupper():
            has_upper = True
        elif ch.islower():
            has_lower = True
        elif ch.isdecimal():
            has_digit = True
    return has_upper and has_lower and has_digit

for p in ['Vlsi2025', 'vlsi2025', 'Short1']:
    print(p, strong(p))`, expect: 'Vlsi2025 True\nvlsi2025 False\nShort1 False' }
        ],
        challenge: { q: 'Table printer: given <code>table = [[\'apples\', \'oranges\', \'cherries\'], [\'Alice\', \'Bob\', \'Carol\'], [\'dogs\', \'cats\', \'moose\']]</code> (each inner list is a column), print the table with each column right-justified to the width of its longest word.', starter: R`table = [['apples', 'oranges', 'cherries'],
         ['Alice', 'Bob', 'Carol'],
         ['dogs', 'cats', 'moose']]
`, sol: R`table = [['apples', 'oranges', 'cherries'],
         ['Alice', 'Bob', 'Carol'],
         ['dogs', 'cats', 'moose']]
widths = [max(len(w) for w in col) for col in table]
for row in range(len(table[0])):
    cells = []
    for c in range(len(table)):
        cells.append(table[c][row].rjust(widths[c]))
    print(' '.join(cells))`, expect: '  apples Alice  dogs\n oranges   Bob  cats\ncherries Carol moose' },
        summary: ['String methods return new values; the original is unchanged.', 'isX methods validate input.', 'split() makes a list; join() makes a string.', 'rjust/ljust/center align text; strip removes padding.', 'Chain methods for compact transformations.']
      },
      {
        id: 'm2-5', title: 'Tuples, references and mutability',
        covers: ['Tuples and Dictionaries, basics'],
        concept: R`<p>A <strong>tuple</strong> is like a list but written with parentheses — <code>('hello', 42, 0.5)</code> — and it is <strong>immutable</strong>: items cannot be assigned, appended or removed. A one-item tuple needs a trailing comma: <code>('hello',)</code>; without it, the parentheses are just grouping.</p>
<ul>
<li>Indexing, slicing, <code>len()</code>, <code>in</code> and loops all work exactly as with lists.</li>
<li><strong>Unpacking</strong>: <code>x, y = (3, 4)</code>. The classic swap <code>a, b = b, a</code> builds and unpacks a tuple.</li>
<li><code>list()</code> and <code>tuple()</code> convert between the two.</li>
<li>Use a tuple to signal that a sequence should not change (coordinates, RGB colours, days of the week), and as dictionary keys.</li>
</ul>
<p><strong>References.</strong> A variable does not contain a list; it stores a <em>reference</em> to a list object. After <code>cheese = spam</code>, both names refer to the <strong>same</strong> list, so changing it through one name is visible through the other. Passing a list to a function passes the reference, so the function can modify the caller’s list. <code>id()</code> shows an object’s identity.</p>
<p>Immutable values (int, float, str, tuple) can never be changed in place, so sharing them is harmless — “changing” them really rebinds the name to a new object. To get an independent list, copy it: <code>spam[:]</code> or <code>copy.copy(spam)</code>; for lists that contain lists, <code>copy.deepcopy(spam)</code>.</p>`,
        syntax: R`point = (3, 4)
x, y = point             # unpacking
a, b = b, a              # swap
single = ('only',)
list(point), tuple([1, 2])
cheese = spam            # same object
import copy
safe = copy.deepcopy(spam)   # independent copy`,
        example: { code: R`eggs = ('hello', 42, 0.5)
print(eggs[0], eggs[1:3], len(eggs))
try:
    eggs[1] = 99
except TypeError as e:
    print('TypeError:', e)
print(type(('hello',)), type(('hello')))
x, y = (3, 4)
x, y = y, x
print(x, y)
print(tuple(['cat', 'dog']), list('hello'))

spam = [0, 1, 2, 3]
cheese = spam              # copies the reference, not the list
cheese[1] = 'Hello!'
print(spam, spam is cheese, id(spam) == id(cheese))

def eggs_fn(some_list):
    some_list.append('Hello')
eggs_fn(spam)
print(spam)

import copy
nested = [[1, 2], [3, 4]]
shallow = copy.copy(nested)
deep = copy.deepcopy(nested)
nested[0].append(99)
print(shallow, deep)` },
        demo: { w: 'trace', intro: 'The mutability experiment. Watch the arrows: after cheese = spam both names point at one list object; the slice copy points at a new one; reassigning the string creates a new object instead of changing the old one.', code: R`spam = [1, 2, 3]
cheese = spam
copied = spam[:]
cheese.append(4)
word = 'hi'
other = word
word = word + '!'
point = (1, 2)
print(spam, copied, other, word)` },
        visual: { html: R`<div class="mut-grid">
<div><h4>Mutable</h4><p>list, dict, set, objects of most classes</p><p>Can change in place: <code>spam.append(4)</code>. Every name referring to the object sees the change.</p></div>
<div><h4>Immutable</h4><p>int, float, bool, str, tuple</p><p>Cannot change in place. <code>word = word + '!'</code> builds a new object and moves the name to it.</p></div>
</div>` },
        mistakes: [
          { wrong: R`t = (5)
print(type(t))`, right: R`t = (5,)`, why: '(5) is just the integer 5 in parentheses. A one-item tuple needs a trailing comma.' },
          { wrong: R`backup = scores
scores.clear()`, right: R`backup = scores[:]
scores.clear()`, why: 'backup = scores copies only the reference, so clearing scores empties backup too.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Store the RGB colour teal <code>(0, 128, 128)</code> in a tuple, unpack it into <code>r, g, b</code> and print them.', starter: '', sol: R`teal = (0, 128, 128)
r, g, b = teal
print(r, g, b)`, expect: '0 128 128' },
          { lvl: 'Medium', q: 'Write <code>min_max(nums)</code> that returns a tuple <code>(smallest, largest)</code>. Unpack the result for <code>[4, 9, 1, 7]</code> and print it.', starter: '', sol: R`def min_max(nums):
    return (min(nums), max(nums))
lo, hi = min_max([4, 9, 1, 7])
print(lo, hi)`, expect: '1 9' },
          { lvl: 'Hard', q: 'Predict the output, then run it. Explain in a comment why <code>a</code> changes but <code>n</code> does not.', starter: R`def change(lst, num):
    lst.append(4)
    num = num + 1

a = [1, 2, 3]
n = 10
change(a, n)
print(a, n)`, sol: R`def change(lst, num):
    lst.append(4)      # mutates the shared list object
    num = num + 1      # rebinds the local name only; ints are immutable

a = [1, 2, 3]
n = 10
change(a, n)
print(a, n)`, expect: '[1, 2, 3, 4] 10' }
        ],
        challenge: { q: 'A function <code>add_student(roster, name)</code> must return a new roster with the name added <em>without</em> modifying the original list. Show that the original is unchanged.', starter: '', sol: R`def add_student(roster, name):
    new_roster = roster[:]
    new_roster.append(name)
    return new_roster

original = ['Asha', 'Ravi']
updated = add_student(original, 'Meera')
print(original)
print(updated)`, expect: "['Asha', 'Ravi']\n['Asha', 'Ravi', 'Meera']" },
        summary: ['Tuples are immutable sequences; (x,) for one item.', 'Unpacking assigns tuple items to variables; a, b = b, a swaps.', 'Variables hold references; assignment shares the object.', 'Mutable objects can change through any reference; immutable ones cannot.', 'Copy with [:] / copy.copy(); use copy.deepcopy() for nested lists.']
      },
      {
        id: 'm2-6', title: 'Dictionaries',
        covers: ['Tuples and Dictionaries, basics'],
        concept: R`<p>A <strong>dictionary</strong> maps <strong>keys</strong> to <strong>values</strong>: <code>{'size': 'fat', 'colour': 'gray'}</code>. Keys can be any immutable value (strings, numbers, tuples) and must be unique.</p>
<ul>
<li>Access a value by key: <code>cat['size']</code>. A missing key raises <code>KeyError</code>.</li>
<li>Add or update: <code>cat['age'] = 3</code>. Delete: <code>del cat['age']</code> or <code>cat.pop('age')</code>.</li>
<li><code>keys()</code>, <code>values()</code>, <code>items()</code> return views you can loop over: <code>for k, v in cat.items():</code>.</li>
<li><code>'size' in cat</code> checks keys; <code>'fat' in cat.values()</code> checks values.</li>
<li><code>get(key, default)</code> returns a default instead of raising KeyError.</li>
<li><code>setdefault(key, default)</code> sets the key only if it is missing, and returns its value — ideal for counting.</li>
<li><code>pprint.pprint()</code> prints large dictionaries neatly with sorted keys.</li>
</ul>
<p>Two dictionaries are equal if they have the same key–value pairs, regardless of order (since Python 3.7 they do remember insertion order, but order is not part of equality).</p>`,
        syntax: R`cat = {'size': 'fat', 'colour': 'gray'}
cat['size']                  # 'fat'
cat['age'] = 3               # add
del cat['age']               # delete
cat.get('age', 0)            # 0 if missing
for key, value in cat.items():
    ...
counts.setdefault(ch, 0)
counts[ch] += 1`,
        example: { code: R`birthdays = {'Alice': 'Apr 1', 'Bob': 'Dec 12', 'Carol': 'Mar 4'}
print(birthdays['Bob'])
birthdays['Eve'] = 'Jan 30'
print(list(birthdays.keys()))
for name, day in birthdays.items():
    print(name, '->', day)
print('Carol' in birthdays, 'Dec 12' in birthdays.values())
print(birthdays.get('Zara', 'not found'))
try:
    print(birthdays['Zara'])
except KeyError as e:
    print('KeyError:', e)

import pprint
message = 'It was a bright cold day in April'
count = {}
for ch in message.lower():
    count.setdefault(ch, 0)
    count[ch] = count[ch] + 1
pprint.pprint(count)` },
        demo: { w: 'dictViz', intro: 'An interactive dictionary backed by a real Python dict. Add, update, search for and delete key–value pairs and watch the generated statements.' },
        visual: { w: 'trace', intro: 'Counting characters with setdefault(): watch new keys appear and counts increase.', code: R`word = 'banana'
counts = {}
for ch in word:
    counts.setdefault(ch, 0)
    counts[ch] += 1
print(counts)` },
        mistakes: [
          { wrong: R`d = {'a': 1}
print(d['b'])`, right: R`print(d.get('b', 0))`, why: "KeyError: 'b'. Use get() or check with 'b' in d first." },
          { wrong: R`d = {['x', 'y']: 1}`, right: R`d = {('x', 'y'): 1}`, why: "Keys must be immutable: TypeError: unhashable type: 'list'. Use a tuple." },
          { wrong: R`d[0]   # expecting the first item`, right: R`list(d.values())[0]`, why: 'Dictionaries are accessed by key, not position.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Create a dictionary of three students and their marks, add a fourth student, and print the marks of <code>\'Ravi\'</code>.', starter: R`marks = {'Asha': 88, 'Ravi': 74, 'Meera': 91}
`, sol: R`marks = {'Asha': 88, 'Ravi': 74, 'Meera': 91}
marks['John'] = 67
print(marks['Ravi'])`, expect: '74' },
          { lvl: 'Medium', q: 'Count how many times each word appears in <code>\'to be or not to be\'</code> and print the dictionary.', starter: R`text = 'to be or not to be'
`, sol: R`text = 'to be or not to be'
freq = {}
for w in text.split():
    freq[w] = freq.get(w, 0) + 1
print(freq)`, expect: "{'to': 2, 'be': 2, 'or': 1, 'not': 1}" },
          { lvl: 'Hard', q: 'Invert a dictionary that maps students to branches so that it maps each branch to a list of students: <code>{\'Asha\': \'ECE\', \'Ravi\': \'CSE\', \'Meera\': \'ECE\'}</code> → <code>{\'ECE\': [\'Asha\', \'Meera\'], \'CSE\': [\'Ravi\']}</code>.', starter: R`branch = {'Asha': 'ECE', 'Ravi': 'CSE', 'Meera': 'ECE'}
`, sol: R`branch = {'Asha': 'ECE', 'Ravi': 'CSE', 'Meera': 'ECE'}
by_branch = {}
for student, b in branch.items():
    by_branch.setdefault(b, []).append(student)
print(by_branch)`, expect: "{'ECE': ['Asha', 'Meera'], 'CSE': ['Ravi']}" }
        ],
        challenge: { q: 'Inventory: write <code>display_inventory(inv)</code> that prints each item and count and the total number of items, and <code>add_to_inventory(inv, loot)</code> that adds a list of looted items. Start with <code>{\'gold coin\': 42, \'rope\': 1}</code> and loot <code>[\'gold coin\', \'dagger\', \'gold coin\', \'ruby\']</code>.', starter: '', sol: R`def display_inventory(inv):
    print('Inventory:')
    total = 0
    for item, n in inv.items():
        print(n, item)
        total += n
    print('Total number of items:', total)

def add_to_inventory(inv, loot):
    for item in loot:
        inv[item] = inv.get(item, 0) + 1
    return inv

inv = {'gold coin': 42, 'rope': 1}
add_to_inventory(inv, ['gold coin', 'dagger', 'gold coin', 'ruby'])
display_inventory(inv)`, expect: 'Inventory:\n44 gold coin\n1 rope\n1 dagger\n1 ruby\nTotal number of items: 47' },
        summary: ['A dictionary maps unique immutable keys to values.', 'd[key] reads/writes; del removes; a missing key raises KeyError.', 'keys(), values(), items() support loops and membership tests.', 'get() and setdefault() handle missing keys gracefully.', 'pprint prints large dictionaries readably.']
      },
      {
        id: 'm2-7', title: 'Using data structures to model real-world things',
        covers: ['Using Data Structures to Model Real-World Things'],
        concept: R`<p>Lists and dictionaries can be <strong>nested</strong> to represent almost anything. Choosing the structure is a design decision:</p>
<ul>
<li>Use a <strong>list</strong> when order matters or items are processed one after another (a queue, a series of readings).</li>
<li>Use a <strong>dictionary</strong> when you look things up by a name or ID (a student by USN, a board square by position).</li>
<li>Use a <strong>tuple</strong> for a fixed group of fields that should not change (a coordinate, a date).</li>
</ul>
<p>Classic examples: a <strong>tic-tac-toe board</strong> as a dictionary with keys <code>'top-L'</code>, <code>'mid-M'</code>, …; a chess position in algebraic notation (<code>{'1h': 'bking', '6c': 'wqueen'}</code>); a <strong>guest list</strong> as a dictionary of dictionaries counting what each guest brings; a class register as a list of student dictionaries.</p>
<p>Once the structure is clear, writing functions that operate on it — printing a board, totalling marks, searching records — becomes straightforward.</p>`,
        syntax: R`board = {'top-L': ' ', 'top-M': ' ', ...}
students = [{'usn': '1GS23EC001', 'name': 'Asha', 'marks': [78, 85]}, ...]
guests = {'Alice': {'apples': 5, 'pretzels': 12}, 'Bob': {'ham sandwiches': 3}}`,
        example: { code: R`the_board = {'top-L': ' ', 'top-M': ' ', 'top-R': ' ',
             'mid-L': ' ', 'mid-M': ' ', 'mid-R': ' ',
             'low-L': ' ', 'low-M': ' ', 'low-R': ' '}

def print_board(board):
    print(board['top-L'] + '|' + board['top-M'] + '|' + board['top-R'])
    print('-+-+-')
    print(board['mid-L'] + '|' + board['mid-M'] + '|' + board['mid-R'])
    print('-+-+-')
    print(board['low-L'] + '|' + board['low-M'] + '|' + board['low-R'])

turn = 'X'
for move in ['mid-M', 'low-L', 'low-M', 'top-M', 'mid-L', 'mid-R']:
    the_board[move] = turn
    turn = 'O' if turn == 'X' else 'X'
print_board(the_board)

all_guests = {'Alice': {'apples': 5, 'pretzels': 12},
              'Bob': {'ham sandwiches': 3, 'apples': 2},
              'Carol': {'cups': 3, 'apple pies': 1}}

def total_brought(guests, item):
    count = 0
    for k, v in guests.items():
        count = count + v.get(item, 0)
    return count

print('Apples', total_brought(all_guests, 'apples'))
print('Cups', total_brought(all_guests, 'cups'))` },
        demo: { w: 'code', intro: 'A student-records and marks manager built only from lists and dictionaries. Add a student, change marks, or add a new report and run it again.', code: R`students = [
    {'usn': '1GS23EC001', 'name': 'Asha',  'marks': {'Python': 88, 'VLSI': 92, 'DSP': 79}},
    {'usn': '1GS23EC002', 'name': 'Ravi',  'marks': {'Python': 64, 'VLSI': 71, 'DSP': 58}},
    {'usn': '1GS23EC003', 'name': 'Meera', 'marks': {'Python': 95, 'VLSI': 84, 'DSP': 90}},
]

def average(s):
    return sum(s['marks'].values()) / len(s['marks'])

print('USN'.ljust(12) + 'Name'.ljust(8) + 'Average'.rjust(8))
for s in students:
    print(s['usn'].ljust(12) + s['name'].ljust(8) + str(round(average(s), 1)).rjust(8))

subject = 'VLSI'
topper = max(students, key=lambda s: s['marks'][subject])
print('Top in', subject + ':', topper['name'])

by_usn = {s['usn']: s for s in students}     # index the records by USN
print(by_usn['1GS23EC002']['marks'])` },
        visual: { w: 'trace', intro: 'The heap view shows how the outer list refers to dictionaries, which in turn refer to inner dictionaries.', code: R`inventory = {'resistor': 120, 'capacitor': 75}
order = [('resistor', 20), ('led', 50)]
for part, qty in order:
    inventory[part] = inventory.get(part, 0) - qty
low = [p for p, q in inventory.items() if q < 0]
print(inventory, low)` },
        mistakes: [
          { wrong: R`students = {'name': ['Asha', 'Ravi'], 'marks': [88, 64]}`, right: R`students = [{'name': 'Asha', 'marks': 88}, {'name': 'Ravi', 'marks': 64}]`, why: 'Parallel lists inside a dictionary drift apart when one is sorted or edited. Keep each record together.' },
          { wrong: R`row = [0] * 3
grid = [row] * 3
grid[0][0] = 1`, right: R`grid = [[0] * 3 for _ in range(3)]`, why: 'The first version repeats a reference to one list, so every row changes together.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Model a book with a dictionary (title, author, year, available). Print <code>Title by Author (Year)</code>.', starter: '', sol: R`book = {'title': 'Think Python', 'author': 'Allen Downey', 'year': 2015, 'available': True}
print(book['title'] + ' by ' + book['author'] + ' (' + str(book['year']) + ')')`, expect: 'Think Python by Allen Downey (2015)' },
          { lvl: 'Medium', q: 'Using the tic-tac-toe board dictionary, write <code>winner(board)</code> that returns <code>\'X\'</code>, <code>\'O\'</code> or <code>None</code> by checking the 8 winning lines. Test it with a board where X fills the middle row.', starter: R`board = {'top-L': 'O', 'top-M': ' ', 'top-R': 'O',
         'mid-L': 'X', 'mid-M': 'X', 'mid-R': 'X',
         'low-L': ' ', 'low-M': 'O', 'low-R': ' '}
`, sol: R`board = {'top-L': 'O', 'top-M': ' ', 'top-R': 'O',
         'mid-L': 'X', 'mid-M': 'X', 'mid-R': 'X',
         'low-L': ' ', 'low-M': 'O', 'low-R': ' '}
LINES = [['top-L', 'top-M', 'top-R'], ['mid-L', 'mid-M', 'mid-R'], ['low-L', 'low-M', 'low-R'],
         ['top-L', 'mid-L', 'low-L'], ['top-M', 'mid-M', 'low-M'], ['top-R', 'mid-R', 'low-R'],
         ['top-L', 'mid-M', 'low-R'], ['top-R', 'mid-M', 'low-L']]
def winner(b):
    for a, c, d in LINES:
        if b[a] != ' ' and b[a] == b[c] == b[d]:
            return b[a]
    return None
print(winner(board))`, expect: 'X' },
          { lvl: 'Hard', q: 'Model a lab inventory as a dictionary of part → quantity. Process a list of transactions like <code>(\'issue\', \'LED\', 5)</code> and <code>(\'return\', \'LED\', 2)</code>; refuse an issue that would make stock negative by printing a warning. Print the final inventory.', starter: R`stock = {'LED': 10, 'resistor': 50, 'breadboard': 4}
transactions = [('issue', 'LED', 5), ('issue', 'breadboard', 6),
                ('return', 'LED', 2), ('issue', 'resistor', 20)]
`, sol: R`stock = {'LED': 10, 'resistor': 50, 'breadboard': 4}
transactions = [('issue', 'LED', 5), ('issue', 'breadboard', 6),
                ('return', 'LED', 2), ('issue', 'resistor', 20)]
for kind, part, qty in transactions:
    if kind == 'issue':
        if stock.get(part, 0) < qty:
            print('Cannot issue', qty, part)
            continue
        stock[part] -= qty
    else:
        stock[part] = stock.get(part, 0) + qty
print(stock)`, expect: "Cannot issue 6 breadboard\n{'LED': 7, 'resistor': 30, 'breadboard': 4}" }
        ],
        challenge: { q: 'Timetable model: represent a weekly timetable as a dictionary from day to a list of <code>(time, subject)</code> tuples. Write functions to print one day, find every slot of a given subject, and count the hours per subject.', starter: R`timetable = {
    'Mon': [('9:00', 'Python'), ('10:00', 'VLSI'), ('11:15', 'DSP')],
    'Tue': [('9:00', 'DSP'), ('10:00', 'Python')],
    'Wed': [('9:00', 'VLSI'), ('11:15', 'Python')],
}
`, sol: R`timetable = {
    'Mon': [('9:00', 'Python'), ('10:00', 'VLSI'), ('11:15', 'DSP')],
    'Tue': [('9:00', 'DSP'), ('10:00', 'Python')],
    'Wed': [('9:00', 'VLSI'), ('11:15', 'Python')],
}
def show_day(day):
    for time, subject in timetable[day]:
        print(time.rjust(5), subject)

def slots_of(subject):
    return [(day, t) for day, slots in timetable.items() for t, s in slots if s == subject]

def hours():
    h = {}
    for slots in timetable.values():
        for _, s in slots:
            h[s] = h.get(s, 0) + 1
    return h

show_day('Mon')
print(slots_of('Python'))
print(hours())`, expect: " 9:00 Python\n10:00 VLSI\n11:15 DSP\n[('Mon', '9:00'), ('Tue', '10:00'), ('Wed', '11:15')]\n{'Python': 3, 'VLSI': 2, 'DSP': 2}" },
        summary: ['Nest lists and dictionaries to model real data.', 'Lists for ordered collections, dictionaries for lookup by key, tuples for fixed records.', 'Keep each record’s fields together.', 'Write small functions that operate on your structure.']
      }
    ]
  });
})();
