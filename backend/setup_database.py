import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print("Error: DATABASE_URL environment variable not set")
    exit(1)

print("Connecting to database...")
try:
    conn = psycopg2.connect(db_url)
    conn.autocommit = True  # Important to commit changes immediately
    cur = conn.cursor()
    print("Connection successful!")

    # --- Get Table Information ---
    print("\nDescribing 'nodes' table...")
    cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'nodes';")
    for row in cur.fetchall():
        print(f"  - Column: {row[0]}, Type: {row[1]}")

    print("\nDescribing 'edges' table...")
    cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'edges';")
    for row in cur.fetchall():
        print(f"  - Column: {row[0]}, Type: {row[1]}")


    # Close connection
    cur.close()
    conn.close()
    print("\nDatabase inspection complete!")

except psycopg2.Error as e:
    print(f"Database error: {e}")
except Exception as e:
    print(f"Error: {e}")
