import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Get database URL from environment variable
db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print("Error: DATABASE_URL environment variable not set")
    exit(1)

print("Connecting to database...")
try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    print("Connection successful!")

    # Check if tables exist
    print("\nChecking tables...")
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE';
    """)
    
    tables = [row[0] for row in cur.fetchall()]
    print(f"Tables found: {tables}")
    
    # Check columns for nodes table if it exists
    if 'nodes' in tables:
        print("\nColumns in 'nodes' table:")
        cur.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'nodes';
        """)
        for row in cur.fetchall():
            print(f"  - {row[0]}: {row[1]}")
    else:
        print("\nNodes table not found!")
    
    # Check columns for edges table if it exists
    if 'edges' in tables:
        print("\nColumns in 'edges' table:")
        cur.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'edges';
        """)
        for row in cur.fetchall():
            print(f"  - {row[0]}: {row[1]}")
    else:
        print("\nEdges table not found!")
    
    # Close connection
    cur.close()
    conn.close()
    
except psycopg2.Error as e:
    print(f"Database error: {e}")
except Exception as e:
    print(f"Error: {e}")