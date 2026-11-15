CREATE TABLE raw_schools (
    school_name TEXT NOT NULL CHECK (TRIM(school_name) <> ''),
    zone TEXT NOT NULL,
    school_level TEXT NOT NULL
);

CREATE TABLE raw_subjects (
    school_name TEXT NOT NULL CHECK (TRIM(school_name) <> ''),
    subject TEXT NOT NULL CHECK (TRIM(subject) <> '')
);
