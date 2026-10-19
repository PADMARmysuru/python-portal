(function () {
  'use strict';
  const R = String.raw;
  const PHONE_TEXT = 'Call me at 415-555-1011 tomorrow. 415-555-9999 is my office. Lab: 080-2345-6789.';
  window.PP.addModule({
    n: 3, title: 'Regular Expressions and Files', co: 3,
    blurb: 'Find text patterns with the re module, then read, write and organise files and saved data.',
    lessons: [
      {
        id: 'm3-1', title: 'Pattern matching: finding text without regular expressions',
        covers: ['Pattern Matching with Regular Expressions', 'Finding Patterns of Text Without Regular Expressions'],
        concept: R`<p><strong>Pattern matching</strong> means finding text that has a certain <em>shape</em> rather than exact content: “three digits, a hyphen, three digits, a hyphen, four digits” describes every phone number in that format. <code>Ctrl+F</code> finds exact text only; regular expressions (regexes) describe shapes.</p>
<p>To appreciate regexes, first solve the problem without them. A function <code>is_phone_number(text)</code> can check a 12-character string one position at a time: are characters 0–2 digits? Is character 3 a hyphen? … To find numbers <em>inside</em> a longer message, slide a 12-character window across every position and test each chunk.</p>
<p>It works, but it is long, fixed to one format, and every new format (spaces instead of hyphens, an area code in brackets, an extension) needs more code. A regex expresses the same pattern in one line: <code>\d\d\d-\d\d\d-\d\d\d\d</code>.</p>`,
        syntax: R`def is_phone_number(text):
    if len(text) != 12:
        return False
    for i in range(0, 3):
        if not text[i].isdecimal():
            return False
    if text[3] != '-':
        return False
    ...
    return True`,
        example: { code: R`def is_phone_number(text):
    if len(text) != 12:
        return False
    for i in range(0, 3):
        if not text[i].isdecimal():
            return False
    if text[3] != '-':
        return False
    for i in range(4, 7):
        if not text[i].isdecimal():
            return False
    if text[7] != '-':
        return False
    for i in range(8, 12):
        if not text[i].isdecimal():
            return False
    return True

print('415-555-4242 is a phone number:', is_phone_number('415-555-4242'))
print('Moshi moshi is a phone number:', is_phone_number('Moshi moshi'))

message = 'Call me at 415-555-1011 tomorrow. 415-555-9999 is my office.'
for i in range(len(message)):
    chunk = message[i:i + 12]
    if is_phone_number(chunk):
        print('Phone number found: ' + chunk)
print('Done')` },
        demo: { w: 'pair', intro: 'The same search, two ways. Both programs scan the same message; compare the amount of code, then try adding a number in a different format to the message in both.', left: { title: 'Ordinary string search', code: R`message = '${PHONE_TEXT}'

def is_phone(t):
    return (len(t) == 12 and t[3] == '-' and t[7] == '-'
            and t[:3].isdecimal() and t[4:7].isdecimal() and t[8:].isdecimal())

found = []
for i in range(len(message) - 11):
    if is_phone(message[i:i + 12]):
        found.append(message[i:i + 12])
print(found)
print('in' in message, message.find('415'))` }, right: { title: 'Regex search', code: R`import re
message = '${PHONE_TEXT}'

phone = re.compile(r'\d{3}-\d{3}-\d{4}')
print(phone.findall(message))

# one small change also accepts 080-2345-6789:
flexible = re.compile(r'\d{3}-\d{3,4}-\d{4}')
print(flexible.findall(message))` } },
        visual: { html: R`<div class="window-demo" aria-label="Sliding window illustration">
<p>The manual approach tests every 12-character window of the message:</p>
<pre class="code-static"><code>Call me at 415-555-1011 tomorrow.
           [415-555-1011]   ← is_phone_number() returns True
          [ 415-555-101]    ← False (character 0 is a space)
            [15-555-1011 ]  ← False (character 3 is '-'? no: '5')</code></pre>
<p>A regex engine performs a similar scan internally, but you only describe the pattern.</p></div>` },
        mistakes: [
          { wrong: R`'415-555-4242' in message   # to find any phone number`, right: R`re.findall(r'\d{3}-\d{3}-\d{4}', message)`, why: 'in and find() look for exact text only; they cannot match “any digits”.' },
          { wrong: R`for i in range(len(message)):
    if is_phone(message[i:i+12]): ...`, right: R`for i in range(len(message) - 11):`, why: 'Near the end, slices are shorter than 12 characters; is_phone must reject them (or the loop must stop earlier).' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Without regexes, write <code>is_pincode(text)</code> that returns True for a 6-digit Indian PIN code such as <code>\'560001\'</code>. Test it on <code>\'560001\'</code> and <code>\'56A001\'</code>.', starter: '', sol: R`def is_pincode(text):
    return len(text) == 6 and text.isdecimal()
print(is_pincode('560001'), is_pincode('56A001'))`, expect: 'True False' },
          { lvl: 'Medium', q: 'Without regexes, find every 6-digit PIN code in <code>\'Office 560001, branch 572103, plot 12345.\'</code> by sliding a window — but reject digits that are part of a longer number.', starter: R`text = 'Office 560001, branch 572103, plot 12345.'
`, sol: R`text = 'Office 560001, branch 572103, plot 12345.'
found = []
for i in range(len(text) - 5):
    chunk = text[i:i + 6]
    before = text[i - 1] if i > 0 else ' '
    after = text[i + 6] if i + 6 < len(text) else ' '
    if chunk.isdecimal() and not before.isdecimal() and not after.isdecimal():
        found.append(chunk)
print(found)`, expect: "['560001', '572103']" },
          { lvl: 'Hard', q: 'Without regexes, write <code>is_time(t)</code> that accepts 24-hour times <code>HH:MM</code> from 00:00 to 23:59. Test <code>\'09:45\'</code>, <code>\'24:00\'</code>, <code>\'7:30\'</code>.', starter: '', sol: R`def is_time(t):
    if len(t) != 5 or t[2] != ':':
        return False
    hh, mm = t[:2], t[3:]
    if not (hh.isdecimal() and mm.isdecimal()):
        return False
    return int(hh) < 24 and int(mm) < 60

print(is_time('09:45'), is_time('24:00'), is_time('7:30'))`, expect: 'True False False' }
        ],
        challenge: { q: 'Extend the manual phone finder so that it also accepts the format <code>(415) 555-4242</code>. Notice how much code each new format adds — this is the motivation for regexes.', starter: '', sol: R`def is_phone(t):
    if len(t) == 12:
        return t[3] == '-' and t[7] == '-' and t[:3].isdecimal() and t[4:7].isdecimal() and t[8:].isdecimal()
    if len(t) == 14:
        return (t[0] == '(' and t[4] == ')' and t[5] == ' ' and t[9] == '-'
                and t[1:4].isdecimal() and t[6:9].isdecimal() and t[10:].isdecimal())
    return False

msg = 'Home (415) 555-4242, work 415-555-1011.'
found = []
for size in (12, 14):
    for i in range(len(msg) - size + 1):
        if is_phone(msg[i:i + size]):
            found.append(msg[i:i + size])
print(found)`, expect: "['415-555-1011', '(415) 555-4242']" },
        summary: ['Pattern matching finds text by its shape, not its exact content.', 'Without regexes you must check characters one position at a time.', 'Manual matchers are long and rigid; regexes describe patterns concisely.']
      },
      {
        id: 'm3-2', title: 'Finding patterns with regular expressions and groups',
        covers: ['Finding Patterns of Text with Regular Expressions'],
        concept: R`<p>All regex functions live in the <code>re</code> module. Using a regex takes four steps:</p>
<ol><li><code>import re</code></li>
<li>Create a <strong>Regex object</strong> with <code>re.compile()</code>, passing the pattern as a <strong>raw string</strong> (<code>r'...'</code>) so backslashes reach the regex engine untouched.</li>
<li>Call <code>search()</code> with the text. It returns a <strong>Match object</strong> for the first match, or <code>None</code>.</li>
<li>Call the Match object’s <code>group()</code> method to get the matched text.</li></ol>
<p><code>\d</code> matches one digit, so <code>\d\d\d-\d\d\d-\d\d\d\d</code> matches a phone number; <code>\d{3}</code> is shorthand for three digits.</p>
<p><strong>Grouping with parentheses</strong>: <code>(\d\d\d)-(\d\d\d-\d\d\d\d)</code> creates group 1 (area code) and group 2 (the rest). <code>group(1)</code>, <code>group(2)</code> return each group; <code>group()</code> or <code>group(0)</code> is the whole match; <code>groups()</code> returns a tuple of all groups. To match a literal parenthesis, escape it: <code>\(</code> and <code>\)</code>.</p>`,
        syntax: R`import re
phone_regex = re.compile(r'(\d{3})-(\d{3}-\d{4})')
mo = phone_regex.search('My number is 415-555-4242.')
mo.group()     # '415-555-4242'
mo.group(1)    # '415'
mo.groups()    # ('415', '555-4242')`,
        example: { code: R`import re

phone_num_regex = re.compile(r'\d\d\d-\d\d\d-\d\d\d\d')
mo = phone_num_regex.search('My number is 415-555-4242.')
print('Phone number found: ' + mo.group())

phone_num_regex = re.compile(r'(\d\d\d)-(\d\d\d-\d\d\d\d)')
mo = phone_num_regex.search('My number is 415-555-4242.')
print(mo.group(1), mo.group(2), mo.group(0))
area_code, main_number = mo.groups()
print(area_code, main_number)

bracketed = re.compile(r'(\(\d\d\d\)) (\d\d\d-\d\d\d\d)')
mo = bracketed.search('My phone number is (415) 555-4242.')
print(mo.group(1), mo.group(2))

print(phone_num_regex.search('No numbers here'))   # None` },
        demo: { w: 'regex', intro: 'A regular-expression playground running Python’s re module. Edit the pattern or text: matches are highlighted, and each match lists its position and groups.', presets: [
          { label: 'Phone number', pattern: R`\d\d\d-\d\d\d-\d\d\d\d`, text: PHONE_TEXT, func: 'search' },
          { label: 'Two groups', pattern: R`(\d{3})-(\d{3}-\d{4})`, text: PHONE_TEXT, func: 'search' },
          { label: 'Escaped brackets', pattern: R`(\(\d{3}\)) (\d{3}-\d{4})`, text: 'Home (415) 555-4242, work (080) 234-5678.', func: 'findall' }
        ] },
        visual: { html: R`<div class="regex-steps">
<div><b>Pattern</b><code>(\d{3})-(\d{3}-\d{4})</code></div>
<div><b>Text</b><code>My number is <mark>415</mark>-<mark class="g2">555-4242</mark>.</code></div>
<div><b>Match object</b><code>&lt;re.Match object; span=(13, 25), match='415-555-4242'&gt;</code></div>
<div><b>group(1)</b><code>'415'</code> <b>group(2)</b><code>'555-4242'</code></div>
</div>` },
        mistakes: [
          { wrong: R`re.compile('\d\d\d')`, right: R`re.compile(r'\d\d\d')`, why: 'Without the r prefix, Python processes backslash escapes first; \d happens to survive but \b (backspace!) and others do not. Always use raw strings for regexes.' },
          { wrong: R`mo = regex.search(text)
print(mo.group())`, right: R`mo = regex.search(text)
if mo:
    print(mo.group())`, why: "When nothing matches, search() returns None and None.group() raises AttributeError: 'NoneType' object has no attribute 'group'." }
        ],
        practice: [
          { lvl: 'Easy', q: 'Use <code>re.compile()</code> and <code>search()</code> to find the first 6-digit PIN code in <code>\'Ship to Bengaluru 560001 by Friday\'</code>.', starter: R`import re
text = 'Ship to Bengaluru 560001 by Friday'
`, sol: R`import re
text = 'Ship to Bengaluru 560001 by Friday'
mo = re.compile(r'\d{6}').search(text)
print(mo.group())`, expect: '560001' },
          { lvl: 'Medium', q: 'Use two groups to split <code>\'Date: 2025-08-15\'</code> into year and the month-day part, and print them with <code>groups()</code>.', starter: R`import re
`, sol: R`import re
mo = re.search(r'(\d{4})-(\d{2}-\d{2})', 'Date: 2025-08-15')
print(mo.groups())`, expect: "('2025', '08-15')" },
          { lvl: 'Hard', q: 'Extract the course code and course name from <code>\'Course 1BEC305 (Python Programming) has 3 credits\'</code> using groups; note that the brackets in the text must be escaped.', starter: R`import re
text = 'Course 1BEC305 (Python Programming) has 3 credits'
`, sol: R`import re
text = 'Course 1BEC305 (Python Programming) has 3 credits'
mo = re.search(r'(\d[A-Z]{3}\d{3}) \((.+)\)', text)
print(mo.group(1))
print(mo.group(2))`, expect: '1BEC305\nPython Programming' }
        ],
        challenge: { q: 'Parse a VTU-style USN such as <code>1GS23EC045</code> into region (1 digit), college code (2 letters), year (2 digits), branch (2 letters) and roll number (3 digits) using five groups. Print them as a dictionary.', starter: R`import re
usn = '1GS23EC045'
`, sol: R`import re
usn = '1GS23EC045'
mo = re.compile(r'(\d)([A-Z]{2})(\d{2})([A-Z]{2})(\d{3})').search(usn)
keys = ['region', 'college', 'year', 'branch', 'roll']
print(dict(zip(keys, mo.groups())))`, expect: "{'region': '1', 'college': 'GS', 'year': '23', 'branch': 'EC', 'roll': '045'}" },
        summary: ['import re → re.compile(r"...") → search() → group().', 'search() returns a Match object or None.', 'Parentheses create groups; group(n), groups().', 'Escape literal parentheses as \\( and \\).']
      },
      {
        id: 'm3-3', title: 'More pattern matching: alternation, optional and repeated parts',
        covers: ['More Pattern Matching with Regular Expressions'],
        concept: R`<table class="ref"><thead><tr><th>Syntax</th><th>Meaning</th><th>Example</th></tr></thead><tbody>
<tr><td><code>a|b</code></td><td>pipe: either expression (first match wins)</td><td><code>Batman|Tina Fey</code>; <code>Bat(man|mobile|copter)</code></td></tr>
<tr><td><code>?</code></td><td>the preceding group/char is optional (zero or one)</td><td><code>Bat(wo)?man</code> matches Batman and Batwoman</td></tr>
<tr><td><code>*</code></td><td>zero or more</td><td><code>Bat(wo)*man</code> also matches Batwowowoman</td></tr>
<tr><td><code>+</code></td><td>one or more</td><td><code>Bat(wo)+man</code> does not match Batman</td></tr>
<tr><td><code>{n}</code></td><td>exactly n times</td><td><code>(Ha){3}</code> → HaHaHa</td></tr>
<tr><td><code>{n,m}</code>, <code>{n,}</code>, <code>{,m}</code></td><td>between n and m; n or more; up to m</td><td><code>(Ha){3,5}</code></td></tr>
<tr><td><code>{n,m}?</code>, <code>*?</code>, <code>+?</code></td><td>non-greedy: match as little as possible</td><td><code>(Ha){3,5}?</code> → HaHaHa</td></tr>
</tbody></table>
<p>Quantifiers are <strong>greedy</strong> by default: given <code>HaHaHaHaHa</code>, <code>(Ha){3,5}</code> takes all five. Adding <code>?</code> after the braces makes it <strong>non-greedy</strong>. (The same character <code>?</code> therefore means two different things: “optional” after a group, “non-greedy” after a quantifier.)</p>
<p>To match a literal <code>|</code>, <code>?</code>, <code>*</code> or <code>+</code>, escape it with a backslash.</p>`,
        syntax: R`re.compile(r'Bat(man|mobile|copter|bat)')
re.compile(r'Bat(wo)?man')
re.compile(r'(\d{3}-)?\d{3}-\d{4}')   # optional area code
re.compile(r'(Ha){3,5}')    # greedy
re.compile(r'(Ha){3,5}?')   # non-greedy`,
        example: { code: R`import re

hero = re.compile(r'Batman|Tina Fey')
print(hero.search('Batman and Tina Fey').group())

bat = re.compile(r'Bat(man|mobile|copter|bat)')
mo = bat.search('Batmobile lost a wheel')
print(mo.group(), mo.group(1))

bat_opt = re.compile(r'Bat(wo)?man')
print(bat_opt.search('The Adventures of Batwoman').group())

phone = re.compile(r'(\d\d\d-)?\d\d\d-\d\d\d\d')
print(phone.search('My number is 555-4242').group())

print(re.compile(r'Bat(wo)*man').search('Batwowowowoman').group())
print(re.compile(r'Bat(wo)+man').search('The Adventures of Batman'))

greedy = re.compile(r'(Ha){3,5}')
lazy = re.compile(r'(Ha){3,5}?')
print(greedy.search('HaHaHaHaHa').group(), lazy.search('HaHaHaHaHa').group())` },
        demo: { w: 'regex', intro: 'Try the alternation and repetition presets, then switch greedy to non-greedy by adding or removing ? after the braces.', presets: [
          { label: 'Pipe in a group', pattern: R`Bat(man|mobile|copter|bat)`, text: 'Batman drove the Batmobile; the Batcopter waited. Batbat?', func: 'findall' },
          { label: 'Optional ?', pattern: R`Bat(wo)?man`, text: 'Batman met Batwoman and Batwowoman.', func: 'search' },
          { label: 'Zero or more *', pattern: R`Bat(wo)*man`, text: 'Batman, Batwoman, Batwowowoman', func: 'search' },
          { label: 'Greedy {3,5}', pattern: R`(Ha){3,5}`, text: 'HaHaHaHaHa', func: 'search' },
          { label: 'Non-greedy {3,5}?', pattern: R`(Ha){3,5}?`, text: 'HaHaHaHaHa', func: 'search' },
          { label: 'Optional area code', pattern: R`(\d{3}-)?\d{3}-\d{4}`, text: 'Call 555-4242 or 415-555-1011.', func: 'search' }
        ] },
        visual: { html: R`<div class="greedy-vis">
<p><b>Text:</b> <code>HaHaHaHaHa</code></p>
<p><b><code>(Ha){3,5}</code></b> — greedy: <code><mark>HaHaHaHaHa</mark></code> (takes the maximum, 5)</p>
<p><b><code>(Ha){3,5}?</code></b> — non-greedy: <code><mark>HaHaHa</mark>HaHa</code> (stops at the minimum, 3)</p>
<p><b><code>&lt;.*&gt;</code></b> on <code>&lt;b&gt;bold&lt;/b&gt;</code> — greedy: the whole string. <b><code>&lt;.*?&gt;</code></b> — just <code>&lt;b&gt;</code>.</p>
</div>` },
        mistakes: [
          { wrong: R`re.compile(r'colou?r|COLOR')   # expecting case-insensitive`, right: R`re.compile(r'colou?r', re.IGNORECASE)`, why: 'Use the re.IGNORECASE (re.I) flag rather than listing case variants.' },
          { wrong: R`re.compile(r'Why?')   # to match "Why?"`, right: R`re.compile(r'Why\?')`, why: 'Unescaped ? makes the y optional, so it matches "Wh" and "Why" but never the question mark.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Write one regex that matches both <code>colour</code> and <code>color</code> and use <code>findall</code> on <code>\'The colour and the color differ.\'</code>.', starter: R`import re
`, sol: R`import re
print(re.findall(r'colou?r', 'The colour and the color differ.'))`, expect: "['colour', 'color']" },
          { lvl: 'Medium', q: 'Match an Indian mobile number that may start with an optional <code>+91 </code> prefix followed by 10 digits. Search <code>\'Reach me on +91 9876543210 today\'</code> and <code>\'or 9123456780\'</code>.', starter: R`import re
`, sol: R`import re
mobile = re.compile(r'(\+91 )?\d{10}')
print(mobile.search('Reach me on +91 9876543210 today').group())
print(mobile.search('or 9123456780').group())`, expect: '+91 9876543210\n9123456780' },
          { lvl: 'Hard', q: 'Given the HTML-like text <code>\'&lt;b&gt;bold&lt;/b&gt; and &lt;i&gt;italic&lt;/i&gt;\'</code>, print every tag with a non-greedy pattern, and show what the greedy version matches instead.', starter: R`import re
html = '<b>bold</b> and <i>italic</i>'
`, sol: R`import re
html = '<b>bold</b> and <i>italic</i>'
print(re.findall(r'<.*?>', html))
print(re.search(r'<.*>', html).group())`, expect: "['<b>', '</b>', '<i>', '</i>']\n<b>bold</b> and <i>italic</i>" }
        ],
        challenge: { q: 'Write a regex that recognises resistor values like <code>4.7k</code>, <code>220</code>, <code>1M</code>, <code>10k</code>, <code>2.2M</code> (a number with optional decimal part and an optional k or M suffix, followed by the word <code>ohm</code> with an optional s). Use findall with a group around the value.', starter: R`import re
text = 'Use 4.7k ohm, 220 ohms, 1M ohm and 2.2M ohms; avoid 10kohm typos.'
`, sol: R`import re
text = 'Use 4.7k ohm, 220 ohms, 1M ohm and 2.2M ohms; avoid 10kohm typos.'
print(re.findall(r'(\d+(?:\.\d+)?[kM]?) ohms?', text))`, expect: "['4.7k', '220', '1M', '2.2M']" },
        summary: ['| means either; inside a group it shares a prefix.', '? optional, * zero or more, + one or more, {n,m} a range of repetitions.', 'Quantifiers are greedy; append ? for non-greedy.', 'Escape | ? * + when you mean the literal characters.']
      },
      {
        id: 'm3-4', title: 'findall(), character classes and your own classes',
        covers: ['The findall() Method', 'Character Classes', 'Making Your Own Character Classes'],
        concept: R`<p><strong><code>findall()</code></strong> returns <em>every</em> match, not just the first. What it returns depends on groups:</p>
<ul><li>No groups → a list of strings: <code>['415-555-9999', '212-555-0000']</code>.</li>
<li>With groups → a list of tuples, one string per group: <code>[('415', '555', '9999'), …]</code>.</li></ul>
<p><strong>Shorthand character classes</strong>:</p>
<table class="ref"><tbody>
<tr><td><code>\d</code></td><td>any digit 0–9</td><td><code>\D</code></td><td>any character that is not a digit</td></tr>
<tr><td><code>\w</code></td><td>letter, digit or underscore (“word” character)</td><td><code>\W</code></td><td>anything else</td></tr>
<tr><td><code>\s</code></td><td>space, tab or newline</td><td><code>\S</code></td><td>any non-whitespace</td></tr>
</tbody></table>
<p><strong>Your own character class</strong> lists allowed characters in square brackets: <code>[aeiouAEIOU]</code> matches any vowel; ranges use a hyphen: <code>[a-zA-Z0-9]</code>. Inside brackets, ordinary regex symbols such as <code>.</code> <code>*</code> <code>?</code> are literal and need no escaping. A caret right after <code>[</code> makes a <strong>negative class</strong>: <code>[^aeiouAEIOU]</code> matches anything that is not a vowel.</p>`,
        syntax: R`re.findall(r'\d{3}-\d{3}-\d{4}', text)       # list of strings
re.findall(r'(\d{3})-(\d{3})-(\d{4})', text) # list of tuples
re.findall(r'\d+\s\w+', text)                # '12 drummers'
re.findall(r'[aeiouAEIOU]', text)
re.findall(r'[^aeiouAEIOU]', text)`,
        example: { code: R`import re
text = 'Cell: 415-555-9999 Work: 212-555-0000'
print(re.compile(r'\d\d\d-\d\d\d-\d\d\d\d').findall(text))
print(re.compile(r'(\d\d\d)-(\d\d\d)-(\d\d\d\d)').findall(text))

xmas = re.compile(r'\d+\s\w+')
print(xmas.findall('12 drummers, 11 pipers, 10 lords, 9 ladies, 8 maids, '
                   '7 swans, 6 geese, 5 rings, 4 birds, 3 hens, 2 doves, 1 partridge'))

vowels = re.compile(r'[aeiouAEIOU]')
print(vowels.findall('RoboCop eats baby food. BABY FOOD.'))
consonants = re.compile(r'[^aeiouAEIOU]')
print(''.join(consonants.findall('RoboCop eats baby food.')))
print(re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
                 'Mail asha.k@gsss.edu.in or help@example.com today'))` },
        demo: { w: 'regex', intro: 'Character classes in action. Use the presets, then build your own class — for example [A-F0-9] for hexadecimal digits.', presets: [
          { label: '\\d digits', pattern: R`\d+`, text: 'Room 101, block 3, 2025 batch, 60 students', func: 'findall' },
          { label: '\\w words', pattern: R`\w+`, text: 'snake_case, camelCase and 1BEC305!', func: 'findall' },
          { label: '\\s whitespace', pattern: R`\s+`, text: 'tabs\tand  spaces\nand newlines', func: 'findall' },
          { label: 'Number + word', pattern: R`\d+\s\w+`, text: '12 drummers, 11 pipers, 10 lords, 9 ladies', func: 'findall' },
          { label: 'Vowel class', pattern: R`[aeiouAEIOU]`, text: 'RoboCop eats baby food. BABY FOOD.', func: 'findall' },
          { label: 'Negated class', pattern: R`[^aeiouAEIOU\s]`, text: 'RoboCop eats baby food.', func: 'findall' },
          { label: 'Email-like', pattern: R`[\w.+-]+@[\w-]+(\.[\w-]+)+`, text: 'Mail asha.k@gsss.edu.in or help@example.com', func: 'findall' }
        ] },
        visual: { html: R`<div class="class-grid">
<div><code>\d</code><span>0 1 2 … 9</span></div><div><code>\w</code><span>a–z A–Z 0–9 _</span></div><div><code>\s</code><span>space \t \n</span></div>
<div><code>[aeiou]</code><span>only these five</span></div><div><code>[a-f0-9]</code><span>ranges</span></div><div><code>[^0-9]</code><span>anything but digits</span></div>
</div>
<p class="muted">Notice in the email preset: findall returns only the text of the group (the last <code>.xxx</code> part) because the pattern contains a group. Use <code>(?:…)</code> for a non-capturing group to get whole matches.</p>` },
        mistakes: [
          { wrong: R`re.findall(r'(\d{3})-\d{4}', text)   # expecting whole numbers`, right: R`re.findall(r'\d{3}-\d{4}', text)
# or a non-capturing group: r'(?:\d{3})-\d{4}'`, why: 'When a pattern contains groups, findall returns the groups, not the whole match.' },
          { wrong: R`re.findall(r'[0-9]+.[0-9]+', '3x5')`, right: R`re.findall(r'[0-9]+\.[0-9]+', '3x5')`, why: 'Outside brackets an unescaped . matches any character, so 3x5 matches. Escape it, or write [.].' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Find every number (one or more digits) in <code>\'12 apples, 5 mangoes and 120 grapes\'</code>.', starter: R`import re
`, sol: R`import re
print(re.findall(r'\d+', '12 apples, 5 mangoes and 120 grapes'))`, expect: "['12', '5', '120']" },
          { lvl: 'Medium', q: 'Extract every hexadecimal colour like <code>#1a2B3c</code> (a # followed by exactly 6 hex digits) from <code>\'navy #14213D, teal #0E8C8C, bad #12G456, lavender #E9E4F7\'</code>.', starter: R`import re
text = 'navy #14213D, teal #0E8C8C, bad #12G456, lavender #E9E4F7'
`, sol: R`import re
text = 'navy #14213D, teal #0E8C8C, bad #12G456, lavender #E9E4F7'
print(re.findall(r'#[0-9a-fA-F]{6}', text))`, expect: "['#14213D', '#0E8C8C', '#E9E4F7']" },
          { lvl: 'Hard', q: 'Use findall with groups to turn <code>\'Asha:88, Ravi:74, Meera:91\'</code> into a dictionary of name → integer marks.', starter: R`import re
`, sol: R`import re
pairs = re.findall(r'(\w+):(\d+)', 'Asha:88, Ravi:74, Meera:91')
print({name: int(m) for name, m in pairs})`, expect: "{'Asha': 88, 'Ravi': 74, 'Meera': 91}" }
        ],
        challenge: { q: 'Text extraction: from the log below, extract every <code>(time, level, message)</code> triple for WARNING and ERROR lines only, using one regex with three groups and findall.', starter: R`import re
log = """09:00:01 INFO Boot complete
09:00:05 WARNING Fan speed low
09:01:10 ERROR Sensor 3 timeout
09:02:00 INFO Idle
09:03:30 ERROR Disk full"""
`, sol: R`import re
log = """09:00:01 INFO Boot complete
09:00:05 WARNING Fan speed low
09:01:10 ERROR Sensor 3 timeout
09:02:00 INFO Idle
09:03:30 ERROR Disk full"""
for t, level, msg in re.findall(r'(\d\d:\d\d:\d\d) (WARNING|ERROR) (.+)', log):
    print(t, level, msg)`, expect: '09:00:05 WARNING Fan speed low\n09:01:10 ERROR Sensor 3 timeout\n09:03:30 ERROR Disk full' },
        summary: ['findall returns all matches: strings without groups, tuples with groups.', '\\d \\w \\s and their uppercase opposites are shorthand classes.', '[...] defines your own class; ranges with -; ^ inside negates.', 'Symbols inside [...] are literal.']
      },
      {
        id: 'm3-5', title: 'Caret, dollar, wildcard and a review of regex symbols',
        covers: ['The Caret and Dollar Sign Characters', 'The Wildcard Character', 'Review of Regex Symbols'],
        concept: R`<p><strong>Anchors</strong>: <code>^</code> at the start of a pattern means the match must begin at the start of the text; <code>$</code> at the end means it must finish at the end. <code>^\d+$</code> therefore matches only strings made entirely of digits — perfect for validation.</p>
<p>The <strong>wildcard</strong> <code>.</code> matches any single character <em>except a newline</em>. <code>.*</code> means “anything”, greedily; <code>.*?</code> is the non-greedy version. Pass <code>re.DOTALL</code> as the second argument to <code>re.compile()</code> to let <code>.</code> match newlines too.</p>
<p>Other useful tools: <code>re.IGNORECASE</code> (or <code>re.I</code>) for case-insensitive matching; <code>sub(replacement, text)</code> to substitute matches, where <code>\1</code>, <code>\2</code> in the replacement insert groups; <code>re.VERBOSE</code> to spread a complex pattern over several lines with comments. Combine flags with <code>|</code>.</p>`,
        syntax: R`re.compile(r'^Hello')         # must start with Hello
re.compile(r'\d$')            # must end with a digit
re.compile(r'^\d+$')          # digits only
re.compile(r'.at')            # cat, hat, sat ...
re.compile(r'.*', re.DOTALL)  # including newlines
re.compile(r'robocop', re.I)
re.compile(r'Agent (\w)\w*').sub(r'\1****', text)`,
        example: { code: R`import re
begins = re.compile(r'^Hello')
print(begins.search('Hello world!'))
print(begins.search('He said hello.'))
whole = re.compile(r'^\d+$')
print(whole.search('1234567890') is not None, whole.search('12345xyz67890'))

print(re.compile(r'.at').findall('The cat in the hat sat on the flat mat.'))
name = re.compile(r'First Name: (.*) Last Name: (.*)')
mo = name.search('First Name: Al Last Name: Sweigart')
print(mo.group(1), '|', mo.group(2))

print(re.compile(r'.*').search('Serve the public trust.\nProtect the innocent.').group())
print(re.compile(r'.*', re.DOTALL).search('Serve the public trust.\nProtect the innocent.').group())

print(re.compile(r'robocop', re.I).search('RoboCop is part man.').group())
agent = re.compile(r'Agent (\w)\w*')
print(agent.sub(r'\1****', 'Agent Alice told Agent Carol that Agent Eve knew.'))

phone = re.compile(r'''(
    (\d{3}|\(\d{3}\))?   # area code
    (\s|-|\.)?           # separator
    \d{3}                # first 3 digits
    (\s|-|\.)            # separator
    \d{4}                # last 4 digits
)''', re.VERBOSE)
print([g[0] for g in phone.findall('Call (415) 555-4242 or 555.1234')])` },
        demo: { w: 'regex', intro: 'Anchors, the wildcard and substitution. Toggle the flags to see IGNORECASE and DOTALL change the result; choose sub() to replace matches.', presets: [
          { label: '^ start anchor', pattern: R`^Hello`, text: 'Hello world! Hello again.', func: 'findall' },
          { label: '$ end anchor', pattern: R`\d$`, text: 'Your number is 42', func: 'search' },
          { label: '^...$ whole string', pattern: R`^\d+$`, text: '1234567890', func: 'search' },
          { label: 'Wildcard .at', pattern: R`.at`, text: 'The cat in the hat sat on the flat mat.', func: 'findall' },
          { label: 'Dot-star groups', pattern: R`First Name: (.*) Last Name: (.*)`, text: 'First Name: Al Last Name: Sweigart', func: 'search' },
          { label: 'DOTALL', pattern: R`.*`, text: 'Line one\nLine two', func: 'search', flags: ['DOTALL'] },
          { label: 'sub() censor', pattern: R`Agent (\w)\w*`, text: 'Agent Alice told Agent Carol that Agent Eve knew.', func: 'sub', repl: R`\1****` }
        ] },
        visual: { w: 'regexRef' },
        mistakes: [
          { wrong: R`re.search(r'\d+', '12ab')   # to validate "digits only"`, right: R`re.search(r'^\d+$', '12ab')`, why: 'Without anchors, search finds 12 inside the text and reports success.' },
          { wrong: R`re.compile(r'.*').search('a\nb').group()   # expecting 'a\nb'`, right: R`re.compile(r'.*', re.DOTALL)`, why: 'By default . stops at a newline.' },
          { wrong: R`re.compile(r'x', re.I, re.DOTALL)`, right: R`re.compile(r'x', re.I | re.DOTALL)`, why: 'compile() takes one flags argument; combine flags with the bitwise | operator.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Validate that a string contains only digits using anchors. Test <code>\'2025\'</code> and <code>\'20a5\'</code>.', starter: R`import re
`, sol: R`import re
rx = re.compile(r'^\d+$')
print(bool(rx.search('2025')), bool(rx.search('20a5')))`, expect: 'True False' },
          { lvl: 'Medium', q: 'Use <code>sub()</code> to mask all but the last four digits of every 12-digit number in <code>\'Aadhaar 123412341234 and 987698769876\'</code> → <code>XXXXXXXX1234</code>.', starter: R`import re
`, sol: R`import re
text = 'Aadhaar 123412341234 and 987698769876'
print(re.sub(r'\d{8}(\d{4})', r'XXXXXXXX\1', text))`, expect: 'Aadhaar XXXXXXXX1234 and XXXXXXXX9876' },
          { lvl: 'Hard', q: 'Write a case-insensitive, anchored regex using <code>re.VERBOSE</code> that validates dates in the form <code>15-Aug-2025</code> (two-digit day, three-letter month, four-digit year). Test three strings.', starter: R`import re
`, sol: R`import re
date = re.compile(r'''^
    (0[1-9]|[12]\d|3[01])    # day 01-31
    -
    (jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)
    -
    (\d{4})$                 # year
''', re.VERBOSE | re.IGNORECASE)
for s in ['15-Aug-2025', '15-aug-2025', '32-Aug-2025']:
    print(s, bool(date.search(s)))`, expect: '15-Aug-2025 True\n15-aug-2025 True\n32-Aug-2025 False' }
        ],
        challenge: { q: 'Date converter: change every American date <code>MM/DD/YYYY</code> in a text to the Indian format <code>DD-MM-YYYY</code> with one <code>sub()</code> call that reorders three groups.', starter: R`import re
text = 'Exams on 08/15/2025 and 12/01/2025; results 01/20/2026.'
`, sol: R`import re
text = 'Exams on 08/15/2025 and 12/01/2025; results 01/20/2026.'
print(re.sub(r'(\d{2})/(\d{2})/(\d{4})', r'\2-\1-\3', text))`, expect: 'Exams on 15-08-2025 and 01-12-2025; results 20-01-2026.' },
        summary: ['^ anchors to the start, $ to the end; ^...$ validates whole strings.', '. matches any character except newline; re.DOTALL includes newlines.', '.* is greedy, .*? non-greedy.', 're.I ignores case; sub() replaces with \\1 group references; re.VERBOSE allows comments.']
      },
      {
        id: 'm3-6', title: 'Files, file paths and the os.path module',
        covers: ['Reading and Writing Files', 'Files and File Paths', 'The os.path Module'],
        concept: R`<p>Variables vanish when a program ends; <strong>files</strong> keep data. A file has a <strong>filename</strong> and a <strong>path</strong> describing its location in a tree of <strong>folders</strong> (directories).</p>
<ul>
<li>Windows separates folders with backslashes (<code>C:\Users\Asha\notes.txt</code>); Linux and macOS use forward slashes (<code>/home/asha/notes.txt</code>). <code>os.path.join('usr', 'bin', 'spam')</code> builds the right form for the computer it runs on.</li>
<li>The <strong>current working directory</strong> (<code>os.getcwd()</code>, change with <code>os.chdir()</code>) is where relative paths start.</li>
<li>An <strong>absolute path</strong> starts at the root (<code>C:\</code> or <code>/</code>). A <strong>relative path</strong> starts at the cwd; <code>.</code> means this folder and <code>..</code> the parent.</li>
<li><code>os.makedirs('a/b/c')</code> creates folders, including any missing parents.</li>
</ul>
<p><strong>The <code>os.path</code> module</strong>:</p>
<table class="ref"><tbody>
<tr><td><code>abspath(p)</code>, <code>isabs(p)</code>, <code>relpath(p, start)</code></td><td>absolute form; is it absolute?; path relative to start</td></tr>
<tr><td><code>dirname(p)</code>, <code>basename(p)</code>, <code>split(p)</code></td><td>folder part; last part; both as a tuple</td></tr>
<tr><td><code>getsize(p)</code>, <code>os.listdir(p)</code></td><td>file size in bytes; names in a folder</td></tr>
<tr><td><code>exists(p)</code>, <code>isfile(p)</code>, <code>isdir(p)</code></td><td>does it exist; is it a file; is it a folder</td></tr>
</tbody></table>
<p class="callout">Browser limitation: web pages cannot read your computer’s files. Code here runs in a private <strong>virtual file system</strong> inside the browser (working directory <code>/home/pyodide/workspace</code>, Linux-style paths). It is real Python file I/O, but files disappear when you reload. The <code>ntpath</code> module shows how the same calls behave on Windows.</p>`,
        syntax: R`import os
os.path.join('folder', 'sub', 'file.txt')
os.getcwd(); os.chdir('folder')
os.makedirs('reports/2025', exist_ok=True)
os.path.abspath('notes.txt')
os.path.basename('/a/b/c.txt')   # 'c.txt'
os.path.exists('notes.txt')`,
        example: { code: R`import os, ntpath
print('cwd:', os.getcwd())
print(os.path.join('usr', 'bin', 'spam'))
print(ntpath.join('usr', 'bin', 'spam'), '  <- the same call on Windows')

os.makedirs('reports/2025', exist_ok=True)
with open('reports/2025/summary.txt', 'w') as f:
    f.write('Pass: 54\nFail: 6\n')

p = os.path.abspath('reports/2025/summary.txt')
print(p)
print(os.path.isabs('reports'), os.path.isabs(p))
print(os.path.relpath(p, '/home/pyodide'))
print(os.path.dirname(p), '|', os.path.basename(p))
print(os.path.split(p))
print(p.split(os.sep))
print(os.path.getsize(p), 'bytes')
print(os.listdir('.'))
print(os.path.exists('reports'), os.path.isdir('reports'), os.path.isfile('reports'))

total = 0
for name in os.listdir('reports/2025'):
    total += os.path.getsize(os.path.join('reports/2025', name))
print('Folder size:', total)` },
        demo: { w: 'pathViz', intro: 'An os.path explorer running on the virtual file system. Type any path — relative or absolute — and see what each function returns. Switch to Windows mode to see the same calls through ntpath.' },
        visual: { html: R`<div class="path-tree" aria-label="Folder tree">
<pre class="code-static"><code>/                         ← root (C:\ on Windows)
└── home
    └── pyodide
        └── workspace     ← current working directory
            ├── sample.txt          relative: sample.txt
            ├── data
            │   └── marks.csv       relative: data/marks.csv
            └── reports             absolute: /home/pyodide/workspace/reports</code></pre>
<p class="muted"><code>..</code> from <code>workspace</code> is <code>/home/pyodide</code>; <code>./data/marks.csv</code> and <code>data/marks.csv</code> are the same file.</p></div>` },
        mistakes: [
          { wrong: R`path = 'C:\new\data.txt'`, right: R`path = r'C:\new\data.txt'
path = os.path.join('C:\\', 'new', 'data.txt')`, why: '\n inside a normal string is a newline. Use raw strings or os.path.join().' },
          { wrong: R`open('report.txt')   # file is in another folder`, right: R`open(os.path.join('reports', 'report.txt'))`, why: 'Relative paths start from the current working directory; FileNotFoundError means Python looked in the wrong place.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Print the file name and the extension of <code>\'/home/pyodide/workspace/data/marks.csv\'</code> using <code>os.path.basename()</code> and <code>os.path.splitext()</code>.', starter: R`import os
p = '/home/pyodide/workspace/data/marks.csv'
`, sol: R`import os
p = '/home/pyodide/workspace/data/marks.csv'
print(os.path.basename(p))
print(os.path.splitext(p)[1])`, expect: 'marks.csv\n.csv' },
          { lvl: 'Medium', q: 'Create folders <code>lab/exp1</code> and <code>lab/exp2</code>, then print a sorted list of what is inside <code>lab</code> and whether each entry is a folder.', starter: R`import os
`, sol: R`import os
os.makedirs('lab/exp1', exist_ok=True)
os.makedirs('lab/exp2', exist_ok=True)
for name in sorted(os.listdir('lab')):
    print(name, os.path.isdir(os.path.join('lab', name)))`, expect: 'exp1 True\nexp2 True' },
          { lvl: 'Hard', q: 'Write <code>describe(path)</code> that prints whether the path exists, is a file or folder, and its absolute form. Test it on <code>sample.txt</code>, <code>data</code> and <code>missing.txt</code>.', starter: R`import os
`, sol: R`import os
def describe(path):
    if not os.path.exists(path):
        print(path, '-> does not exist')
    elif os.path.isfile(path):
        print(path, '-> file of', os.path.getsize(path), 'bytes at', os.path.abspath(path))
    else:
        print(path, '-> folder at', os.path.abspath(path))

for p in ['sample.txt', 'data', 'missing.txt']:
    describe(p)` }
        ],
        challenge: { q: 'Walk the whole workspace with <code>os.walk()</code> and print every file with its size, then the total number of files and bytes.', starter: R`import os
`, sol: R`import os
count = total = 0
for folder, subfolders, files in os.walk('.'):
    for f in files:
        path = os.path.join(folder, f)
        size = os.path.getsize(path)
        print(path, size)
        count += 1
        total += size
print(count, 'files,', total, 'bytes')` },
        summary: ['Files persist data; a path locates a file in a folder tree.', 'Use os.path.join() instead of typing separators.', 'Absolute paths start at the root; relative paths start at os.getcwd().', 'os.path offers abspath, dirname, basename, split, getsize, exists, isfile, isdir.']
      },
      {
        id: 'm3-7', title: 'The file reading/writing process',
        covers: ['The File Reading/Writing Process'],
        concept: R`<p>Reading or writing a <strong>plaintext file</strong> takes three steps:</p>
<ol><li><strong>Open</strong> — <code>open(path, mode)</code> returns a File object. Mode <code>'r'</code> reads (default, error if missing), <code>'w'</code> writes (creates the file or <em>erases</em> existing content), <code>'a'</code> appends (creates, or adds to the end).</li>
<li><strong>Read or write</strong> — <code>read()</code> returns the whole content as one string; <code>readlines()</code> returns a list of lines (each ending in <code>'\n'</code> except possibly the last); <code>write(s)</code> writes a string and returns the number of characters written. <code>write()</code> does not add newlines — include <code>'\n'</code> yourself.</li>
<li><strong>Close</strong> — <code>close()</code> saves buffered data and releases the file.</li></ol>
<p>The <code>with</code> statement closes the file automatically, even if an error happens — prefer it in real programs.</p>
<p>Binary files (images, PDFs) need modes like <code>'rb'</code>/<code>'wb'</code> and are handled as <code>bytes</code>. Encoding matters for non-English text: <code>open(path, encoding='utf-8')</code>.</p>`,
        syntax: R`f = open('hello.txt', 'w')
f.write('Hello, world!\n')
f.close()

with open('hello.txt', 'a') as f:
    f.write('Another line.\n')

with open('hello.txt') as f:
    content = f.read()        # or f.readlines()`,
        example: { code: R`bacon = open('bacon.txt', 'w')
print(bacon.write('Hello, world!\n'))
bacon.close()

bacon = open('bacon.txt', 'a')
bacon.write('Bacon is not a vegetable.')
bacon.close()

f = open('bacon.txt')
content = f.read()
f.close()
print(content)

with open('sonnet.txt', 'w') as f:
    f.write('When, in disgrace with fortune and men\'s eyes,\n')
    f.write('I all alone beweep my outcast state,\n')
    f.write('And trouble deaf heaven with my bootless cries,\n')

with open('sonnet.txt') as f:
    lines = f.readlines()
print(lines)
for number, line in enumerate(lines, start=1):
    print(number, line.rstrip())

try:
    open('no_such_file.txt')
except FileNotFoundError as e:
    print('FileNotFoundError:', e)` },
        demo: { w: 'fileViz', intro: 'A file-operation visualizer on the virtual file system. Choose open mode, type text and run each step; the program that actually runs is shown, and the file contents update after every operation.' },
        visual: { html: R`<ol class="steps file-steps">
<li><b>open()</b> <span><code>'r'</code> read · <code>'w'</code> overwrite · <code>'a'</code> append</span></li>
<li><b>read() / readlines() / write()</b> <span>strings in, strings out</span></li>
<li><b>close()</b> <span>flushes data to disk — or let <code>with</code> do it</span></li>
</ol>
<table class="ref"><thead><tr><th>Mode</th><th>File missing</th><th>File exists</th><th>Position</th></tr></thead><tbody>
<tr><td><code>'r'</code></td><td>FileNotFoundError</td><td>read only</td><td>start</td></tr>
<tr><td><code>'w'</code></td><td>created</td><td><strong>content erased</strong></td><td>start</td></tr>
<tr><td><code>'a'</code></td><td>created</td><td>kept</td><td>end</td></tr>
</tbody></table>` },
        mistakes: [
          { wrong: R`f = open('log.txt', 'w')   # meant to add a line`, right: R`f = open('log.txt', 'a')`, why: "'w' erases the existing file. Use 'a' to append." },
          { wrong: R`f.write('line one')
f.write('line two')`, right: R`f.write('line one\n')
f.write('line two\n')`, why: 'write() adds no newline, so both lines run together.' },
          { wrong: R`f = open('data.txt', 'w')
f.write(42)`, right: R`f.write(str(42))`, why: 'write() needs a string: TypeError: write() argument must be str, not int.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Write three lines (your name, branch and semester) to <code>me.txt</code>, then read the file back and print it.', starter: '', sol: R`with open('me.txt', 'w') as f:
    f.write('Asha\nECE\nIII\n')
with open('me.txt') as f:
    print(f.read(), end='')`, expect: 'Asha\nECE\nIII' },
          { lvl: 'Medium', q: 'The file <code>data/marks.csv</code> (created for you) contains <code>name,marks</code> lines. Read it, skip the header and print the average mark rounded to 1 decimal.', starter: '', sol: R`with open('data/marks.csv') as f:
    lines = f.readlines()[1:]
marks = [int(line.strip().split(',')[1]) for line in lines if line.strip()]
print(round(sum(marks) / len(marks), 1))`, expect: '76.8' },
          { lvl: 'Hard', q: 'Copy <code>sample.txt</code> to <code>numbered.txt</code>, adding a line number in front of every line, and then print the new file.', starter: '', sol: R`with open('sample.txt') as src, open('numbered.txt', 'w') as dst:
    for i, line in enumerate(src, start=1):
        dst.write(str(i).rjust(3) + ': ' + line)
with open('numbered.txt') as f:
    print(f.read(), end='')` }
        ],
        challenge: { q: 'Log analyser: write a log file with at least six lines of the form <code>HH:MM LEVEL message</code>, then read it back and use a regex to count how many lines exist for each level. Append a summary line to the same file with mode <code>\'a\'</code>.', starter: R`import re
`, sol: R`import re
with open('system.log', 'w') as f:
    f.write('09:00 INFO start\n09:05 WARNING fan low\n09:10 ERROR sensor timeout\n'
            '09:20 INFO idle\n09:30 ERROR disk full\n09:40 INFO stop\n')
counts = {}
with open('system.log') as f:
    for line in f:
        mo = re.match(r'\d\d:\d\d (\w+)', line)
        if mo:
            counts[mo.group(1)] = counts.get(mo.group(1), 0) + 1
with open('system.log', 'a') as f:
    f.write('SUMMARY ' + str(counts) + '\n')
print(open('system.log').read(), end='')` },
        summary: ["open() → read()/readlines()/write() → close().", "'w' overwrites, 'a' appends, 'r' reads (default).", 'write() needs strings and adds no newline.', 'with open(...) as f: closes the file automatically.']
      },
      {
        id: 'm3-8', title: 'Saving variables with shelve and pprint.pformat()',
        covers: ['Saving Variables with the shelve Module', 'Saving Variables with the pprint.pformat() Function'],
        concept: R`<p>Plaintext is fine for text, but programs often need to save <em>Python values</em> — lists, dictionaries — and load them later.</p>
<p><strong>The <code>shelve</code> module</strong> stores values in a binary “shelf” file that behaves like a dictionary: <code>shelf = shelve.open('mydata')</code>, then <code>shelf['cats'] = ['Zophie', 'Pooka']</code>, and finally <code>shelf.close()</code>. A later run can open the shelf and read <code>shelf['cats']</code>. Shelves support <code>keys()</code> and <code>values()</code> (wrap them in <code>list()</code>). On disk, shelve may create several files (for example <code>mydata.bak</code>, <code>mydata.dat</code>, <code>mydata.dir</code> on Windows); you never edit them by hand.</p>
<p><strong><code>pprint.pformat()</code></strong> returns the same neatly formatted text that <code>pprint.pprint()</code> prints. Because that text is valid Python source, writing <code>'cats = ' + pprint.pformat(cats)</code> into a <code>.py</code> file creates a <strong>module you can import</strong>. The result is human-readable and editable, but it only works for basic types (numbers, strings, lists, dictionaries, tuples) whose <code>repr</code> is valid Python.</p>
<table class="ref"><thead><tr><th></th><th>shelve</th><th>pprint.pformat() + .py file</th></tr></thead><tbody>
<tr><td>File format</td><td>binary</td><td>plain Python text</td></tr>
<tr><td>Readable in an editor</td><td>no</td><td>yes</td></tr>
<tr><td>Stores</td><td>almost any Python object</td><td>basic types only</td></tr>
<tr><td>Load with</td><td><code>shelve.open()</code></td><td><code>import</code></td></tr>
</tbody></table>
<p class="callout">Environment note: Pyodide removes the <code>dbm</code> module that shelve relies on. This site restores CPython’s pure-Python <code>dbm.dumb</code> backend, so <code>shelve</code> works here exactly as the standard library defines it, storing files in the virtual workspace.</p>`,
        syntax: R`import shelve
shelf = shelve.open('mydata')
shelf['cats'] = ['Zophie', 'Pooka', 'Simon']
shelf.close()

import pprint
text = pprint.pformat(cats)          # a string of valid Python
open('myCats.py', 'w').write('cats = ' + text + '\n')`,
        example: { code: R`import shelve, os
shelf_file = shelve.open('mydata')
shelf_file['cats'] = ['Zophie', 'Pooka', 'Simon']
shelf_file.close()
print(sorted(f for f in os.listdir('.') if f.startswith('mydata')))

shelf_file = shelve.open('mydata')        # e.g. in a later run
print(type(shelf_file))
print(shelf_file['cats'])
print(list(shelf_file.keys()), list(shelf_file.values()))
shelf_file.close()

import pprint, importlib
cats = [{'name': 'Zophie', 'desc': 'chubby'}, {'name': 'Pooka', 'desc': 'fluffy'}]
print(pprint.pformat(cats))
with open('myCats.py', 'w') as f:
    f.write('cats = ' + pprint.pformat(cats) + '\n')

importlib.invalidate_caches()   # we just created a new module file
import myCats
print(myCats.cats[0]['name'], myCats.cats)` },
        demo: { w: 'code', intro: 'A tiny persistent address book with shelve. Run it several times: each run adds an entry and the shelf keeps everything from earlier runs (until the page reloads).', code: R`import shelve, datetime
with shelve.open('contacts') as book:      # a shelf also works with "with"
    count = len(book)
    book['contact' + str(count + 1)] = {'name': 'Student ' + str(count + 1),
                                       'added': datetime.date.today().isoformat()}
    for key in sorted(book.keys()):
        print(key, book[key])
    print(len(book), 'contacts saved')` },
        visual: { w: 'trace', intro: 'pformat() turns a nested structure into a string; the trace shows the string variable holding Python source text.', code: R`import pprint
marks = {'Asha': [88, 92], 'Ravi': [64, 71]}
text = pprint.pformat(marks)
source = 'marks = ' + text
print(source)` },
        mistakes: [
          { wrong: R`shelf = shelve.open('data')
shelf['x'] = 1      # never closed`, right: R`with shelve.open('data') as shelf:
    shelf['x'] = 1`, why: 'Unclosed shelves may not save their data. Close them or use with.' },
          { wrong: R`shelf.keys()     # expecting a list`, right: R`list(shelf.keys())`, why: 'keys() returns a view object, not a list.' },
          { wrong: R`f.write('cats = ' + str(open_file_object))`, right: R`f.write('cats = ' + pprint.pformat(basic_data))`, why: 'pformat-generated modules only work for values whose repr is valid Python (numbers, strings, lists, dicts, tuples).' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Save the list <code>[\'Python\', \'VLSI\', \'DSP\']</code> under the key <code>\'subjects\'</code> in a shelf, close it, reopen it and print the list.', starter: R`import shelve
`, sol: R`import shelve
s = shelve.open('courses')
s['subjects'] = ['Python', 'VLSI', 'DSP']
s.close()
s = shelve.open('courses')
print(s['subjects'])
s.close()`, expect: "['Python', 'VLSI', 'DSP']" },
          { lvl: 'Medium', q: 'Use <code>pprint.pformat()</code> to write a dictionary of lab equipment counts into <code>equipment.py</code>, then import it and print the number of oscilloscopes.', starter: R`import pprint, importlib
equipment = {'oscilloscope': 12, 'multimeter': 30, 'function generator': 10}
`, sol: R`import pprint, importlib
equipment = {'oscilloscope': 12, 'multimeter': 30, 'function generator': 10}
with open('equipment.py', 'w') as f:
    f.write('equipment = ' + pprint.pformat(equipment) + '\n')
importlib.invalidate_caches()
import equipment as eq
print(eq.equipment['oscilloscope'])`, expect: '12' },
          { lvl: 'Hard', q: 'Write a quiz-score tracker: a shelf maps student names to lists of scores. Write <code>add_score(name, score)</code> (note: you must reassign the list to the shelf key for the change to be saved) and print each student’s average.', starter: R`import shelve
`, sol: R`import shelve
def add_score(name, score):
    with shelve.open('scores') as db:
        scores = db.get(name, [])
        scores.append(score)
        db[name] = scores          # reassign so the shelf stores the updated list

for n, s in [('Asha', 8), ('Ravi', 6), ('Asha', 10), ('Ravi', 9)]:
    add_score(n, s)
with shelve.open('scores') as db:
    for name in sorted(db.keys()):
        print(name, sum(db[name]) / len(db[name]))` }
        ],
        challenge: { q: 'Multi-clipboard: keep named text snippets in a shelf. Support three commands given as a list: <code>(\'save\', key, text)</code>, <code>(\'list\',)</code> and <code>(\'get\', key)</code>. Run a few commands and show the shelf’s keys.', starter: R`import shelve
commands = [('save', 'greet', 'Hello students!'), ('save', 'sign', 'Regards, ECE Dept.'),
            ('list',), ('get', 'greet'), ('get', 'missing')]
`, sol: R`import shelve
commands = [('save', 'greet', 'Hello students!'), ('save', 'sign', 'Regards, ECE Dept.'),
            ('list',), ('get', 'greet'), ('get', 'missing')]
with shelve.open('mcb') as mcb:
    for cmd in commands:
        if cmd[0] == 'save':
            mcb[cmd[1]] = cmd[2]
        elif cmd[0] == 'list':
            print(sorted(mcb.keys()))
        elif cmd[0] == 'get':
            print(mcb.get(cmd[1], '(no such snippet)'))` },
        summary: ['shelve saves Python values in a dictionary-like binary file.', 'Always close a shelf (or use with).', 'pprint.pformat() returns valid Python text; save it as a .py file and import it.', 'shelve: any object, not human-readable; pformat: basic types, human-readable.']
      }
    ]
  });
})();
