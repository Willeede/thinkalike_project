# Minimal test that prints immediately
print("Script started")

# Import with error handling
try:
    import psycopg2
    print("psycopg2 imported successfully")
except Exception as e:
    print(f"Import error: {e}")

# Try environment variables
try:
    import os
    from dotenv import load_dotenv
    print("Loading .env")
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    print(f"DATABASE_URL found: {'Yes' if db_url else 'No'}")
except Exception as e:
    print(f"Env error: {e}")

# Try connection
if db_url:
    try:
        print("Connecting to database...")
        conn = psycopg2.connect(db_url.strip('"'))
        print("Connected successfully!")
        conn.close()
    except Exception as e:
        print(f"Connection error: {e}")

print("Script finished")
