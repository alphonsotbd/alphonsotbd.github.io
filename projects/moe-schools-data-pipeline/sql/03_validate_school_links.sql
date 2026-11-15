SELECT subject.school_key, COUNT(*) AS unmatched_rows
FROM standardised_subjects AS subject
LEFT JOIN schools AS school
    ON school.school_key = subject.school_key
WHERE school.school_key IS NULL
GROUP BY subject.school_key
ORDER BY subject.school_key;
