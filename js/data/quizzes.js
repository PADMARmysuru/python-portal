/* Module quizzes. type: mcq | output (predict the output; verified against real Python by tests/qa.mjs)
   | error (find the error) | fill (code completion; answer = accepted strings). */
(function () {
  'use strict';
  const R = String.raw;
  window.PP.quizzes = {
    1: [
      { type: 'mcq', topic: 'Python basics', q: 'Who created Python, and what is it named after?', options: ['Dennis Ritchie, a snake', 'Guido van Rossum, Monty Python’s Flying Circus', 'James Gosling, a coffee brand', 'Guido van Rossum, the python snake'], answer: 1, explain: 'Guido van Rossum released Python in 1991 and named it after the BBC comedy series Monty Python’s Flying Circus.' },
      { type: 'mcq', topic: 'Language features', q: 'Which statement about Python is correct?', options: ['Blocks are marked with curly braces', 'Variables must be declared with a type', 'It is dynamically typed and uses indentation for blocks', 'It must be compiled to machine code before running'], answer: 2, explain: 'Python checks types at run time (dynamic typing) and uses indentation to mark blocks. CPython compiles to bytecode automatically.' },
      { type: 'output', topic: 'Expressions', q: 'What does this print?', code: R`print(2 + 3 * 4 ** 2 // 5)`, options: ['11', '13', '6', '15'], answer: 0, explain: '4 ** 2 = 16 first, then 3 * 16 = 48, 48 // 5 = 9, and 2 + 9 = 11.' },
      { type: 'output', topic: 'Data types', q: 'What does this print?', code: R`print(7 / 2, 7 // 2, 7 % 2)`, options: ['3.5 3 1', '3 3 1', '3.5 3.5 1', '3.5 4 1'], answer: 0, explain: '/ always returns a float (3.5); // is floor division (3); % is the remainder (1).' },
      { type: 'output', topic: 'String concatenation and replication', q: 'What does this print?', code: R`print('Ha' * 3 + '!')`, options: ['HaHaHa!', 'Ha!Ha!Ha!', 'Ha3!', 'TypeError'], answer: 0, explain: 'Replication happens first ("HaHaHa"), then concatenation adds "!".' },
      { type: 'error', topic: 'String concatenation and replication', q: 'Which line raises an error?', code: R`age = 19
msg = 'I am ' + age + ' years old'
print(msg)`, options: ['Line 1', 'Line 2: TypeError — cannot concatenate str and int', 'Line 3: NameError', 'No error'], answer: 1, explain: 'A str cannot be concatenated with an int. Use str(age).' },
      { type: 'mcq', topic: 'Variables', q: 'Which is a valid variable name?', options: ['2nd_value', 'my-total', 'total_2', 'class'], answer: 2, explain: 'Names may contain letters, digits and underscores but cannot start with a digit, contain hyphens, or be keywords like class.' },
      { type: 'output', topic: 'Your first program', q: 'What does this print?', code: R`print(len('Hello') + int('3'), str(4) + '2')`, options: ['8 42', '8 6', '53 42', '8 4 2'], answer: 0, explain: "len('Hello') is 5, int('3') is 3 → 8; str(4) + '2' concatenates to '42'." },
      { type: 'mcq', topic: 'Boolean operators', q: 'What is the value of <code>not 3 > 5 and 2 == 2.0</code>?', options: ['True', 'False', 'TypeError', 'None'], answer: 0, explain: 'Comparisons first: not False and True → True and True → True. Also 2 == 2.0 is True.' },
      { type: 'output', topic: 'Flow control statements', q: 'What does this print?', code: R`total = 0
for i in range(1, 10, 3):
    total += i
print(total)`, options: ['12', '15', '22', '45'], answer: 0, explain: 'range(1, 10, 3) gives 1, 4, 7; their sum is 12.' },
      { type: 'output', topic: 'Flow control statements', q: 'What does this print?', code: R`n = 0
while True:
    n += 1
    if n == 3:
        continue
    if n > 5:
        break
    print(n, end=' ')`, options: ['1 2 4 5', '1 2 3 4 5', '1 2 4 5 6', '1 2'], answer: 0, explain: 'continue skips printing 3; break leaves the loop when n becomes 6, before printing.' },
      { type: 'fill', topic: 'sys.exit()', q: 'Complete the line so the program stops immediately when the user types quit.', code: R`import sys
if input() == 'quit':
    ____`, answer: ['sys.exit()', 'sys.exit(0)'], explain: 'sys.exit() raises SystemExit and ends the program.' },
      { type: 'output', topic: 'Return values and None', q: 'What does this print?', code: R`def greet(name):
    print('Hi', name)

result = greet('Asha')
print(result)`, options: ['Hi Asha\nNone', 'Hi Asha\nHi Asha', 'None', 'Hi Asha'], answer: 0, explain: 'greet prints and then returns None (no return statement), so the second print shows None.' },
      { type: 'fill', topic: 'Keyword arguments and print()', q: 'Complete the call so it prints <code>A-B-C</code> on one line.', code: R`print('A', 'B', 'C', ____)`, answer: ["sep='-'", 'sep="-"', "sep = '-'"], explain: 'The sep keyword argument sets the separator between values (default is a space).' },
      { type: 'output', topic: 'Local and global scope', q: 'What does this print?', code: R`x = 'global'
def f():
    x = 'local'
    return x
print(f(), x)`, options: ['local global', 'local local', 'global global', 'UnboundLocalError'], answer: 0, explain: 'The assignment inside f creates a separate local x; the global x is unchanged.' },
      { type: 'error', topic: 'The global statement', q: 'Why does this fail?', code: R`count = 0
def bump():
    count = count + 1
bump()`, options: ['count is not defined anywhere', 'UnboundLocalError: count is local because it is assigned in bump, but read before assignment', 'SyntaxError in line 3', 'It does not fail; count becomes 1'], answer: 1, explain: 'Assigning count inside the function makes it local for the whole function. Add global count, or pass it as a parameter.' },
      { type: 'output', topic: 'Exception handling', q: 'What does this print?', code: R`for v in ['4', 'x', '0']:
    try:
        print(8 // int(v))
    except ValueError:
        print('bad')
    except ZeroDivisionError:
        print('zero')`, options: ['2\nbad\nzero', '2\nbad', '2\nzero\nbad', 'bad\nbad\nzero'], answer: 0, explain: "8 // 4 = 2; int('x') raises ValueError; 8 // 0 raises ZeroDivisionError. try inside the loop handles each item." },
      { type: 'mcq', topic: 'Guess the Number', q: 'In the Guess the Number program, why is <code>int(input())</code> used instead of <code>input()</code>?', options: ['input() cannot read numbers', 'To compare the guess numerically with the secret integer', 'To make the program faster', 'Because randint returns a string'], answer: 1, explain: "input() returns a string; comparing a str with an int using < raises TypeError." }
    ],
    2: [
      { type: 'output', topic: 'Lists: indexing and slicing', q: 'What does this print?', code: R`spam = ['cat', 'bat', 'rat', 'elephant']
print(spam[-1], spam[1:3])`, options: ["elephant ['bat', 'rat']", "rat ['bat', 'rat', 'elephant']", "elephant ['cat', 'bat']", "cat ['bat', 'rat']"], answer: 0, explain: '-1 is the last item; the slice 1:3 includes indexes 1 and 2.' },
      { type: 'output', topic: 'List methods', q: 'What does this print?', code: R`a = [3, 1, 2]
a.append(5)
a.insert(0, 9)
a.remove(1)
print(a)`, options: ['[9, 3, 2, 5]', '[9, 1, 2, 5]', '[3, 2, 5, 9]', '[9, 3, 1, 2, 5]'], answer: 0, explain: '[3,1,2] → append 5 → [3,1,2,5] → insert 9 at 0 → [9,3,1,2,5] → remove value 1 → [9,3,2,5].' },
      { type: 'error', topic: 'List methods', q: 'What is wrong with this code?', code: R`nums = [4, 2, 9]
nums = nums.sort()
print(nums[0])`, options: ['sort() needs an argument', 'sort() returns None, so nums becomes None and nums[0] raises TypeError', 'Lists cannot be sorted', 'print cannot print list items'], answer: 1, explain: 'In-place methods return None. Call nums.sort() on its own line.' },
      { type: 'mcq', topic: 'Working with lists', q: 'Which expression is True?', options: ["'howdy' in ['hello', 'hi', 'howdy']", "'howdy' not in ['hello', 'hi', 'howdy']", "['a'] in ['a', 'b']", "'h' in ['hello']"], answer: 0, explain: "in tests whether a value is an item of the list. 'h' is not an item of ['hello'] (it is a substring of an item)." },
      { type: 'output', topic: 'Working with lists', q: 'What does this print?', code: R`size, colour = ['fat', 'gray']
colour, size = size, colour
print(size, colour)`, options: ['gray fat', 'fat gray', 'fat fat', 'ValueError'], answer: 0, explain: 'Multiple assignment unpacks the list; the second line swaps the two values.' },
      { type: 'output', topic: 'Manipulating strings', q: 'What does this print?', code: R`s = 'Hello, world!'
print(s[7:12], s[::-1][0])`, options: ['world !', 'world, d', ' world !', 'world H'], answer: 0, explain: "s[7:12] is 'world'; the reversed string starts with '!'." },
      { type: 'error', topic: 'Manipulating strings', q: 'Which line raises an error?', code: R`name = 'python'
first = name[0]
name[0] = 'P'
print(name)`, options: ['Line 2: IndexError', "Line 3: TypeError — 'str' object does not support item assignment", 'Line 4: NameError', 'No error; prints Python'], answer: 1, explain: "Strings are immutable. Use name = 'P' + name[1:] or name.capitalize()." },
      { type: 'mcq', topic: 'Raw strings', q: "What is <code>len(r'C:\\new')</code>?", options: ['6', '5', '7', '4'], answer: 0, explain: "In a raw string the backslash is kept literally: C, :, \\, n, e, w — 6 characters." },
      { type: 'output', topic: 'Useful string methods', q: 'What does this print?', code: R`print('-'.join('a b c'.split()), '  hi  '.strip().upper())`, options: ['a-b-c HI', 'a b c HI', 'a-b-c   HI  ', '-a-b-c- HI'], answer: 0, explain: "split() gives ['a','b','c']; '-'.join joins them; strip() then upper() gives 'HI'." },
      { type: 'fill', topic: 'Useful string methods', q: 'Complete the expression so it is True only when <code>pin</code> contains digits only.', code: R`if pin.____():
    print('valid')`, answer: ['isdecimal', 'isdigit', 'isnumeric'], explain: "isdecimal() returns True if the string is non-empty and every character is a decimal digit." },
      { type: 'output', topic: 'Useful string methods', q: 'What does this print?', code: R`print('Hi'.rjust(5, '*') + '|' + 'Hi'.center(6, '.'))`, options: ['***Hi|..Hi..', '*****Hi|..Hi..', 'Hi***|..Hi..', '***Hi|.Hi...'], answer: 0, explain: "rjust(5) pads to width 5 on the left; center(6) pads 2 on each side." },
      { type: 'mcq', topic: 'Tuples', q: 'Which creates a tuple containing one item?', options: ["('hello')", "('hello',)", "['hello']", "tuple('hello')"], answer: 1, explain: "A trailing comma makes a one-item tuple. ('hello') is just a string; tuple('hello') makes five one-character items." },
      { type: 'output', topic: 'References', q: 'What does this print?', code: R`a = [1, 2]
b = a
b.append(3)
c = a[:]
c.append(4)
print(a, len(c))`, options: ['[1, 2, 3] 4', '[1, 2] 4', '[1, 2, 3, 4] 4', '[1, 2, 3] 3'], answer: 0, explain: 'b is the same list as a, so appending to b changes a. c is a copy, so appending to c does not.' },
      { type: 'output', topic: 'Dictionaries', q: 'What does this print?', code: R`d = {'a': 1, 'b': 2}
d['c'] = d.get('a', 0) + d.get('z', 10)
print(d['c'], len(d), 'b' in d)`, options: ['11 3 True', '1 3 True', '11 2 True', 'KeyError'], answer: 0, explain: "get('a', 0) is 1; get('z', 10) returns the default 10; the new key makes 3 entries." },
      { type: 'error', topic: 'Dictionaries', q: 'What goes wrong?', code: R`stock = {'pen': 5}
print(stock['pencil'])`, options: ["KeyError: 'pencil'", 'IndexError', 'It prints 0', 'It prints None'], answer: 0, explain: "Missing keys raise KeyError. Use stock.get('pencil', 0)." },
      { type: 'fill', topic: 'Dictionaries', q: 'Complete the loop so it counts characters (the key is created with value 0 the first time).', code: R`count = {}
for ch in text:
    count.____(ch, 0)
    count[ch] += 1`, answer: ['setdefault'], explain: 'setdefault(key, value) sets the key only if it does not already exist.' },
      { type: 'mcq', topic: 'Modelling real-world things', q: 'Which structure best represents a tic-tac-toe board where you look up squares by position name?', options: ['A dictionary with keys like "top-L", "mid-M"', 'A single string', 'A tuple of nine integers that never changes', 'A set'], answer: 0, explain: 'A dictionary maps each position name to its mark and can be updated as the game goes on.' }
    ],
    3: [
      { type: 'mcq', topic: 'Pattern matching', q: 'Why are regular expressions preferred over manual character-by-character checks for finding phone numbers?', options: ['They run without Python', 'They describe the pattern concisely and adapt easily to new formats', 'They are the only way to search strings', 'They never return None'], answer: 1, explain: 'A manual matcher needs many lines per format; a regex expresses the same shape in one line.' },
      { type: 'mcq', topic: 'Regex basics', q: 'Why should regex patterns be written as raw strings?', options: ['Raw strings are faster', 'So backslashes reach the regex engine unchanged', 'Because re.compile only accepts raw strings', 'To make the pattern case-insensitive'], answer: 1, explain: "Without r'', Python interprets escapes such as \\b or \\n before the regex engine sees them." },
      { type: 'output', topic: 'Groups', q: 'What does this print?', code: R`import re
mo = re.search(r'(\d{3})-(\d{4})', 'Call 555-4242 now')
print(mo.group(1), mo.group())`, options: ['555 555-4242', '555-4242 555', '4242 555-4242', "('555', '4242')"], answer: 0, explain: 'group(1) is the first parenthesised group; group() is the whole match.' },
      { type: 'error', topic: 'Regex basics', q: 'What error can this code produce?', code: R`import re
mo = re.search(r'\d+', 'no digits here')
print(mo.group())`, options: ["AttributeError: 'NoneType' object has no attribute 'group'", 'ValueError', 're.error: bad pattern', 'It prints an empty string'], answer: 0, explain: 'search() returns None when nothing matches; check if mo: before calling group().' },
      { type: 'output', topic: 'Optional and repetition', q: 'What does this print?', code: R`import re
print(re.search(r'Bat(wo)?man', 'Batwoman').group(),
      re.search(r'(Ha){2,3}?', 'HaHaHa').group())`, options: ['Batwoman HaHa', 'Batwoman HaHaHa', 'Batman HaHa', 'wo Ha'], answer: 0, explain: '(wo)? matches the optional "wo"; {2,3}? is non-greedy, so it stops at two repetitions.' },
      { type: 'mcq', topic: 'Greedy matching', q: 'What does <code>re.search(r\'&lt;.*&gt;\', \'&lt;a&gt;&lt;b&gt;\').group()</code> return?', options: ["'<a><b>'", "'<a>'", "'<b>'", 'None'], answer: 0, explain: '.* is greedy, so it extends to the last >. Use .*? for the shortest match.' },
      { type: 'output', topic: 'findall()', q: 'What does this print?', code: R`import re
print(re.findall(r'(\d)(\w)', '1a 2b 3c'))`, options: ["[('1', 'a'), ('2', 'b'), ('3', 'c')]", "['1a', '2b', '3c']", "['1', '2', '3']", "[('1a', '2b', '3c')]"], answer: 0, explain: 'With groups, findall returns a list of tuples — one string per group.' },
      { type: 'mcq', topic: 'Character classes', q: 'Which shorthand class matches a space, tab or newline?', options: [R`\d`, R`\w`, R`\s`, R`\S`], answer: 2, explain: '\\s is whitespace; \\S is its opposite.' },
      { type: 'output', topic: 'Custom character classes', q: 'What does this print?', code: R`import re
print(''.join(re.findall(r'[^aeiou ]', 'regex is fun')))`, options: ['rgxsfn', 'eeiu', 'rgx s fn', 'regexisfun'], answer: 0, explain: 'The negated class matches every character that is not a vowel or a space.' },
      { type: 'fill', topic: 'Caret and dollar', q: 'Complete the pattern so it matches strings made entirely of digits.', code: R`re.compile(r'____')`, answer: [R`^\d+$`, R`^[0-9]+$`], explain: '^ anchors to the start and $ to the end, so the whole string must be digits.' },
      { type: 'output', topic: 'Wildcard', q: 'What does this print?', code: R`import re
print(re.findall(r'.at', 'cat\nhat flat'))`, options: ["['cat', 'hat', 'lat']", "['cat', 'hat', 'flat']", "['cat', '\\nhat', 'lat']", "['cat', 'hat']"], answer: 0, explain: '. matches one character except newline, so "flat" yields "lat".' },
      { type: 'output', topic: 'sub()', q: 'What does this print?', code: R`import re
print(re.sub(r'(\w+)@(\w+)', r'\2 at \1', 'mail asha@gsss'))`, options: ['mail gsss at asha', 'mail asha at gsss', 'mail \\2 at \\1', 'mail gsss@asha'], answer: 0, explain: '\\1 and \\2 in the replacement insert the captured groups in the new order.' },
      { type: 'mcq', topic: 'os.path', q: 'What does <code>os.path.basename(\'/home/asha/notes/py.txt\')</code> return?', options: ["'py.txt'", "'/home/asha/notes'", "'notes'", "'.txt'"], answer: 0, explain: 'basename returns the last component; dirname returns everything before it.' },
      { type: 'mcq', topic: 'File paths', q: 'Which statement about relative paths is correct?', options: ['They always start with C:\\ or /', 'They are interpreted from the current working directory', 'They cannot contain ..', 'They only work on Windows'], answer: 1, explain: 'Relative paths start at os.getcwd(); .. refers to the parent folder.' },
      { type: 'error', topic: 'File reading/writing process', q: 'The programmer wanted to add a line to an existing log. What happens?', code: R`f = open('log.txt', 'w')
f.write('new entry\n')
f.close()`, options: ["The old contents are erased because 'w' overwrites the file", 'It appends correctly', 'FileNotFoundError', 'TypeError'], answer: 0, explain: "Use mode 'a' to append; 'w' truncates the file first." },
      { type: 'output', topic: 'File reading/writing process', q: 'What does this print?', code: R`with open('t.txt', 'w') as f:
    f.write('a\nb\n')
with open('t.txt', 'a') as f:
    f.write('c')
print(open('t.txt').readlines())`, options: ["['a\\n', 'b\\n', 'c']", "['a', 'b', 'c']", "['c']", "['a\\nb\\nc']"], answer: 0, explain: 'readlines() keeps the newline at the end of each line; the appended last line has none.' },
      { type: 'mcq', topic: 'shelve', q: 'Which is true about the shelve module?', options: ['It saves values in a human-readable .py file', 'It stores Python values in a dictionary-like binary file', 'It can only store strings', 'It does not need to be closed'], answer: 1, explain: 'A shelf works like a dictionary persisted in binary files; close it (or use with) to save.' },
      { type: 'fill', topic: 'pprint.pformat()', q: 'Complete the line so the file myCats.py can later be imported to get the list back.', code: R`import pprint
cats = [{'name': 'Zophie'}]
open('myCats.py', 'w').write('cats = ' + pprint.____(cats) + '\n')`, answer: ['pformat'], explain: 'pformat returns the formatted text (valid Python) instead of printing it.' }
    ],
    4: [
      { type: 'mcq', topic: 'Programmer-defined types', q: 'What does <code>blank = Point()</code> do, given <code>class Point: pass</code>?', options: ['Defines a new class', 'Creates a new instance of Point and assigns a reference to blank', 'Calls a function named Point that must be imported', 'Copies the class'], answer: 1, explain: 'Calling a class instantiates it and returns the new object.' },
      { type: 'error', topic: 'Attributes', q: 'Which line fails?', code: R`class Point:
    pass
p = Point()
p.x = 3
print(p.x, p.y)`, options: ["Line 5: AttributeError — 'Point' object has no attribute 'y'", 'Line 3', 'Line 4: cannot add attributes', 'No error'], answer: 0, explain: 'Attributes exist only after they are assigned; y was never set.' },
      { type: 'output', topic: 'Objects are mutable', q: 'What does this print?', code: R`class Box:
    pass
def grow(b):
    b.size += 10
box = Box()
box.size = 5
grow(box)
print(box.size)`, options: ['15', '5', '10', 'AttributeError'], answer: 0, explain: 'The function receives a reference to the same object and modifies it.' },
      { type: 'output', topic: 'Copying', q: 'What does this print?', code: R`import copy
class P:
    pass
a = P(); a.pt = [1, 2]
s = copy.copy(a)
d = copy.deepcopy(a)
a.pt.append(3)
print(len(s.pt), len(d.pt), s is a)`, options: ['3 2 False', '2 2 False', '3 3 True', '2 3 False'], answer: 0, explain: 'The shallow copy shares the embedded list; the deep copy has its own list. s is a different object.' },
      { type: 'mcq', topic: 'Instances as return values', q: 'A function <code>find_center(rect)</code> creates a Point, sets its x and y, and returns it. This is an example of…', options: ['a modifier', 'an instance as a return value', 'operator overloading', 'type-based dispatch'], answer: 1, explain: 'Functions can create and return new objects.' },
      { type: 'mcq', topic: 'Pure functions', q: 'Which best describes a pure function?', options: ['It modifies its arguments and returns None', 'It does not modify its arguments and has no side effects other than returning a value', 'It is defined inside a class', 'It uses only integers'], answer: 1, explain: 'Pure functions leave their arguments unchanged; modifiers change them.' },
      { type: 'output', topic: 'Modifiers', q: 'What does this print?', code: R`class T:
    pass
def inc(t, s):
    t.sec += s
t = T(); t.sec = 50
r = inc(t, 20)
print(t.sec, r)`, options: ['70 None', '50 70', '70 70', '50 None'], answer: 0, explain: 'inc is a modifier: it changes t and returns nothing (None).' },
      { type: 'mcq', topic: 'Prototyping versus planning', q: 'What is the “designed development” insight used for Time objects?', options: ['Store times as strings', 'Treat a time as a number in base 60 and convert with time_to_int / int_to_time', 'Always use modifiers', 'Avoid classes for times'], answer: 1, explain: 'Converting to seconds and back replaces messy carry logic with simple integer arithmetic.' },
      { type: 'fill', topic: 'The init method', q: 'Complete the method header so it runs automatically when an object is created.', code: R`class Time:
    def ____(self, hour=0, minute=0):
        self.hour = hour
        self.minute = minute`, answer: ['__init__'], explain: '__init__ (two underscores on each side) is the initialiser.' },
      { type: 'output', topic: 'The __str__ method', q: 'What does this print?', code: R`class Point:
    def __init__(self, x=0, y=0):
        self.x, self.y = x, y
    def __str__(self):
        return '(%d, %d)' % (self.x, self.y)
print(Point(3), Point(y=4))`, options: ['(3, 0) (0, 4)', '(3, 4) (3, 4)', '(0, 3) (4, 0)', '<__main__.Point object> <__main__.Point object>'], answer: 0, explain: 'Default parameters fill the missing values; print uses __str__.' },
      { type: 'error', topic: 'Classes and methods', q: 'Why does <code>t.show()</code> fail?', code: R`class T:
    def show():
        print('time')
t = T()
t.show()`, options: ['TypeError: show() takes 0 positional arguments but 1 was given — self is missing', 'NameError: T', 'AttributeError: show', 'It works and prints time'], answer: 0, explain: 'Calling t.show() passes t as the first argument; the method must accept self.' },
      { type: 'mcq', topic: 'Object-oriented features', q: 'Which pair of calls is equivalent?', options: ['t.print_time() and Time.print_time(t)', 't.print_time() and print_time(Time)', 'Time() and Time.__str__()', 't.print_time and t.print_time()'], answer: 0, explain: 'Method call syntax obj.method() is shorthand for Class.method(obj).' },
      { type: 'output', topic: 'Operator overloading', q: 'What does this print?', code: R`class V:
    def __init__(self, x): self.x = x
    def __add__(self, o): return V(self.x + o.x)
    def __str__(self): return 'V' + str(self.x)
print(V(2) + V(5))`, options: ['V7', 'V25', '7', 'TypeError'], answer: 0, explain: 'V(2) + V(5) calls V(2).__add__(V(5)), which returns V(7); print uses __str__.' },
      { type: 'mcq', topic: 'Operator overloading', q: 'Which special method lets <code>5 + t</code> work when <code>t</code> is a Time object?', options: ['__add__', '__radd__', '__iadd__', '__plus__'], answer: 1, explain: 'When the left operand (an int) cannot add a Time, Python calls the right operand’s __radd__.' },
      { type: 'mcq', topic: 'Type-based dispatch', q: 'Type-based dispatch in <code>__add__</code> is typically implemented with…', options: ['isinstance()', 'try/finally', 'global variables', 'copy.deepcopy()'], answer: 0, explain: 'isinstance(other, Time) chooses between adding two times and adding seconds.' },
      { type: 'output', topic: 'Polymorphism', q: 'What does this print?', code: R`def histogram(s):
    d = {}
    for c in s:
        d[c] = d.get(c, 0) + 1
    return d
print(histogram('aab'), histogram(['x', 'x']))`, options: ["{'a': 2, 'b': 1} {'x': 2}", "{'aab': 1} {'xx': 1}", 'TypeError', "{'a': 2, 'b': 1} {'x': 1}"], answer: 0, explain: 'histogram works on any sequence whose items can be dictionary keys — polymorphism.' },
      { type: 'fill', topic: 'Polymorphism', q: 'Complete the class so <code>sum([Time(...), Time(...)])</code> works (sum starts from 0).', code: R`class Time:
    def __add__(self, other): ...
    def ____(self, other):
        return self.__add__(other)`, answer: ['__radd__'], explain: 'sum() computes 0 + first, which needs __radd__ on Time.' }
    ],
    5: [
      { type: 'mcq', topic: 'HTTP', q: 'What separates the headers from the body in an HTTP response?', options: ['A semicolon', 'A blank line (\\r\\n\\r\\n)', 'The word BODY', 'A tab character'], answer: 1, explain: 'Headers end with an empty line; everything after it is the body.' },
      { type: 'mcq', topic: 'HTTP', q: 'Which status code means “Not Found”?', options: ['200', '301', '404', '500'], answer: 2, explain: '2xx success, 3xx redirection, 4xx client error (404 Not Found), 5xx server error.' },
      { type: 'error', topic: 'Simplest web browser', q: 'What is wrong with this line in the simplest browser?', code: R`mysock.send('GET http://data.pr4e.org/romeo.txt HTTP/1.0\r\n\r\n')`, options: ['send() needs bytes, so the string must be .encode()d', 'The URL must not include http://', 'HTTP/1.0 is invalid', 'Nothing is wrong'], answer: 0, explain: 'Sockets transmit bytes; call .encode() on the request string.' },
      { type: 'mcq', topic: 'Retrieving an image', q: 'Why must an image retrieved over HTTP be written with mode <code>\'wb\'</code>?', options: ['Images are larger than text', 'Image data is bytes, and text mode expects str', "'wb' is faster", 'Because urllib requires it'], answer: 1, explain: 'Binary data must be written in binary mode.' },
      { type: 'mcq', topic: 'urllib', q: 'What does <code>urllib.request.urlopen(url)</code> return?', options: ['A string with the whole page', 'A file-like object whose lines are bytes', 'A list of headers', 'A socket object you must send() to'], answer: 1, explain: 'It behaves like a file opened in binary mode; decode each line to get str.' },
      { type: 'output', topic: 'Parsing XML', q: 'What does this print?', code: R`import xml.etree.ElementTree as ET
t = ET.fromstring('<p><name>Chuck</name><email hide="yes"/></p>')
print(t.find('name').text, t.find('email').get('hide'))`, options: ['Chuck yes', 'name email', 'Chuck None', 'None yes'], answer: 0, explain: '.text is element content; get() reads an attribute.' },
      { type: 'output', topic: 'Looping through nodes', q: 'What does this print?', code: R`import xml.etree.ElementTree as ET
s = ET.fromstring('<s><users><user x="2"/><user x="7"/></users></s>')
print(len(s.findall('user')), len(s.findall('users/user')))`, options: ['0 2', '2 2', '2 0', '0 0'], answer: 0, explain: 'findall follows the path from the current element; user is not a direct child of s.' },
      { type: 'fill', topic: 'XML', q: 'Complete the import used throughout the textbook’s XML examples.', code: R`import xml.etree.____ as ET`, answer: ['ElementTree'], explain: 'xml.etree.ElementTree is the standard-library XML parser.' },
      { type: 'output', topic: 'JSON', q: 'What does this print?', code: R`import json
d = json.loads('{"ok": true, "n": null, "v": [1, 2]}')
print(d['ok'], d['n'], len(d['v']))`, options: ['True None 2', 'true null 2', 'True null 2', "'true' 'null' 2"], answer: 0, explain: 'JSON true/null become Python True/None.' },
      { type: 'error', topic: 'JSON', q: 'Why does this fail?', code: R`import json
json.loads("{'name': 'Asha'}")`, options: ['JSON requires double quotes around strings and keys', 'json.loads needs a file', 'Dictionaries cannot be parsed', 'The key must be an integer'], answer: 0, explain: 'Single quotes are not valid JSON: json.JSONDecodeError.' },
      { type: 'mcq', topic: 'Database concepts', q: 'In relational database terms, a row of a table is also called a…', options: ['relation', 'tuple / record', 'attribute', 'schema'], answer: 1, explain: 'Table = relation, row = tuple, column = attribute.' },
      { type: 'mcq', topic: 'Database browser', q: 'What is a tool like DB Browser for SQLite mainly used for?', options: ['Writing Python code', 'Inspecting and editing SQLite database files and running SQL interactively', 'Browsing websites', 'Compiling SQL to Python'], answer: 1, explain: 'It lets you see what your program stored and test queries without writing code.' },
      { type: 'fill', topic: 'SQL', q: 'Complete the query to list tracks with more than 10 plays.', code: R`SELECT title, plays FROM Tracks ____ plays > 10`, answer: ['WHERE', 'where'], explain: 'WHERE filters rows.' },
      { type: 'error', topic: 'Creating a database table', q: 'The rows never appear in the database file. Why?', code: R`import sqlite3
conn = sqlite3.connect('music.sqlite')
cur = conn.cursor()
cur.execute('INSERT INTO Tracks VALUES (?, ?)', ('My Way', 15))
conn.close()`, options: ['conn.commit() was never called before closing', 'The ? placeholders are wrong', 'cursor() should be called twice', 'INSERT needs SELECT first'], answer: 0, explain: 'Changes are saved only when committed.' },
      { type: 'mcq', topic: 'Spidering Twitter', q: 'In the spidering programs, what is the purpose of the <code>retrieved</code> column?', options: ['To store the password', 'To mark which accounts have been processed so the spider can stop and restart', 'To count followers', 'To sort the table'], answer: 1, explain: 'The flag lets each run pick an unretrieved account, making the crawl restartable.' },
      { type: 'mcq', topic: 'Three kinds of keys', q: 'Enrollment.student_id holds the id of a row in the Student table. It is a…', options: ['primary key', 'logical key', 'foreign key', 'candidate key'], answer: 2, explain: 'A foreign key points to the primary key of a row in another table.' },
      { type: 'mcq', topic: 'Basic data modeling', q: 'Which rule guides basic data modeling?', options: ['Put all data in one table', 'Do not store the same string data more than once; use integer keys to refer to it', 'Always use TEXT columns', 'Avoid primary keys'], answer: 1, explain: 'Normalising strings into their own tables avoids duplication and inconsistency.' },
      { type: 'mcq', topic: 'JOIN', q: 'Which JOIN keeps every Student row even if the student has no Enrollment rows?', options: ['INNER JOIN', 'LEFT JOIN with Student on the left', 'CROSS JOIN', 'JOIN without ON'], answer: 1, explain: 'LEFT JOIN keeps all rows of the left table, filling unmatched columns with NULL.' }
    ]
  };
})();
