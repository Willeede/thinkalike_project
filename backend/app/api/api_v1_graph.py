from fastapi import APIRouter, HTTPException
import logging
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/graph")
async def get_graph():
    logger.info("Entering get_graph function")
    try:
        # Database Connection
        logger.info("Retrieving DATABASE_URL from environment")
        db_url = os.environ.get("DATABASE_URL")
        if not db_url:
            logger.error("DATABASE_URL environment variable not set")
            raise HTTPException(status_code=500, detail="Database URL not configured")

        logger.info("Connecting to database")
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        logger.info("Database connection established")

        # Node Query
        cur.execute("SELECT id, label, \"group\", value, \"isAI\" FROM nodes;")
        nodes = []
        for row in cur.fetchall():
            node_id, label, group, value, is_ai = row
            nodes.append({
                "id": str(node_id),
                "label": label,
                "group": group,
                "value": value,
                "isAI": bool(is_ai) if is_ai is not None else False,
            })
        logger.info(f"Fetched {len(nodes)} nodes")

        # Edge Query
        cur.execute("SELECT source, target, value FROM edges;")
        edges = []
        for row in cur.fetchall():
            source, target, value = row
            edges.append({
                "from": str(source),
                "to": str(target),
                "value": value,
            })
        logger.info(f"Fetched {len(edges)} edges")

        # Close connections
        cur.close()
        conn.close()
        logger.info("Database connection closed")

        data = {"nodes": nodes, "edges": edges}
        logger.info(f"Returning graph data (first 3 nodes): {data['nodes'][:3]}...")
        return data

    except psycopg2.Error as db_err:
        logger.error(f"Database error: {str(db_err)}")
        raise HTTPException(status_code=500, detail=str(db_err))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
