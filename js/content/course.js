/* Course data transcribed from the supplied 1BEC305 syllabus page. */
(function () {
  'use strict';
  window.PP.course = {
    title: 'Python Programming',
    code: '1BEC305',
    scheme: '2025',
    type: 'PCC',
    semester: 'III',
    ltp: '3:0:0',
    pedagogyHours: '42:0:0:48',
    pedagogyLabel: 'Total Hours of Pedagogy (L:T:P:SL&TW)',
    credits: 3,
    cie: 50,
    see: 50,
    total: 100,
    seeType: 'Theory',
    examHours: 3,
    outcomes: [
      'Acquire programming skills in Python',
      'Demonstrate data structure representation using Python',
      'Develop the skill of pattern matching and files in Python',
      'Acquire Object Oriented Skills in Python',
      'Develop the ability to write database applications in Python'
    ],
    // Exact syllabus wording, module by module. Every entry must be covered by at least one lesson (see tests/qa.mjs).
    syllabus: {
      1: { hours: 9, textbook: 'Text book 1: Chapters 1–3', topics: [
        'Python Basics', 'Python language features', 'History', 'Entering Expressions into the Interactive Shell',
        'The Integer, Floating-Point, and String Data Types', 'String Concatenation and Replication', 'Storing Values in Variables',
        'Your First Program', 'Dissecting Your Program', 'Flow control', 'Boolean Values', 'Comparison Operators', 'Boolean Operators',
        'Mixing Boolean and Comparison Operators', 'Elements of Flow Control', 'Program Execution', 'Flow Control Statements',
        'Importing Modules', 'Ending a Program Early with sys.exit()', 'Functions', 'def Statements with Parameters',
        'Return Values and return Statements', 'The None Value', 'Keyword Arguments and print()', 'Local and Global Scope',
        'The global Statement', 'Exception Handling', 'A Short Program: Guess the Number'] },
      2: { hours: 8, textbook: 'Text book 1: Chapters 4–6', topics: [
        'Lists: The List Data Type', 'Working with Lists', 'Strings: Manipulating Strings', 'Working with Strings',
        'Useful String Methods', 'Tuples and Dictionaries, basics', 'Using Data Structures to Model Real-World Things',
        'Manipulating Strings (listed again at the end of Module 2)'] },
      3: { hours: 8, textbook: 'Text book 1: Chapters 7, 8', topics: [
        'Pattern Matching with Regular Expressions', 'Finding Patterns of Text Without Regular Expressions',
        'Finding Patterns of Text with Regular Expressions', 'More Pattern Matching with Regular Expressions', 'The findall() Method',
        'Character Classes', 'Making Your Own Character Classes', 'The Caret and Dollar Sign Characters', 'The Wildcard Character',
        'Review of Regex Symbols', 'Reading and Writing Files', 'Files and File Paths', 'The os.path Module',
        'The File Reading/Writing Process', 'Saving Variables with the shelve Module', 'Saving Variables with the pprint.pformat() Function'] },
      4: { hours: 9, textbook: 'Text book 2: Chapters 15–18', topics: [
        'Classes and objects: Programmer-defined types', 'Attributes', 'Rectangles', 'Instances as return values', 'Objects are mutable',
        'Copying', 'Classes and functions: Time', 'Pure functions', 'Modifiers', 'Prototyping versus planning',
        'Classes and methods: Object-oriented features', 'Printing objects', 'Another example', 'The init method', 'The __str__ method',
        'Operator overloading', 'Type-based dispatch', 'Polymorphism'] },
      5: { hours: null, textbook: null, topics: [
        'HTTP', 'The World’s simplest Web Browser', 'Retrieving an image over HTTP', 'Retrieving web pages with urllib', 'XML',
        'Parsing XML', 'Looping through nodes', 'JSON', 'What is database?', 'Database Concepts', 'Database Browser',
        'Creating a database table', 'SQL', 'Spidering Twitter', 'Basic data modeling', 'Programming with multiple tables',
        'Three kinds of Keys', 'JOIN'] }
    },
    notes: [
      'The supplied syllabus page ends after the Module 5 topic list, so the Module 5 teaching hours and textbook chapters are not visible. They are shown here as “not visible in the supplied copy” instead of being guessed.',
      'Modules 1–4 add up to 34 hours. The pedagogy line states 42 lecture hours, which would leave 8 hours for Module 5 — confirm this against the complete syllabus document.',
      'The page cites “Text book 1” and “Text book 2” by chapter number only; the book titles are not on the supplied page. The topic names match Automate the Boring Stuff with Python (Sweigart) for Modules 1–3, Think Python 2e (Downey) for Module 4, and Python for Everybody (Severance) for Module 5 — confirm against the full syllabus.',
      'In Module 2 the syllabus lists “Manipulating Strings” twice. It is taught once (lessons 2.3–2.4) and the repeat is mapped to the same lessons.'
    ]
  };
})();
