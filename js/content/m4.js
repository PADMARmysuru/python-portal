(function () {
  'use strict';
  const R = String.raw;
  window.PP.addModule({
    n: 4, title: 'Object-Oriented Programming', co: 4,
    blurb: 'Programmer-defined types, attributes, mutability and copying, pure functions vs modifiers, methods, operator overloading and polymorphism.',
    lessons: [
      {
        id: 'm4-1', title: 'Classes, objects and attributes',
        covers: ['Classes and objects: Programmer-defined types', 'Attributes'],
        concept: R`<p>Python’s built-in types (int, str, list…) cannot represent everything. A <strong>class</strong> is a <strong>programmer-defined type</strong>: a blueprint describing a new kind of object. Creating an object from a class is called <strong>instantiation</strong>, and the object is an <strong>instance</strong> of the class.</p>
<p>A <strong>class definition</strong> starts with <code>class Point:</code>, usually followed by a docstring. Calling the class like a function — <code>blank = Point()</code> — creates a new instance and returns a reference to it.</p>
<p>Values stored in an object are its <strong>attributes</strong>, accessed with <strong>dot notation</strong>: <code>blank.x = 3.0</code> creates (or updates) attribute <code>x</code>. Attributes can be used in any expression: <code>math.sqrt(blank.x**2 + blank.y**2)</code>. Reading an attribute that does not exist raises <code>AttributeError</code>.</p>
<p>An <strong>object diagram</strong> shows a variable referring to an object, and the object’s attributes with their values. Objects can be passed to functions like any other value; the function receives a reference to the same object.</p>`,
        syntax: R`class Point:
    """Represents a point in 2-D space."""

blank = Point()       # instantiation
blank.x = 3.0         # create attributes
blank.y = 4.0
print(blank.x)        # dot notation`,
        example: { code: R`import math

class Point:
    """Represents a point in 2-D space."""

print(Point)
blank = Point()
print(type(blank), isinstance(blank, Point))
blank.x = 3.0
blank.y = 4.0
print(blank.x, blank.y)
distance = math.sqrt(blank.x ** 2 + blank.y ** 2)
print('Distance from origin:', distance)
print('(%g, %g)' % (blank.x, blank.y))

def print_point(p):
    print('(' + str(p.x) + ', ' + str(p.y) + ')')

print_point(blank)
print(vars(blank))     # the attributes stored in the object
try:
    print(blank.z)
except AttributeError as e:
    print('AttributeError:', e)` },
        demo: { w: 'classViz', mode: 'attrs', intro: 'The class–object relationship. The class box on the left is the blueprint; each object created is a separate instance with its own attribute values. Every object you create here is created by real Python.' },
        visual: { w: 'trace', intro: 'Object diagram: the variable blank refers to a Point object whose attributes appear as they are assigned.', code: R`class Point:
    """Represents a point in 2-D space."""

blank = Point()
blank.x = 3.0
blank.y = 4.0
other = Point()
other.x = blank.x + 1
other.y = 0.0` },
        mistakes: [
          { wrong: R`p = Point
p.x = 3`, right: R`p = Point()
p.x = 3`, why: 'Without parentheses, p refers to the class itself, so you set a class attribute instead of creating an instance.' },
          { wrong: R`p = Point()
print(p.x)`, right: R`p = Point()
p.x = 0
print(p.x)`, why: "AttributeError: 'Point' object has no attribute 'x' — attributes exist only after they are assigned (or set in __init__, lesson 4.4)." }
        ],
        practice: [
          { lvl: 'Easy', q: 'Define a class <code>Student</code>. Create an instance, give it attributes <code>name</code> and <code>usn</code>, and print them.', starter: '', sol: R`class Student:
    """Represents a student."""

s = Student()
s.name = 'Asha'
s.usn = '1GS23EC001'
print(s.name, s.usn)`, expect: 'Asha 1GS23EC001' },
          { lvl: 'Medium', q: 'Write <code>distance_between_points(p1, p2)</code> that takes two Point objects and returns the distance between them. Test with (0, 0) and (3, 4).', starter: R`import math
class Point:
    """Represents a point in 2-D space."""
`, sol: R`import math
class Point:
    """Represents a point in 2-D space."""

def distance_between_points(p1, p2):
    return math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)

a = Point(); a.x, a.y = 0, 0
b = Point(); b.x, b.y = 3, 4
print(distance_between_points(a, b))`, expect: '5.0' },
          { lvl: 'Hard', q: 'Write <code>make_point(x, y)</code> that creates and returns a new Point, and <code>midpoint(p1, p2)</code> that returns a new Point halfway between them. Print the midpoint of (2, 3) and (6, 9).', starter: R`class Point:
    """Represents a point in 2-D space."""
`, sol: R`class Point:
    """Represents a point in 2-D space."""

def make_point(x, y):
    p = Point()
    p.x = x
    p.y = y
    return p

def midpoint(p1, p2):
    return make_point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)

m = midpoint(make_point(2, 3), make_point(6, 9))
print(m.x, m.y)`, expect: '4.0 6.0' }
        ],
        challenge: { q: 'Model a circuit component: create a class <code>Resistor</code>, make three instances with an attribute <code>ohms</code>, store them in a list and compute the total resistance in series and in parallel.', starter: '', sol: R`class Resistor:
    """Represents a resistor."""

values = [100, 220, 470]
parts = []
for v in values:
    r = Resistor()
    r.ohms = v
    parts.append(r)

series = sum(r.ohms for r in parts)
parallel = 1 / sum(1 / r.ohms for r in parts)
print('Series:', series)
print('Parallel:', round(parallel, 2))`, expect: 'Series: 790\nParallel: 59.98' },
        summary: ['A class is a programmer-defined type; calling it creates an instance.', 'Attributes are values attached to an object, read and written with dot notation.', 'Functions can take objects as arguments and return new objects.', 'Missing attributes raise AttributeError.']
      },
      {
        id: 'm4-2', title: 'Rectangles, instances as return values, mutability and copying',
        covers: ['Rectangles', 'Instances as return values', 'Objects are mutable', 'Copying'],
        concept: R`<p><strong>Rectangles.</strong> To represent a rectangle aligned with the axes, we choose attributes <code>width</code>, <code>height</code> and <code>corner</code> (a Point for the lower-left corner). An attribute that is itself an object is called <strong>embedded</strong>: <code>box.corner.x</code>.</p>
<p><strong>Instances as return values.</strong> Functions can create and return new objects: <code>find_center(box)</code> builds a new Point at the centre and returns it.</p>
<p><strong>Objects are mutable.</strong> Assigning to an attribute changes the object in place: <code>box.width = box.width + 50</code>. A function such as <code>grow_rectangle(rect, dw, dh)</code> can therefore modify the caller’s object, because both refer to the same object.</p>
<p><strong>Copying.</strong> Assignment creates an <strong>alias</strong> (a second reference), not a copy. The <code>copy</code> module helps:</p>
<ul><li><code>copy.copy(p)</code> — a <strong>shallow copy</strong>: a new object whose attributes refer to the <em>same</em> embedded objects.</li>
<li><code>copy.deepcopy(p)</code> — a <strong>deep copy</strong>: copies embedded objects too, recursively.</li></ul>
<p><code>is</code> checks identity (same object); <code>==</code> on programmer-defined objects defaults to identity as well, unless the class defines <code>__eq__</code>.</p>`,
        syntax: R`class Rectangle:
    """Attributes: width, height, corner."""

box = Rectangle()
box.corner = Point()
box.corner.x = 0.0

import copy
p2 = copy.copy(p1)        # shallow
b3 = copy.deepcopy(box)   # deep`,
        example: { code: R`import copy

class Point:
    """Represents a point in 2-D space."""

class Rectangle:
    """Represents a rectangle. attributes: width, height, corner."""

box = Rectangle()
box.width = 100.0
box.height = 200.0
box.corner = Point()
box.corner.x = 0.0
box.corner.y = 0.0

def find_center(rect):
    p = Point()
    p.x = rect.corner.x + rect.width / 2
    p.y = rect.corner.y + rect.height / 2
    return p

center = find_center(box)
print('center', center.x, center.y)

def grow_rectangle(rect, dwidth, dheight):
    rect.width += dwidth
    rect.height += dheight

grow_rectangle(box, 50, 100)
print('grown', box.width, box.height)

alias = box
shallow = copy.copy(box)
deep = copy.deepcopy(box)
print(alias is box, shallow is box, shallow.corner is box.corner, deep.corner is box.corner)
box.corner.x = 10
print(shallow.corner.x, deep.corner.x)

p1 = Point(); p1.x, p1.y = 3.0, 4.0
p2 = copy.copy(p1)
print(p1 is p2, p1 == p2)` },
        demo: { w: 'rectLab', intro: 'An interactive Rectangle object. Grow it, move its corner, and make an alias, a shallow copy and a deep copy — then change the original and watch which copies follow. Every action is real Python.' },
        visual: { w: 'trace', intro: 'Memory diagram for copying: compare which objects are shared after copy.copy() and copy.deepcopy().', code: R`import copy
class Point:
    pass
class Rectangle:
    pass
box = Rectangle()
box.width = 100
box.corner = Point()
box.corner.x = 0
alias = box
shallow = copy.copy(box)
deep = copy.deepcopy(box)
box.corner.x = 5` },
        mistakes: [
          { wrong: R`backup = box
grow_rectangle(box, 10, 10)   # expecting backup unchanged`, right: R`backup = copy.deepcopy(box)`, why: 'backup = box is an alias; both names see the change.' },
          { wrong: R`b2 = copy.copy(box)
b2.corner.x = 99      # expecting box unchanged`, right: R`b2 = copy.deepcopy(box)`, why: 'A shallow copy shares the embedded Point, so changing b2.corner changes box.corner too.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Create a Rectangle 30 × 20 with its corner at (5, 5) and print its area and perimeter.', starter: R`class Point:
    pass
class Rectangle:
    pass
`, sol: R`class Point:
    pass
class Rectangle:
    pass
r = Rectangle()
r.width, r.height = 30, 20
r.corner = Point()
r.corner.x, r.corner.y = 5, 5
print(r.width * r.height, 2 * (r.width + r.height))`, expect: '600 100' },
          { lvl: 'Medium', q: 'Write <code>move_rectangle(rect, dx, dy)</code> that changes the corner of the rectangle in place. Move a rectangle at (0, 0) by (3, 4) and print the new corner.', starter: R`class Point:
    pass
class Rectangle:
    pass
`, sol: R`class Point:
    pass
class Rectangle:
    pass
def move_rectangle(rect, dx, dy):
    rect.corner.x += dx
    rect.corner.y += dy
r = Rectangle(); r.width = r.height = 10
r.corner = Point(); r.corner.x = r.corner.y = 0
move_rectangle(r, 3, 4)
print(r.corner.x, r.corner.y)`, expect: '3 4' },
          { lvl: 'Hard', q: 'Write <code>moved_copy(rect, dx, dy)</code> that returns a <em>new</em> moved rectangle and leaves the original unchanged (use <code>copy.deepcopy</code>). Print both corners.', starter: R`import copy
class Point:
    pass
class Rectangle:
    pass
`, sol: R`import copy
class Point:
    pass
class Rectangle:
    pass
def moved_copy(rect, dx, dy):
    new = copy.deepcopy(rect)
    new.corner.x += dx
    new.corner.y += dy
    return new
r = Rectangle(); r.width = r.height = 10
r.corner = Point(); r.corner.x = r.corner.y = 0
m = moved_copy(r, 3, 4)
print(r.corner.x, r.corner.y, '|', m.corner.x, m.corner.y)`, expect: '0 0 | 3 4' }
        ],
        challenge: { q: 'Write <code>overlaps(r1, r2)</code> that returns True if two axis-aligned rectangles overlap (share any area). Test overlapping, touching-edge and separate cases.', starter: R`class Point:
    pass
class Rectangle:
    pass
def make_rect(x, y, w, h):
    r = Rectangle(); r.width, r.height = w, h
    r.corner = Point(); r.corner.x, r.corner.y = x, y
    return r
`, sol: R`class Point:
    pass
class Rectangle:
    pass
def make_rect(x, y, w, h):
    r = Rectangle(); r.width, r.height = w, h
    r.corner = Point(); r.corner.x, r.corner.y = x, y
    return r

def overlaps(a, b):
    return (a.corner.x < b.corner.x + b.width and b.corner.x < a.corner.x + a.width and
            a.corner.y < b.corner.y + b.height and b.corner.y < a.corner.y + a.height)

print(overlaps(make_rect(0, 0, 10, 10), make_rect(5, 5, 10, 10)))
print(overlaps(make_rect(0, 0, 10, 10), make_rect(10, 0, 5, 5)))
print(overlaps(make_rect(0, 0, 10, 10), make_rect(20, 20, 5, 5)))`, expect: 'True\nFalse\nFalse' },
        summary: ['Objects can contain other objects (embedded objects).', 'Functions can return new instances.', 'Objects are mutable; functions can modify the objects passed to them.', 'Assignment aliases; copy.copy is shallow; copy.deepcopy copies everything.', 'is tests identity.']
      },
      {
        id: 'm4-3', title: 'Classes and functions: Time, pure functions and modifiers',
        covers: ['Classes and functions: Time', 'Pure functions', 'Modifiers', 'Prototyping versus planning'],
        concept: R`<p>A <code>Time</code> class records the time of day with attributes <code>hour</code>, <code>minute</code> and <code>second</code>. Functions that work with Time objects come in two kinds:</p>
<ul><li>A <strong>pure function</strong> does not modify any of the objects passed to it and has no effect other than returning a value. <code>add_time(t1, t2)</code> creates and returns a new Time.</li>
<li>A <strong>modifier</strong> changes the objects it receives; the caller sees the change. <code>increment(time, seconds)</code> adds seconds to an existing Time.</li></ul>
<p>Anything a modifier does can also be done with pure functions. Programs that use mostly pure functions (a <em>functional programming style</em>) are usually easier to reason about and less error-prone; modifiers are sometimes more convenient or efficient.</p>
<p><strong>Prototyping versus planning.</strong> “Prototype and patch” writes a quick version, tests it and patches errors (for example, adding carry logic when seconds exceed 59). It works but tends to produce complicated code with many special cases. <strong>Designed development</strong> plans with insight: a Time is really a number in base 60, so converting to seconds (<code>time_to_int</code>), doing integer arithmetic and converting back (<code>int_to_time</code>) gives code that is shorter, clearer and easier to verify.</p>`,
        syntax: R`def add_time(t1, t2):         # pure: returns a new object
    ...
    return total

def increment(time, seconds): # modifier: changes time in place
    time.second += seconds
    ...

def time_to_int(t):
    return (t.hour * 60 + t.minute) * 60 + t.second`,
        example: { code: R`class Time:
    """Represents the time of day. attributes: hour, minute, second"""

def make_time(h, m, s):
    t = Time(); t.hour, t.minute, t.second = h, m, s
    return t

def print_time(t):
    print('%.2d:%.2d:%.2d' % (t.hour, t.minute, t.second))

# Prototype and patch: add, then patch the carries
def add_time(t1, t2):
    total = make_time(t1.hour + t2.hour, t1.minute + t2.minute, t1.second + t2.second)
    if total.second >= 60:
        total.second -= 60
        total.minute += 1
    if total.minute >= 60:
        total.minute -= 60
        total.hour += 1
    return total

start = make_time(9, 45, 0)
duration = make_time(1, 35, 0)
print_time(add_time(start, duration))
print_time(start)                      # unchanged: add_time is pure

def increment(time, seconds):          # modifier
    time.second += seconds
    m, time.second = divmod(time.second, 60)
    time.minute += m
    h, time.minute = divmod(time.minute, 60)
    time.hour += h

increment(start, 3725)
print_time(start)                      # changed

# Designed development: treat a Time as a base-60 number
def time_to_int(t):
    return (t.hour * 60 + t.minute) * 60 + t.second

def int_to_time(seconds):
    minutes, second = divmod(seconds, 60)
    hour, minute = divmod(minutes, 60)
    return make_time(hour, minute, second)

def add_time2(t1, t2):
    return int_to_time(time_to_int(t1) + time_to_int(t2))

print_time(add_time2(make_time(9, 45, 0), make_time(1, 35, 0)))
print(time_to_int(int_to_time(45296)) == 45296)` },
        demo: { w: 'timeLab', intro: 'Pure function versus modifier, side by side. Set a time and a number of seconds, then call each function. The pure function returns a new Time and leaves the original alone; the modifier changes the original.' },
        visual: { w: 'trace', intro: 'Watch the frames: add_time creates a new object (total) and returns it, while increment changes the object that start already refers to.', code: R`class Time:
    pass
def make_time(h, m, s):
    t = Time(); t.hour, t.minute, t.second = h, m, s
    return t
def add_time(t1, t2):
    total = make_time(t1.hour + t2.hour, t1.minute + t2.minute, t1.second + t2.second)
    return total
def increment(t, seconds):
    t.second += seconds
start = make_time(9, 45, 0)
later = add_time(start, make_time(1, 0, 0))
increment(start, 30)` },
        mistakes: [
          { wrong: R`def add_time(t1, t2):
    t1.hour += t2.hour
    return t1`, right: R`def add_time(t1, t2):
    total = Time()
    total.hour = t1.hour + t2.hour
    return total`, why: 'The first version is a modifier pretending to be pure: it changes t1 behind the caller’s back.' },
          { wrong: R`increment(t, 3600)
print(increment(t, 60))   # prints None`, right: R`increment(t, 60)
print_time(t)`, why: 'Modifiers usually return None; inspect the object instead.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Write <code>is_after(t1, t2)</code> that returns True if t1 follows t2 chronologically. (Hint: compare tuples <code>(hour, minute, second)</code>.)', starter: R`class Time:
    pass
def make_time(h, m, s):
    t = Time(); t.hour, t.minute, t.second = h, m, s
    return t
`, sol: R`class Time:
    pass
def make_time(h, m, s):
    t = Time(); t.hour, t.minute, t.second = h, m, s
    return t
def is_after(t1, t2):
    return (t1.hour, t1.minute, t1.second) > (t2.hour, t2.minute, t2.second)
print(is_after(make_time(10, 0, 0), make_time(9, 59, 59)), is_after(make_time(8, 0, 0), make_time(9, 0, 0)))`, expect: 'True False' },
          { lvl: 'Medium', q: 'Write a <em>pure</em> version of increment, <code>increment_pure(time, seconds)</code>, using <code>time_to_int</code> and <code>int_to_time</code>. Show the original is unchanged.', starter: R`class Time:
    pass
def make_time(h, m, s):
    t = Time(); t.hour, t.minute, t.second = h, m, s
    return t
def time_to_int(t):
    return (t.hour * 60 + t.minute) * 60 + t.second
def int_to_time(seconds):
    minutes, second = divmod(seconds, 60)
    hour, minute = divmod(minutes, 60)
    return make_time(hour, minute, second)
`, sol: R`class Time:
    pass
def make_time(h, m, s):
    t = Time(); t.hour, t.minute, t.second = h, m, s
    return t
def time_to_int(t):
    return (t.hour * 60 + t.minute) * 60 + t.second
def int_to_time(seconds):
    minutes, second = divmod(seconds, 60)
    hour, minute = divmod(minutes, 60)
    return make_time(hour, minute, second)
def increment_pure(time, seconds):
    return int_to_time(time_to_int(time) + seconds)
t = make_time(11, 59, 30)
n = increment_pure(t, 45)
print(t.hour, t.minute, t.second, '->', n.hour, n.minute, n.second)`, expect: '11 59 30 -> 12 0 15' },
          { lvl: 'Hard', q: 'Write <code>mul_time(t, factor)</code> (pure) that multiplies a duration by a number, and use it to compute the average lap time when 3 laps take 0:10:30 in total.', starter: R`class Time:
    pass
def make_time(h, m, s):
    t = Time(); t.hour, t.minute, t.second = h, m, s
    return t
def time_to_int(t):
    return (t.hour * 60 + t.minute) * 60 + t.second
def int_to_time(seconds):
    minutes, second = divmod(seconds, 60)
    hour, minute = divmod(minutes, 60)
    return make_time(hour, minute, second)
`, sol: R`class Time:
    pass
def make_time(h, m, s):
    t = Time(); t.hour, t.minute, t.second = h, m, s
    return t
def time_to_int(t):
    return (t.hour * 60 + t.minute) * 60 + t.second
def int_to_time(seconds):
    minutes, second = divmod(seconds, 60)
    hour, minute = divmod(minutes, 60)
    return make_time(hour, minute, second)
def mul_time(t, factor):
    return int_to_time(round(time_to_int(t) * factor))
avg = mul_time(make_time(0, 10, 30), 1 / 3)
print('%.2d:%.2d:%.2d' % (avg.hour, avg.minute, avg.second))`, expect: '00:03:30' }
        ],
        challenge: { q: 'Write <code>valid_time(t)</code> that checks the invariants (non-negative values, minute and second below 60) and use <code>assert valid_time(...)</code> inside <code>add_time</code> so bad inputs are caught early. Demonstrate it catching an invalid Time.', starter: '', sol: R`class Time:
    pass
def make_time(h, m, s):
    t = Time(); t.hour, t.minute, t.second = h, m, s
    return t
def valid_time(t):
    if t.hour < 0 or t.minute < 0 or t.second < 0:
        return False
    return t.minute < 60 and t.second < 60
def time_to_int(t):
    return (t.hour * 60 + t.minute) * 60 + t.second
def int_to_time(seconds):
    minutes, second = divmod(seconds, 60)
    hour, minute = divmod(minutes, 60)
    return make_time(hour, minute, second)
def add_time(t1, t2):
    assert valid_time(t1) and valid_time(t2), 'invalid Time object'
    return int_to_time(time_to_int(t1) + time_to_int(t2))

ok = add_time(make_time(1, 20, 0), make_time(0, 50, 0))
print(ok.hour, ok.minute, ok.second)
try:
    add_time(make_time(1, 75, 0), make_time(0, 0, 0))
except AssertionError as e:
    print('AssertionError:', e)`, expect: '2 10 0\nAssertionError: invalid Time object' },
        summary: ['Pure functions return results without modifying arguments.', 'Modifiers change the objects passed to them.', 'Prefer pure functions where practical.', 'Prototype-and-patch is quick but messy; designed development (time as base-60 integer) is simpler and verifiable.']
      },
      {
        id: 'm4-4', title: 'Classes and methods: __init__, __str__ and printing objects',
        covers: ['Classes and methods: Object-oriented features', 'Printing objects', 'Another example', 'The init method', 'The __str__ method'],
        concept: R`<p>Python is an <strong>object-oriented</strong> language. Its characteristic features: programs include class and method definitions; most computation is expressed as operations on objects; and objects often correspond to things in the real world (a Time object to a time of day, a Point to a point in space).</p>
<p>A <strong>method</strong> is a function defined inside a class. It is called on an object with dot notation — <code>start.print_time()</code> — and the object becomes the first parameter, conventionally named <code>self</code>. This changes the point of view from “call a function, pass it a Time” to “ask the Time to do something”.</p>
<p><strong>Printing objects:</strong> turning <code>print_time(t)</code> into a method <code>t.print_time()</code>.</p>
<p><strong>Another example:</strong> methods with extra parameters, such as <code>t.increment(seconds)</code> and <code>t1.is_after(t2)</code>.</p>
<p><strong><code>__init__</code></strong> (two underscores each side) is a special method invoked automatically when an object is instantiated. It usually assigns the initial attributes, and its parameters can have defaults: <code>Time()</code>, <code>Time(9)</code>, <code>Time(9, 45)</code>.</p>
<p><strong><code>__str__</code></strong> returns a string representation of the object. <code>print(obj)</code> and <code>str(obj)</code> call it; without it, print shows something like <code>&lt;__main__.Time object at 0x…&gt;</code>.</p>`,
        syntax: R`class Time:
    def __init__(self, hour=0, minute=0, second=0):
        self.hour = hour
        self.minute = minute
        self.second = second

    def __str__(self):
        return '%.2d:%.2d:%.2d' % (self.hour, self.minute, self.second)

    def print_time(self):
        print(str(self))

start = Time(9, 45)
start.print_time()      # same as Time.print_time(start)
print(start)            # uses __str__`,
        example: { code: R`class Time:
    """Represents the time of day."""

    def __init__(self, hour=0, minute=0, second=0):
        self.hour = hour
        self.minute = minute
        self.second = second

    def __str__(self):
        return '%.2d:%.2d:%.2d' % (self.hour, self.minute, self.second)

    def print_time(self):
        print(self)

    def time_to_int(self):
        return (self.hour * 60 + self.minute) * 60 + self.second

    def increment(self, seconds):           # "another example"
        return int_to_time(self.time_to_int() + seconds)

    def is_after(self, other):
        return self.time_to_int() > other.time_to_int()

def int_to_time(seconds):
    minutes, second = divmod(seconds, 60)
    hour, minute = divmod(minutes, 60)
    return Time(hour, minute, second)

start = Time(9, 45)
start.print_time()
Time.print_time(start)      # the same call, written as a function
end = start.increment(1337)
print(end)
print(end.is_after(start))
print(Time(), Time(9), Time(9, 45), Time(9, 45, 30))

class Plain:
    pass
print(Plain())              # no __str__: default representation` },
        demo: { w: 'classViz', mode: 'init', intro: 'Animate object creation. Fill in the arguments and press Create: the __init__ lines run one by one and each attribute appears on the new object, then __str__ produces its printable form. Objects are created by real Python.' },
        visual: { w: 'trace', intro: 'Trace instantiation: Time(9, 45) creates the object, then an __init__ frame appears with self referring to that new object.', code: R`class Time:
    def __init__(self, hour=0, minute=0, second=0):
        self.hour = hour
        self.minute = minute
        self.second = second

    def __str__(self):
        return '%.2d:%.2d:%.2d' % (self.hour, self.minute, self.second)

start = Time(9, 45)
text = str(start)
print(start)` },
        mistakes: [
          { wrong: R`class Time:
    def print_time():
        print(self.hour)`, right: R`class Time:
    def print_time(self):
        print(self.hour)`, why: 'A method needs self as its first parameter, otherwise calling t.print_time() raises TypeError: takes 0 positional arguments but 1 was given.' },
          { wrong: R`def _init_(self, hour):`, right: R`def __init__(self, hour):`, why: 'The special name has two underscores on each side. With one, it is an ordinary method that never runs automatically.' },
          { wrong: R`def __str__(self):
    print(self.hour)`, right: R`def __str__(self):
    return str(self.hour)`, why: '__str__ must return a string; printing inside it and returning None raises TypeError: __str__ returned non-string.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Write a <code>Point</code> class with <code>__init__(self, x=0, y=0)</code> and <code>__str__</code> returning <code>(x, y)</code>. Print <code>Point(3, 4)</code> and <code>Point()</code>.', starter: '', sol: R`class Point:
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y
    def __str__(self):
        return '(' + str(self.x) + ', ' + str(self.y) + ')'
print(Point(3, 4))
print(Point())`, expect: '(3, 4)\n(0, 0)' },
          { lvl: 'Medium', q: 'Create a <code>BankAccount</code> class with <code>owner</code> and <code>balance</code> (default 0), methods <code>deposit(amount)</code> and <code>withdraw(amount)</code> (refuse if insufficient funds) and a <code>__str__</code>.', starter: '', sol: R`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
    def deposit(self, amount):
        self.balance += amount
    def withdraw(self, amount):
        if amount > self.balance:
            print('Insufficient funds')
            return
        self.balance -= amount
    def __str__(self):
        return self.owner + ': Rs ' + str(self.balance)

acc = BankAccount('Asha')
acc.deposit(5000)
acc.withdraw(7000)
acc.withdraw(1200)
print(acc)`, expect: 'Insufficient funds\nAsha: Rs 3800' },
          { lvl: 'Hard', q: 'Give the Time class a method <code>duration_until(other)</code> returning a new Time equal to the difference. Print the duration from 09:45:00 to 13:10:20.', starter: R`class Time:
    def __init__(self, hour=0, minute=0, second=0):
        self.hour, self.minute, self.second = hour, minute, second
    def __str__(self):
        return '%.2d:%.2d:%.2d' % (self.hour, self.minute, self.second)
    def time_to_int(self):
        return (self.hour * 60 + self.minute) * 60 + self.second
`, sol: R`class Time:
    def __init__(self, hour=0, minute=0, second=0):
        self.hour, self.minute, self.second = hour, minute, second
    def __str__(self):
        return '%.2d:%.2d:%.2d' % (self.hour, self.minute, self.second)
    def time_to_int(self):
        return (self.hour * 60 + self.minute) * 60 + self.second
    def duration_until(self, other):
        diff = other.time_to_int() - self.time_to_int()
        m, s = divmod(diff, 60)
        h, m = divmod(m, 60)
        return Time(h, m, s)
print(Time(9, 45).duration_until(Time(13, 10, 20)))`, expect: '03:25:20' }
        ],
        challenge: { q: 'Design a <code>Kangaroo</code> class whose <code>__init__</code> takes an optional list <code>pouch_contents</code>. A common bug is <code>def __init__(self, contents=[])</code>: show that two kangaroos then share one pouch, and fix it with <code>None</code> as the default.', starter: '', sol: R`class BadKangaroo:
    def __init__(self, contents=[]):
        self.pouch = contents
    def put_in_pouch(self, item):
        self.pouch.append(item)

kanga, roo = BadKangaroo(), BadKangaroo()
kanga.put_in_pouch('wallet')
print('Bad:', roo.pouch)           # roo sees kanga's wallet!

class Kangaroo:
    def __init__(self, contents=None):
        self.pouch = [] if contents is None else list(contents)
    def put_in_pouch(self, item):
        self.pouch.append(item)
    def __str__(self):
        return 'Kangaroo with ' + str(self.pouch)

kanga, roo = Kangaroo(), Kangaroo()
kanga.put_in_pouch('wallet')
print(kanga)
print(roo)`, expect: "Bad: ['wallet']\nKangaroo with ['wallet']\nKangaroo with []" },
        summary: ['Methods are functions defined in a class; the object is passed as self.', 'obj.method(args) is equivalent to Class.method(obj, args).', '__init__ initialises attributes when an object is created; defaults make arguments optional.', '__str__ returns the printable string used by print() and str().']
      },
      {
        id: 'm4-5', title: 'Operator overloading, type-based dispatch and polymorphism',
        covers: ['Operator overloading', 'Type-based dispatch', 'Polymorphism'],
        concept: R`<p><strong>Operator overloading</strong> means defining special methods so operators work on your own types. Defining <code>__add__</code> makes <code>t1 + t2</code> call <code>t1.__add__(t2)</code>. Every operator has a special method: <code>__sub__</code> (−), <code>__mul__</code> (*), <code>__eq__</code> (==), <code>__lt__</code> (&lt;), <code>__len__</code> (<code>len()</code>), and so on.</p>
<p><strong>Type-based dispatch</strong> chooses what to do based on the type of an argument, typically with <code>isinstance()</code>: <code>Time + Time</code> adds two times, while <code>Time + int</code> adds seconds. If the object is on the right side (<code>1337 + start</code>), Python calls the right operand’s <code>__radd__</code>, which can simply reuse <code>__add__</code>.</p>
<p><strong>Polymorphism</strong>: functions that work with several types. <code>sum()</code> works on any objects that support addition (so it works on Time objects once <code>__add__</code> and <code>__radd__</code> exist); a <code>histogram(s)</code> function works on strings, lists or tuples — anything whose elements can be dictionary keys. Related classes that share method names (every shape has <code>area()</code>) let one loop treat them all alike. The best kind of polymorphism is unintentional: a function you already wrote turns out to work with a type you never planned for.</p>`,
        syntax: R`class Time:
    def __add__(self, other):
        if isinstance(other, Time):        # type-based dispatch
            return self.add_time(other)
        return self.increment(other)

    def __radd__(self, other):             # other + time
        return self.__add__(other)

    def __eq__(self, other):
        return self.time_to_int() == other.time_to_int()`,
        example: { code: R`class Time:
    def __init__(self, hour=0, minute=0, second=0):
        self.hour, self.minute, self.second = hour, minute, second

    def __str__(self):
        return '%.2d:%.2d:%.2d' % (self.hour, self.minute, self.second)

    def time_to_int(self):
        return (self.hour * 60 + self.minute) * 60 + self.second

    def __add__(self, other):
        if isinstance(other, Time):
            seconds = self.time_to_int() + other.time_to_int()
        else:
            seconds = self.time_to_int() + other
        return int_to_time(seconds)

    def __radd__(self, other):
        return self.__add__(other)

    def __eq__(self, other):
        return isinstance(other, Time) and self.time_to_int() == other.time_to_int()

def int_to_time(seconds):
    minutes, second = divmod(seconds, 60)
    hour, minute = divmod(minutes, 60)
    return Time(hour, minute, second)

start = Time(9, 45)
duration = Time(1, 35)
print(start + duration)     # Time + Time
print(start + 1337)         # Time + int
print(1337 + start)         # int + Time -> __radd__
print(Time(1, 0) == Time(0, 60))

laps = [Time(0, 7, 30), Time(0, 7, 45), Time(0, 8, 5)]
print(sum(laps))            # polymorphism: sum() works because + and __radd__ exist

def histogram(s):
    d = {}
    for c in s:
        d[c] = d.get(c, 0) + 1
    return d

print(histogram('banana'))
print(histogram(['spam', 'egg', 'spam', 'spam', 'bacon', 'spam']))` },
        demo: { w: 'code', intro: 'A Vector class with overloaded operators, and polymorphism across related shape classes that share the method names area() and __str__(). Add your own shape class and it works in the same loop.', code: R`import math

class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)
    def __mul__(self, k):                  # vector * number
        return Vector(self.x * k, self.y * k)
    __rmul__ = __mul__                     # number * vector
    def __abs__(self):
        return math.hypot(self.x, self.y)
    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)
    def __str__(self):
        return 'Vector(' + str(self.x) + ', ' + str(self.y) + ')'

a, b = Vector(3, 4), Vector(1, 2)
print(a + b, a - b, a * 2, 3 * b, abs(a), a == Vector(3, 4))

class Shape:
    def area(self):
        raise NotImplementedError
    def __str__(self):
        return type(self).__name__ + ' with area ' + str(round(self.area(), 2))

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return math.pi * self.r ** 2

class Rectangle(Shape):
    def __init__(self, w, h): self.w, self.h = w, h
    def area(self): return self.w * self.h

class Triangle(Shape):
    def __init__(self, b, h): self.b, self.h = b, h
    def area(self): return 0.5 * self.b * self.h

for shape in [Circle(1), Rectangle(3, 4), Triangle(6, 2)]:
    print(shape)                           # same call, different behaviour
print('Total area:', round(sum(s.area() for s in [Circle(1), Rectangle(3, 4)]), 2))` },
        visual: { html: R`<table class="ref"><thead><tr><th>You write</th><th>Python calls</th></tr></thead><tbody>
<tr><td><code>a + b</code></td><td><code>a.__add__(b)</code>, or <code>b.__radd__(a)</code> if that is not defined/returns NotImplemented</td></tr>
<tr><td><code>a - b</code>, <code>a * b</code></td><td><code>__sub__</code>, <code>__mul__</code> (<code>__rmul__</code> for <code>3 * a</code>)</td></tr>
<tr><td><code>a == b</code>, <code>a &lt; b</code></td><td><code>__eq__</code>, <code>__lt__</code></td></tr>
<tr><td><code>len(a)</code>, <code>abs(a)</code>, <code>str(a)</code></td><td><code>__len__</code>, <code>__abs__</code>, <code>__str__</code></td></tr>
</tbody></table>
<div class="dispatch"><b>Type-based dispatch in <code>Time.__add__</code>:</b> <code>isinstance(other, Time)</code> → add two times; otherwise → treat <code>other</code> as seconds.</div>` },
        mistakes: [
          { wrong: R`print(1337 + start)   # only __add__ defined`, right: R`def __radd__(self, other):
    return self.__add__(other)`, why: "Without __radd__, int + Time raises TypeError: unsupported operand type(s) for +: 'int' and 'Time'." },
          { wrong: R`def __add__(self, other):
    self.x += other.x
    return self`, right: R`def __add__(self, other):
    return Vector(self.x + other.x, self.y + other.y)`, why: 'a + b should not change a. Return a new object.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Add <code>__eq__</code> to a Point class so that two points with the same coordinates compare equal.', starter: R`class Point:
    def __init__(self, x=0, y=0):
        self.x, self.y = x, y
`, sol: R`class Point:
    def __init__(self, x=0, y=0):
        self.x, self.y = x, y
    def __eq__(self, other):
        return isinstance(other, Point) and (self.x, self.y) == (other.x, other.y)
print(Point(1, 2) == Point(1, 2), Point(1, 2) == Point(2, 1))`, expect: 'True False' },
          { lvl: 'Medium', q: 'Give Point an <code>__add__</code> with type-based dispatch: Point + Point adds coordinates; Point + tuple adds the tuple’s values. Add <code>__radd__</code> and a <code>__str__</code>.', starter: '', sol: R`class Point:
    def __init__(self, x=0, y=0):
        self.x, self.y = x, y
    def __add__(self, other):
        if isinstance(other, Point):
            return Point(self.x + other.x, self.y + other.y)
        return Point(self.x + other[0], self.y + other[1])
    def __radd__(self, other):
        return self.__add__(other)
    def __str__(self):
        return '(' + str(self.x) + ', ' + str(self.y) + ')'
print(Point(1, 2) + Point(3, 4))
print(Point(1, 2) + (10, 20))
print((10, 20) + Point(1, 2))`, expect: '(4, 6)\n(11, 22)\n(11, 22)' },
          { lvl: 'Hard', q: 'Create a <code>Fraction</code> class with <code>__add__</code>, <code>__mul__</code>, <code>__eq__</code> and <code>__str__</code>, always storing the fraction in lowest terms (use <code>math.gcd</code>). Show that 1/2 + 1/3 = 5/6 and 2/4 == 1/2.', starter: R`import math
`, sol: R`import math
class Fraction:
    def __init__(self, num, den=1):
        g = math.gcd(num, den)
        self.num, self.den = num // g, den // g
    def __add__(self, other):
        return Fraction(self.num * other.den + other.num * self.den, self.den * other.den)
    def __mul__(self, other):
        return Fraction(self.num * other.num, self.den * other.den)
    def __eq__(self, other):
        return (self.num, self.den) == (other.num, other.den)
    def __str__(self):
        return str(self.num) + '/' + str(self.den)
print(Fraction(1, 2) + Fraction(1, 3))
print(Fraction(2, 3) * Fraction(3, 4))
print(Fraction(2, 4) == Fraction(1, 2))`, expect: '5/6\n1/2\nTrue' }
        ],
        challenge: { q: 'Polymorphism across circuit elements: create classes <code>Resistor</code>, <code>Capacitor</code> and <code>Inductor</code>, each with <code>impedance(f)</code> returning the magnitude in ohms (R; 1/(2πfC); 2πfL). Write one function that prints the impedance of any list of elements at 1 kHz.', starter: R`import math
`, sol: R`import math
class Resistor:
    def __init__(self, r): self.r = r
    def impedance(self, f): return self.r
    def __str__(self): return 'R=' + str(self.r)

class Capacitor:
    def __init__(self, c): self.c = c
    def impedance(self, f): return 1 / (2 * math.pi * f * self.c)
    def __str__(self): return 'C=' + str(self.c)

class Inductor:
    def __init__(self, l): self.l = l
    def impedance(self, f): return 2 * math.pi * f * self.l
    def __str__(self): return 'L=' + str(self.l)

def report(parts, f):
    for p in parts:
        print(str(p).ljust(10), round(p.impedance(f), 2), 'ohm')

report([Resistor(470), Capacitor(1e-6), Inductor(0.01)], 1000)`, expect: 'R=470      470 ohm\nC=1e-06    159.15 ohm\nL=0.01     62.83 ohm' },
        summary: ['Special methods (__add__, __eq__, __str__…) overload operators and built-ins.', 'Type-based dispatch uses isinstance() to choose behaviour.', '__radd__ handles the object on the right of +.', 'Polymorphic functions work with any type that supports the operations they use.']
      }
    ]
  });
})();
