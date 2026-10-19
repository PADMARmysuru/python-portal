/* Coding problems: student code is executed, then every test expression is evaluated and compared
   with the expected value (tests are [expression, expected_expression]). */
(function () {
  'use strict';
  const R = String.raw;
  const PP = window.PP;
  PP.problems = [
    { id: 'p1-1', module: 1, level: 'Easy', title: 'Grade calculator', topic: 'Flow control',
      statement: 'Write <code>grade(marks)</code> that returns <code>"S"</code> for 90 and above, <code>"A"</code> for 75–89, <code>"B"</code> for 60–74, <code>"C"</code> for 40–59 and <code>"F"</code> below 40. Marks outside 0–100 should return <code>"Invalid"</code>.',
      starter: R`def grade(marks):
    pass
`,
      tests: [['grade(95)', "'S'"], ['grade(90)', "'S'"], ['grade(75)', "'A'"], ['grade(60)', "'B'"], ['grade(40)', "'C'"], ['grade(39)', "'F'"], ['grade(101)', "'Invalid'"], ['grade(-5)', "'Invalid'"]],
      hints: ['Check the invalid range first, then use an if / elif chain from the highest grade down.', 'Because elif stops at the first True condition, <code>marks &gt;= 75</code> already implies marks &lt; 90 in that branch.', 'Do not forget to return (not print) the letter.'],
      solution: R`def grade(marks):
    if marks < 0 or marks > 100:
        return 'Invalid'
    if marks >= 90:
        return 'S'
    elif marks >= 75:
        return 'A'
    elif marks >= 60:
        return 'B'
    elif marks >= 40:
        return 'C'
    return 'F'
`,
      explain: 'Ordering the conditions from highest to lowest means each branch only needs a lower bound. The invalid check comes first so out-of-range values never reach the grading chain.' },
    { id: 'p1-2', module: 1, level: 'Medium', title: 'Sum of digits', topic: 'Loops',
      statement: 'Write <code>digit_sum(n)</code> that returns the sum of the decimal digits of a non-negative integer using a <code>while</code> loop with <code>%</code> and <code>//</code> (no string conversion).',
      starter: R`def digit_sum(n):
    pass
`,
      tests: [['digit_sum(0)', '0'], ['digit_sum(7)', '7'], ['digit_sum(5274)', '18'], ['digit_sum(1000001)', '2'], ['digit_sum(99999)', '45']],
      hints: ['<code>n % 10</code> gives the last digit.', '<code>n // 10</code> removes the last digit.', 'Loop while n &gt; 0, adding the last digit to a total each time.'],
      solution: R`def digit_sum(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total
`,
      explain: 'Each iteration peels off the last digit with % 10 and shrinks the number with // 10. For n = 0 the loop never runs, so 0 is returned.' },
    { id: 'p1-3', module: 1, level: 'Hard', title: 'Safe integer input', topic: 'Exceptions',
      statement: 'Write <code>to_int(text, default=0)</code> that returns <code>int(text)</code> after stripping spaces, or <code>default</code> when the text is not a valid integer. Also write <code>count_valid(items)</code> returning how many items convert successfully.',
      starter: R`def to_int(text, default=0):
    pass

def count_valid(items):
    pass
`,
      tests: [["to_int('42')", '42'], ["to_int('  -7 ')", '-7'], ["to_int('3.5')", '0'], ["to_int('abc', default=-1)", '-1'], ["count_valid(['1', 'x', ' 2', '', '3'])", '3'], ['count_valid([])', '0']],
      hints: ['Use try / except ValueError around int().', 'int() already accepts surrounding spaces, but calling strip() makes the intent clear.', 'count_valid can loop and use a sentinel default such as None to detect failure.'],
      solution: R`def to_int(text, default=0):
    try:
        return int(text.strip())
    except ValueError:
        return default

def count_valid(items):
    count = 0
    for item in items:
        if to_int(item, None) is not None:
            count += 1
    return count
`,
      explain: 'Catching ValueError turns a crash into a controlled default. Reusing to_int with a None default lets count_valid distinguish a real 0 from a failure.' },

    { id: 'p2-1', module: 2, level: 'Easy', title: 'Second largest', topic: 'Lists',
      statement: 'Write <code>second_largest(nums)</code> that returns the second largest <em>distinct</em> value in a list, or <code>None</code> if there is no such value.',
      starter: R`def second_largest(nums):
    pass
`,
      tests: [['second_largest([4, 9, 1, 7])', '7'], ['second_largest([5, 5, 3])', '3'], ['second_largest([2])', 'None'], ['second_largest([8, 8, 8])', 'None'], ['second_largest([-1, -5, -3])', '-3']],
      hints: ['Duplicates matter: convert to a set to keep distinct values.', 'Sort the distinct values.', 'If fewer than two distinct values remain, return None.'],
      solution: R`def second_largest(nums):
    distinct = sorted(set(nums))
    if len(distinct) < 2:
        return None
    return distinct[-2]
`,
      explain: 'set() removes duplicates, sorted() orders the values, and index -2 is the second largest.' },
    { id: 'p2-2', module: 2, level: 'Medium', title: 'Word frequency', topic: 'Dictionaries',
      statement: 'Write <code>word_freq(text)</code> returning a dictionary of lowercase word → count. Ignore the punctuation characters <code>.,!?;:</code>.',
      starter: R`def word_freq(text):
    pass
`,
      tests: [["word_freq('To be, or not to be!')", "{'to': 2, 'be': 2, 'or': 1, 'not': 1}"], ["word_freq('')", '{}'], ["word_freq('Hi hi HI.')", "{'hi': 3}"]],
      hints: ['Lower-case the text first.', 'Remove punctuation with replace() in a loop over the characters ".,!?;:".', 'Use dict.get(word, 0) + 1 to count.'],
      solution: R`def word_freq(text):
    text = text.lower()
    for p in '.,!?;:':
        text = text.replace(p, '')
    freq = {}
    for w in text.split():
        freq[w] = freq.get(w, 0) + 1
    return freq
`,
      explain: 'Normalising case and punctuation first means "Be" and "be!" count as the same word. get() supplies 0 for words seen for the first time.' },
    { id: 'p2-3', module: 2, level: 'Hard', title: 'Student records', topic: 'Modelling data',
      statement: 'Records are dictionaries like <code>{"name": "Asha", "marks": [88, 92]}</code>. Write <code>toppers(records, n)</code> returning the names of the <code>n</code> students with the highest average, highest first (ties broken alphabetically by name).',
      starter: R`def toppers(records, n):
    pass
`,
      tests: [["toppers([{'name': 'Asha', 'marks': [88, 92]}, {'name': 'Ravi', 'marks': [64, 70]}, {'name': 'Meera', 'marks': [95, 85]}], 2)", "['Asha', 'Meera']"],
              ["toppers([{'name': 'B', 'marks': [80]}, {'name': 'A', 'marks': [80]}], 1)", "['A']"], ["toppers([], 3)", '[]']],
      hints: ['Compute each average with sum(...) / len(...).', 'sorted() accepts a key; a key returning a tuple sorts by several criteria.', 'Use a negative average so higher averages come first, then the name: key=lambda r: (-avg(r), r["name"]).'],
      solution: R`def toppers(records, n):
    def avg(r):
        return sum(r['marks']) / len(r['marks'])
    ranked = sorted(records, key=lambda r: (-avg(r), r['name']))
    return [r['name'] for r in ranked[:n]]
`,
      explain: 'Sorting by the tuple (-average, name) puts the highest average first and breaks ties alphabetically. Slicing [:n] handles n larger than the list.' },

    { id: 'p3-1', module: 3, level: 'Easy', title: 'Extract emails', topic: 'Regular expressions',
      statement: 'Write <code>emails(text)</code> that returns a list of every email-like address (letters, digits, dots, underscores, plus or hyphens; an @; a domain with at least one dot).',
      starter: R`import re

def emails(text):
    pass
`,
      tests: [["emails('Mail asha.k@gsss.edu.in or help@example.com.')", "['asha.k@gsss.edu.in', 'help@example.com']"], ["emails('no address here')", '[]'], ["emails('a+b_c-d@x-y.org')", "['a+b_c-d@x-y.org']"]],
      hints: ['Build a character class for the user part: [\\w.+-]+', 'The domain is one or more groups of [\\w-]+ separated by dots.', 'Use a non-capturing group (?:...) so findall returns whole matches.'],
      solution: R`import re

def emails(text):
    return re.findall(r'[\w.+-]+@[\w-]+(?:\.[\w-]+)+', text)
`,
      explain: 'The non-capturing group (?:\\.[\\w-]+)+ requires at least one ".part" in the domain and keeps findall returning complete addresses. The trailing full stop in the first test is not included because the pattern needs word characters after each dot.' },
    { id: 'p3-2', module: 3, level: 'Medium', title: 'Validate phone numbers', topic: 'Regular expressions',
      statement: 'Write <code>valid_mobile(s)</code> returning True for an Indian mobile number written as 10 digits starting with 6–9, optionally preceded by <code>+91</code> or <code>+91 </code> (with one space). The whole string must match.',
      starter: R`import re

def valid_mobile(s):
    pass
`,
      tests: [["valid_mobile('9876543210')", 'True'], ["valid_mobile('+91 9876543210')", 'True'], ["valid_mobile('+919876543210')", 'True'], ["valid_mobile('5876543210')", 'False'], ["valid_mobile('98765 43210')", 'False'], ["valid_mobile('98765432100')", 'False']],
      hints: ['Anchor the pattern with ^ and $ (or use re.fullmatch).', 'The prefix is optional: (\\+91 ?)?', 'First digit [6-9], then exactly nine more digits: \\d{9}.'],
      solution: R`import re

def valid_mobile(s):
    return re.fullmatch(r'(\+91 ?)?[6-9]\d{9}', s) is not None
`,
      explain: 're.fullmatch requires the entire string to match, which is equivalent to wrapping the pattern in ^...$. The ? after the space makes it optional.' },
    { id: 'p3-3', module: 3, level: 'Hard', title: 'File statistics', topic: 'Files',
      statement: 'Write <code>file_stats(path)</code> that returns a tuple <code>(lines, words, characters)</code> for a text file, like the Unix <code>wc</code> command. Return <code>None</code> if the file does not exist.',
      starter: R`def file_stats(path):
    pass
`,
      tests: [["(open('wc_test.txt', 'w').write('one two\\nthree\\n'), file_stats('wc_test.txt'))[1]", '(2, 3, 14)'], ["file_stats('does_not_exist.txt')", 'None'], ["(open('empty.txt', 'w').close(), file_stats('empty.txt'))[1]", '(0, 0, 0)']],
      hints: ['Open the file inside try / except FileNotFoundError.', 'read() gives all the text; len(text) is the character count.', 'len(text.splitlines()) counts lines and len(text.split()) counts words.'],
      solution: R`def file_stats(path):
    try:
        with open(path) as f:
            text = f.read()
    except FileNotFoundError:
        return None
    return (len(text.splitlines()), len(text.split()), len(text))
`,
      explain: 'Reading the whole file once is enough for all three counts. splitlines() handles the final newline correctly, and the exception handler covers missing files.' },

    { id: 'p4-1', module: 4, level: 'Easy', title: 'Rectangle class', topic: 'Classes',
      statement: 'Write a class <code>Rectangle</code> with <code>__init__(self, width, height)</code>, methods <code>area()</code> and <code>perimeter()</code>, and <code>__str__</code> returning e.g. <code>Rectangle(3 x 4)</code>.',
      starter: R`class Rectangle:
    pass
`,
      tests: [['Rectangle(3, 4).area()', '12'], ['Rectangle(3, 4).perimeter()', '14'], ['str(Rectangle(3, 4))', "'Rectangle(3 x 4)'"], ['Rectangle(2.5, 2).area()', '5.0']],
      hints: ['Store width and height on self in __init__.', 'Methods take self and use self.width / self.height.', '__str__ must return a string, not print it.'],
      solution: R`class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def __str__(self):
        return 'Rectangle(' + str(self.width) + ' x ' + str(self.height) + ')'
`,
      explain: '__init__ stores the state; area and perimeter compute from it; __str__ controls how print() and str() display the object.' },
    { id: 'p4-2', module: 4, level: 'Medium', title: 'Time arithmetic', topic: 'Operator overloading',
      statement: 'Complete class <code>Time</code> so that <code>Time + Time</code> and <code>Time + int</code> (seconds) both return a new Time, <code>int + Time</code> also works, and <code>==</code> compares times. <code>str()</code> must give <code>HH:MM:SS</code>.',
      starter: R`class Time:
    def __init__(self, hour=0, minute=0, second=0):
        self.hour, self.minute, self.second = hour, minute, second

    def __str__(self):
        return '%.2d:%.2d:%.2d' % (self.hour, self.minute, self.second)
`,
      tests: [['str(Time(9, 45) + Time(1, 35))', "'11:20:00'"], ['str(Time(23, 59, 50) + 15)', "'24:00:05'"], ['str(100 + Time(0, 0, 0))', "'00:01:40'"], ['Time(1, 0) == Time(0, 60)', 'True'], ['Time(1, 0) == Time(1, 0, 1)', 'False']],
      hints: ['Add a helper that converts a Time to seconds and another that converts seconds back to a Time.', 'In __add__, use isinstance(other, Time) to choose between adding a Time and adding seconds.', '__radd__ can simply return self.__add__(other); __eq__ compares the seconds.'],
      solution: R`class Time:
    def __init__(self, hour=0, minute=0, second=0):
        self.hour, self.minute, self.second = hour, minute, second

    def __str__(self):
        return '%.2d:%.2d:%.2d' % (self.hour, self.minute, self.second)

    def to_seconds(self):
        return (self.hour * 60 + self.minute) * 60 + self.second

    @staticmethod
    def from_seconds(s):
        m, sec = divmod(s, 60)
        h, m = divmod(m, 60)
        return Time(h, m, sec)

    def __add__(self, other):
        if isinstance(other, Time):
            return Time.from_seconds(self.to_seconds() + other.to_seconds())
        return Time.from_seconds(self.to_seconds() + other)

    def __radd__(self, other):
        return self.__add__(other)

    def __eq__(self, other):
        return isinstance(other, Time) and self.to_seconds() == other.to_seconds()
`,
      explain: 'Converting to seconds (designed development) makes addition trivial. isinstance() performs type-based dispatch, and __radd__ handles int + Time.' },
    { id: 'p4-3', module: 4, level: 'Hard', title: 'Polymorphic shapes', topic: 'Polymorphism',
      statement: 'Create classes <code>Circle(r)</code>, <code>Square(side)</code> and <code>Triangle(a, b, c)</code>, each with <code>area()</code> (use Heron’s formula for the triangle). Then write <code>largest(shapes)</code> that returns the class name of the shape with the largest area.',
      starter: R`import math

class Circle:
    pass

class Square:
    pass

class Triangle:
    pass

def largest(shapes):
    pass
`,
      tests: [['round(Circle(1).area(), 4)', '3.1416'], ['Square(3).area()', '9'], ['Triangle(3, 4, 5).area()', '6.0'], ['largest([Circle(1), Square(3), Triangle(3, 4, 5)])', "'Square'"], ['largest([Circle(2), Square(3)])', "'Circle'"]],
      hints: ['Every class needs __init__ to store its measurements and an area() method.', "Heron's formula: s = (a + b + c) / 2; area = sqrt(s(s-a)(s-b)(s-c)).", 'max(shapes, key=lambda s: s.area()) finds the largest; type(obj).__name__ gives its class name.'],
      solution: R`import math

class Circle:
    def __init__(self, r):
        self.r = r
    def area(self):
        return math.pi * self.r ** 2

class Square:
    def __init__(self, side):
        self.side = side
    def area(self):
        return self.side ** 2

class Triangle:
    def __init__(self, a, b, c):
        self.a, self.b, self.c = a, b, c
    def area(self):
        s = (self.a + self.b + self.c) / 2
        return math.sqrt(s * (s - self.a) * (s - self.b) * (s - self.c))

def largest(shapes):
    return type(max(shapes, key=lambda s: s.area())).__name__
`,
      explain: 'largest() never checks types: it relies only on every object having area(). That is polymorphism — new shape classes work without changing the function.' },

    { id: 'p5-1', module: 5, level: 'Easy', title: 'Parse JSON users', topic: 'JSON',
      statement: 'Write <code>active_names(text)</code> that parses a JSON array of user objects and returns a sorted list of names of users whose <code>"active"</code> field is true. Users without the field count as inactive.',
      starter: R`import json

def active_names(text):
    pass
`,
      tests: [[R`active_names('[{"name": "Ravi", "active": true}, {"name": "Asha", "active": true}, {"name": "Meera", "active": false}]')`, "['Asha', 'Ravi']"], [`active_names('[]')`, '[]'], [R`active_names('[{"name": "X"}]')`, '[]']],
      hints: ['json.loads converts the text to a list of dictionaries.', 'JSON true becomes Python True.', 'user.get("active", False) handles missing fields.'],
      solution: R`import json

def active_names(text):
    users = json.loads(text)
    return sorted(u['name'] for u in users if u.get('active', False))
`,
      explain: 'After json.loads the data is ordinary Python; get() with a default avoids KeyError for users without the field.' },
    { id: 'p5-2', module: 5, level: 'Medium', title: 'XML marks report', topic: 'XML',
      statement: 'Write <code>average_marks(xml_text)</code> that returns the average of the integer text of every <code>&lt;marks&gt;</code> element found under <code>department/student</code>, rounded to 2 decimals (0 if there are none).',
      starter: R`import xml.etree.ElementTree as ET

def average_marks(xml_text):
    pass
`,
      tests: [[`average_marks('''${PP.SAMPLE_XML.replace(/^<\?xml[^>]*>\n/, '')}''')`, '82.33'], [`average_marks('<college><department/></college>')`, '0'], [`average_marks('<c><department><student><marks>70</marks></student></department></c>')`, '70.0']],
      hints: ['root = ET.fromstring(xml_text)', 'Loop over root.findall("department/student") and read s.find("marks").text.', 'Guard against an empty list before dividing.'],
      solution: R`import xml.etree.ElementTree as ET

def average_marks(xml_text):
    root = ET.fromstring(xml_text)
    marks = [int(s.find('marks').text) for s in root.findall('department/student')]
    if not marks:
        return 0
    return round(sum(marks) / len(marks), 2)
`,
      explain: 'findall with a path visits each student node; converting the text with int() allows the average to be computed.' },
    { id: 'p5-3', module: 5, level: 'Hard', title: 'SQL join report', topic: 'Databases',
      statement: 'Write <code>course_report(conn)</code> for the sample school database. Return a list of tuples <code>(course_code, number_of_students, average_marks)</code> for <em>every</em> course, ordered by code; use <code>None</code> as the average when nobody is enrolled. Averages are rounded to 1 decimal.',
      starter: R`import sqlite3

def course_report(conn):
    pass

conn = sqlite3.connect(':memory:')
conn.executescript('''${PP.SCHOOL_SQL}''')
`,
      tests: [['course_report(conn)', "[('1BEC305', 4, 78.5), ('EC201', 2, 88.0), ('EC202', 1, 71.0), ('EC203', 0, None)]"]],
      hints: ['Start FROM Course and LEFT JOIN Enrollment so empty courses are kept.', 'COUNT(Enrollment.student_id) counts only matching rows; AVG of no rows is NULL (None).', 'ROUND(AVG(marks), 1) and GROUP BY Course.id ORDER BY Course.code.'],
      solution: R`import sqlite3

def course_report(conn):
    sql = '''SELECT Course.code, COUNT(Enrollment.student_id), ROUND(AVG(Enrollment.marks), 1)
             FROM Course LEFT JOIN Enrollment ON Course.id = Enrollment.course_id
             GROUP BY Course.id ORDER BY Course.code'''
    return conn.execute(sql).fetchall()

conn = sqlite3.connect(':memory:')
conn.executescript('''${PP.SCHOOL_SQL}''')
`,
      explain: 'A LEFT JOIN from Course keeps EC203 even with no enrolments; COUNT of a right-table column gives 0 and AVG gives NULL for it.' }
  ];

  PP.projects = [
    { id: 'proj1', module: 1, title: 'Number guessing tournament', brief: 'Extend Guess the Number: play several rounds, validate every guess with try/except, keep the best (lowest) number of guesses, and end the tournament early with sys.exit() when the player types quit.', starter: R`import random, sys

def play_round():
    """Play one round and return the number of guesses taken (or None if lost)."""
    secret = random.randint(1, 20)
    # TODO: allow 6 guesses, validate input, give hints
    return None

best = None
for rnd in range(1, 4):
    print('Round', rnd)
    result = play_round()
    # TODO: update best
print('Best score:', best)
` },
    { id: 'proj2', module: 2, title: 'Marks management system', brief: 'Build a menu-free marks manager using a list of student dictionaries: add students, record marks for several subjects, print a formatted table with ljust/rjust, report subject toppers and the class average.', starter: R`students = []

def add_student(usn, name):
    students.append({'usn': usn, 'name': name, 'marks': {}})

def record(usn, subject, mark):
    pass   # TODO

def report():
    pass   # TODO: aligned table + averages

add_student('1GS23EC001', 'Asha')
add_student('1GS23EC002', 'Ravi')
record('1GS23EC001', 'Python', 88)
record('1GS23EC002', 'Python', 64)
report()
` },
    { id: 'proj3', module: 3, title: 'Log file analyser', brief: 'Write a log file to the workspace, then read it back and use regular expressions to extract timestamps, levels and messages; count each level, list all ERROR messages, and save a summary with shelve so the next run can compare.', starter: R`import re, shelve

with open('server.log', 'w') as f:
    f.write('2025-08-01 09:00:01 INFO Started\n'
            '2025-08-01 09:02:13 ERROR Disk quota exceeded\n'
            '2025-08-01 09:05:40 WARNING High memory\n'
            '2025-08-01 09:07:02 ERROR Connection lost\n')

pattern = re.compile(r'(\S+) (\S+) (INFO|WARNING|ERROR) (.*)')
# TODO: read the file, count levels, print ERROR lines, store counts in a shelf
` },
    { id: 'proj4', module: 4, title: 'Bank account system', brief: 'Design an Account class with __init__, __str__, deposit, withdraw (with validation) and a transaction history; add a SavingsAccount whose add_interest() method differs, and overload + to merge two accounts of the same owner.', starter: R`class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.history = []

    def __str__(self):
        return self.owner + ': Rs ' + str(self.balance)

    # TODO: deposit, withdraw, __add__

acc = Account('Asha', 1000)
print(acc)
` },
    { id: 'proj5', module: 5, title: 'Library database application', brief: 'Model Books, Members and Loans as three SQLite tables with primary, logical and foreign keys. Load data from a JSON string, issue and return books, and produce JOIN-based reports such as overdue loans and the most borrowed titles.', starter: R`import sqlite3, json

data = json.loads('''{"books": [{"isbn": "9781593279929", "title": "Automate the Boring Stuff"},
                               {"isbn": "9781491939369", "title": "Think Python"}],
                     "members": [{"usn": "1GS23EC001", "name": "Asha"}]}''')

conn = sqlite3.connect(':memory:')
conn.executescript('''
CREATE TABLE Book   (id INTEGER PRIMARY KEY, isbn TEXT UNIQUE, title TEXT);
CREATE TABLE Member (id INTEGER PRIMARY KEY, usn TEXT UNIQUE, name TEXT);
CREATE TABLE Loan   (book_id INTEGER REFERENCES Book(id), member_id INTEGER REFERENCES Member(id),
                     issued TEXT, returned TEXT);
''')
# TODO: insert data, issue a book, report loans with a JOIN
print(conn.execute('SELECT COUNT(*) FROM Book').fetchone())
` }
  ];
})();
