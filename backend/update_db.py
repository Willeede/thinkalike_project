import psycopg2
import os
from dotenv import load_dotenv
from pathlib import Path

print("=== DATABASE UPDATE SCRIPT ===")

try:
    # Load environment variables
    env_path = Path(__file__).parent / '.env'
    load_dotenv(dotenv_path=env_path)
    db_url = os.getenv("DATABASE_URL")

    if not db_url:
        print("❌ DATABASE_URL not found")
        exit(1)

    # Connect to database
    print("Connecting to database...")
    conn = psycopg2.connect(db_url.strip('"'))
    cur = conn.cursor()

    # Update node labels to verify direct DB changes
    print("Updating node labels...")
    cur.execute("""
        UPDATE nodes
        SET label = 'VERIFIED DB Node 1',
            value = 'This confirms database connection works!'
        WHERE id = 1
    """)

    cur.execute("""
        UPDATE nodes
        SET label = 'VERIFIED DB Node 2',
            value = 'Direct database modification'
        WHERE id = 2
    """)

    conn.commit()
    print("✅ Database updated successfully!")

    # Check updated data
    cur.execute('SELECT id, label, value FROM nodes')
    print("\nUpdated nodes:")
    for row in cur.fetchall():
        print(f"ID: {row[0]}, Label: {row[1]}, Value: {row[2]}")

    cur.close()
    conn.close()

except Exception as e:
    print(f"❌ Error: {str(e)}")
