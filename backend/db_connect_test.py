print("============ DATABASE CONNECTION TEST ============")
import os
import sys
import traceback
from dotenv import load_dotenv

# Load environment variables
print("1. Loading environment variables...")
load_dotenv()

# Check if DATABASE_URL exists
db_url = os.getenv("DATABASE_URL")
if not db_url:
    print("❌ ERROR: DATABASE_URL not found!")
    sys.exit(1)

print(f"✅ Found DATABASE_URL starting with: {db_url[:15]}...")

# Try database connection
print("\n2. Attempting database connection...")
try:
    import psycopg2
    conn = psycopg2.connect(db_url.strip('"'))
    print("✅ Connection established!")

    # Test basic query
    print("\n3. Testing basic query...")
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()
    if version:
        print(f"✅ PostgreSQL version: {version[0]}")
    else:
        print("❌ ERROR: Failed to retrieve PostgreSQL version")
        sys.exit(1)

    # Test table operations
    print("\n4. Creating test table...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS test_connection (
            id SERIAL PRIMARY KEY,
            message TEXT NOT NULL
        );
    """)
    conn.commit()
    print("✅ Test table created/verified")

    # Insert test data
    print("\n5. Inserting test data...")
    cur.execute("""
        INSERT INTO test_connection (message)
        VALUES ('Connection test successful')
        RETURNING id;
    """)
    row = cur.fetchone()
    if row is None:
        print("❌ ERROR: Failed to insert test data")
        sys.exit(1)
    row_id = row[0]
    conn.commit()
    print(f"✅ Test data inserted with ID: {row_id}")

    # Query data
    print("\n6. Reading test data...")
    cur.execute("SELECT id, message FROM test_connection ORDER BY id DESC LIMIT 1;")
    result = cur.fetchone()
    if result:
        print(f"✅ Retrieved data: ID={result[0]}, Message='{result[1]}'")
    else:
        print("❌ ERROR: No data retrieved from test_connection table")
        sys.exit(1)

    cur.close()
    conn.close()
    print("\n============ TEST PASSED ✅ ============")
    print("Database connection is working correctly!")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
    print("\n--- Traceback ---")
    traceback.print_exc()
    print("\n============ TEST FAILED ❌ ============")
    print("Check your database credentials and connection!")
    sys.exit(1)
