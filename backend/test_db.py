import psycopg2
from dotenv import load_dotenv
import os
from pathlib import Path

def test_connection():
    try:
        # Use print instead of logger for visibility
        print("="*50)
        print("DATABASE CONNECTION TEST")
        print("="*50)

        # Get absolute path to .env file
        env_path = Path(__file__).parent / '.env'
        print(f"Loading .env from: {env_path}")
        load_dotenv(dotenv_path=env_path)

        # Get database URL
        db_url = os.getenv("DATABASE_URL", "").strip('"')
        if not db_url:
            print("ERROR: DATABASE_URL not found in .env file!")
            return False

        # Print sanitized URL
        sanitized_url = "**********" + db_url[db_url.find('@'):]
        print(f"Database URL found: {sanitized_url}")

        # Check if URL is correctly formatted
        if not db_url.startswith("postgresql://"):
            print(f"ERROR: URL doesn't start with postgresql://")
            print(f"URL starts with: {db_url[:15]}...")
            return False

        # Connect to database
        print("Attempting database connection...")
        conn = psycopg2.connect(db_url)

        # Test query
        cur = conn.cursor()
        cur.execute("SELECT 1 AS test")
        result = cur.fetchone()
        if result and result[0] == 1:
            print("✅ Database connection SUCCESSFUL!")
        else:
            print("❌ Test query failed!")

        # Close connections
        cur.close()
        conn.close()
        return True

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    result = test_connection()
    print("\nFINAL RESULT:")
    if result:
        print("✅ Database connection test PASSED!")
    else:
        print("❌ Database connection test FAILED!")

    print("\nNEXT STEPS:")
    if result:
        print("- Proceed with API development")
        print("- Database connection is working correctly")
    else:
        print("- Check your .env file contains DATABASE_URL")
        print("- Verify the database credentials")
        print("- Test if the database server is accessible")
