import os
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

# Create a log file
with open("db_connection_log.txt", "w") as log_file:
    log_file.write("=== DATABASE CONNECTION TEST ===\n\n")

    try:
        # Step 1: Load environment variables
        log_file.write("Step 1: Loading environment variables\n")
        env_path = Path(__file__).parent / '.env'
        log_file.write(f"Looking for .env at: {env_path}\n")

        if not env_path.exists():
            log_file.write("ERROR: .env file not found!\n")
            # Create a template .env file
            with open(env_path, "w") as env_file:
                env_file.write('DATABASE_URL="postgresql://postgre_thinkalike_user:9GIGUOLlSgY0KKaC9qXWLbWMGmEQn3Yv@dpg-cv56oc56l47c73d15480-a.oregon-postgres.render.com:5432/postgre_thinkalike"\n')
                env_file.write('# Template .env file created\n')
    except Exception as e:
        log_file.write(f"An error occurred: {e}\n")
