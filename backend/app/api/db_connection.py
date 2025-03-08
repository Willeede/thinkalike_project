import os
import psycopg2
from dotenv import load_dotenv
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def get_db_connection():
    """Create and return a database connection"""
    try:
        # Get absolute path to .env file
        env_path = Path(__file__).parent.parent.parent / '.env'
        logger.info(f"Loading .env from: {env_path}")
        load_dotenv(dotenv_path=env_path)

        # Get database URL
        db_url = os.getenv("DATABASE_URL")
        if not db_url:
            logger.error("DATABASE_URL not found in environment")
            return None

        # Strip quotes if present
        db_url = db_url.strip('"')
        logger.info(f"Database URL found (censored): postgresql://****:****@{db_url.split('@')[1] if '@' in db_url else 'unknown'}")

        # Connect to database
        conn = psycopg2.connect(db_url)
        logger.info("Database connection successful")
        return conn

    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        return None
