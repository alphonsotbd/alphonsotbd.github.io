SELECT school.school_name, school.zone, COUNT(subject.subject_name) AS subject_count
FROM in_scope_schools AS school
LEFT JOIN school_subjects AS subject
    ON subject.school_key = school.school_key
GROUP BY school.school_key, school.school_name, school.zone
ORDER BY subject_count DESC, school.school_name;
