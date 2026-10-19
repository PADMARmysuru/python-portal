-- Sample Student-Course-Enrollment database (fictional data for teaching)
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
