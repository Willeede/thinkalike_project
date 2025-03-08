from fastapi import APIRouter, HTTPException
import logging
import psycopg2
import os
from dotenv import load_dotenv
from pathlib import Path
import traceback

router = APIRouter()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def get_db_connection():
    """Create a database connection"""
    try:
        # Get absolute path to .env file
        env_path = Path(__file__).parent.parent.parent / '.env'
        load_dotenv(dotenv_path=env_path)

        # Get database URL
        db_url = os.getenv("DATABASE_URL")
        if not db_url:
            return None

        # Connect to database
        return psycopg2.connect(db_url.strip('"'))
    except Exception as e:
        logger.error(f"DB error: {e}")
        return None

@router.get("/")
async def get_graph():
    """Fetch graph data from database"""
    logger.info("Graph endpoint called")

    try:
        # Use get_db_connection() instead of recreating connection logic
        conn = get_db_connection()
        if not conn:
            logger.error("Database connection failed")
            return {
                "debug": "connection_failed",
                "nodes": [{"id": "error", "label": "DATABASE CONNECTION FAILED", "group": 3}],
                "edges": []
            }

        cur = conn.cursor()

        # Test query first
        cur.execute("SELECT version()")
        version_result = cur.fetchone()
        if version_result:
            version = version_result[0]
            logger.info(f"DB Version: {version}")
        else:
            logger.error("Failed to fetch DB version")

        cur.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'nodes'
            )
        """)
        result = cur.fetchone()
        table_exists = result[0] if result else False

        if not table_exists:
            logger.info("Creating tables...")
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

            # Add sample data
            cur.execute("""
                INSERT INTO nodes (label, "group", value, "isAI")
                VALUES
                ('DEBUG Node 1', 1, 'From DEBUG test', FALSE),
                ('DEBUG Node 2', 2, 'From DEBUG connection', TRUE)
                RETURNING id
            """)
            ids = [row[0] for row in cur.fetchall()]

            if len(ids) >= 2:
                cur.execute("""
                    INSERT INTO edges (source, target, value)
                    VALUES (%s, %s, 'DEBUG connection')
                """, (ids[0], ids[1]))
            conn.commit()

        # Get data
        logger.info("Fetching data from database...")
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
        logger.info(f"Returning {len(nodes)} nodes from database")

        return {
            "nodes": nodes,
            "edges": edges
        }
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        traceback.print_exc()
        return {
            "debug": "error",
            "error": str(e),
            "nodes": [
                {"id": "debug1", "label": f"DEBUG ERROR: {str(e)[:30]}", "group": 3, "value": "Error", "isAI": False},
                {"id": "debug2", "label": "Check Server Logs", "group": 3, "value": "Error", "isAI": False}
            ],
            "edges": [
                {"from": "debug1", "to": "debug2", "value": "Error connection"}
            ]
        }

@router.get("/test")
async def get_test_data():
    """Return test data"""
    logger.info("DEBUG TEST endpoint called")
    return {
        "debug": "test_endpoint",
        "nodes": [
            {"id": "debug1", "label": "DEBUG Test Node 1", "group": 1, "value": "DEBUG test value", "isAI": False},
            {"id": "debug2", "label": "DEBUG Test Node 2", "group": 2, "value": "DEBUG test value 2", "isAI": True}
        ],
        "edges": [
            {"from": "debug1", "to": "debug2", "value": "DEBUG test connection"}
        ]
    }

@router.get("/reset")
async def reset_database():
    """Reset and recreate the database tables with fresh data"""
    logger.info("Resetting database...")

    try:
        # Use get_db_connection() instead of recreating connection logic
        conn = get_db_connection()
        if not conn:
            logger.error("Database connection failed")
            return {"success": False, "message": "Database connection failed"}

        cur = conn.cursor()

        # Drop existing tables if they exist
        logger.info("Dropping existing tables...")
        cur.execute("DROP TABLE IF EXISTS edges")
        cur.execute("DROP TABLE IF EXISTS nodes")
        conn.commit()

        # Create fresh tables
        logger.info("Creating new tables...")
        cur.execute("""
            CREATE TABLE nodes (
                id SERIAL PRIMARY KEY,
                label VARCHAR(255) NOT NULL,
                "group" INTEGER NOT NULL,
                value TEXT,
                "isAI" BOOLEAN DEFAULT FALSE
            )
        """)

        cur.execute("""
            CREATE TABLE edges (
                id SERIAL PRIMARY KEY,
                source INTEGER REFERENCES nodes(id),
                target INTEGER REFERENCES nodes(id),
                value TEXT
            )
        """)
        conn.commit()

        # Insert fresh data
        logger.info("Inserting fresh data...")
        cur.execute("""
            INSERT INTO nodes (label, "group", value, "isAI")
            VALUES
            ('RESET DB Node 1', 1, 'Created via reset endpoint', FALSE),
            ('RESET DB Node 2', 2, 'Also from reset endpoint', TRUE)
            RETURNING id
        """)
        ids = [row[0] for row in cur.fetchall()]

        if len(ids) >= 2:
            cur.execute("""
                INSERT INTO edges (source, target, value)
                VALUES (%s, %s, 'Reset connection')
            """, (ids[0], ids[1]))
        conn.commit()

        # Close connection
        cur.close()
        conn.close()

        return {
            "success": True,
            "message": "Database reset successfully",
            "new_nodes": [
                {"id": ids[0], "label": "RESET DB Node 1"},
                {"id": ids[1], "label": "RESET DB Node 2"}
            ]
        }
    except Exception as e:
        logger.error(f"Error resetting database: {str(e)}")
        return {"success": False, "message": f"Error: {str(e)}"}


