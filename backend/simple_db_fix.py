import os
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

# Write to log file
with open("db_fix_log.txt", "w") as log:
    try:
        log.write("Starting database fix\n")

        # Step 1: Create/check .env file
        env_path = Path(__file__).parent / '.env'

        if not env_path.exists():
            log.write(".env not found, creating it\n")
            with open(env_path, "w") as env_file:
                env_file.write('DATABASE_URL="postgresql://postgre_thinkalike_user:9GIGUOLlSgY0KKaC9qXWLbWMGmEQn3Yv@dpg-cv56oc56l47c73d15480-a.oregon-postgres.render.com:5432/postgre_thinkalike"\n')
                env_file.write('API_VERSION="v1"\n')
        else:
            log.write(".env file exists\n")

        # Step 2: Test database connection
        load_dotenv(dotenv_path=env_path)
        db_url = os.getenv("DATABASE_URL")

        if not db_url:
            log.write("ERROR: DATABASE_URL not found in .env\n")
        else:
            log.write("Testing database connection\n")
            conn = psycopg2.connect(db_url.strip('"'))
            log.write("Connection successful!\n")

            # Test query
            cur = conn.cursor()
            cur.execute("SELECT version()")
            result = cur.fetchone()
            if result:
                version = result[0]
                log.write(f"PostgreSQL version: {version}\n")
            else:
                log.write("ERROR: Failed to fetch PostgreSQL version\n")
            log.write(f"PostgreSQL version: {version}\n")
            cur.close()
            conn.close()

        # Step 3: Update the API file
        log.write("Updating API file\n")
        api_file_path = os.path.join('app', 'api', 'api_v1_graph.py')
        with open(api_file_path, 'w') as f:
            f.write('''from fastapi import APIRouter
import logging
import psycopg2
import os
from dotenv import load_dotenv
from pathlib import Path

router = APIRouter()
logger = logging.getLogger(__name__)

def get_db_connection():
    """Create a database connection"""
    try:
        env_path = Path(__file__).parent.parent.parent / '.env'
        load_dotenv(dotenv_path=env_path)
        db_url = os.getenv("DATABASE_URL")
        if db_url:
            return psycopg2.connect(db_url.strip('"'))
        return None
    except Exception as e:
        logger.error(f"DB error: {e}")
        return None

@router.get("/")
async def get_graph():
    """Fetch graph data from database"""
    conn = get_db_connection()
    if not conn:
        return await get_test_data()

    try:
        cur = conn.cursor()

        # Create tables if needed
        cur.execute("""
            CREATE TABLE IF NOT EXISTS nodes (
                id SERIAL PRIMARY KEY,
                label VARCHAR(255) NOT NULL,
                "group" INTEGER NOT NULL,
                value TEXT,
                "isAI" BOOLEAN DEFAULT FALSE
            )
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS edges (
                id SERIAL PRIMARY KEY,
                source INTEGER REFERENCES nodes(id),
                target INTEGER REFERENCES nodes(id),
                value TEXT
            )
        """)
        conn.commit()

        # Check if empty
        cur.execute("SELECT COUNT(*) FROM nodes")
        if cur.fetchone()[0] == 0:
            # Add sample data
            cur.execute("""
                INSERT INTO nodes (label, "group", value, "isAI")
                VALUES
                ('DB Node 1', 1, 'From database', FALSE),
                ('DB Node 2', 2, 'Also from DB', TRUE)
                RETURNING id
            """)
            ids = [row[0] for row in cur.fetchall()]

            if len(ids) >= 2:
                cur.execute("""
                    INSERT INTO edges (source, target, value)
                    VALUES (%s, %s, 'DB connection')
                """, (ids[0], ids[1]))
            conn.commit()

        # Get data
        cur.execute('SELECT id, label, "group", value, "isAI" FROM nodes')
        nodes = [
            {
                "id": str(id),
                "label": label,
                "group": group,
                "value": value,
                "isAI": bool(isAI) if isAI is not None else False
            }
            for id, label, group, value, isAI in cur.fetchall()
        ]

        cur.execute('SELECT source, target, value FROM edges')
        edges = [
            {
                "from": str(source),
                "to": str(target),
                "value": value
            }
            for source, target, value in cur.fetchall()
        ]

        cur.close()
        conn.close()

        return {"nodes": nodes, "edges": edges}
    except Exception as e:
        logger.error(f"Error: {e}")
        if conn:
            conn.close()
        return await get_test_data()

@router.get("/test")
async def get_test_data():
    """Return test data"""
    return {
        "nodes": [
            {"id": "1", "label": "Test Node 1", "group": 1, "value": "Test value", "isAI": False},
            {"id": "2", "label": "Test Node 2", "group": 2, "value": "Test value 2", "isAI": True}
        ],
        "edges": [
            {"from": "1", "to": "2", "value": "Test connection"}
        ]
    }''')

        log.write("API file updated successfully!\n")
        log.write("Process complete! Restart server: uvicorn app.main:app --reload\n")

    except Exception as e:
        log.write(f"ERROR: {e}\n")

print("Process completed! Check db_fix_log.txt for details")
