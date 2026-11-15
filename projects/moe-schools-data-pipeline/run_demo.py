from contextlib import closing
from csv import DictReader
from pathlib import Path
import sqlite3


ROOT = Path(__file__).resolve().parent


def read_query(filename):
    return (ROOT / 'sql' / filename).read_text(encoding='utf-8')


def load_csv(connection, filename, statement):
    with (ROOT / 'data' / filename).open(encoding='utf-8', newline='') as source:
        connection.executemany(statement, DictReader(source))


def print_table(title, cursor):
    print(f'\n{title}')
    print('\t'.join(column[0] for column in cursor.description))
    for row in cursor:
        print('\t'.join(str(value) for value in row))


def main():
    with closing(sqlite3.connect(':memory:')) as connection:
        connection.executescript(read_query('01_schema.sql'))
        load_csv(connection, 'schools.csv',
                 'INSERT INTO raw_schools VALUES (:school_name, :zone, :school_level)')
        load_csv(connection, 'subjects.csv',
                 'INSERT INTO raw_subjects VALUES (:school_name, :subject)')
        connection.executescript(read_query('02_pipeline.sql'))

        unmatched = connection.execute(read_query('03_validate_school_links.sql')).fetchall()
        if unmatched:
            details = ', '.join(f'{name} ({count} rows)' for name, count in unmatched)
            raise SystemExit(f'Validation failed: unmatched school references: {details}')

        school_count, pair_count = connection.execute('''
            SELECT (SELECT COUNT(*) FROM in_scope_schools), COUNT(*) FROM school_subjects
        ''').fetchone()
        print('Validation passed: 0 unmatched subject rows')
        print(f'{pair_count} unique school–subject pairs across {school_count} schools')
        print_table('Subject coverage', connection.execute(read_query('04_subject_coverage.sql')))
        print_table('Subject count by school', connection.execute(read_query('05_school_subject_counts.sql')))


if __name__ == '__main__':
    main()
