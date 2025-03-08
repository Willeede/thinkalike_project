import os
import psycopg2
from dotenv import load_dotenv
import logging
from pathlib import Path

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

__all__ = ['get_db_connection']

def get_db_connection():
    """Create and return a database connection"""
    try:
        # Load environment variables
        env_path = Path(__file__).parent.parent.parent / '.env'
        logger.info(f"Loading .env from: {str(env_path)}")
        load_dotenv(dotenv_path=env_path)

        # Get and verify database URL
        db_url = os.getenv("DATABASE_URL", "").strip('"')
        if not db_url:
            logger.error("DATABASE_URL not found in environment")
            return None

        # Connect to database
        conn = psycopg2.connect(db_url)

        return conn

    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        return None
