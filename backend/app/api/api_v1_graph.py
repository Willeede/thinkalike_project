from fastapi import APIRouter, HTTPException
import logging
import os
import psycopg2  # Make sure you have psycopg2-binary installed
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/graph")
async def get_graph():
    logger.info("Entering get_graph function")
    try:
        logger.info("Retrieving DATABASE_URL from environment")
        db_url = os.environ.get("DATABASE_URL")
        if not db_url:
            logger.error("DATABASE_URL environment variable not set.")
            raise HTTPException(status_code=500, detail="DATABASE_URL not configured")

        logger.info("Connecting to the database")  # Don’t log sensitive info
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        logger.info("Database connection established")

        # --- Node Query ---
        cur.execute("SELECT id, label, \"group\", value, \"isAI\" FROM nodes;")
        nodes = []
        for row in cur.fetchall():
            node_id, label, group, value, is_ai = row
            node = {
                "id": str(node_id),
                "label": label,
                "group": group,
                "value": value,
                "isAI": bool(is_ai) if is_ai is not None else False,
            }
            nodes.append(node)

        logger.info(f"Fetched {len(nodes)} nodes")

        # --- Edge Query ---
        cur.execute("SELECT source, target, value FROM edges;")
        edges = []
        for row in cur.fetchall():
            source, target, value = row
            edge = {
                "from": str(source),
                "to": str(target),
                "value": value,
            }
            edges.append(edge)

        logger.info(f"Fetched {len(edges)} edges")

        cur.close()
        conn.close()
        logger.info("Database connection closed")

        data = {"nodes": nodes, "edges": edges}
        logger.info(f"Returning graph data (first 3 nodes): {data['nodes'][:3]}...")
        return data

    except psycopg2.Error as db_err:
        logger.error(f"Database error: {db_err}")
        raise HTTPException(status_code=500, detail=f"Database error: {db_err}")
    except Exception as e:
        logger.error(f"Error in get_graph: {e}")
        raise HTTPException(status_code=500, detail=str(e))
