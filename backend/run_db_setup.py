import os
import psycopg2
from psycopg2 import OperationalError

def run_sql_setup():
    conn = None
    cur = None
    db_url = "postgresql://postgre_thinkalike_user:9GIGUOLlSgY0KKaC9qXWLbWMGmEQn3Yv@dpg-cv56oc56l47c73d15480-a.oregon-postgres.render.com/postgre_thinkalike"

    try:
        print("Connecting to database...")
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        with open('db_setup.sql', 'r') as file:
            sql_commands = file.read()

        print("Executing SQL commands...")
        cur.execute(sql_commands)
        conn.commit()

        print("\nVerifying nodes:")
        cur.execute("SELECT * FROM nodes;")
        print(cur.fetchall())

        print("\nVerifying edges:")
        cur.execute("SELECT * FROM edges;")
        print(cur.fetchall())

        print("\nDatabase setup completed successfully!")

    except OperationalError as e:
        print(f"Database connection error: {e}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    run_sql_setup()
