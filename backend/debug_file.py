import os
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

# Write output to a file instead of console
with open("debug_output.txt", "w") as f:
    f.write("=== DATABASE DEBUG INFO ===\n\n")

    try:
        # Check env file
        env_path = Path(__file__).parent / '.env'
        f.write(f"Checking .env at: {env_path.absolute()}\n")

        if not env_path.exists():
            f.write("❌ .env file not found\n")
        else:
            f.write("✅ .env file found\n")

        # Load env vars
        load_dotenv(dotenv_path=env_path)
        db_url = os.getenv("DATABASE_URL")

        if not db_url:
            f.write("❌ DATABASE_URL not found\n")
        else:
            f.write(f"✅ DATABASE_URL found (starts with: {db_url[:15]}...)\n")

        # Connect to DB
        f.write("\nConnecting to database...\n")
        if db_url:
            conn = psycopg2.connect(db_url.strip('"'))
        else:
            raise ValueError("DATABASE_URL is not set in the environment variables")
        f.write("✅ Connected to database\n")

        # Get tables
        cur = conn.cursor()
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        tables = [row[0] for row in cur.fetchall()]
        f.write(f"Tables in database: {', '.join(tables)}\n")

        # Check nodes table structure
        f.write("\nChecking nodes table structure...\n")
        cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='nodes'")
        columns = [(row[0], row[1]) for row in cur.fetchall()]
        f.write("Columns in nodes table:\n")
        for col, dtype in columns:
            f.write(f"  - {col}: {dtype}\n")

        # Check nodes data
        f.write("\nChecking nodes data...\n")
        cur.execute("SELECT * FROM nodes")
        nodes = cur.fetchall()
        f.write(f"Found {len(nodes)} nodes:\n")
        for node in nodes:
            f.write(f"  {node}\n")

        # Try updating
        f.write("\nTrying to update node data...\n")
        try:
            # First try with id=1
            cur.execute("""
                UPDATE nodes
                SET label = 'FIXED DB Node 1',
                    value = 'Updated via direct SQL'
                WHERE id = 1
                RETURNING id
            """)
            result = cur.fetchall()
            if result:
                f.write(f"✅ Updated node with id=1, rows affected: {len(result)}\n")
            else:
                f.write("❌ No rows updated with id=1\n")

            # Try with column name 'id'
            cur.execute("""
                UPDATE nodes
                SET label = 'FIXED DB Node',
                    value = 'Found correct ID field'
                WHERE id::text = 'node1'
                RETURNING id
            """)
            result = cur.fetchall()
            if result:
                f.write(f"✅ Updated node with id='node1', rows affected: {len(result)}\n")
            else:
                f.write("❌ No rows updated with id='node1'\n")

        except Exception as e:
            f.write(f"❌ Error during update: {str(e)}\n")

        conn.commit()
        cur.close()
        conn.close()

    except Exception as e:
        f.write(f"❌ Error: {str(e)}\n")

print("Debug info written to debug_output.txt")

