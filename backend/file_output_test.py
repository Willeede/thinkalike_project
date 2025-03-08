# This script writes to a file instead of stdout
import os
import traceback

# Write to file for debugging
with open("debug_output.txt", "w") as f:
    try:
        f.write("TEST STARTED\n")

        # Import psycopg2
        import psycopg2
        f.write("IMPORTS SUCCESSFUL\n")

        # Load environment
        from dotenv import load_dotenv
        load_dotenv()
        db_url = os.getenv("DATABASE_URL")
        f.write(f"DATABASE_URL: {'Found' if db_url else 'Not found'}\n")

        # Connect to database
        if db_url:
            f.write("Attempting connection...\n")
            conn = psycopg2.connect(db_url.strip('"'))
            f.write("CONNECTION SUCCESSFUL\n")

            # Test query
            cursor = conn.cursor()
            cursor.execute("SELECT version()")
            result = cursor.fetchone()
            if result:
                version = result[0]
                f.write(f"PostgreSQL Version: {version}\n")
            else:
                f.write("ERROR: No result returned from query\n")

            cursor.close()
            conn.close()
    except Exception as e:
        f.write(f"ERROR: {str(e)}\n")
        f.write("TRACEBACK:\n")
        traceback.print_exc(file=f)

    f.write("TEST COMPLETED\n")
