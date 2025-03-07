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

    # Create nodes table
    print("\nCreating nodes table...")
    cur.execute('''
    CREATE TABLE IF NOT EXISTS nodes (
        id VARCHAR PRIMARY KEY,
        label VARCHAR NOT NULL,
        "group" INTEGER NOT NULL,
        value VARCHAR,
        "isAI" BOOLEAN
    )
    ''')
    print("Nodes table created successfully.")

    # Create edges table
    print("\nCreating edges table...")
    cur.execute('''
    CREATE TABLE IF NOT EXISTS edges (
        source VARCHAR NOT NULL,
        target VARCHAR NOT NULL,
        value VARCHAR,
        PRIMARY KEY (source, target)
    )
    ''')
    print("Edges table created successfully.")

    # Insert sample data
    print("\nInserting sample data...")
    
    # Sample nodes
    cur.execute("INSERT INTO nodes VALUES ('node1', 'Node 1', 1, 'Example value', false)")
    cur.execute("INSERT INTO nodes VALUES ('node2', 'Node 2', 2, 'Another value', true)")
    print("Sample nodes inserted.")
    
    # Sample edge
    cur.execute("INSERT INTO edges VALUES ('node1', 'node2', 'Connection between 1 and 2')")
    print("Sample edge inserted.")

    # Verify data
    cur.execute("SELECT * FROM nodes")
    nodes = cur.fetchall()
    print(f"\nNodes in database: {len(nodes)}")
    for node in nodes:
        print(f"  - {node}")
        
    cur.execute("SELECT * FROM edges")
    edges = cur.fetchall()
    print(f"\nEdges in database: {len(edges)}")
    for edge in edges:
        print(f"  - {edge}")
    
    # Close connection
    cur.close()
    conn.close()
    print("\nDatabase setup complete!")
    
except psycopg2.Error as e:
    print(f"Database error: {e}")
except Exception as e:
    print(f"Error: {e}")