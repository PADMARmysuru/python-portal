(function () {
  'use strict';
  const R = String.raw;
  const PP = window.PP;

  PP.SCHOOL_SQL = R`-- Sample Student-Course-Enrollment database (fictional data for teaching)
CREATE TABLE Student (
    id     INTEGER PRIMARY KEY,
    usn    TEXT UNIQUE NOT NULL,
    name   TEXT NOT NULL,
    branch TEXT
);
CREATE TABLE Course (
    id      INTEGER PRIMARY KEY,
    code    TEXT UNIQUE NOT NULL,
    title   TEXT NOT NULL,
    credits INTEGER
);
CREATE TABLE Enrollment (
    student_id INTEGER NOT NULL REFERENCES Student(id),
    course_id  INTEGER NOT NULL REFERENCES Course(id),
    marks      INTEGER,
    PRIMARY KEY (student_id, course_id)
);
INSERT INTO Student (usn, name, branch) VALUES
    ('1GS23EC001', 'Asha', 'ECE'), ('1GS23EC002', 'Ravi', 'ECE'), ('1GS23EC003', 'Meera', 'ECE'),
    ('1GS23CS004', 'John', 'CSE'), ('1GS23EC005', 'Priya', 'ECE');
INSERT INTO Course (code, title, credits) VALUES
    ('1BEC305', 'Python Programming', 3), ('EC201', 'Digital Design (sample)', 4),
    ('EC202', 'Network Analysis (sample)', 3), ('EC203', 'Analog Lab (sample)', 1);
INSERT INTO Enrollment (student_id, course_id, marks) VALUES
    (1, 1, 88), (1, 2, 92), (2, 1, 64), (2, 3, 71), (3, 1, 95), (3, 2, 84), (4, 1, 67);
`;

  PP.TRACKS_SQL = R`CREATE TABLE Tracks (title TEXT, plays INTEGER);
INSERT INTO Tracks (title, plays) VALUES ('Thunderstruck', 20), ('My Way', 15), ('Imagine', 9);
`;

  PP.SAMPLE_XML = R`<?xml version="1.0"?>
<college name="GSSSIETW">
  <department code="ECE">
    <student usn="1GS23EC001">
      <name>Asha</name>
      <marks subject="Python">88</marks>
      <email hide="yes">asha@example.edu</email>
    </student>
    <student usn="1GS23EC002">
      <name>Ravi</name>
      <marks subject="Python">64</marks>
    </student>
    <student usn="1GS23EC003">
      <name>Meera</name>
      <marks subject="Python">95</marks>
    </student>
  </department>
</college>`;

  PP.SAMPLE_JSON = R`[
  {"id": "001", "name": "Asha", "x": "2", "skills": ["Python", "Verilog"]},
  {"id": "009", "name": "Ravi", "x": "7", "skills": ["C"]},
  {"id": "014", "name": "Meera", "x": "5", "skills": [], "mentor": null, "active": true}
]`;

  PP.addModule({
    n: 5, title: 'Web, XML, JSON and Databases', co: 5,
    blurb: 'How HTTP works, retrieving pages and images, parsing XML and JSON, and building multi-table SQLite applications.',
    lessons: [
      {
        id: 'm5-1', title: 'HTTP and the world’s simplest web browser',
        covers: ['HTTP', 'The World’s simplest Web Browser'],
        concept: R`<p>The <strong>HyperText Transfer Protocol (HTTP)</strong> is the set of rules browsers and servers use to exchange documents over the internet. It runs on top of a <strong>socket</strong> — a two-way connection between two programs — usually on <strong>port 80</strong> (HTTPS, the encrypted version, uses port 443).</p>
<p>An HTTP exchange is plain text:</p>
<ol><li>The client connects to the server and sends a <strong>request</strong>: a request line such as <code>GET http://data.pr4e.org/romeo.txt HTTP/1.0</code> followed by optional headers and a <strong>blank line</strong> (<code>\r\n\r\n</code>).</li>
<li>The server replies with a <strong>response</strong>: a status line (<code>HTTP/1.1 200 OK</code>), <strong>headers</strong> (metadata such as <code>Content-Type</code>, <code>Content-Length</code>, <code>Last-Modified</code>), a blank line, and then the <strong>body</strong> (the document itself).</li></ol>
<p>Common <strong>status codes</strong>: 200 OK, 301 Moved Permanently, 304 Not Modified, 404 Not Found, 500 Internal Server Error. The first digit gives the class: 2xx success, 3xx redirection, 4xx client error, 5xx server error.</p>
<p><strong>The world’s simplest web browser</strong> is about ten lines using the <code>socket</code> module: create a socket, <code>connect()</code> to the host on port 80, <code>send()</code> the encoded request, then <code>recv()</code> chunks until the server closes the connection, decoding and printing each one. Because it prints everything it receives, you see the headers as well as the document.</p>
<p class="callout">Browser limitation: web pages are not allowed to open raw sockets, so the socket program below must be run in desktop Python (IDLE, Thonny, a terminal). The runnable part of this lesson parses a sample response, clearly marked as sample data.</p>`,
        syntax: R`import socket
mysock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
mysock.connect(('data.pr4e.org', 80))
cmd = 'GET http://data.pr4e.org/romeo.txt HTTP/1.0\r\n\r\n'.encode()
mysock.send(cmd)
data = mysock.recv(512)     # bytes; b'' when the server closes
mysock.close()`,
        example: { runnable: false, title: 'socket1.py — run in desktop Python', note: 'This program needs a real network socket, which browsers do not provide. Copy it into IDLE or Thonny to see a live response from data.pr4e.org.', code: R`import socket

mysock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
mysock.connect(('data.pr4e.org', 80))
cmd = 'GET http://data.pr4e.org/romeo.txt HTTP/1.0\r\n\r\n'.encode()
mysock.send(cmd)

while True:
    data = mysock.recv(512)
    if len(data) < 1:
        break
    print(data.decode(), end='')

mysock.close()` },
        demo: { w: 'httpViz', intro: 'Step through an HTTP request and response. The exchange shown is sample data that mirrors what the socket program receives; change the requested path to see how the status line and headers change.' },
        visual: { w: 'code', intro: 'Runnable: split a raw HTTP response (sample data, stored as bytes exactly as a socket would deliver it) into status line, headers and body.', code: R`# SAMPLE DATA: the bytes a socket would receive from data.pr4e.org for romeo.txt
raw = (b'HTTP/1.1 200 OK\r\n'
       b'Date: Wed, 11 Apr 2018 18:52:55 GMT\r\n'
       b'Server: Apache/2.4.7 (Ubuntu)\r\n'
       b'Last-Modified: Sat, 13 May 2017 11:22:22 GMT\r\n'
       b'Content-Length: 167\r\n'
       b'Content-Type: text/plain\r\n'
       b'Connection: close\r\n'
       b'\r\n'
       b'But soft what light through yonder window breaks\n'
       b'It is the east and Juliet is the sun\n'
       b'Arise fair sun and kill the envious moon\n'
       b'Who is already sick and pale with grief\n')

head, body = raw.split(b'\r\n\r\n', 1)      # a blank line separates headers from body
lines = head.decode().split('\r\n')
version, code, reason = lines[0].split(' ', 2)
print('Status:', code, reason, '(' + version + ')')
headers = dict(line.split(': ', 1) for line in lines[1:])
for name, value in headers.items():
    print(' ', name.ljust(15), value)
print('Body bytes:', len(body), '| Content-Length says', headers['Content-Length'])
print(body.decode())` },
        mistakes: [
          { wrong: R`mysock.send('GET http://data.pr4e.org/romeo.txt HTTP/1.0\r\n\r\n')`, right: R`mysock.send('GET http://data.pr4e.org/romeo.txt HTTP/1.0\r\n\r\n'.encode())`, why: 'Sockets send bytes, not str: TypeError: a bytes-like object is required. Encode the string (UTF-8) first.' },
          { wrong: R`cmd = 'GET http://data.pr4e.org/romeo.txt HTTP/1.0'`, right: R`cmd = 'GET http://data.pr4e.org/romeo.txt HTTP/1.0\r\n\r\n'`, why: 'The request must end with a blank line (\r\n\r\n); otherwise the server keeps waiting for more headers.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Given the status line <code>\'HTTP/1.1 404 Not Found\'</code>, print the status code as an integer and whether it is a client error (4xx).', starter: R`status_line = 'HTTP/1.1 404 Not Found'
`, sol: R`status_line = 'HTTP/1.1 404 Not Found'
code = int(status_line.split()[1])
print(code, 400 <= code < 500)`, expect: '404 True' },
          { lvl: 'Medium', q: 'Build the exact request string (as bytes) that the simplest browser would send for <code>http://data.pr4e.org/page1.htm</code>, and print it with <code>repr()</code> so the <code>\\r\\n</code> characters are visible.', starter: '', sol: R`url = 'http://data.pr4e.org/page1.htm'
cmd = ('GET ' + url + ' HTTP/1.0\r\n\r\n').encode()
print(repr(cmd))`, expect: "b'GET http://data.pr4e.org/page1.htm HTTP/1.0\\r\\n\\r\\n'" },
          { lvl: 'Hard', q: 'Write <code>parse_response(raw)</code> that returns <code>(status_code, headers_dict, body_text)</code> for a raw response in bytes. Test it on a small sample response of your own with a 301 redirect and a <code>Location</code> header.', starter: '', sol: R`def parse_response(raw):
    head, body = raw.split(b'\r\n\r\n', 1)
    lines = head.decode().split('\r\n')
    code = int(lines[0].split()[1])
    headers = {}
    for line in lines[1:]:
        k, v = line.split(': ', 1)
        headers[k] = v
    return code, headers, body.decode()

sample = b'HTTP/1.1 301 Moved Permanently\r\nLocation: https://example.org/\r\nContent-Length: 0\r\n\r\n'
code, headers, body = parse_response(sample)
print(code, headers['Location'], repr(body))`, expect: "301 https://example.org/ ''" }
        ],
        challenge: { q: 'On desktop Python, modify the simplest browser to stop printing the headers: collect all the bytes first, find the blank line with <code>find(b\'\\r\\n\\r\\n\')</code> and print only the body. (Run the finished program outside the browser.)', starter: R`import socket
# desktop Python only
`, sol: R`import socket
mysock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
mysock.connect(('data.pr4e.org', 80))
mysock.send('GET http://data.pr4e.org/romeo.txt HTTP/1.0\r\n\r\n'.encode())
data = b''
while True:
    chunk = mysock.recv(512)
    if len(chunk) < 1:
        break
    data = data + chunk
mysock.close()
pos = data.find(b'\r\n\r\n')
print(data[pos + 4:].decode())`, runnable: false },
        summary: ['HTTP is a text protocol over a socket (port 80; HTTPS on 443).', 'A request line + headers + blank line; a response has status line, headers, blank line, body.', 'Status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server error.', 'The simplest browser: socket → connect → send(encoded request) → recv loop → close.']
      },
      {
        id: 'm5-2', title: 'Retrieving images and web pages with urllib',
        covers: ['Retrieving an image over HTTP', 'Retrieving web pages with urllib'],
        concept: R`<p><strong>Retrieving an image over HTTP</strong> with a socket works like retrieving text, but the body is <em>binary</em>: you keep the bytes as bytes, accumulate them (<code>picture = picture + data</code>), find the end of the headers with <code>picture.find(b'\r\n\r\n')</code>, skip those 4 bytes, and write the rest to a file opened in <code>'wb'</code> mode. Data arrives in chunks of varying size depending on network speed; a short <code>time.sleep()</code> in the loop or a larger <code>recv()</code> buffer changes how many chunks you see, but not the final file.</p>
<p><strong><code>urllib</code></strong> handles all the socket and header work for you. <code>urllib.request.urlopen(url)</code> returns a file-like object: you can loop over its lines, call <code>read()</code> to get the whole body as bytes, and the headers are consumed automatically (still available through <code>.getheaders()</code>). Since the body is bytes, call <code>decode()</code> to work with text.</p>
<p>Typical uses: counting words in a page (<code>for line in fhand: words = line.decode().split()</code>), saving an image (<code>img = urlopen(url).read()</code> then write with <code>'wb'</code>), and reading large files in blocks (<code>fhand.read(100000)</code>) to avoid filling memory.</p>
<p class="callout">In this browser, <code>urllib.request</code> cannot open sockets, so those programs are shown for desktop Python. Pyodide provides <code>pyodide.http.open_url()</code>, which performs a <strong>real HTTP request through the browser</strong> — limited to the site’s own server or servers that allow cross-origin requests. The demo below uses it to retrieve <code>data/romeo.txt</code> from this website.</p>`,
        syntax: R`import urllib.request
fhand = urllib.request.urlopen('http://data.pr4e.org/romeo.txt')
for line in fhand:
    print(line.decode().strip())

img = urllib.request.urlopen('http://data.pr4e.org/cover3.jpg').read()
with open('cover3.jpg', 'wb') as f:
    f.write(img)`,
        example: { runnable: false, title: 'urlwords.py and curl1.py — run in desktop Python', note: 'Both programs need urllib network access, which the browser sandbox does not allow.', code: R`import urllib.request

# Count the words in a web page
fhand = urllib.request.urlopen('http://data.pr4e.org/romeo.txt')
counts = dict()
for line in fhand:
    words = line.decode().split()
    for word in words:
        counts[word] = counts.get(word, 0) + 1
print(counts)

# Retrieve an image and save it (binary data -> 'wb')
img = urllib.request.urlopen('http://data.pr4e.org/cover3.jpg').read()
fhand = open('cover3.jpg', 'wb')
fhand.write(img)
fhand.close()
print('Saved', len(img), 'bytes')` },
        demo: { w: 'code', intro: 'A real HTTP request from the browser. open_url() fetches data/romeo.txt from this site’s own server and the program counts the words — the same processing as urlwords.py. If the site is opened directly from disk (file://) instead of a web server, the request fails and the error explains why.', code: R`from pyodide.http import open_url     # browser-based HTTP (Pyodide only)

fhand = open_url('data/romeo.txt')     # relative to this page's address
text = fhand.read()
print('Retrieved', len(text), 'characters over HTTP\n')

counts = dict()
for line in text.splitlines():
    for word in line.split():
        counts[word] = counts.get(word, 0) + 1

top = sorted(counts.items(), key=lambda kv: -kv[1])[:5]
print('Most common words:', top)` },
        visual: { w: 'code', intro: 'Runnable image-retrieval logic on sample bytes: the same header-stripping steps urljpeg.py performs, applied to a tiny fake “image” so you can see each stage.', code: R`# SAMPLE DATA: a response whose body is binary (first bytes of a JPEG file)
picture = (b'HTTP/1.1 200 OK\r\nContent-Type: image/jpeg\r\nContent-Length: 10\r\n\r\n'
           + bytes([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46]))

pos = picture.find(b'\r\n\r\n')
print('Header length:', pos)
print(picture[:pos].decode())
body = picture[pos + 4:]                      # skip the blank line
print('Body bytes:', list(body[:4]), '... starts with JPEG marker FF D8:', body[:2] == b'\xff\xd8')

with open('stuff.jpg', 'wb') as f:            # binary mode
    f.write(body)
import os
print('Saved stuff.jpg,', os.path.getsize('stuff.jpg'), 'bytes')` },
        mistakes: [
          { wrong: R`open('cover3.jpg', 'w').write(img)`, right: R`open('cover3.jpg', 'wb').write(img)`, why: "Image data is bytes; text mode 'w' raises TypeError: write() argument must be str, not bytes." },
          { wrong: R`for line in fhand:
    words = line.split()   # bytes, not str`, right: R`for line in fhand:
    words = line.decode().split()`, why: 'urlopen yields bytes; without decode() you get words like b"soft".' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Decode the sample bytes <code>b\'But soft what light\\n\'</code> to a string and print the number of words.', starter: R`data = b'But soft what light\n'
`, sol: R`data = b'But soft what light\n'
print(len(data.decode().split()))`, expect: '4' },
          { lvl: 'Medium', q: 'Use <code>open_url(\'data/romeo.txt\')</code> to fetch the file and print the longest word and its length.', starter: R`from pyodide.http import open_url
`, sol: R`from pyodide.http import open_url
words = open_url('data/romeo.txt').read().split()
longest = max(words, key=len)
print(longest, len(longest))` },
          { lvl: 'Hard', q: 'Simulate reading a large download in blocks: given <code>data = bytes(range(256)) * 40</code>, read it 1000 bytes at a time from an <code>io.BytesIO</code> object (as you would with <code>fhand.read(1000)</code>), counting the blocks and total bytes.', starter: R`import io
data = bytes(range(256)) * 40
`, sol: R`import io
data = bytes(range(256)) * 40
fhand = io.BytesIO(data)
blocks = total = 0
while True:
    chunk = fhand.read(1000)
    if len(chunk) < 1:
        break
    blocks += 1
    total += len(chunk)
print(blocks, total)`, expect: '11 10240' }
        ],
        challenge: { q: 'Desktop Python: write <code>download(url, filename)</code> that retrieves any URL with urllib in 100 000-byte blocks, writes it in binary mode, and prints the number of bytes saved. Test it on <code>http://data.pr4e.org/cover3.jpg</code>.', starter: R`import urllib.request
`, sol: R`import urllib.request

def download(url, filename):
    src = urllib.request.urlopen(url)
    size = 0
    with open(filename, 'wb') as dst:
        while True:
            block = src.read(100000)
            if len(block) < 1:
                break
            size += len(block)
            dst.write(block)
    print(size, 'bytes saved to', filename)

download('http://data.pr4e.org/cover3.jpg', 'cover3.jpg')`, runnable: false },
        summary: ['Images are binary: keep bytes, strip headers at the first \\r\\n\\r\\n, write with "wb".', 'urllib.request.urlopen() returns a file-like object; headers are handled for you.', 'Decode bytes to str before text processing.', 'Read large resources in blocks.']
      },
      {
        id: 'm5-3', title: 'XML: parsing and looping through nodes',
        covers: ['XML', 'Parsing XML', 'Looping through nodes'],
        concept: R`<p><strong>eXtensible Markup Language (XML)</strong> represents structured data as a tree of <strong>elements</strong> (nodes). Each element has a start tag <code>&lt;name&gt;</code> and an end tag <code>&lt;/name&gt;</code> (or is self-closing, <code>&lt;br/&gt;</code>), may contain text, may carry <strong>attributes</strong> (<code>&lt;email hide="yes"&gt;</code>), and may contain child elements. There is exactly one root element.</p>
<p><strong>Parsing</strong> converts the text into a tree of Python objects. The standard library module <code>xml.etree.ElementTree</code> (imported as <code>ET</code>) does this: <code>tree = ET.fromstring(data)</code> returns the root Element.</p>
<ul>
<li><code>tree.find('name')</code> returns the first matching child; <code>.text</code> is its text.</li>
<li><code>element.get('hide')</code> returns an attribute value (or <code>None</code>).</li>
<li><code>tree.findall('users/user')</code> returns a <em>list</em> of matching elements — a path from the current element.</li>
</ul>
<p><strong>Looping through nodes</strong>: <code>for item in tree.findall('department/student'):</code> visits each matching node, from which you read child text and attributes. Note that <code>findall()</code> only looks along the given path relative to where you start; <code>iter('tag')</code> searches the whole subtree.</p>`,
        syntax: R`import xml.etree.ElementTree as ET
tree = ET.fromstring(data)
tree.find('name').text
tree.find('email').get('hide')
for user in tree.findall('users/user'):
    print(user.find('name').text, user.get('x'))`,
        example: { code: R`import xml.etree.ElementTree as ET

data = '''
<person>
  <name>Chuck</name>
  <phone type="intl">+1 734 303 4456</phone>
  <email hide="yes" />
</person>'''

tree = ET.fromstring(data)
print('Name:', tree.find('name').text)
print('Phone type:', tree.find('phone').get('type'))
print('Attr:', tree.find('email').get('hide'))

input_xml = '''
<stuff>
  <users>
    <user x="2">
      <id>001</id>
      <name>Chuck</name>
    </user>
    <user x="7">
      <id>009</id>
      <name>Brent</name>
    </user>
  </users>
</stuff>'''

stuff = ET.fromstring(input_xml)
lst = stuff.findall('users/user')
print('User count:', len(lst))
for item in lst:
    print('Name', item.find('name').text)
    print('Id', item.find('id').text)
    print('Attribute', item.get('x'))

print(len(stuff.findall('user')), 'users found directly under <stuff> (none: wrong level)')` },
        demo: { w: 'xmlLab', intro: 'An XML editor with a live tree. Edit the XML and press Parse; click any node to see its tag, attributes, text and path; type a findall() path to highlight the nodes a loop would visit. Parsing is done by Python’s ElementTree.' },
        visual: { html: R`<pre class="code-static xml-anatomy"><code>&lt;student usn="1GS23EC001"&gt;        ← start tag with an <b>attribute</b>
    &lt;name&gt;Asha&lt;/name&gt;           ← child element with <b>text</b>
    &lt;email hide="yes" /&gt;        ← self-closing element
&lt;/student&gt;                     ← end tag</code></pre>
<p class="muted">Tree view: <code>college → department → student (×3) → name, marks, email</code>. <code>findall('department/student')</code> from the root returns the three student nodes.</p>` },
        mistakes: [
          { wrong: R`tree.findall('user')    # from <stuff>`, right: R`tree.findall('users/user')`, why: 'findall() follows the path from the current element; user is a grandchild of stuff, not a child.' },
          { wrong: R`tree.find('email').text   # attribute wanted`, right: R`tree.find('email').get('hide')`, why: 'Attributes are read with get(); .text is the content between the tags (None for <email hide="yes" />).' },
          { wrong: R`ET.fromstring('<a><b></a>')`, right: R`ET.fromstring('<a><b></b></a>')`, why: 'XML must be well-formed: every start tag needs a matching end tag (ParseError: mismatched tag).' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Parse <code>&lt;course code="1BEC305"&gt;&lt;title&gt;Python Programming&lt;/title&gt;&lt;/course&gt;</code> and print the code attribute and the title text.', starter: R`import xml.etree.ElementTree as ET
data = '<course code="1BEC305"><title>Python Programming</title></course>'
`, sol: R`import xml.etree.ElementTree as ET
data = '<course code="1BEC305"><title>Python Programming</title></course>'
c = ET.fromstring(data)
print(c.get('code'), c.find('title').text)`, expect: '1BEC305 Python Programming' },
          { lvl: 'Medium', q: 'Loop through the students in the sample college XML (provided) and print each name with their Python marks, then the class average.', starter: R`import xml.etree.ElementTree as ET
xml = '''${PP.SAMPLE_XML.replace(/^<\?xml[^>]*>\n/, '')}'''
`, sol: R`import xml.etree.ElementTree as ET
xml = '''${PP.SAMPLE_XML.replace(/^<\?xml[^>]*>\n/, '')}'''
root = ET.fromstring(xml)
marks = []
for s in root.findall('department/student'):
    m = int(s.find('marks').text)
    marks.append(m)
    print(s.find('name').text, m)
print('Average:', round(sum(marks) / len(marks), 2))`, expect: 'Asha 88\nRavi 64\nMeera 95\nAverage: 82.33' },
          { lvl: 'Hard', q: 'Count how many elements of each tag appear anywhere in the sample college XML using <code>root.iter()</code>, and print the USNs of students who have an <code>email</code> element.', starter: R`import xml.etree.ElementTree as ET
xml = '''${PP.SAMPLE_XML.replace(/^<\?xml[^>]*>\n/, '')}'''
`, sol: R`import xml.etree.ElementTree as ET
xml = '''${PP.SAMPLE_XML.replace(/^<\?xml[^>]*>\n/, '')}'''
root = ET.fromstring(xml)
counts = {}
for el in root.iter():
    counts[el.tag] = counts.get(el.tag, 0) + 1
print(counts)
print([s.get('usn') for s in root.iter('student') if s.find('email') is not None])`, expect: "{'college': 1, 'department': 1, 'student': 3, 'name': 3, 'marks': 3, 'email': 1}\n['1GS23EC001']" }
        ],
        challenge: { q: 'Write <code>to_xml(records)</code> that builds an XML document from a list of student dictionaries using <code>ET.Element</code> and <code>ET.SubElement</code>, then parse the generated text back and verify the names match.', starter: R`import xml.etree.ElementTree as ET
records = [{'usn': '1GS23EC001', 'name': 'Asha'}, {'usn': '1GS23EC002', 'name': 'Ravi'}]
`, sol: R`import xml.etree.ElementTree as ET
records = [{'usn': '1GS23EC001', 'name': 'Asha'}, {'usn': '1GS23EC002', 'name': 'Ravi'}]

def to_xml(records):
    root = ET.Element('students')
    for r in records:
        s = ET.SubElement(root, 'student', usn=r['usn'])
        ET.SubElement(s, 'name').text = r['name']
    return ET.tostring(root, encoding='unicode')

text = to_xml(records)
print(text)
back = ET.fromstring(text)
print([s.find('name').text for s in back.findall('student')] == [r['name'] for r in records])`, expect: '<students><student usn="1GS23EC001"><name>Asha</name></student><student usn="1GS23EC002"><name>Ravi</name></student></students>\nTrue' },
        summary: ['XML is a tree of elements with tags, text, attributes and children.', 'ET.fromstring() parses text into Element objects.', 'find() returns one child; findall(path) returns a list; get() reads attributes.', 'Loop over findall() results to process repeated nodes.']
      },
      {
        id: 'm5-4', title: 'JSON — JavaScript Object Notation',
        covers: ['JSON'],
        concept: R`<p><strong>JSON</strong> is a lightweight text format for exchanging data, derived from JavaScript’s object and array syntax. It maps almost directly onto Python types:</p>
<table class="ref"><thead><tr><th>JSON</th><th>Python</th></tr></thead><tbody>
<tr><td>object <code>{"key": value}</code></td><td>dict</td></tr><tr><td>array <code>[…]</code></td><td>list</td></tr>
<tr><td>string <code>"text"</code> (double quotes only)</td><td>str</td></tr><tr><td>number <code>42</code>, <code>3.5</code></td><td>int, float</td></tr>
<tr><td><code>true</code> / <code>false</code></td><td>True / False</td></tr><tr><td><code>null</code></td><td>None</td></tr>
</tbody></table>
<p>The <code>json</code> module converts both ways: <code>json.loads(text)</code> parses a JSON string into Python values; <code>json.dumps(value, indent=2)</code> produces JSON text. (<code>load</code>/<code>dump</code> without the s read and write files.) Invalid JSON raises <code>json.JSONDecodeError</code>, which reports the line and column.</p>
<p><strong>XML vs JSON:</strong> XML is more self-describing and supports attributes, mixed content and namespaces — common in documents and configuration. JSON is simpler, more compact and maps directly to lists and dictionaries — the usual choice for web APIs.</p>`,
        syntax: R`import json
info = json.loads('{"name": "Chuck", "email": {"hide": "yes"}}')
info['email']['hide']             # 'yes'
text = json.dumps(info, indent=2)
with open('data.json', 'w') as f:
    json.dump(info, f)`,
        example: { code: R`import json

data = '''
{
  "name" : "Chuck",
  "phone" : {"type" : "intl", "number" : "+1 734 303 4456"},
  "email" : {"hide" : "yes"}
}'''
info = json.loads(data)
print('Name:', info['name'])
print('Hide:', info['email']['hide'])

data = '''
[
  {"id" : "001", "x" : "2", "name" : "Chuck"},
  {"id" : "009", "x" : "7", "name" : "Brent"}
]'''
info = json.loads(data)
print('User count:', len(info))
for item in info:
    print('Name', item['name'], '| Id', item['id'], '| Attribute', item['x'])

record = {'usn': '1GS23EC001', 'passed': True, 'mentor': None, 'marks': [88, 92]}
print(json.dumps(record))
print(json.dumps(record, indent=2))

try:
    json.loads("{'name': 'single quotes are not JSON'}")
except json.JSONDecodeError as e:
    print('JSONDecodeError:', e)` },
        demo: { w: 'jsonLab', intro: 'A JSON editor powered by Python’s json module. Format, minify and validate; errors show the exact line and column. The tree shows the Python type of every value.' },
        visual: { html: R`<div class="xj-compare">
<div><h4>XML</h4><pre class="code-static"><code>&lt;person&gt;
  &lt;name&gt;Chuck&lt;/name&gt;
  &lt;email hide="yes"/&gt;
&lt;/person&gt;</code></pre></div>
<div><h4>JSON</h4><pre class="code-static"><code>{
  "name": "Chuck",
  "email": {"hide": "yes"}
}</code></pre></div>
</div>
<table class="ref"><tbody>
<tr><td>Structure</td><td>XML: tree of elements</td><td>JSON: nested lists and dicts</td></tr>
<tr><td>Metadata</td><td>attributes, namespaces, schemas</td><td>none built in</td></tr>
<tr><td>Python module</td><td><code>xml.etree.ElementTree</code></td><td><code>json</code></td></tr>
<tr><td>Typical use</td><td>documents, configuration, SOAP</td><td>web APIs, configuration</td></tr>
</tbody></table>` },
        mistakes: [
          { wrong: R`json.loads("{'a': 1}")`, right: R`json.loads('{"a": 1}')`, why: 'JSON strings and keys must use double quotes.' },
          { wrong: R`json.loads('{"a": 1,}')`, right: R`json.loads('{"a": 1}')`, why: 'Trailing commas are not allowed in JSON.' },
          { wrong: R`info = json.dumps(text)   # to parse`, right: R`info = json.loads(text)`, why: 'loads = load from string (parse); dumps = dump to string (serialize).' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Parse <code>\'{"course": "1BEC305", "credits": 3, "lab": false}\'</code> and print the credits plus one and the Python type of <code>lab</code>.', starter: R`import json
`, sol: R`import json
d = json.loads('{"course": "1BEC305", "credits": 3, "lab": false}')
print(d['credits'] + 1, type(d['lab']))`, expect: "4 <class 'bool'>" },
          { lvl: 'Medium', q: 'Parse the sample array of users (provided) and print the names of users who have at least one skill, along with their skills joined by commas.', starter: R`import json
text = '''${PP.SAMPLE_JSON}'''
`, sol: R`import json
text = '''${PP.SAMPLE_JSON}'''
for user in json.loads(text):
    if user['skills']:
        print(user['name'] + ': ' + ', '.join(user['skills']))`, expect: 'Asha: Python, Verilog\nRavi: C' },
          { lvl: 'Hard', q: 'Save a dictionary of lab bookings to <code>bookings.json</code> with <code>json.dump</code>, load it back with <code>json.load</code>, add a booking and save it again. Print the final file content.', starter: R`import json
bookings = {'Mon': ['Asha'], 'Tue': []}
`, sol: R`import json
bookings = {'Mon': ['Asha'], 'Tue': []}
with open('bookings.json', 'w') as f:
    json.dump(bookings, f)
with open('bookings.json') as f:
    loaded = json.load(f)
loaded['Tue'].append('Ravi')
with open('bookings.json', 'w') as f:
    json.dump(loaded, f, indent=1)
print(open('bookings.json').read())` }
        ],
        challenge: { q: 'Convert the sample college XML into JSON: build a list of dictionaries (usn, name, marks as int) by looping through the XML nodes, then print it with <code>json.dumps(..., indent=2)</code>.', starter: R`import json, xml.etree.ElementTree as ET
xml = '''${PP.SAMPLE_XML.replace(/^<\?xml[^>]*>\n/, '')}'''
`, sol: R`import json, xml.etree.ElementTree as ET
xml = '''${PP.SAMPLE_XML.replace(/^<\?xml[^>]*>\n/, '')}'''
root = ET.fromstring(xml)
students = [{'usn': s.get('usn'), 'name': s.find('name').text, 'marks': int(s.find('marks').text)}
            for s in root.findall('department/student')]
print(json.dumps(students, indent=2))` },
        summary: ['JSON objects/arrays/strings/numbers/true/false/null ↔ dict/list/str/int-float/True/False/None.', 'json.loads parses text; json.dumps produces text (load/dump for files).', 'JSON needs double quotes and no trailing commas.', 'JSON is simpler than XML and the norm for web APIs.']
      },
      {
        id: 'm5-5', title: 'Databases, SQL and creating a table',
        covers: ['What is database?', 'Database Concepts', 'Database Browser', 'Creating a database table', 'SQL'],
        concept: R`<p>A <strong>database</strong> is a file (or server) organised for storing data so that it can be searched and updated quickly — even when it holds far more than fits in memory. Like a dictionary, it maps keys to values, but it lives on disk, persists after the program ends, and uses <strong>indexes</strong> to find records fast.</p>
<p><strong>Concepts.</strong> A relational database stores data in <strong>tables</strong> (relations). Each table has <strong>columns</strong> (attributes, each with a type) and <strong>rows</strong> (tuples / records). Python ships with <strong>SQLite</strong> — a complete database engine in a single file — in the <code>sqlite3</code> module.</p>
<p><strong>Database browser.</strong> A tool such as <em>DB Browser for SQLite</em> (free, sqlitebrowser.org) lets you open a <code>.sqlite</code> file, see its tables, edit rows and run SQL without writing a program — very useful for checking what your Python code stored. The explorer below plays the same role inside this website.</p>
<p><strong>SQL</strong> (Structured Query Language) is how you talk to the database:</p>
<table class="ref"><tbody>
<tr><td><code>CREATE TABLE Tracks (title TEXT, plays INTEGER)</code></td><td>define a table</td></tr>
<tr><td><code>INSERT INTO Tracks (title, plays) VALUES ('My Way', 15)</code></td><td>add a row</td></tr>
<tr><td><code>SELECT * FROM Tracks WHERE plays &gt; 10 ORDER BY title</code></td><td>read rows</td></tr>
<tr><td><code>UPDATE Tracks SET plays = 16 WHERE title = 'My Way'</code></td><td>change rows</td></tr>
<tr><td><code>DELETE FROM Tracks WHERE plays &lt; 5</code></td><td>remove rows</td></tr>
</tbody></table>
<p>In Python: <code>conn = sqlite3.connect('music.sqlite')</code>, <code>cur = conn.cursor()</code>, <code>cur.execute(sql, params)</code>, <code>conn.commit()</code>, <code>conn.close()</code>. Always pass values with <code>?</code> placeholders instead of building SQL strings — this prevents SQL injection and quoting bugs.</p>`,
        syntax: R`import sqlite3
conn = sqlite3.connect('music.sqlite')
cur = conn.cursor()
cur.execute('DROP TABLE IF EXISTS Tracks')
cur.execute('CREATE TABLE Tracks (title TEXT, plays INTEGER)')
cur.execute('INSERT INTO Tracks (title, plays) VALUES (?, ?)', ('My Way', 15))
conn.commit()
for row in cur.execute('SELECT title, plays FROM Tracks'):
    print(row)
conn.close()`,
        example: { code: R`import sqlite3, os

conn = sqlite3.connect('music.sqlite')      # a real SQLite file in the virtual workspace
cur = conn.cursor()
cur.execute('DROP TABLE IF EXISTS Tracks')
cur.execute('CREATE TABLE Tracks (title TEXT, plays INTEGER)')

cur.execute('INSERT INTO Tracks (title, plays) VALUES (?, ?)', ('Thunderstruck', 20))
cur.execute('INSERT INTO Tracks (title, plays) VALUES (?, ?)', ('My Way', 15))
cur.executemany('INSERT INTO Tracks (title, plays) VALUES (?, ?)', [('Imagine', 9), ('Yesterday', 4)])
conn.commit()

print('Tracks:')
cur.execute('SELECT title, plays FROM Tracks ORDER BY plays DESC')
for row in cur:
    print(row)

cur.execute('UPDATE Tracks SET plays = plays + 1 WHERE title = ?', ('Imagine',))
cur.execute('DELETE FROM Tracks WHERE plays < ?', (5,))
conn.commit()
print(cur.execute('SELECT COUNT(*), SUM(plays) FROM Tracks').fetchone())
cur.close()
conn.close()
print('Database file size:', os.path.getsize('music.sqlite'), 'bytes')` },
        demo: { w: 'dbExplorer', seed: 'TRACKS', intro: 'An in-browser database browser running real SQLite. Run SQL, use the quick actions to create a table, insert, update and delete rows, and watch the schema panel update.', samples: [
          { label: 'SELECT all', sql: 'SELECT * FROM Tracks;' },
          { label: 'Filter + sort', sql: 'SELECT title, plays FROM Tracks WHERE plays > 10 ORDER BY title;' },
          { label: 'INSERT', sql: "INSERT INTO Tracks (title, plays) VALUES ('Bohemian Rhapsody', 31);\nSELECT * FROM Tracks;" },
          { label: 'UPDATE', sql: "UPDATE Tracks SET plays = plays + 1 WHERE title = 'My Way';\nSELECT * FROM Tracks;" },
          { label: 'DELETE', sql: 'DELETE FROM Tracks WHERE plays < 10;\nSELECT * FROM Tracks;' },
          { label: 'CREATE TABLE', sql: 'CREATE TABLE Artist (id INTEGER PRIMARY KEY, name TEXT UNIQUE);\nINSERT INTO Artist (name) VALUES (\'AC/DC\'), (\'Frank Sinatra\');\nSELECT * FROM Artist;' },
          { label: 'Aggregate', sql: 'SELECT COUNT(*) AS tracks, SUM(plays) AS total, MAX(plays) AS most FROM Tracks;' }
        ] },
        visual: { html: R`<div class="db-anatomy">
<table class="ref sample-table"><caption>Table <code>Tracks</code></caption><thead><tr><th>title <small>TEXT</small></th><th>plays <small>INTEGER</small></th></tr></thead>
<tbody><tr><td>Thunderstruck</td><td>20</td></tr><tr><td>My Way</td><td>15</td></tr></tbody></table>
<ul><li><b>Table</b> = relation</li><li><b>Row</b> = tuple / record</li><li><b>Column</b> = attribute / field</li></ul>
</div>
<ol class="steps"><li><b>connect()</b> opens (or creates) the database file</li><li><b>cursor()</b> creates a handle for running SQL</li><li><b>execute()</b> sends SQL with ? parameters</li><li><b>commit()</b> saves changes to disk</li><li><b>close()</b> releases the file</li></ol>` },
        mistakes: [
          { wrong: R`cur.execute("INSERT INTO Tracks VALUES ('" + title + "', 5)")`, right: R`cur.execute('INSERT INTO Tracks VALUES (?, ?)', (title, 5))`, why: "String-built SQL breaks on titles containing ' and allows SQL injection. Use ? placeholders." },
          { wrong: R`cur.execute('INSERT ...')
conn.close()`, right: R`cur.execute('INSERT ...')
conn.commit()
conn.close()`, why: 'Without commit(), changes are discarded when the connection closes.' },
          { wrong: R`cur.execute('SELECT * FROM Tracks WHERE plays > ?', 10)`, right: R`cur.execute('SELECT * FROM Tracks WHERE plays > ?', (10,))`, why: 'Parameters must be a sequence; a single value needs a one-item tuple.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Create an in-memory database (<code>sqlite3.connect(\':memory:\')</code>), a table <code>Lab(name TEXT, seats INTEGER)</code>, insert two labs and print all rows.', starter: R`import sqlite3
`, sol: R`import sqlite3
conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.execute('CREATE TABLE Lab (name TEXT, seats INTEGER)')
cur.executemany('INSERT INTO Lab VALUES (?, ?)', [('VLSI Lab', 30), ('DSP Lab', 24)])
for row in cur.execute('SELECT * FROM Lab'):
    print(row)`, expect: "('VLSI Lab', 30)\n('DSP Lab', 24)" },
          { lvl: 'Medium', q: 'Store the marks <code>{\'Asha\': 88, \'Ravi\': 64, \'Meera\': 95, \'John\': 67}</code> in a table, then use SQL to print the students with marks of at least 70, highest first.', starter: R`import sqlite3
marks = {'Asha': 88, 'Ravi': 64, 'Meera': 95, 'John': 67}
`, sol: R`import sqlite3
marks = {'Asha': 88, 'Ravi': 64, 'Meera': 95, 'John': 67}
conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE Marks (name TEXT, marks INTEGER)')
conn.executemany('INSERT INTO Marks VALUES (?, ?)', marks.items())
for name, m in conn.execute('SELECT name, marks FROM Marks WHERE marks >= 70 ORDER BY marks DESC'):
    print(name, m)`, expect: 'Meera 95\nAsha 88' },
          { lvl: 'Hard', q: 'Count word frequencies from a text into a table <code>Counts(word TEXT PRIMARY KEY, count INTEGER)</code>: for each word, try <code>UPDATE</code>; if no row changed (<code>cur.rowcount == 0</code>), <code>INSERT</code>. Print the top three words.', starter: R`import sqlite3
text = 'the quick brown fox jumps over the lazy dog the fox'
`, sol: R`import sqlite3
text = 'the quick brown fox jumps over the lazy dog the fox'
conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.execute('CREATE TABLE Counts (word TEXT PRIMARY KEY, count INTEGER)')
for w in text.split():
    cur.execute('UPDATE Counts SET count = count + 1 WHERE word = ?', (w,))
    if cur.rowcount == 0:
        cur.execute('INSERT INTO Counts (word, count) VALUES (?, 1)', (w,))
conn.commit()
for row in cur.execute('SELECT word, count FROM Counts ORDER BY count DESC, word LIMIT 3'):
    print(row)`, expect: "('the', 3)\n('fox', 2)\n('brown', 1)" }
        ],
        challenge: { q: 'Build a tiny library system: a <code>Books</code> table (id, title, available). Write functions <code>add_book</code>, <code>issue(title)</code> (only if available) and <code>report()</code>, using parameterised SQL throughout.', starter: R`import sqlite3
conn = sqlite3.connect(':memory:')
`, sol: R`import sqlite3
conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE Books (id INTEGER PRIMARY KEY, title TEXT UNIQUE, available INTEGER DEFAULT 1)')

def add_book(title):
    conn.execute('INSERT INTO Books (title) VALUES (?)', (title,))
    conn.commit()

def issue(title):
    cur = conn.execute('UPDATE Books SET available = 0 WHERE title = ? AND available = 1', (title,))
    conn.commit()
    print('Issued' if cur.rowcount else 'Not available:', title)

def report():
    for title, avail in conn.execute('SELECT title, available FROM Books ORDER BY title'):
        print(title.ljust(22), 'in' if avail else 'out')

for t in ['Think Python', 'Automate the Boring Stuff', 'Python for Everybody']:
    add_book(t)
issue('Think Python')
issue('Think Python')
report()`, expect: 'Issued Think Python\nNot available: Think Python\nAutomate the Boring Stuff in\nPython for Everybody   in\nThink Python           out' },
        summary: ['A database stores data on disk with indexes for fast lookup.', 'Tables have typed columns and rows; SQLite is built into Python (sqlite3).', 'CREATE, INSERT, SELECT, UPDATE, DELETE are the core SQL statements.', 'connect → cursor → execute (with ? parameters) → commit → close.', 'A database browser lets you inspect what your program stored.']
      },
      {
        id: 'm5-6', title: 'Spidering Twitter: a case study with sample data',
        covers: ['Spidering Twitter'],
        concept: R`<p>The textbook’s “Spidering Twitter” programs show a classic pattern: a <strong>spider</strong> (crawler) that retrieves data from a web API a little at a time and stores its progress in a database, so it can be stopped and restarted without losing work.</p>
<p>How the original worked: the program asked the Twitter API (with OAuth credentials kept in a separate <code>hidden.py</code> file) for the friends of an account, received JSON, and stored each account in a table with a <code>retrieved</code> flag. Each run picked an account with <code>retrieved = 0</code>, fetched its friends, inserted any new accounts, recorded who-follows-whom, and marked the account as retrieved. A later version used two tables — <code>People(id, name, retrieved)</code> and <code>Follows(from_id, to_id)</code> — connected by integer keys (lesson 5.7).</p>
<p class="callout">Today: Twitter is now X, and its API requires paid developer access, so the original programs no longer run as published. This lesson keeps the <em>idea</em> and replaces the network call with a <strong>mock API</strong> — a dictionary of sample accounts returned as JSON text. No credentials or live access are needed. Swapping <code>mock_api()</code> for a real request function would be the only change for a live service.</p>
<p>What the case study teaches: parsing JSON from an API, using a database as the spider’s memory, the <code>retrieved</code> flag pattern for restartable work, <code>INSERT OR IGNORE</code> and <code>UNIQUE</code> constraints to avoid duplicates, and modelling a many-to-many relationship (who follows whom).</p>`,
        syntax: R`cur.execute('CREATE TABLE IF NOT EXISTS People (id INTEGER PRIMARY KEY, name TEXT UNIQUE, retrieved INTEGER)')
cur.execute('CREATE TABLE IF NOT EXISTS Follows (from_id INTEGER, to_id INTEGER, UNIQUE(from_id, to_id))')
cur.execute('SELECT id, name FROM People WHERE retrieved = 0 LIMIT 1')
cur.execute('INSERT OR IGNORE INTO People (name, retrieved) VALUES (?, 0)', (friend,))
cur.execute('UPDATE People SET retrieved = 1 WHERE name = ?', (acct,))`,
        example: { code: R`import json, sqlite3

# ---- MOCK API (sample data instead of the live Twitter/X service) ----
SAMPLE_FRIENDS = {
    'drchuck':  ['coursera', 'umsi', 'pythonlearn'],
    'coursera': ['umsi', 'stanford'],
    'umsi':     ['drchuck', 'umich'],
    'pythonlearn': ['drchuck'],
    'stanford': [], 'umich': ['umsi'],
}
def mock_api(account):
    """Pretend web request: returns JSON text like a friends/list API would."""
    users = [{'screen_name': f} for f in SAMPLE_FRIENDS.get(account, [])]
    return json.dumps({'users': users})
# ----------------------------------------------------------------------

conn = sqlite3.connect('friends.sqlite')
cur = conn.cursor()
cur.execute('DROP TABLE IF EXISTS People')
cur.execute('DROP TABLE IF EXISTS Follows')
cur.execute('CREATE TABLE People (id INTEGER PRIMARY KEY, name TEXT UNIQUE, retrieved INTEGER)')
cur.execute('CREATE TABLE Follows (from_id INTEGER, to_id INTEGER, UNIQUE(from_id, to_id))')
cur.execute('INSERT INTO People (name, retrieved) VALUES (?, 0)', ('drchuck',))

for run in range(1, 8):                       # each pass = one "Enter Twitter Account:" round
    cur.execute('SELECT id, name FROM People WHERE retrieved = 0 LIMIT 1')
    row = cur.fetchone()
    if row is None:
        print('No unretrieved accounts left')
        break
    from_id, acct = row
    js = json.loads(mock_api(acct))
    cur.execute('UPDATE People SET retrieved = 1 WHERE id = ?', (from_id,))
    new = 0
    for u in js['users']:
        friend = u['screen_name']
        cur.execute('INSERT OR IGNORE INTO People (name, retrieved) VALUES (?, 0)', (friend,))
        new += cur.rowcount
        cur.execute('SELECT id FROM People WHERE name = ?', (friend,))
        to_id = cur.fetchone()[0]
        cur.execute('INSERT OR IGNORE INTO Follows (from_id, to_id) VALUES (?, ?)', (from_id, to_id))
    conn.commit()
    print('Run', run, '- retrieved', acct, '| friends:', len(js['users']), '| new accounts:', new)

print('\nPeople:', cur.execute('SELECT name, retrieved FROM People').fetchall())
print('Most followed:')
for name, n in cur.execute('''SELECT People.name, COUNT(*) FROM Follows
                              JOIN People ON Follows.to_id = People.id
                              GROUP BY People.name ORDER BY COUNT(*) DESC LIMIT 3'''):
    print(' ', name, n)
conn.close()` },
        demo: { w: 'code', intro: 'Restartability: run this cell repeatedly. It reopens the same database file and continues from where the previous run stopped, exactly like the original spider. Run the example above first to create friends.sqlite.', code: R`import json, sqlite3, os
if not os.path.exists('friends.sqlite'):
    print('Run the worked example first to create friends.sqlite')
else:
    conn = sqlite3.connect('friends.sqlite')
    cur = conn.cursor()
    todo = cur.execute('SELECT COUNT(*) FROM People WHERE retrieved = 0').fetchone()[0]
    done = cur.execute('SELECT COUNT(*) FROM People WHERE retrieved = 1').fetchone()[0]
    print('Retrieved:', done, '| still to retrieve:', todo)
    for frm, to in cur.execute('''SELECT a.name, b.name FROM Follows
                                  JOIN People AS a ON Follows.from_id = a.id
                                  JOIN People AS b ON Follows.to_id = b.id
                                  ORDER BY a.name'''):
        print(frm, '->', to)
    conn.close()` },
        visual: { html: R`<div class="spider-flow">
<ol class="steps">
<li><b>Pick</b> an account with <code>retrieved = 0</code> from <code>People</code></li>
<li><b>Request</b> its friends from the API (here: <code>mock_api()</code> returns JSON)</li>
<li><b>Parse</b> the JSON with <code>json.loads()</code></li>
<li><b>Store</b> new accounts (<code>INSERT OR IGNORE</code>) and <code>Follows</code> rows</li>
<li><b>Mark</b> the account <code>retrieved = 1</code> and <code>commit()</code> — safe to stop here</li>
</ol>
<p class="muted">Tables: <code>People(id, name, retrieved)</code> ← <code>Follows(from_id, to_id)</code> → <code>People(id)</code></p></div>` },
        mistakes: [
          { wrong: R`cur.execute('INSERT INTO People (name) VALUES (?)', (friend,))   # every time`, right: R`cur.execute('INSERT OR IGNORE INTO People (name, retrieved) VALUES (?, 0)', (friend,))`, why: 'With a UNIQUE name column, a plain INSERT of an existing account raises IntegrityError; INSERT OR IGNORE skips duplicates.' },
          { wrong: R`# commit only at the very end of a long crawl`, right: R`conn.commit()   # after each account`, why: 'If the program stops (network error, Ctrl+C), uncommitted work is lost. Committing per account makes the spider restartable.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Parse the mock API response <code>\'{"users": [{"screen_name": "umsi"}, {"screen_name": "umich"}]}\'</code> and print the list of screen names.', starter: R`import json
`, sol: R`import json
js = json.loads('{"users": [{"screen_name": "umsi"}, {"screen_name": "umich"}]}')
print([u['screen_name'] for u in js['users']])`, expect: "['umsi', 'umich']" },
          { lvl: 'Medium', q: 'After running the worked example, query <code>friends.sqlite</code> to list the accounts that follow <code>drchuck</code>.', starter: R`import sqlite3
`, sol: R`import sqlite3
conn = sqlite3.connect('friends.sqlite')
rows = conn.execute('''SELECT a.name FROM Follows
                       JOIN People AS a ON Follows.from_id = a.id
                       JOIN People AS b ON Follows.to_id = b.id
                       WHERE b.name = ? ORDER BY a.name''', ('drchuck',)).fetchall()
print([r[0] for r in rows])`, expect: "['pythonlearn', 'umsi']" },
          { lvl: 'Hard', q: 'Find mutual friendships (A follows B and B follows A) in <code>friends.sqlite</code> with a self-join on <code>Follows</code>, printing each pair once.', starter: R`import sqlite3
`, sol: R`import sqlite3
conn = sqlite3.connect('friends.sqlite')
sql = '''SELECT pa.name, pb.name FROM Follows AS f1
         JOIN Follows AS f2 ON f1.from_id = f2.to_id AND f1.to_id = f2.from_id
         JOIN People AS pa ON f1.from_id = pa.id
         JOIN People AS pb ON f1.to_id = pb.id
         WHERE pa.name < pb.name ORDER BY pa.name, pb.name'''
for a, b in conn.execute(sql):
    print(a, '<->', b)`, expect: 'drchuck <-> pythonlearn\ndrchuck <-> umsi\numich <-> umsi' }
        ],
        challenge: { q: 'Add a <code>depth</code> column to <code>People</code> (0 for the starting account, parent depth + 1 for newly found friends) and stop the spider once it reaches depth 2. Print each account with its depth.', starter: R`import json, sqlite3
SAMPLE_FRIENDS = {'drchuck': ['coursera', 'umsi', 'pythonlearn'], 'coursera': ['umsi', 'stanford'],
                  'umsi': ['drchuck', 'umich'], 'pythonlearn': ['drchuck'], 'stanford': [], 'umich': ['umsi']}
`, sol: R`import json, sqlite3
SAMPLE_FRIENDS = {'drchuck': ['coursera', 'umsi', 'pythonlearn'], 'coursera': ['umsi', 'stanford'],
                  'umsi': ['drchuck', 'umich'], 'pythonlearn': ['drchuck'], 'stanford': [], 'umich': ['umsi']}
conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.execute('CREATE TABLE People (id INTEGER PRIMARY KEY, name TEXT UNIQUE, retrieved INTEGER, depth INTEGER)')
cur.execute("INSERT INTO People (name, retrieved, depth) VALUES ('drchuck', 0, 0)")
while True:
    row = cur.execute('SELECT id, name, depth FROM People WHERE retrieved = 0 AND depth < 2 ORDER BY depth LIMIT 1').fetchone()
    if row is None:
        break
    pid, acct, depth = row
    for friend in SAMPLE_FRIENDS.get(acct, []):
        cur.execute('INSERT OR IGNORE INTO People (name, retrieved, depth) VALUES (?, 0, ?)', (friend, depth + 1))
    cur.execute('UPDATE People SET retrieved = 1 WHERE id = ?', (pid,))
for name, depth in cur.execute('SELECT name, depth FROM People ORDER BY depth, name'):
    print(depth, name)`, expect: '0 drchuck\n1 coursera\n1 pythonlearn\n1 umsi\n2 stanford\n2 umich' },
        summary: ['A spider retrieves data incrementally and keeps its state in a database.', 'The retrieved flag makes the crawl restartable; commit after each unit of work.', 'UNIQUE + INSERT OR IGNORE prevent duplicates.', 'Follows(from_id, to_id) models a many-to-many relationship between People.', 'The live Twitter/X API now needs paid credentials; the mock API keeps the same logic.']
      },
      {
        id: 'm5-7', title: 'Data modeling, multiple tables, keys and JOIN',
        covers: ['Basic data modeling', 'Programming with multiple tables', 'Three kinds of Keys', 'JOIN'],
        concept: R`<p><strong>Basic data modeling.</strong> Storing the same string over and over (an artist’s name on every track) wastes space and invites inconsistency. The core rule of database design: <em>do not put the same string data in a database more than once</em>. Instead, store each real-world thing once in its own table and refer to it by an integer key. Draw each thing (Student, Course) as a table and each relationship as a link between tables; a many-to-many relationship (students take many courses, courses have many students) needs a <strong>connection table</strong> (Enrollment).</p>
<p><strong>Three kinds of keys:</strong></p>
<ul>
<li><strong>Primary key</strong> — usually an integer <code>id</code> that uniquely identifies each row; the database assigns it (<code>INTEGER PRIMARY KEY</code>).</li>
<li><strong>Logical key</strong> — what the outside world uses to look up a row, such as a USN or course code; mark it <code>UNIQUE</code> so duplicates are rejected and lookups are indexed. (Textbooks also call candidate identifiers like this <em>candidate keys</em>: columns that could uniquely identify a row.)</li>
<li><strong>Foreign key</strong> — an integer column that holds the primary key of a row in another table (<code>Enrollment.student_id</code> → <code>Student.id</code>).</li>
</ul>
<p><strong>Programming with multiple tables.</strong> When inserting, look up (or insert) the referenced row first to get its id: <code>INSERT OR IGNORE INTO Course (code, …)</code>, then <code>SELECT id FROM Course WHERE code = ?</code>, then insert the row that uses that id.</p>
<p><strong>JOIN</strong> reassembles the data: <code>SELECT … FROM Enrollment JOIN Student ON Enrollment.student_id = Student.id</code>. An <code>INNER JOIN</code> (plain <code>JOIN</code>) returns only rows that match on both sides; a <code>LEFT JOIN</code> keeps every row of the left table and fills missing matches with <code>NULL</code> — useful for finding students with no enrolments.</p>`,
        syntax: R`CREATE TABLE Student (id INTEGER PRIMARY KEY, usn TEXT UNIQUE, name TEXT);
CREATE TABLE Enrollment (student_id INTEGER REFERENCES Student(id),
                         course_id INTEGER REFERENCES Course(id),
                         marks INTEGER, PRIMARY KEY (student_id, course_id));

SELECT Student.name, Course.title, Enrollment.marks
FROM Enrollment
JOIN Student ON Enrollment.student_id = Student.id
JOIN Course  ON Enrollment.course_id  = Course.id;

SELECT Student.name, Enrollment.course_id
FROM Student LEFT JOIN Enrollment ON Student.id = Enrollment.student_id;`,
        example: { code: R`import sqlite3
conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.executescript('''
CREATE TABLE Student (id INTEGER PRIMARY KEY, usn TEXT UNIQUE NOT NULL, name TEXT);
CREATE TABLE Course  (id INTEGER PRIMARY KEY, code TEXT UNIQUE NOT NULL, title TEXT);
CREATE TABLE Enrollment (student_id INTEGER REFERENCES Student(id),
                         course_id INTEGER REFERENCES Course(id),
                         marks INTEGER, PRIMARY KEY (student_id, course_id));
''')

def get_id(table, key_col, key, extra_col, extra):
    """Insert the row if its logical key is new, then return its primary key."""
    cur.execute(f'INSERT OR IGNORE INTO {table} ({key_col}, {extra_col}) VALUES (?, ?)', (key, extra))
    cur.execute(f'SELECT id FROM {table} WHERE {key_col} = ?', (key,))
    return cur.fetchone()[0]

raw = [('1GS23EC001', 'Asha', '1BEC305', 'Python Programming', 88),
       ('1GS23EC001', 'Asha', 'EC201', 'Digital Design', 92),
       ('1GS23EC002', 'Ravi', '1BEC305', 'Python Programming', 64),
       ('1GS23EC003', 'Meera', 'EC201', 'Digital Design', 84)]
for usn, name, code, title, marks in raw:
    sid = get_id('Student', 'usn', usn, 'name', name)
    cid = get_id('Course', 'code', code, 'title', title)
    cur.execute('INSERT OR REPLACE INTO Enrollment VALUES (?, ?, ?)', (sid, cid, marks))
cur.execute("INSERT INTO Student (usn, name) VALUES ('1GS23EC005', 'Priya')")   # no enrolments
conn.commit()

print('Students:', cur.execute('SELECT * FROM Student').fetchall())
print('Enrollment (only integers):', cur.execute('SELECT * FROM Enrollment').fetchall())
print('\nINNER JOIN:')
for row in cur.execute('''SELECT Student.name, Course.title, Enrollment.marks
                          FROM Enrollment
                          JOIN Student ON Enrollment.student_id = Student.id
                          JOIN Course  ON Enrollment.course_id  = Course.id
                          ORDER BY Student.name, Course.title'''):
    print(' ', row)
print('\nLEFT JOIN (students with no enrolment get None):')
for row in cur.execute('''SELECT Student.name, COUNT(Enrollment.course_id)
                          FROM Student LEFT JOIN Enrollment ON Student.id = Enrollment.student_id
                          GROUP BY Student.id ORDER BY Student.name'''):
    print(' ', row)` },
        demo: { w: 'joinViz', intro: 'Animated table matching. Choose INNER JOIN or LEFT JOIN and step through: each Student row is compared with Enrollment rows on Student.id = Enrollment.student_id, and the result table grows. The same query then runs in SQLite to confirm.' },
        visual: { w: 'keysViz', intro: 'Primary, logical (candidate) and foreign keys in the Student–Course–Enrollment schema. Hover or focus a key to highlight the relationship.' },
        extra: { w: 'dbExplorer', seed: 'SCHOOL', title: 'Multi-table explorer: Student–Course–Enrollment', intro: 'The full sample application. Try the JOIN queries, then write your own — for example, the average marks per course, or students not enrolled in Python.', samples: [
          { label: 'All tables', sql: 'SELECT * FROM Student;\nSELECT * FROM Course;\nSELECT * FROM Enrollment;' },
          { label: 'INNER JOIN', sql: 'SELECT Student.name, Course.code, Course.title, Enrollment.marks\nFROM Enrollment\nJOIN Student ON Enrollment.student_id = Student.id\nJOIN Course  ON Enrollment.course_id  = Course.id\nORDER BY Student.name;' },
          { label: 'LEFT JOIN', sql: 'SELECT Student.name, Course.title\nFROM Student\nLEFT JOIN Enrollment ON Student.id = Enrollment.student_id\nLEFT JOIN Course ON Enrollment.course_id = Course.id\nORDER BY Student.name;' },
          { label: 'Not enrolled', sql: 'SELECT Student.name FROM Student\nLEFT JOIN Enrollment ON Student.id = Enrollment.student_id\nWHERE Enrollment.student_id IS NULL;' },
          { label: 'Average per course', sql: 'SELECT Course.title, COUNT(*) AS students, ROUND(AVG(marks), 1) AS average\nFROM Enrollment JOIN Course ON Enrollment.course_id = Course.id\nGROUP BY Course.id ORDER BY average DESC;' },
          { label: 'Duplicate logical key', sql: "INSERT INTO Student (usn, name) VALUES ('1GS23EC001', 'Duplicate');" },
          { label: 'Bad foreign key', sql: 'INSERT INTO Enrollment (student_id, course_id, marks) VALUES (99, 1, 50);' }
        ] },
        mistakes: [
          { wrong: R`CREATE TABLE Enrollment (student_name TEXT, course_title TEXT, marks INTEGER)`, right: R`CREATE TABLE Enrollment (student_id INTEGER, course_id INTEGER, marks INTEGER)`, why: 'Repeating names in every row duplicates string data; a renamed course would have to be fixed in many rows. Store integer foreign keys.' },
          { wrong: R`SELECT name, title FROM Student, Enrollment, Course`, right: R`SELECT name, title FROM Enrollment
JOIN Student ON Enrollment.student_id = Student.id
JOIN Course ON Enrollment.course_id = Course.id`, why: 'Without ON conditions, the database pairs every row with every other row (a cross product).' },
          { wrong: R`SELECT ... FROM Student JOIN Enrollment ...   -- to include unenrolled students`, right: R`SELECT ... FROM Student LEFT JOIN Enrollment ...`, why: 'An inner join drops students with no matching Enrollment rows.' }
        ],
        practice: [
          { lvl: 'Easy', q: 'Using the sample school database (the SQL is provided), print the name of every student taking course <code>1BEC305</code>.', starter: R`import sqlite3
conn = sqlite3.connect(':memory:')
conn.executescript('''${PP.SCHOOL_SQL}''')
`, sol: R`import sqlite3
conn = sqlite3.connect(':memory:')
conn.executescript('''${PP.SCHOOL_SQL}''')
sql = '''SELECT Student.name FROM Enrollment
         JOIN Student ON Enrollment.student_id = Student.id
         JOIN Course ON Enrollment.course_id = Course.id
         WHERE Course.code = ? ORDER BY Student.name'''
print([r[0] for r in conn.execute(sql, ('1BEC305',))])`, expect: "['Asha', 'John', 'Meera', 'Ravi']" },
          { lvl: 'Medium', q: 'Print every course with the number of enrolled students, including courses nobody takes (use LEFT JOIN and COUNT of a column from the right table).', starter: R`import sqlite3
conn = sqlite3.connect(':memory:')
conn.executescript('''${PP.SCHOOL_SQL}''')
`, sol: R`import sqlite3
conn = sqlite3.connect(':memory:')
conn.executescript('''${PP.SCHOOL_SQL}''')
sql = '''SELECT Course.code, COUNT(Enrollment.student_id) FROM Course
         LEFT JOIN Enrollment ON Course.id = Enrollment.course_id
         GROUP BY Course.id ORDER BY Course.code'''
for code, n in conn.execute(sql):
    print(code, n)`, expect: '1BEC305 4\nEC201 2\nEC202 1\nEC203 0' },
          { lvl: 'Hard', q: 'Write <code>enroll(usn, code, marks)</code> that looks up both ids by their logical keys and inserts the enrolment, printing a clear message if the USN or course code does not exist. Then print each student’s total credits.', starter: R`import sqlite3
conn = sqlite3.connect(':memory:')
conn.executescript('''${PP.SCHOOL_SQL}''')
`, sol: R`import sqlite3
conn = sqlite3.connect(':memory:')
conn.executescript('''${PP.SCHOOL_SQL}''')

def enroll(usn, code, marks):
    s = conn.execute('SELECT id FROM Student WHERE usn = ?', (usn,)).fetchone()
    c = conn.execute('SELECT id FROM Course WHERE code = ?', (code,)).fetchone()
    if s is None or c is None:
        print('Unknown', 'USN' if s is None else 'course', usn if s is None else code)
        return
    conn.execute('INSERT OR REPLACE INTO Enrollment VALUES (?, ?, ?)', (s[0], c[0], marks))
    conn.commit()

enroll('1GS23EC005', 'EC203', 79)
enroll('1GS23EC099', 'EC203', 50)
enroll('1GS23EC005', 'EC999', 50)
sql = '''SELECT Student.name, COALESCE(SUM(Course.credits), 0) FROM Student
         LEFT JOIN Enrollment ON Student.id = Enrollment.student_id
         LEFT JOIN Course ON Enrollment.course_id = Course.id
         GROUP BY Student.id ORDER BY Student.name'''
for name, credits in conn.execute(sql):
    print(name, credits)`, expect: 'Unknown USN 1GS23EC099\nUnknown course EC999\nAsha 7\nJohn 3\nMeera 7\nPriya 1\nRavi 6' }
        ],
        challenge: { q: 'Data-model a music library from flat rows <code>(track, album, artist, genre, plays)</code> into four tables — Artist, Genre, Album (artist_id) and Track (album_id, genre_id) — using logical keys and <code>INSERT OR IGNORE</code>. Then reconstruct the original rows with a three-way JOIN.', starter: R`import sqlite3
rows = [('Thunderstruck', 'The Razors Edge', 'AC/DC', 'Rock', 20),
        ('Who Made Who', 'Who Made Who', 'AC/DC', 'Rock', 18),
        ('My Way', 'My Way', 'Frank Sinatra', 'Pop', 15)]
`, sol: R`import sqlite3
rows = [('Thunderstruck', 'The Razors Edge', 'AC/DC', 'Rock', 20),
        ('Who Made Who', 'Who Made Who', 'AC/DC', 'Rock', 18),
        ('My Way', 'My Way', 'Frank Sinatra', 'Pop', 15)]
conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.executescript('''
CREATE TABLE Artist (id INTEGER PRIMARY KEY, name TEXT UNIQUE);
CREATE TABLE Genre  (id INTEGER PRIMARY KEY, name TEXT UNIQUE);
CREATE TABLE Album  (id INTEGER PRIMARY KEY, artist_id INTEGER, title TEXT UNIQUE);
CREATE TABLE Track  (id INTEGER PRIMARY KEY, title TEXT UNIQUE, album_id INTEGER, genre_id INTEGER, plays INTEGER);
''')
for track, album, artist, genre, plays in rows:
    cur.execute('INSERT OR IGNORE INTO Artist (name) VALUES (?)', (artist,))
    artist_id = cur.execute('SELECT id FROM Artist WHERE name = ?', (artist,)).fetchone()[0]
    cur.execute('INSERT OR IGNORE INTO Genre (name) VALUES (?)', (genre,))
    genre_id = cur.execute('SELECT id FROM Genre WHERE name = ?', (genre,)).fetchone()[0]
    cur.execute('INSERT OR IGNORE INTO Album (title, artist_id) VALUES (?, ?)', (album, artist_id))
    album_id = cur.execute('SELECT id FROM Album WHERE title = ?', (album,)).fetchone()[0]
    cur.execute('INSERT OR REPLACE INTO Track (title, album_id, genre_id, plays) VALUES (?, ?, ?, ?)',
                (track, album_id, genre_id, plays))
conn.commit()
print(cur.execute('SELECT COUNT(*) FROM Artist').fetchone()[0], 'artists stored once each')
for row in cur.execute('''SELECT Track.title, Album.title, Artist.name, Genre.name, Track.plays
                          FROM Track JOIN Album ON Track.album_id = Album.id
                          JOIN Artist ON Album.artist_id = Artist.id
                          JOIN Genre ON Track.genre_id = Genre.id ORDER BY Track.plays DESC'''):
    print(row)`, expect: "2 artists stored once each\n('Thunderstruck', 'The Razors Edge', 'AC/DC', 'Rock', 20)\n('Who Made Who', 'Who Made Who', 'AC/DC', 'Rock', 18)\n('My Way', 'My Way', 'Frank Sinatra', 'Pop', 15)" },
        summary: ['Store each string once; refer to it with integer keys.', 'Primary key: integer id; logical (candidate) key: UNIQUE real-world identifier; foreign key: id of a row in another table.', 'Many-to-many relationships need a connection table.', 'INNER JOIN keeps matching rows; LEFT JOIN keeps all left rows with NULLs for missing matches.']
      }
    ]
  });
})();
