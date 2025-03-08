import os
import psycopg2
from dotenv import load_dotenv
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_database_connection():
    """Test the database connection and verify/create required tables"""
    try:
        # Explicitly specify the .env file path
        env_path = Path(__file__).parent.parent / '.env'
        logger.info(f"Loading .env from: {env_path}")
        load_dotenv(dotenv_path=env_path, override=True)

        # Get database URL and log (without password)
        db_url = os.getenv("DATABASE_URL", '').strip('"')
        if not db_url:
            logger.error("DATABASE_URL not found in .env file")
            return False

        safe_url = db_url.replace(db_url.split("@")[0], "postgresql://****:****")
        logger.info(f"Connecting to: {safe_url}")

        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        logger.info("Successfully connected to database")

        # Check and create tables
        cur.execute("""
            CREATE TABLE IF NOT EXISTS nodes (
                id SERIAL PRIMARY KEY,
                label VARCHAR(255) NOT NULL,
                "group" INTEGER NOT NULL,
                value TEXT,
                "isAI" BOOLEAN DEFAULT FALSE
            );
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS edges (
                id SERIAL PRIMARY KEY,
                source INTEGER REFERENCES nodes(id),
                target INTEGER REFERENCES nodes(id),
                value TEXT,
                UNIQUE(source, target)
            );
        """)
        conn.commit()
        logger.info("Tables verified/created successfully")

        # Test queries
        cur.execute("SELECT COUNT(*) FROM nodes")
        node_count_result = cur.fetchone()
        node_count = node_count_result[0] if node_count_result else 0
        logger.info(f"Number of nodes in database: {node_count}")

        cur.execute("SELECT COUNT(*) FROM edges")
        edge_count_result = cur.fetchone()
        edge_count = edge_count_result[0] if edge_count_result else 0
        logger.info(f"Number of edges in database: {edge_count}")

        # Close connections
        cur.close()
        conn.close()
        logger.info("Database connection test completed successfully!")
        return True

    except psycopg2.Error as e:
        logger.error(f"Database error: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return False

if __name__ == "__main__":
    test_database_connection()
