CREATE TABLE schools (
    school_key TEXT PRIMARY KEY,
    school_name TEXT NOT NULL,
    zone TEXT NOT NULL,
    school_level TEXT NOT NULL
);

INSERT INTO schools (school_key, school_name, zone, school_level)
SELECT
    UPPER(TRIM(school_name)),
    TRIM(school_name),
    UPPER(TRIM(zone)),
    UPPER(TRIM(school_level))
FROM raw_schools;

CREATE VIEW standardised_subjects AS
SELECT
    UPPER(TRIM(school_name)) AS school_key,
    CASE UPPER(TRIM(subject))
        WHEN 'ENGLISH LANGUAGE' THEN 'ENGLISH'
        WHEN 'MATH' THEN 'MATHEMATICS'
        ELSE UPPER(TRIM(subject))
    END AS subject_name
FROM raw_subjects;

CREATE VIEW in_scope_schools AS
SELECT school_key, school_name, zone
FROM schools
WHERE zone IN ('NORTH', 'EAST')
  AND school_level IN ('PRIMARY', 'SECONDARY');

CREATE VIEW school_subjects AS
SELECT DISTINCT
    school.school_key,
    school.school_name,
    school.zone,
    subject.subject_name
FROM in_scope_schools AS school
JOIN standardised_subjects AS subject
    ON subject.school_key = school.school_key;
