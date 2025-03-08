# This script writes directly to a file and doesn't depend on console output
import os
import sys
import time
from pathlib import Path

# Open file for writing
with open("direct_debug.log", "w") as f:
    f.write("=== DIRECT FILE TEST ===\n")
    f.write(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
    f.write(f"Python: {sys.version}\n")
    f.write(f"Working directory: {os.getcwd()}\n")

    # Check for .env file
    env_file = Path(".env")
    f.write(f"\nChecking for .env file at: {env_file.absolute()}\n")

    if env_file.exists():
        f.write(".env file exists!\n")
        # Read first few lines (avoiding sensitive data)
        with open(env_file, "r") as env:
            lines = env.readlines()[:5]  # Read first 5 lines
            f.write(f"First few lines (not showing sensitive data):\n")
            for line in lines:
                # Only show comment lines or placeholder text
                if line.startswith("#") or "=" not in line:
                    f.write(f"  {line.strip()}\n")
                else:
                    var_name = line.split("=")[0]
                    f.write(f"  {var_name}=****\n")
    else:
        f.write(".env file NOT found!\n")

    # Try to import psycopg2
    f.write("\nTrying to import psycopg2...\n")
    try:
        import psycopg2
        f.write("✓ Import successful!\n")
    except Exception as e:
        f.write(f"✗ Import failed: {e}\n")

    f.write("\n=== TEST COMPLETE ===\n")
