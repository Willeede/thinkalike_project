print("Hello, this is a test!")

# Test database URL
import os
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv("DATABASE_URL")
print(f"Database URL exists: {'Yes' if db_url else 'No'}")
if db_url:
    print(f"URL starts with: {db_url[:15]}...")
