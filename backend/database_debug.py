import os
import sys
import psycopg2
import traceback
import time
from pathlib import Path
from dotenv import load_dotenv

# Create log file and console logging
LOG_FILE = "db_debug.log"
with open(LOG_FILE, "w") as f:
    f.write(f"===== DATABASE DEBUG LOG - {time.strftime('%Y-%m-%d %H:%M:%S')} =====\n\n")

def log(message):
    """Log to both console and file"""
    timestamp = time.strftime('%H:%M:%S')
    formatted = f"[{timestamp}] {message}"
    print(formatted)
    with open(LOG_FILE, "a") as f:
        f.write(f"{formatted}\n")

# STEP 1: Check Python and environment
log(f"Python version: {sys.version}")
log(f"Current directory: {os.getcwd()}")
log(f"Script location: {__file__}")

# STEP 2: Find .env file
log("\nSTEP 2: Locating .env file")
env_paths = [
    Path(".env"),                            # Current directory
    Path(__file__).parent / ".env",          # Script directory
    Path(__file__).parent.parent / ".env",   # Parent directory
]

env_file_found = False
for path in env_paths:
    if path.exists():
        log(f"✅ Found .env file at: {path.absolute()}")
        env_file_found = True
        env_path = path
        break

if not env_file_found:
    log("❌ ERROR: No .env file found!")
    sys.exit(1)

# STEP 3: Load environment variables
log("\nSTEP 3: Loading environment variables")
try:
    load_dotenv(dotenv_path=env_path)
    log("✅ Loaded .env file")
except Exception as e:
    log(f"❌ ERROR loading .env: {e}")
    traceback.print_exc()
    sys.exit(1)

# STEP 4: Check DATABASE_URL
log("\nSTEP 4: Checking DATABASE_URL")
db_url = os.getenv("DATABASE_URL")
if not db_url:
    log("❌ ERROR: DATABASE_URL not found in environment!")
    log("Available environment variables:")
    for key in os.environ:
        if "SECRET" not in key.upper() and "KEY" not in key.upper() and "PASS" not in key.upper():
            log(f"  - {key}")
    sys.exit(1)

# Mask the password in the URL for logging
masked_url = db_url
if "@" in db_url:
    parts = db_url.split("@")
    prefix_parts = parts[0].split(":")
    if len(prefix_parts) > 2:
        masked_url = f"{prefix_parts[0]}:****@{parts[1]}"

log(f"✅ Found DATABASE_URL (masked): {masked_url}")

# STEP 5: Check URL format
log("\nSTEP 5: Checking URL format")
if not db_url.startswith("postgresql://"):
    log(f"❌ WARNING: URL doesn't start with postgresql://")
    log(f"URL starts with: {db_url[:15]}...")

# STEP 6: Try connection
log("\nSTEP 6: Attempting database connection")
try:
    start_time = time.time()
    conn = psycopg2.connect(db_url.strip('"'))
    elapsed = time.time() - start_time
    log(f"✅ Connection established in {elapsed:.2f} seconds")
except Exception as e:
    log(f"❌ ERROR connecting to database: {e}")
    log("\nDetailed traceback:")
    traceback.print_exc()
    sys.exit(1)

# STEP 7: Test query
log("\nSTEP 7: Testing basic query")
try:
    cur = conn.cursor()
    cur.execute("SELECT version();")
    result = cur.fetchone()
    if result is None:
        log("❌ ERROR: No result returned from query")
        sys.exit(1)
    version = result[0]
    log(f"✅ Database version: {version}")

    # Test table existence
    log("\nSTEP 8: Checking tables")
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema='public'
    """)
    tables = [row[0] for row in cur.fetchall()]
    log(f"✅ Found {len(tables)} tables: {', '.join(tables)}")

    # Close everything
    cur.close()
    conn.close()
    log("\nSTEP 9: Connection closed successfully")
except Exception as e:
    log(f"❌ ERROR executing query: {e}")
    log("\nDetailed traceback:")
    traceback.print_exc()
    sys.exit(1)

log("\n===== DEBUG COMPLETE: ALL STEPS PASSED =====")
