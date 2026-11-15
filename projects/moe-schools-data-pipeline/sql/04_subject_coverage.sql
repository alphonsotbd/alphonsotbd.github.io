SELECT subject_name, COUNT(*) AS schools_offering_subject
FROM school_subjects
GROUP BY subject_name
ORDER BY schools_offering_subject DESC, subject_name;
