# MOE Schools Data Pipeline

Alphonso Zhuang Jie · Nanyang Polytechnic · AI2501 Data Security and Management

This demo shows how to join school profiles to subject offerings, standardise inconsistent subject names and check that each subject record has a matching school. It focuses on primary and secondary schools in Singapore’s North and East zones.

My coursework used MySQL for filtering and pandas for cleaning and integration. In the original run, 6,772 in-scope subject rows became 6,763 unique school–subject pairs across 161 schools. This smaller portfolio demo uses fictional school names and sample records, and runs with Python’s built-in SQLite library.

## Run the demo

```bash
python3 run_demo.py
```

The script loads both CSV fixtures in memory, runs the SQL, and prints validation results and two summary tables. It runs with standard Python 3 and works from any working directory.

## Follow the SQL

| File | What it does |
| --- | --- |
| [`sql/01_schema.sql`](sql/01_schema.sql) | Creates tables for the raw school and subject rows. |
| [`sql/02_pipeline.sql`](sql/02_pipeline.sql) | Trims and standardises school identifiers and subject names, then filters schools and removes duplicate school–subject pairs. |
| [`sql/03_validate_school_links.sql`](sql/03_validate_school_links.sql) | Uses a left join to find subject rows with no matching school **before** the in-scope join can drop them. |
| [`sql/04_subject_coverage.sql`](sql/04_subject_coverage.sql) | Counts the number of in-scope schools that offer each subject. |
| [`sql/05_school_subject_counts.sql`](sql/05_school_subject_counts.sql) | Counts the unique subjects offered by each in-scope school. |

## Expected results

The sample contains 13 raw subject rows. Eleven are in scope, and two duplicate pairs collapse after subject names are standardised. The result is **9 unique school–subject pairs across 3 schools**, with **0 unmatched subject rows**. English and Mathematics are each offered at three schools, Science at two and Computing at one.

To see the validation fail, add `Demo Missing School,Science` to `data/subjects.csv` and rerun the script. It will name the unmatched school and exit with a nonzero status. Remove the test row to reset the sample.

## Sources

- [MOE General information of schools](https://data.gov.sg/datasets/d_688b934f82c1059ed0a6993d2a829089/view)
- [MOE Subjects Offered](https://data.gov.sg/datasets/d_f1d144e423570c9d84dbc5102c2e664d/view)
- [Portfolio case study](https://alphonsotbd.github.io/#tuition-analytics)
